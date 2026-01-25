# Liaison Types TypeScript ↔ Tables SQL avec Drizzle

## Le mécanisme fondamental

**Drizzle génère automatiquement les types TS depuis tes schémas**

```tsx
// server/database/schema.ts
export const persons = sqliteTable('persons', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  age: integer('age')
})
```

**Ce schéma devient DEUX choses :**

1. **Source SQL** : pour créer la table physique
2. **Source de types TS** : inférés automatiquement

---

## Extraction des types

**Drizzle fournit des utilitaires d'inférence :**

```tsx
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { persons } from '~/server/database/schema'

// Type pour lire (SELECT)
type Person = InferSelectModel<typeof persons>
// → { id: number; name: string; email: string; age: number | null; createdAt: Date }

// Type pour insérer (INSERT)
type NewPerson = InferInsertModel<typeof persons>
// → { id?: number; name: string; email: string; age?: number | null; createdAt?: Date }
```

**Différences clés :**

- `InferSelectModel` : tous les champs présents (lecture DB)
- `InferInsertModel` : champs optionnels si `autoIncrement` ou `$defaultFn`

---

## Comparaison avec approches manuelles

### ❌ Ancienne méthode (sans ORM)

```tsx
// Définition manuelle (risque de désynchronisation)
interface Person {
  id: number
  name: string
  email: string
}

// SQL séparé (peut diverger du type)
db.query('SELECT * FROM persons')
```

**Problèmes :**

- Types et DB peuvent diverger
- Aucune vérification à la compilation
- Maintenance double (schema + types)

---

### ✅ Avec Drizzle (source unique de vérité)

```tsx
// UNE définition = double usage
export const persons = sqliteTable('persons', { /* ... */ })

// Types dérivés automatiquement
const allPersons = await db.select().from(persons)
// → allPersons est typé comme Person[] automatiquement
```

**Avantages :**

- Single Source of Truth
- Auto-complétion IDE
- Erreurs TS à la compilation
- Refactoring safe

---

## En pratique dans ton code

### Exemple 1 : API Route typée

```tsx
// server/api/persons/index.get.ts
import { db } from '~/server/utils/db'
import { persons } from '~/server/database/schema'

export default defineEventHandler(async () => {
  const results = await db.select().from(persons)
  
  // TS sait que results est de type Person[]
  // Tu peux utiliser autocomplete sur results[0].name, etc.
  
  return results
})
```

**Typage automatique :**

```tsx
const results = await db.select().from(persons)
//    ↑ Type inféré : { id: number; name: string; ... }[]
```

---

### Exemple 2 : Insertion avec validation

```tsx
import { type InferInsertModel } from 'drizzle-orm'
import { persons } from '~/server/database/schema'

type NewPerson = InferInsertModel<typeof persons>

export default defineEventHandler(async (event) => {
  const body = await readBody<NewPerson>(event)
  
  // TS vérifie que body.name existe et est string
  // TS accepte que body.id soit undefined
  
  const result = await db.insert(persons).values(body)
  return result
})
```

---

### Exemple 3 : Sélection partielle

```tsx
// Sélectionner seulement certains champs
const nameOnly = await db
  .select({ name: persons.name, email: persons.email })
  .from(persons)

// Type inféré automatiquement :
// { name: string; email: string }[]
```

**Drizzle infère le type du SELECT :**

- Si tu sélectionnes tout → type complet
- Si tu sélectionnes partiellement → type partiel
- Pas besoin de typage manuel !

---

## Relations et types imbriqués

**Exemple avec relation :**

```tsx
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull()
})

export const posts = sqliteTable('posts', {
  id: integer('id').primaryKey(),
  title: text('title').notNull(),
  userId: integer('user_id').references(() => users.id)
})

// Définir la relation (pour query builder)
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts)
}))
```

**Query avec relation typée :**

```tsx
const usersWithPosts = await db.query.users.findMany({
  with: { posts: true }
})

// Type inféré :
// {
//   id: number;
//   name: string;
//   posts: { id: number; title: string; userId: number | null }[]
// }[]
```

---

## Schéma → Types → Validation (flux complet)

```tsx
// 1. Définition schéma (source de vérité)
export const persons = sqliteTable('persons', {
  name: text('name').notNull(),
  age: integer('age')
})

// 2. Type TS extrait
type NewPerson = InferInsertModel<typeof persons>

// 3. Validation Zod (optionnel, pour données externes)
import { z } from 'zod'

const personSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().positive().optional()
})

// 4. Usage dans API
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Valider avec Zod
  const validated = personSchema.parse(body)
  
  // Insérer (déjà typé par Drizzle)
  await db.insert(persons).values(validated)
})
```

**Différence validation TS vs Zod :**

- **TS** : vérification à la compilation (code source)
- **Zod** : validation à l'exécution (données utilisateur)
- Les deux sont complémentaires !

---

## Pattern professionnel recommandé

**Créer `server/database/types.ts`** :

```tsx
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import * as schema from './schema'

// Export centralisé des types
export type Person = InferSelectModel<typeof schema.persons>
export type NewPerson = InferInsertModel<typeof schema.persons>

// Pour d'autres tables...
export type Post = InferSelectModel<typeof schema.posts>
export type NewPost = InferInsertModel<typeof schema.posts>
```

**Usage partout dans l'app :**

```tsx
import type { Person, NewPerson } from '~/server/database/types'

function processPerson(person: Person) { /* ... */ }
```

---

## Récapitulatif
```
Schema Drizzle (sqliteTable)
        ↓
   [Compilation]
        ↓
    ┌───┴───┐
    ↓       ↓
Types TS   SQL
 (auto)   (migration)
    ↓       ↓
  IDE    Database
```

**Points clés :**

1. Schéma = unique source de vérité
2. Types TS générés automatiquement
3. Pas de duplication manuelle
4. Refactoring safe (renommer un champ = erreur TS partout)