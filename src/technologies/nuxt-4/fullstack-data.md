# Manipuler et stocker des données avec Nuxt.js Fullstack (sans BFF)

> Ce guide complète le précédent en se concentrant sur une architecture où Nuxt est le seul backend. Seules les différences et spécificités sont abordées.
> 


## 1. Différence architecturale fondamentale

### BFF vs Fullstack pur

```
┌─── Architecture BFF ───────────────────────────────────────────┐
│                                                                │
│   Client ──► Nuxt Server ──► Backend .NET ──► Base de données  │
│              (agrégateur)    (logique métier)                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘

┌─── Architecture Fullstack Pure ────────────────────────────────┐
│                                                                │
│   Client ──► Nuxt Server ──► Base de données                   │
│              (logique métier + API)                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Conséquences directes :**

| Aspect | BFF | Fullstack pur |
| --- | --- | --- |
| Responsabilité serveur | Agrégation, transformation | Logique métier complète |
| Accès DB | Via backend externe | Connexion directe |
| Migrations | Gérées par le backend | Gérées dans Nuxt |
| Sécurité | Backend gère l’authN/authZ | Nuxt gère tout |
| Complexité | Plus de couches | Plus simple, moins de séparation |

### Structure adaptée

```
server/
├── api/                    # Endpoints REST
│   └── users/
│       ├── index.get.ts
│       ├── index.post.ts
│       └── [id].get.ts
├── services/               # Logique métier (optionnel si simple)
│   └── userService.ts
├── database/               # ⬅️ NOUVEAU : tout ce qui touche à la DB
│   ├── schema.ts           # Définition des tables
│   ├── migrations/         # Fichiers de migration
│   ├── seed.ts             # Données initiales
│   └── index.ts            # Export de la connexion
├── utils/
│   └── validate.ts
└── plugins/
    └── database.ts         # Initialisation au démarrage
```

**Changement clé** : Le dossier `repositories/` devient souvent inutile. Tu peux appeler Drizzle directement depuis les services ou même les handlers pour les apps simples.


## 2. Connexion directe à la base de données

### Initialisation avec un plugin serveur

```tsx
// server/plugins/database.ts
import { db } from '~/server/database'

export default defineNitroPlugin(async () => {
  // Vérifier la connexion au démarrage
  try {
    await db.execute('SELECT 1')
    console.log('✅ Database connected')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)  // Arrêter si pas de DB
  }
})
```

### Configuration Drizzle complète

```tsx
// server/database/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('sqlite.db')

export const db = drizzle(sqlite, { schema })

// Avec PostgreSQL en production
// import { drizzle } from 'drizzle-orm/node-postgres'
// import { Pool } from 'pg'
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// export const db = drizzle(pool, { schema })
```

**Point important** : En passant `{ schema }`, tu actives l’API “relational queries” de Drizzle (voir section 4).

## 3. Gestion des migrations

### Avec Drizzle Kit

C’est toi qui gères l’évolution du schéma, pas un backend externe.

```bash
# Installation
npm install drizzle-kit -D
```

```tsx
// drizzle.config.ts (racine du projet)
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'sqlite',  // ou 'postgresql'
  dbCredentials: {
    url: './sqlite.db'
  }
})
```

**Commandes essentielles :**

```bash
# Générer une migration après modification du schéma
npx drizzle-kit generate

# Appliquer les migrations
npx drizzle-kit migrate

# Visualiser la DB (outil graphique)
npx drizzle-kit studio
```

### Workflow typique

1. Modifier `schema.ts`
2. `npx drizzle-kit generate` → crée un fichier SQL de migration
3. `npx drizzle-kit migrate` → applique à la DB
4. Commiter le fichier de migration avec le code

---

## 4. Requêtes relationnelles (Drizzle Relations API)

En fullstack pur, tu gères toi-même les relations. Drizzle offre une API élégante.

### Définir les relations

```tsx
// server/database/schema.ts
import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar, integer, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).unique()
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 200 }),
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow()
})

// Définition des relations (pas de colonne en DB, juste pour les requêtes)
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  })
}))
```

### Requêtes avec relations (Query API)

```tsx
// Récupérer un user avec ses posts
const userWithPosts = await db.query.users.findFirst({
  where: eq(users.id, 1),
  with: {
    posts: true  // Inclut tous les posts
  }
})

// Résultat typé automatiquement :
// { id: 1, name: '...', posts: [{ id: 1, title: '...' }, ...] }

// Requête plus fine
const recentPosts = await db.query.posts.findMany({
  where: eq(posts.authorId, userId),
  orderBy: desc(posts.createdAt),
  limit: 10,
  with: {
    author: {
      columns: { name: true }  // Seulement le nom
    }
  }
})
```

**Comparaison des deux API Drizzle :**

| Query Builder (`db.select()`) | Query API (`db.query.table`) |
| --- | --- |
| Plus proche du SQL | Plus “ORM-like” |
| Joins manuels | Relations automatiques avec `with` |
| Contrôle total | Plus concis pour les cas courants |

---

## 5. Seeding (données initiales)

### Script de seed

```tsx
// server/database/seed.ts
import { db } from './index'
import { users, posts } from './schema'

