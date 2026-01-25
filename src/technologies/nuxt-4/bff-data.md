# Manipuler et stocker des données (BFF)

# Manipuler et stocker des données réelles avec Nuxt.js et une architecture fullstack BFF

## Table des matières

1. [Comprendre l’architecture données dans un BFF](about:blank#1-comprendre-larchitecture-donn%C3%A9es-dans-un-bff)
2. [Le flux de données dans Nuxt fullstack](about:blank#2-le-flux-de-donn%C3%A9es-dans-nuxt-fullstack)
3. [Solutions de stockage : comparatif](about:blank#3-solutions-de-stockage--comparatif)
4. [Concepts clés et syntaxe](about:blank#4-concepts-cl%C3%A9s-et-syntaxe)
5. [Librairies essentielles](about:blank#5-librairies-essentielles)
6. [Patterns d’accès aux données](about:blank#6-patterns-dacc%C3%A8s-aux-donn%C3%A9es)
7. [Bonnes pratiques](about:blank#7-bonnes-pratiques)
8. [Gestion des erreurs et validation](about:blank#8-gestion-des-erreurs-et-validation)

---

## 1. Comprendre l’architecture données dans un BFF

### Le rôle du BFF dans la gestion des données

Dans une architecture BFF, ton serveur Nuxt (`server/`) agit comme **intermédiaire intelligent** entre :

```
┌─────────────┐     ┌─────────────────────┐     ┌──────────────────┐
│   Client    │ ──► │   Nuxt Server (BFF) │ ──► │  Sources données │
│  (app/)     │ ◄── │   (server/)         │ ◄── │  (.NET, DB, API) │
└─────────────┘     └─────────────────────┘     └──────────────────┘
```

**Responsabilités du BFF pour les données :**

| Responsabilité | Description |
| --- | --- |
| **Agrégation** | Combiner plusieurs sources en une seule réponse |
| **Transformation** | Adapter le format pour le frontend |
| **Caching** | Stocker temporairement pour optimiser |
| **Validation** | Vérifier les données entrantes/sortantes |
| **Abstraction** | Masquer la complexité des backends |

### Structure de fichiers orientée données

```
server/
├── api/                    # Endpoints REST exposés au client
│   ├── users/
│   │   ├── index.get.ts    # GET /api/users
│   │   ├── index.post.ts   # POST /api/users
│   │   └── [id].get.ts     # GET /api/users/:id
│   └── auth/
│       └── login.post.ts
├── services/               # Logique métier et accès données
│   ├── userService.ts
│   └── authService.ts
├── repositories/           # Couche d'abstraction stockage
│   ├── userRepository.ts
│   └── baseRepository.ts
├── utils/                  # Helpers et utilitaires
│   ├── database.ts
│   └── cache.ts
└── plugins/                # Initialisation (DB connections)
    └── database.ts
```

**Principe clé** : Séparation en couches → API → Service → Repository → Source

---

## 2. Le flux de données dans Nuxt fullstack

### Côté serveur : defineEventHandler

C’est le point d’entrée de toute requête API. La syntaxe de base :

```tsx
// server/api/items.get.ts
export default defineEventHandler(async (event) => {
  // event contient : requête, réponse, contexte
  return { data: [] }
})
```

**Propriétés essentielles de `event`** :

| Méthode/Propriété | Usage |
| --- | --- |
| `getQuery(event)` | Récupérer query params (`?page=1`) |
| `readBody(event)` | Lire le body JSON (POST/PUT) |
| `getRouterParam(event, 'id')` | Paramètre de route (`[id].ts`) |
| `getHeader(event, 'name')` | Lire un header |
| `setResponseStatus(event, 201)` | Définir le status HTTP |
| `event.context` | Données partagées (auth, etc.) |

### Côté client : useFetch vs useAsyncData

**`useFetch`** — Le plus courant, syntaxe simplifiée :

```tsx
// Récupération simple
const { data, pending, error, refresh } = await useFetch('/api/users')

// Avec options
const { data } = await useFetch('/api/users', {
  query: { page: 1, limit: 10 },  // → /api/users?page=1&limit=10
  method: 'POST',
  body: { name: 'John' },
  pick: ['id', 'name'],           // Ne garder que certains champs
  transform: (data) => data.items // Transformer la réponse
})
```

**`useAsyncData`** — Contrôle total, pour logique complexe :

```tsx
const { data } = await useAsyncData('users-key', () => {
  // Tu peux faire plusieurs appels, de la logique, etc.
  return $fetch('/api/users')
})
```

**Différence clé** : `useFetch` = wrapper autour de `useAsyncData` + `$fetch`. Utilise `useAsyncData` quand tu dois combiner plusieurs sources ou ajouter de la logique.

### Le cycle de rendu et les données

```
┌─────────────────────────────────────────────────────────────────┐
│                         SSR (Serveur)                           │
├─────────────────────────────────────────────────────────────────┤
│  1. useFetch appelé → requête HTTP vers /api/...                │
│  2. Données récupérées et sérialisées dans le HTML              │
│  3. HTML envoyé au client avec données embarquées               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Hydratation (Client)                      │
├─────────────────────────────────────────────────────────────────┤
│  4. Vue se "réveille", réutilise les données déjà présentes     │
│  5. Pas de second appel API (grâce à la clé de cache)           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Solutions de stockage : comparatif

### Vue d’ensemble

| Solution | Type | Cas d’usage | Persistance |
| --- | --- | --- | --- |
| **SQLite** | SQL embarqué | Prototypage, apps légères | Fichier local |
| **PostgreSQL** | SQL relationnel | Production, données structurées | Serveur |
| **MongoDB** | NoSQL document | Données flexibles, JSON natif | Serveur |
| **Redis** | Key-Value en mémoire | Cache, sessions, temps réel | Mémoire/Disque |
| **Backend .NET** | API externe | Ton contexte pro | Dépend du backend |
| **Turso/libSQL** | SQLite distribué | Edge, serverless | Cloud |

### SQLite avec better-sqlite3 (synchrone, simple)

Idéal pour apprendre et prototyper. Pas de serveur à gérer.

```tsx
// server/utils/database.ts
import Database from 'better-sqlite3'

const db = new Database('data.db')

// Exécution synchrone (spécificité better-sqlite3)
db.exec(`CREATE TABLE IF NOT EXISTS users (...)`)

export { db }
```

### PostgreSQL avec Drizzle ORM

Solution production avec typage fort et migrations.

```tsx
// server/utils/db.ts
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
export const db = drizzle(pool)
```

### Connexion à ton backend .NET

Le pattern le plus pertinent pour ton contexte pro :

```tsx
// server/utils/dotnetClient.ts
const baseUrl = process.env.DOTNET_API_URL

export const dotnetClient = {
  async get<T>(endpoint: string): Promise<T> {
    return $fetch<T>(`${baseUrl}${endpoint}`, {
      headers: { 'Authorization': `Bearer${getToken()}` }
    })
  },
  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return $fetch<T>(`${baseUrl}${endpoint}`, { method: 'POST', body })
  }
}
```

### Redis pour le caching

```tsx
// server/utils/cache.ts
import { createClient } from 'redis'

const redis = createClient({ url: process.env.REDIS_URL })
await redis.connect()

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  },
  async set(key: string, value: unknown, ttlSeconds = 300) {
    await redis.setEx(key, ttlSeconds, JSON.stringify(value))
  }
}
```

---

## 4. Concepts clés et syntaxe

### Définir un schéma avec Drizzle ORM

Drizzle utilise une approche “schema-first” en TypeScript pur :

```tsx
// server/database/schema.ts
import { pgTable, serial, varchar, timestamp, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow()
})

// Relations
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  authorId: integer('author_id').references(() => users.id),
  title: varchar('title', { length: 200 })
})
```

**Avantage** : Le schéma génère automatiquement les types TypeScript.

### Requêtes avec Drizzle (Query Builder)

```tsx
import { db } from '~/server/utils/db'
import { users } from '~/server/database/schema'
import { eq, like, and, desc } from 'drizzle-orm'

// SELECT simple
const allUsers = await db.select().from(users)

// SELECT avec conditions
const activeUsers = await db
  .select()
  .from(users)
  .where(eq(users.status, 'active'))
  .orderBy(desc(users.createdAt))

// SELECT avec filtre multiple
const filtered = await db
  .select({ id: users.id, name: users.name })  // Projection
  .from(users)
  .where(and(
    eq(users.role, 'admin'),
    like(users.email, '%@company.com')
  ))

// INSERT
const [newUser] = await db
  .insert(users)
  .values({ email: 'test@mail.com', name: 'Test' })
  .returning()  // Retourne l'enregistrement créé

// UPDATE
await db
  .update(users)
  .set({ name: 'Nouveau nom' })
  .where(eq(users.id, 1))

// DELETE
await db.delete(users).where(eq(users.id, 1))
```

### Validation avec Zod

Zod permet de valider et typer les données entrantes :

```tsx
import { z } from 'zod'

// Définir un schéma de validation
const createUserSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().optional()
})

