# Server/Client et Communication API

# Architecture Server/Client et Communication API dans Nuxt 4 Fullstack

> Ce guide approfondit la séparation des responsabilités entre server/ et app/, la création de routes API avec Drizzle, et les patterns de consommation côté client.
> 

---

## 1. Comprendre la séparation Server / Client

### Le principe fondamental

Dans une architecture Nuxt fullstack pure, **deux environnements d’exécution coexistent** :

| Environnement | Dossier | Exécution | Accès |
| --- | --- | --- | --- |
| **Server** | `server/` | Node.js uniquement | BDD, filesystem, secrets |
| **Client** | `app/` | Navigateur (+ SSR initial) | APIs, localStorage, DOM |

**Règle d’or** : Le client ne doit **jamais** accéder directement à la base de données. Toute donnée passe par une route API.

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                           │
│   app/pages/       app/components/       app/composables/   │
│        │                   │                    │           │
│        └───────────────────┼────────────────────┘           │
│                            │                                │
│                     useFetch('/api/...')                    │
└────────────────────────────┼────────────────────────────────┘
                             │ HTTP
┌────────────────────────────┼────────────────────────────────┐
│                        SERVEUR NODE                         │
│                            ▼                                │
│   server/api/         server/services/      server/database/│
│   (handlers)          (logique métier)      (Drizzle)       │
│        │                   │                    │           │
│        └───────────────────┴────────────────────┘           │
│                            │                                │
│                         SQLite                              │
└─────────────────────────────────────────────────────────────┘
```

### Ce qui s’exécute où

**Côté Server uniquement** (`server/`) :
- Accès BDD via Drizzle
- Variables d’environnement sensibles (`process.env.DATABASE_URL`)
- Opérations filesystem (`fs.readFile`)
- Secrets, tokens, credentials

**Côté Client uniquement** (dans le navigateur) :
- `localStorage`, `sessionStorage`
- APIs navigateur (`navigator`, `window`)
- Event listeners DOM

**Côté “Universel”** (`app/` - s’exécute des deux côtés en SSR) :
- Composables avec `useFetch`, `useAsyncData`
- `useState` (hydraté du serveur vers le client)
- Composants Vue (rendus SSR puis hydratés)

### Piège classique : le code universel

```tsx
// ❌ ERREUR : s'exécute aussi côté serveur SSR
const token = localStorage.getItem('token')

// ✅ CORRECT : vérifie l'environnement
if (import.meta.client) {
  const token = localStorage.getItem('token')
}

// ✅ CORRECT : dans un hook lifecycle
onMounted(() => {
  const token = localStorage.getItem('token')
})
```

**`import.meta.client`** et **`import.meta.server`** : constantes Nuxt pour conditionner l’exécution.

---

## 2. Anatomie d’une route API Nuxt

### Conventions de nommage

Les fichiers dans `server/api/` deviennent automatiquement des endpoints :

| Fichier | Route | Méthode |
| --- | --- | --- |
| `server/api/users.ts` | `/api/users` | Toutes |
| `server/api/users.get.ts` | `/api/users` | GET uniquement |
| `server/api/users.post.ts` | `/api/users` | POST uniquement |
| `server/api/users/[id].ts` | `/api/users/:id` | Toutes |
| `server/api/users/[id].delete.ts` | `/api/users/:id` | DELETE uniquement |

### Structure d’un handler

```tsx
// server/api/example.get.ts
export default defineEventHandler(async (event) => {
  // 'event' contient tout le contexte de la requête
  return { message: 'Hello' }
})
```

**`defineEventHandler`** : fonction Nuxt qui crée un handler compatible H3 (le serveur HTTP sous-jacent).

**`event`** : objet contenant :
- La requête HTTP brute
- Les headers
- Les paramètres de route
- Le body (pour POST/PUT)
- Le contexte Nuxt

### Récupérer les données de la requête

```tsx
// Paramètres d'URL : /api/users/42
const id = getRouterParam(event, 'id') // '42' (string!)

// Query string : /api/users?status=active&limit=10
const query = getQuery(event) // { status: 'active', limit: '10' }

// Body (POST, PUT, PATCH)
const body = await readBody(event) // objet JSON parsé