async function seed() {
  console.log('🌱 Seeding database...')

  // Vider les tables (attention à l'ordre pour les FK)
  await db.delete(posts)
  await db.delete(users)

  // Insérer des utilisateurs
  const [admin] = await db.insert(users).values([
    { name: 'Admin', email: 'admin@test.com' },
    { name: 'User', email: 'user@test.com' }
  ]).returning()

  // Insérer des posts liés
  await db.insert(posts).values([
    { title: 'Premier post', authorId: admin.id },
    { title: 'Deuxième post', authorId: admin.id }
  ])

  console.log('✅ Seeding complete')
}

seed().catch(console.error)
```

```json
// package.json
{
  "scripts": {
    "db:seed": "npx tsx server/database/seed.ts",
    "db:reset": "rm -f sqlite.db && npx drizzle-kit migrate && npm run db:seed"
  }
}
```

---

### Fichier seed : `server/database/seed.ts`

typescript

`import { db } from '~/server/utils/db'
import { volunteers } from './schema'

export const seedVolunteers = [
  { firstName: 'Marie', lastName: 'Dubois', email: 'marie.dubois@email.fr', phone: '0612345601', status: 'active' as const },
  { firstName: 'Thomas', lastName: 'Martin', email: 'thomas.martin@email.fr', phone: '0612345602', status: 'active' as const },
  { firstName: 'Sophie', lastName: 'Bernard', email: 'sophie.bernard@email.fr', phone: null, status: 'active' as const },
  { firstName: 'Lucas', lastName: 'Petit', email: 'lucas.petit@email.fr', phone: '0612345604', status: 'inactive' as const },
  { firstName: 'Emma', lastName: 'Robert', email: 'emma.robert@email.fr', phone: '0612345605', status: 'active' as const },
  { firstName: 'Hugo', lastName: 'Richard', email: 'hugo.richard@email.fr', phone: '0612345606', status: 'active' as const },
  { firstName: 'Chloé', lastName: 'Durand', email: 'chloe.durand@email.fr', phone: null, status: 'active' as const },
  { firstName: 'Arthur', lastName: 'Moreau', email: 'arthur.moreau@email.fr', phone: '0612345608', status: 'active' as const },
  { firstName: 'Léa', lastName: 'Simon', email: 'lea.simon@email.fr', phone: '0612345609', status: 'inactive' as const },
  { firstName: 'Louis', lastName: 'Laurent', email: 'louis.laurent@email.fr', phone: '0612345610', status: 'active' as const },
  { firstName: 'Camille', lastName: 'Lefebvre', email: 'camille.lefebvre@email.fr', phone: '0612345611', status: 'active' as const },
  { firstName: 'Gabriel', lastName: 'Michel', email: 'gabriel.michel@email.fr', phone: null, status: 'active' as const },
  { firstName: 'Manon', lastName: 'Garcia', email: 'manon.garcia@email.fr', phone: '0612345613', status: 'active' as const },
  { firstName: 'Raphaël', lastName: 'Roux', email: 'raphael.roux@email.fr', phone: '0612345614', status: 'active' as const },
  { firstName: 'Juliette', lastName: 'Blanc', email: 'juliette.blanc@email.fr', phone: '0612345615', status: 'inactive' as const },
  { firstName: 'Nathan', lastName: 'Guerin', email: 'nathan.guerin@email.fr', phone: null, status: 'active' as const },
  { firstName: 'Alice', lastName: 'Boyer', email: 'alice.boyer@email.fr', phone: '0612345617', status: 'active' as const },
  { firstName: 'Tom', lastName: 'Garnier', email: 'tom.garnier@email.fr', phone: '0612345618', status: 'active' as const },
  { firstName: 'Inès', lastName: 'Chevalier', email: 'ines.chevalier@email.fr', phone: '0612345619', status: 'active' as const },
  { firstName: 'Paul', lastName: 'Fontaine', email: 'paul.fontaine@email.fr', phone: '0612345620', status: 'active' as const }
]

export async function seedDatabase() {
  const existingVolunteers = await db.select().from(volunteers)
  
  if (existingVolunteers.length === 0) {
    console.log('📦 Seeding database with sample volunteers...')
    await db.insert(volunteers).values(seedVolunteers)
    console.log('✅ Database seeded successfully')
  }
}`

### Points importants

**`as const`** : force le type literal `'active'` au lieu de `string`

- Correspond exactement au type enum du schéma
- Évite les erreurs TypeScript

**Check avant insert** : vérifie que la table est vide

- Évite les doublons si le serveur redémarre
- Idempotent (peut être exécuté plusieurs fois sans problème)

**Export des données** : `seedVolunteers` réutilisable

- Tu peux les importer pour des tests
- Facilite le reset de la DB

---

## 2. Plugin mis à jour : `server/plugins/database.ts`

typescript

`import { seedDatabase } from '../database/seed'