// Inférer le type TypeScript
type CreateUserInput = z.infer<typeof createUserSchema>

// Utilisation dans un handler
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Valide et type en une fois
  const validated = createUserSchema.parse(body)  // Throw si invalide

  // Ou version "safe" sans exception
  const result = createUserSchema.safeParse(body)
  if (!result.success) {
    throw createError({ statusCode: 400, message: result.error.message })
  }

  return createUser(result.data)
})
```

### Gestion d’état côté client avec useState

Pour les données partagées entre composants :

```tsx
// composables/useUserStore.ts
export const useUserStore = () => {
  // État global (persisté pendant la navigation)
  const currentUser = useState<User | null>('current-user', () => null)

  const setUser = (user: User) => { currentUser.value = user }
  const clearUser = () => { currentUser.value = null }

  return { currentUser, setUser, clearUser }
}
```

**Attention** : `useState` est hydraté du serveur vers le client. Pour des données sensibles, préférer un state purement client.

---

## 5. Librairies essentielles

### ORM et accès base de données

| Librairie | Forces | Faiblesses |
| --- | --- | --- |
| **Drizzle ORM** | Léger, type-safe, SQL-like | Moins de “magie” |
| **Prisma** | DX excellent, migrations faciles | Bundle plus lourd |
| **Kysely** | Query builder pur, très typé | Pas d’ORM complet |

**Recommandation** : Drizzle pour Nuxt (léger, edge-compatible).

### Validation

| Librairie | Usage |
| --- | --- |
| **Zod** | Standard actuel, excellent avec TypeScript |
| **Valibot** | Alternative ultra-légère à Zod |
| **h3-zod** | Intégration Zod spécifique pour les handlers Nuxt |

### HTTP Client

| Outil | Contexte |
| --- | --- |
| **$fetch** (ofetch) | Intégré à Nuxt, isomorphique |
| **ky** | Alternative moderne à axios |

### Caching et performance

| Solution | Usage |
| --- | --- |
| **unstorage** | Abstraction stockage (intégré Nuxt) |
| **Redis** | Cache distribué production |
| **lru-cache** | Cache mémoire simple |

---

## 6. Patterns d’accès aux données

### Pattern Repository

Abstrait la source de données derrière une interface :

```tsx
// server/repositories/userRepository.ts
import { db } from '~/server/utils/db'
import { users } from '~/server/database/schema'