// Headers
const auth = getHeader(event, 'authorization')
```

**Attention** : `getRouterParam` retourne toujours une **string**. Pense à convertir :

```tsx
const id = Number(getRouterParam(event, 'id'))
if (isNaN(id)) {
  throw createError({ statusCode: 400, message: 'ID invalide' })
}
```

---

## 3. Routes API avec Drizzle et SQLite

### Rappel : configuration Drizzle

```tsx
// server/database/index.ts
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import * as schema from './schema'

const sqlite = new Database('sqlite.db')
export const db = drizzle(sqlite, { schema })
```

### Pattern CRUD complet

### GET tous les éléments

```tsx
// server/api/tasks.get.ts
import { db } from '~/server/database'
import { tasks } from '~/server/database/schema'

export default defineEventHandler(async () => {
  return await db.select().from(tasks)
})
```

**Point clé** : `db.select().from(table)` retourne un tableau. Même vide, c’est un tableau `[]`.

### GET un élément par ID

```tsx
// server/api/tasks/[id].get.ts
import { db } from '~/server/database'
import { tasks } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const result = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id))

  // select() retourne toujours un tableau
  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'Tâche non trouvée' })
  }

  return result[0]
})
```

**`eq(colonne, valeur)`** : opérateur Drizzle pour `WHERE colonne = valeur`.

### POST créer un élément

```tsx
// server/api/tasks.post.ts
import { db } from '~/server/database'
import { tasks } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validation basique (voir section Zod plus bas)
  if (!body.title) {
    throw createError({ statusCode: 400, message: 'Titre requis' })
  }

  const result = await db.insert(tasks).values({
    title: body.title,
    status: body.status ?? 'pending'
  }).returning()

  return result[0]
})
```

**`.returning()`** : indispensable pour récupérer l’élément créé (avec son ID auto-généré).

### PUT/PATCH modifier un élément

```tsx
// server/api/tasks/[id].put.ts
import { db } from '~/server/database'
import { tasks } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody(event)

  const result = await db
    .update(tasks)
    .set({
      title: body.title,
      status: body.status,
      updatedAt: new Date()
    })
    .where(eq(tasks.id, id))
    .returning()

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'Tâche non trouvée' })
  }

  return result[0]
})
```

### DELETE supprimer un élément

```tsx
// server/api/tasks/[id].delete.ts
import { db } from '~/server/database'
import { tasks } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))

  const result = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning()

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'Tâche non trouvée' })
  }

  return { deleted: true, task: result[0] }
})
```

### Gestion des erreurs côté serveur

```tsx
// Erreur client (4xx) - mauvaise requête
throw createError({
  statusCode: 400,
  message: 'Données invalides'
})

// Erreur serveur (5xx) - problème interne
throw createError({
  statusCode: 500,
  message: 'Erreur base de données'
})
```

**`createError`** : fonction H3/Nuxt qui crée une erreur HTTP propre, interceptée par le client.

---

## 4. Validation avec Zod côté serveur

### Pourquoi valider côté serveur ?

Le client peut être contourné (DevTools, Postman, scripts). **Toute donnée entrante doit être validée sur le serveur.**

### Pattern de validation

```tsx
// server/api/tasks.post.ts
import { z } from 'zod'

// Définir le schéma de validation
const createTaskSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  dueDate: z.string().datetime().optional()
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Valider et parser
  const parsed = createTaskSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: 'Validation échouée',
      data: parsed.error.flatten() // détails des erreurs
    })
  }

  // parsed.data est maintenant typé et validé
  const result = await db.insert(tasks).values(parsed.data).returning()
  return result[0]
})
```

**`safeParse`** vs **`parse`** :
- `safeParse` : retourne `{ success, data?, error? }` — ne throw pas
- `parse` : retourne directement les données ou throw une exception

### Réutiliser les schémas

```tsx
// server/validators/task.ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  status: z.enum(['pending', 'in_progress', 'done']).default('pending')
})

export const updateTaskSchema = createTaskSchema.partial()

