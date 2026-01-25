# Installation et Configuration SQLite + Drizzle

## Étape 1 : Installation des packages

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

**Explication des packages :**

- `drizzle-orm` : ORM principal (query builder, types TS)
- `better-sqlite3` : Driver SQLite natif (performant, synchrone)
- `drizzle-kit` : CLI pour migrations et introspection
- `@types/better-sqlite3` : Types TypeScript

**Alternative PostgreSQL (pour référence) :**

```bash
npm install drizzle-orm postgres
```

---

## Étape 2 : Configuration Drizzle Kit

**Créer `drizzle.config.ts`** (à la racine du projet) :

```tsx
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts',
  out: './server/database/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './.data/db.sqlite'
  }
})
```

**Décryptage :**

- `schema` : où sont tes définitions de tables
- `out` : où générer les fichiers SQL de migration
- `dialect` : type de DB (sqlite/postgresql/mysql)
- `dbCredentials.url` : chemin du fichier DB

**Pourquoi `.data/` ?**

- Convention Nuxt pour fichiers ignorés par Git
- Ajoute `.data/` dans `.gitignore`

---

## Étape 3 : Créer la structure de dossiers

```bash
mkdir -p server/database/migrations
mkdir -p .data

```

**Organisation professionnelle :**

```
server/
├── database/
│   ├── schema.ts         # ← Schémas de tables
│   └── migrations/       # ← Historique SQL auto-généré
└── utils/
    └── db.ts            # ← Instance Drizzle

```

---

## Étape 4 : Initialiser la connexion DB

**Créer `server/utils/db.ts`** :

```tsx
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'

// Créer la connexion SQLite
const sqlite = new Database('.data/db.sqlite')

// Activer les clés étrangères (important!)
sqlite.pragma('foreign_keys = ON')

// Créer l'instance Drizzle
export const db = drizzle(sqlite)

```

**Points clés :**

- `Database()` crée le fichier si inexistant
- `pragma` active les contraintes FK (désactivées par défaut en SQLite)
- Export unique = pattern singleton
- Placé dans `utils/` = auto-importé partout dans `server/`

---

## Étape 5 : Définir ton schéma

**Créer `server/database/schema.ts`** :

```tsx
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const persons = sqliteTable('persons', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  age: integer('age'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => new Date())
})

```

**Syntaxe Drizzle :**

- `sqliteTable('nom_table', { colonnes })` : définition table
- Types : `integer`, `text`, `real`, `blob`
- Modifiers : `.notNull()`, `.unique()`, `.primaryKey()`
- `mode: 'timestamp'` : convertit integer ↔ Date automatiquement
- `$defaultFn()` : fonction exécutée à l'insertion

**Comparaison avec SQL brut :**

```sql
-- Équivalent en SQL
CREATE TABLE persons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  age INTEGER,
  created_at INTEGER DEFAULT (strftime('%s', 'now'))
);
```

---

## Étape 6 : Générer et appliquer la migration

**Ajouter scripts dans `package.json`** :

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```

**Exécuter :**

```bash
# 1. Générer le fichier SQL de migration
npm run db:generate

# 2. Appliquer la migration sur la DB
npm run db:migrate
```

**Ce qui se passe :**

1. `generate` analyse `schema.ts` → crée `migrations/0000_xxx.sql`
2. `migrate` exécute le SQL → crée la table dans `db.sqlite`
3. Historique = traçabilité des changements

**Fichier généré (`migrations/0000_initial.sql`) :**

```sql
CREATE TABLE `persons` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL UNIQUE,
  -- ...
);
```

---

## Étape 7 : Tester avec Drizzle Studio (optionnel mais utile)

```bash
npm run db:studio
```

**Interface web** sur `https://local.drizzle.studio` :

- Visualiser les tables
- Insérer/modifier des données
- Tester des requêtes
- Alternative à DB Browser for SQLite

---

## Étape 8 : Premier test d'insertion

**Créer `server/api/test-db.get.ts`** :

```tsx
import { db } from '~/server/utils/db'
import { persons } from '~/server/database/schema'

export default defineEventHandler(async () => {
  // Insérer une personne
  const result = await db.insert(persons).values({
    name: 'Alice Dupont',
    email: 'alice@example.com',
    age: 30
  })

  // Récupérer toutes les personnes
  const allPersons = await db.select().from(persons)

  return { inserted: result, allPersons }
})

```

**Tester dans le navigateur :**

```
http://localhost:3000/api/test-db

```

**Syntaxe Drizzle :**

- `db.insert(table).values({})` : création
- `db.select().from(table)` : lecture
- Types TS auto-complétés ✨
- Retour auto-sérialisé en JSON

---

## Récapitulatif du workflow

```
1. Modifier schema.ts (ajouter/modifier tables)
2. npm run db:generate (créer migration SQL)
3. npm run db:migrate (appliquer sur DB)
4. Utiliser db.insert/select/update/delete dans API routes
```

---