export const userRepository = {
  async findAll() {
    return db.select().from(users)
  },

  async findById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id))
    return user ?? null
  },

  async create(data: NewUser) {
    const [user] = await db.insert(users).values(data).returning()
    return user
  }
}
```

### Pattern Service

Contient la logique métier, utilise les repositories :

```tsx
// server/services/userService.ts
import { userRepository } from '~/server/repositories/userRepository'
import { cache } from '~/server/utils/cache'

export const userService = {
  async getUser(id: number) {
    // Vérifier le cache d'abord
    const cached = await cache.get<User>(`user:${id}`)
    if (cached) return cached

    const user = await userRepository.findById(id)
    if (user) {
      await cache.set(`user:${id}`, user, 300)  // Cache 5 min
    }
    return user
  },

  async createUser(input: CreateUserInput) {
    // Logique métier ici (validation supplémentaire, etc.)
    return userRepository.create(input)
  }
}
```

### Pattern API Handler (couche fine)

```tsx
// server/api/users/[id].get.ts
import { userService } from '~/server/services/userService'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  if (isNaN(id)) {
    throw createError({ statusCode: 400, message: 'ID invalide' })
  }

  const user = await userService.getUser(id)

  if (!user) {
    throw createError({ statusCode: 404, message: 'Utilisateur non trouvé' })
  }

  return user
})
```

### Agrégation de données (BFF pattern)

Combiner plusieurs sources en une réponse :

```tsx
// server/api/dashboard.get.ts
export default defineEventHandler(async (event) => {
  // Appels parallèles pour optimiser
  const [user, stats, notifications] = await Promise.all([
    userService.getCurrentUser(event),
    statsService.getUserStats(userId),
    notificationService.getUnread(userId)
  ])

  // Réponse agrégée et formatée pour le frontend
  return {
    user: { name: user.name, avatar: user.avatar },
    stats: { totalTasks: stats.total, completed: stats.done },
    unreadCount: notifications.length
  }
})
```

---

## 7. Bonnes pratiques

### Structure et organisation

1. **Séparer les responsabilités** : API → Service → Repository
2. **Un fichier par endpoint** : `users/index.get.ts`, `users/index.post.ts`
3. **Centraliser la config DB** dans `server/utils/` ou `server/plugins/`

### Typage

```tsx
// Toujours typer les réponses API
interface ApiResponse<T> {
  data: T
  meta?: { total: number; page: number }
}