// Types dérivés automatiquement
export type CreateTask = z.infer<typeof createTaskSchema>
export type UpdateTask = z.infer<typeof updateTaskSchema>
```

---

## 5. Composables pour consommer les APIs

### Principe : centraliser les appels API

Au lieu d’appeler `useFetch` directement dans chaque composant, on crée des **composables** qui encapsulent la logique.

```
app/composables/useTasks.ts  →  Logique d'accès aux tâches
app/pages/tasks/index.vue   →  Utilise useTasks()
app/components/TaskList.vue →  Utilise useTasks()
```

### Anatomie d’un composable API

```tsx
// app/composables/useTasks.ts
export function useTasks() {
  // État réactif partagé (optionnel)
  const tasks = useState<Task[]>('tasks', () => [])

  // Récupérer toutes les tâches
  async function fetchAll() {
    const { data, error } = await useFetch<Task[]>('/api/tasks')
    if (data.value) {
      tasks.value = data.value
    }
    return { data, error }
  }

  // Récupérer une tâche
  async function fetchOne(id: number) {
    return await useFetch<Task>(`/api/tasks/${id}`)
  }

  // Créer une tâche
  async function create(task: CreateTask) {
    return await useFetch<Task>('/api/tasks', {
      method: 'POST',
      body: task
    })
  }

  // Mettre à jour
  async function update(id: number, task: UpdateTask) {
    return await useFetch<Task>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: task
    })
  }

  // Supprimer
  async function remove(id: number) {
    return await useFetch(`/api/tasks/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    tasks,       // état réactif
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
}
```

### Utilisation dans une page

```
<script setup lang="ts">
const { tasks, fetchAll, create } = useTasks()

// Charger au montage
const { pending, error } = await fetchAll()

// Créer une nouvelle tâche
async function handleCreate() {
  const { error } = await create({ title: 'Nouvelle tâche' })
  if (!error.value) {
    await fetchAll() // Recharger la liste
  }
}
</script>
```

### `useFetch` vs `$fetch`

| Aspect | `useFetch` | `$fetch` |
| --- | --- | --- |
| **Contexte** | Composables, setup | Partout (event handlers, etc.) |
| **SSR** | ✅ Évite double appel | ❌ Appel dupliqué SSR+Client |
| **Réactivité** | ✅ Retourne refs | ❌ Retourne promesse simple |
| **Cache** | ✅ Intégré | ❌ Aucun |

**Règle** :
- `useFetch` pour le chargement initial (dans `setup` ou composables)
- `$fetch` pour les actions utilisateur (onClick, onSubmit)

```tsx
// Dans setup → useFetch
const { data } = await useFetch('/api/tasks')

// Dans un handler → $fetch
async function handleDelete(id: number) {
  await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  refresh() // recharger les données
}
```

### Pattern avec refresh

```tsx
export function useTasks() {
  const { data: tasks, pending, error, refresh } = useFetch<Task[]>('/api/tasks')

  async function create(task: CreateTask) {
    await $fetch('/api/tasks', { method: 'POST', body: task })
    await refresh() // Recharge automatiquement
  }

  async function remove(id: number) {
    await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    await refresh()
  }

  return { tasks, pending, error, create, remove, refresh }
}
```

---

## 6. Gestion des types partagés

### Le problème

```
server/database/schema.ts  →  Types Drizzle (InferSelectModel)
app/composables/useTasks.ts  →  Besoin des mêmes types
```

Le client ne peut pas importer depuis `server/` (environnements séparés).

### Solution : dossier `types/` à la racine

```
project/
├── app/
├── server/
├── types/           ← Types partagés
│   └── models.ts
```

```tsx
// types/models.ts
export interface Task {
  id: number
  title: string
  status: 'pending' | 'in_progress' | 'done'
  createdAt: string  // ISO string (JSON)
  updatedAt: string
}

export interface CreateTask {
  title: string
  status?: Task['status']
}

export interface UpdateTask {
  title?: string
  status?: Task['status']
}
```

**Pourquoi `string` pour les dates ?**

Les dates transitent par JSON (API HTTP). JSON ne connaît que les strings. Côté client, tu reçois `"2025-01-21T10:30:00.000Z"`, pas un objet `Date`.

### Utilisation

```tsx
// app/composables/useTasks.ts
import type { Task, CreateTask } from '~/types/models'

export function useTasks() {
  const { data } = useFetch<Task[]>('/api/tasks')
  // ...
}
```

```tsx
// server/api/tasks.get.ts
import type { Task } from '~/types/models'

export default defineEventHandler(async (): Promise<Task[]> => {
  // ...
})
```

### Alternative : générer depuis Drizzle

Si tu veux que Drizzle reste la source de vérité :

```tsx
// server/database/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  status: text('status', { enum: ['pending', 'in_progress', 'done'] }).notNull()
})

// Exporter le type inféré
export type TaskDB = typeof tasks.$inferSelect
```

Puis dans `types/models.ts`, tu peux créer le type API qui en dérive (avec dates en string, etc.).

---

## 7. Patterns avancés

### Composable avec état global

Pour partager l’état entre composants sans repasser par l’API :

```tsx
// app/composables/useTasks.ts
export function useTasks() {
  // useState crée un state global, partagé entre composants
  const tasks = useState<Task[]>('tasks', () => [])
  const isLoaded = useState('tasks-loaded', () => false)

  async function fetchAll() {
    // Ne recharger que si pas déjà fait
    if (isLoaded.value) return { data: tasks, error: null }

    const { data, error } = await useFetch<Task[]>('/api/tasks')
    if (data.value) {
      tasks.value = data.value
      isLoaded.value = true
    }
    return { data, error }
  }

  function invalidate() {
    isLoaded.value = false
  }

  return { tasks, fetchAll, invalidate }
}
```

### Gestion des erreurs côté client

```tsx
export function useTasks() {
  const error = useState<string | null>('tasks-error', () => null)

  async function create(task: CreateTask) {
    try {
      const result = await $fetch<Task>('/api/tasks', {
        method: 'POST',
        body: task
      })
      error.value = null
      return result
    } catch (e: any) {
      // Erreur HTTP structurée
      error.value = e.data?.message ?? 'Erreur lors de la création'
      return null
    }
  }

  return { error, create }
}
```

### Optimistic updates (avancé)

Mettre à jour l’UI avant la confirmation serveur :

```tsx
async function remove(id: number) {
  // Sauvegarder l'état actuel
  const backup = [...tasks.value]

  // Mise à jour optimiste
  tasks.value = tasks.value.filter(t => t.id !== id)

  try {
    await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
  } catch {
    // Rollback si erreur
    tasks.value = backup
  }
}
```

---

## 8. Checklist de mise en œuvre

### Structure minimale

```
project/
├── app/
│   ├── composables/
│   │   └── useTasks.ts
│   └── pages/
│       └── tasks/
│           └── index.vue
├── server/
│   ├── api/
│   │   ├── tasks.get.ts
│   │   ├── tasks.post.ts
│   │   └── tasks/
│   │       └── [id].ts      # GET, PUT, DELETE
│   ├── database/
│   │   ├── index.ts         # Export db
│   │   └── schema.ts        # Tables Drizzle
│   └── validators/
│       └── task.ts          # Schémas Zod
└── types/
    └── models.ts            # Types partagés
```

### Questions à se poser

- [ ]  Mon handler valide-t-il toutes les entrées (params, query, body) ?
- [ ]  Les erreurs retournent-elles des codes HTTP appropriés ?
- [ ]  Mon composable gère-t-il les états loading/error ?
- [ ]  Les types sont-ils cohérents entre server et client ?
- [ ]  Les dates sont-elles gérées comme strings côté client ?

---

## 9. Résumé des concepts clés

| Concept | Syntaxe | Usage |
| --- | --- | --- |
| Handler API | `defineEventHandler(async (event) => {})` | Créer une route |
| Param URL | `getRouterParam(event, 'id')` | `/api/[id]` → récupérer id |
| Query string | `getQuery(event)` | `?foo=bar` → récupérer foo |
| Body | `await readBody(event)` | POST/PUT → récupérer données |
| Erreur HTTP | `throw createError({ statusCode, message })` | Retourner 4xx/5xx |
| Fetch SSR-safe | `useFetch('/api/...')` | Appel initial (setup) |
| Fetch action | `$fetch('/api/...', { method })` | onClick, onSubmit |
| État global | `useState('key', () => initial)` | Partage entre composants |
| Refresh | `const { refresh } = useFetch(...)` | Recharger après mutation |

---

## Ressources

- [Nuxt Server Directory](https://nuxt.com/docs/guide/directory-structure/server)
- [H3 (serveur HTTP Nuxt)](https://h3.unjs.io/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Zod Documentation](https://zod.dev/)