export default defineNitroPlugin(async () => {
  try {
    // Test connexion
    await db.run('SELECT 1')
    console.log('✅ Database connected')
    
    // Seed uniquement en dev
    if (process.env.NODE_ENV === 'development') {
      await seedDatabase()
    }
  } catch (error) {
    console.error('❌ Database connection failed', error)
    process.exit(1)
  }
})`

### Points importants

**Check environnement** : `process.env.NODE_ENV`

- Seed uniquement en dev
- Évite de polluer la prod avec des données de test

**Séparation** : logique de seed isolée

- Fichier seed réutilisable (pour scripts de migration)
- Plugin reste simple et lisible

**process.exit(1)** : arrête le serveur si connexion échoue

- Force à corriger le problème immédiatement
- Évite un serveur qui tourne sans DB

---

### Alternative : Script de seed manuel

Si tu préfères contrôler manuellement le seed :

### `scripts/seed.ts`

typescript

`import { seedDatabase } from '../server/database/seed'

async function run() {
  await seedDatabase()
  process.exit(0)
}

run()`

### Dans `package.json`

json

`{
  "scripts": {
    "seed": "tsx scripts/seed.ts"
  }
}`

Puis tu lances manuellement : `npm run seed`

---

## 6. Pattern simplifié (sans couche service)

Pour des apps simples, tu peux accéder à Drizzle directement dans les handlers :

```tsx
// server/api/posts/index.get.ts
import { db } from '~/server/database'
import { posts } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10

  const results = await db.query.posts.findMany({
    limit,
    offset: (page - 1) * limit,
    orderBy: desc(posts.createdAt),
    with: { author: { columns: { name: true } } }
  })

  return results
})
```

**Quand ajouter une couche service ?**
- Logique métier complexe (calculs, validations croisées)
- Réutilisation entre plusieurs endpoints
- Tests unitaires de la logique métier

---

## 7. Transactions

En fullstack pur, tu gères toi-même la cohérence des données :

```tsx
// server/api/users/index.post.ts
export default defineEventHandler(async (event) => {
  const body = await validateBody(event, createUserSchema)

  // Transaction : tout réussit ou tout échoue
  const result = await db.transaction(async (tx) => {
    const [user] = await tx.insert(users).values(body).returning()

    // Créer un profil par défaut
    await tx.insert(profiles).values({
      userId: user.id,
      bio: '',
      createdAt: new Date()
    })

    // Créer des préférences par défaut
    await tx.insert(preferences).values({
      userId: user.id,
      theme: 'light',
      notifications: true
    })

    return user
  })

  return result
})
```

**Syntaxe clé** : `db.transaction(async (tx) => { ... })` — utilise `tx` au lieu de `db` dans le callback.

---

## 8. Considérations de sécurité spécifiques

### Tu es responsable de tout

En BFF, ton backend .NET gère une partie de la sécurité. En fullstack pur :

```tsx
// ❌DANGER : SQL injection si tu construis des requêtes manuellement
const results = await db.execute(`SELECT * FROM users WHERE name = '${name}'`)

// ✅ Drizzle protège automatiquement avec les query builders
const results = await db.select().from(users).where(eq(users.name, name))
```

### Middleware d’authentification

```tsx
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // Ne pas protéger les routes publiques
  if (event.path.startsWith('/api/auth')) return

  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')

  if (!token) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  // Vérifier le token et attacher l'utilisateur au contexte
  const user = await verifyToken(token)
  event.context.user = user
})
```

### Validation stricte des entrées

```tsx
// Toujours valider, même pour les updates partiels
const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional()
}).refine(data => Object.keys(data).length > 0, {
  message: 'Au moins un champ requis'
})
```

---

## 9. Comparatif final

| Aspect | Fullstack pur | BFF |
| --- | --- | --- |
| **Complexité** | Plus simple | Plus de couches |
| **Contrôle** | Total sur la DB | Délégué au backend |
| **Migrations** | À gérer (Drizzle Kit) | Backend s’en charge |
| **Sécurité** | Responsabilité totale | Partagée |
| **Performance** | Moins de latence (1 hop) | Plus de latence (2 hops) |
| **Scalabilité** | Limité par Nuxt | Backend peut scaler indépendamment |
| **Cas d’usage** | Apps personnelles, MVPs, outils internes | Apps enterprise, microservices |

---

## Résumé des différences clés

| Ce qui change | BFF | Fullstack pur |
| --- | --- | --- |
| **Accès données** | `dotnetClient.get()` | `db.query.table.findMany()` |
| **Schéma** | Défini côté backend | `server/database/schema.ts` |
| **Migrations** | Pas ta responsabilité | `drizzle-kit generate/migrate` |
| **Relations** | API backend les gère | `relations()` + `with: {}` |
| **Transactions** | Backend les gère | `db.transaction()` |
| **Seed** | Backend ou scripts séparés | `npm run db:seed` |

---

## Workflow de développement typique

```bash
# 1. Modifier le schéma
code server/database/schema.ts

# 2. Générer la migration
npx drizzle-kit generate

# 3. Appliquer
npx drizzle-kit migrate

# 4. Vérifier visuellement
npx drizzle-kit studio

# 5. Développer
npm run dev
```