// Utiliser les types inférés de Drizzle
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm'
type User = InferSelectModel<typeof users>
type NewUser = InferInsertModel<typeof users>
```

### Sécurité

```tsx
// Ne jamais exposer les erreurs internes
export default defineEventHandler(async (event) => {
  try {
    return await doSomething()
  } catch (error) {
    console.error('Erreur interne:', error)  // Log serveur
    throw createError({
      statusCode: 500,
      message: 'Une erreur est survenue'  // Message générique au client
    })
  }
})

// Valider TOUTES les entrées utilisateur
const body = createUserSchema.parse(await readBody(event))
```

### Performance

```tsx
// Utiliser les clés de cache intelligemment avec useFetch
const { data } = await useFetch('/api/users', {
  key: `users-page-${page}`,  // Clé unique par page
  getCachedData: (key, nuxtApp) => {
    // Réutiliser les données en cache si récentes
    return nuxtApp.payload.data[key]
  }
})

// Lazy loading pour les données non critiques
const { data: stats } = await useLazyFetch('/api/stats')
```

### Variables d’environnement

```tsx
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Privé (serveur uniquement)
    databaseUrl: process.env.DATABASE_URL,
    apiSecret: process.env.API_SECRET,

    // Public (exposé au client)
    public: {
      apiBase: process.env.API_BASE_URL
    }
  }
})

// Utilisation
const config = useRuntimeConfig()
config.databaseUrl      // Serveur seulement
config.public.apiBase   // Client et serveur
```

---

## 8. Gestion des erreurs et validation

### Créer des erreurs HTTP propres

```tsx
// Erreur simple
throw createError({ statusCode: 404, message: 'Not found' })

// Erreur avec données additionnelles
throw createError({
  statusCode: 422,
  message: 'Validation failed',
  data: { fields: ['email', 'name'] }
})
```

### Middleware de validation réutilisable

```tsx
// server/utils/validate.ts
import type { ZodSchema } from 'zod'

export async function validateBody<T>(event: H3Event, schema: ZodSchema<T>): Promise<T> {
  const body = await readBody(event)
  const result = schema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation error',
      data: result.error.flatten()
    })
  }

  return result.data
}

// Usage simplifié dans les handlers
export default defineEventHandler(async (event) => {
  const data = await validateBody(event, createUserSchema)
  return userService.create(data)
})
```

### Gestion côté client

```tsx
const { data, error } = await useFetch('/api/users')

// Vérifier les erreurs
if (error.value) {
  console.error('Erreur:', error.value.statusCode, error.value.message)
}

// Ou avec watch pour réagir aux changements
watch(error, (err) => {
  if (err) toast.error(err.message)
})
```

---

## Résumé des points clés

| Concept | À retenir |
| --- | --- |
| **Architecture** | API → Service → Repository → Source |
| **Serveur** | `defineEventHandler` + `event` object |
| **Client** | `useFetch` (simple) ou `useAsyncData` (complexe) |
| **ORM** | Drizzle recommandé (léger, typé) |
| **Validation** | Zod systématiquement sur les entrées |
| **Cache** | Redis en prod, `unstorage` pour abstraction |
| **Typage** | Inférer depuis le schéma DB |
| **Sécurité** | Valider, ne pas exposer les erreurs internes |

---

## Prochaines étapes suggérées

1. **Pratique** : Implémenter un CRUD complet avec SQLite + Drizzle
2. **Évolution** : Ajouter Redis pour le caching
3. **Production** : Migrer vers PostgreSQL avec migrations
4. **Intégration** : Connecter ton backend .NET via le pattern client