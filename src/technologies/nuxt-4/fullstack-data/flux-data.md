# Premier flux de données DB → API → Client

### **Vue d'ensemble du flux**

```
Database (SQLite)
    ↓ Drizzle ORM
API Route (server/api/volunteers.ts)
    ↓ HTTP/JSON
Composable (composables/useVolunteers.ts)
    ↓ Reactive data
Component (pages/volunteers.vue)
```

---

## Route API : GET /api/volunteers

### Concept clé

Les routes API dans `server/api/` sont **automatiquement exposées**. Le nom du fichier = l'endpoint.

### Fichier : `server/api/volunteers.ts`

```ts
import { db } from '~/server/utils/db'
import { volunteers } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const allVolunteers = await db.select().from(volunteers)
  return allVolunteers
})
```

### Points importants

**`defineEventHandler`** : wrapper Nuxt pour les routes API

- Gère automatiquement la sérialisation JSON
- Capture les erreurs non gérées

**`db.select().from(table)`** : syntaxe Drizzle de base

- `.select()` = toutes les colonnes
- Retourne un array d'objets

**Types automatiques** : Drizzle infère le type de retour depuis le schéma

- Pas besoin de définir manuellement `Volunteer`
- Le type est disponible côté client via l'API

---

## Composable : useVolunteers

### Concept clé

Un composable encapsule la **logique de fetching** pour la réutiliser. Convention : préfixe `use`.

### Fichier : `composables/useVolunteers.ts`

```ts
export function useVolunteers() {
  return useFetch('/api/volunteers')
}
```

### Points importants

**`useFetch`** : composable Nuxt pour fetcher des données

- Auto-refresh lors de navigation
- Gère le cache automatiquement
- SSR-friendly (s'exécute côté serveur au premier rendu)

**Typage automatique** : Nuxt infère les types depuis l'API route

- Pas besoin d'importer ou définir le type manuellement
- IntelliSense fonctionne out-of-the-box

**Retour de `useFetch`** :

```ts
{
  data: Ref<Volunteer[] | null>,
  pending: Ref<boolean>,
  error: Ref<Error | null>,
  refresh: () => Promise<void>
}
```

---

## Utilisation dans un composant

### Fichier : `pages/volunteers.vue`

```ts
<script setup lang="ts">
const { data: volunteers, pending, error } = useVolunteers()
</script>

<template>
  <div>
    <p v-if="pending">Chargement...</p>
    <p v-if="error">Erreur : {{ error.message }}</p>
    
    <UTable 
      v-else-if="volunteers"
      :rows="volunteers"
      :columns="[
        { key: 'firstName', label: 'Prénom' },
        { key: 'lastName', label: 'Nom' },
        { key: 'email', label: 'Email' }
      ]"
    />
  </div>
</template>
```

### Points importants

**Destructuring** : `const { data, pending, error }`

- `data` renommé en `volunteers` pour clarté
- Toutes ces variables sont **reactives** (Ref)

**`v-if` / `v-else-if`** : gestion conditionnelle du rendu

- Ordre important : pending → error → success
- Évite les erreurs d'accès à `volunteers` null

**Props UTable** :

- `:rows` attend un array
- `:columns` définit quelles colonnes afficher avec leur mapping

---

## Typage des données

La sérialisation JSON transforme `Date` → `string` automatiquement, donc **assume ce comportement** et type en conséquence.

### Solution la plus propre : Type utilitaire

```ts
// /server/database/schema
export type Volunteer = typeof volunteers.$inferSelect
```

### Dans `types/database.ts`

```ts
export type { Volunteer } from '~/server/database/schema'

// Transforme automatiquement Date → string après JSON
type Serialized<T> = {
  [K in keyof T]: T[K] extends Date | null
    ? string | null
    : T[K] extends Date | undefined
    ? string | undefined
    : T[K] extends Date
    ? string
    : T[K]
}

export type VolunteerDTO = Serialized<Volunteer>
```

### Avantages

✅ **Zero duplication** : tu ne réécris pas les champs manuellement

✅ **Tolérant au null** : gère `null` correctement (problème actuel)

✅ **Automatique** : si tu ajoutes un champ au schéma, le DTO suit

✅ **Type-safe** : impossible d'avoir un décalage entre DB et API

---

## Utilisation (identique)

```ts 
import type { VolunteerDTO } from '~/types/database'

export function useVolunteers() {
  return useFetch<VolunteerDTO[]>('/api/volunteers')
}
```

```ts
<script setup lang="ts">
import type { VolunteerDTO } from '~/types/database'

defineProps<{ rows: VolunteerDTO[] }>()
</script>
```

---

## Pourquoi c'est la meilleure pratique

**Standards de l'industrie** :

- Pas de transformation manuelle des dates en API (laisse JSON.stringify faire)
- Le client reçoit des strings ISO, facile à parser si besoin (`new Date(str)`)
- Évite les bugs de timezone

**Pattern DTO universel** :

- Utilisé dans .NET, Java, Node.js
- Sépare clairement DB types vs API types
- Le type utilitaire `Serialized` est réutilisable pour toutes tes tables

---

## CRUD complet

## Vue d'ensemble

Le **GET ALL** qu'on a fait utilise `useFetch` car on charge des données au montage du composant.

Pour **Create/Update/Delete**, on utilise `$fetch` car ce sont des **actions utilisateur** (clic bouton, soumission form).

---

## 1. CREATE - POST /api/volunteers

### Route API : `server/api/volunteers.ts`

```ts
import { db } from '~/server/utils/db'
import { volunteers } from '~/server/database/schema'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  
  if (method === 'GET') {
    return await db.select().from(volunteers)
  }
  
  if (method === 'POST') {
    const body = await readBody(event)
    
    const [newVolunteer] = await db
      .insert(volunteers)
      .values(body)
      .returning()
    
    return newVolunteer
  }
})
```

### Points importants

**`getMethod(event)`** : détecte GET/POST/PUT/DELETE sur la même route

**`readBody(event)`** : récupère le JSON du body de la requête

**`.returning()`** : Drizzle retourne l'objet créé (avec l'id auto-généré)

**Destructuring `[newVolunteer]`** : `.returning()` renvoie un array, on prend le premier élément

---

### Composable : `composables/useVolunteers.ts`

```ts
import type { VolunteerDTO } from '~/types/database'

export function useVolunteers() {
  const { data, refresh } = useFetch<VolunteerDTO[]>('/api/volunteers')
  
  const createVolunteer = async (volunteerData: Partial<VolunteerDTO>) => {
    await $fetch('/api/volunteers', {
      method: 'POST',
      body: volunteerData
    })
    
    await refresh() // Recharge la liste
  }
  
  return {
    volunteers: data,
    createVolunteer
  }
}
```

### Points importants

**`$fetch`** : version non-reactive de `useFetch`

- Utilisé pour les **actions ponctuelles**
- Retourne une Promise (besoin de `await`)
- Pas de cache automatique

**`refresh()`** : force le re-fetch du `useFetch` initial

- Met à jour `data` avec les nouvelles données
- L'UI se rafraîchit automatiquement (réactivité)

**`Partial<VolunteerDTO>`** : tous les champs deviennent optionnels

- Pratique car `id`, `createdAt`, etc. sont générés par la DB

---

### Utilisation dans un composant

```ts
<script setup lang="ts">
const { volunteers, createVolunteer } = useVolunteers()

const newVolunteer = ref({
  firstName: '',
  lastName: '',
  email: ''
})

const handleSubmit = async () => {
  await createVolunteer(newVolunteer.value)
  // Reset form
  newVolunteer.value = { firstName: '', lastName: '', email: '' }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="newVolunteer.firstName" placeholder="Prénom" />
    <input v-model="newVolunteer.lastName" placeholder="Nom" />
    <input v-model="newVolunteer.email" placeholder="Email" />
    <button type="submit">Ajouter</button>
  </form>
</template>
```

---

## 2. UPDATE - PUT /api/volunteers/[id].ts

### Route API : `server/api/volunteers/[id].ts`

```ts
import { db } from '~/server/utils/db'
import { volunteers } from '~/server/database/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = getMethod(event)
  
  if (method === 'PUT') {
    const body = await readBody(event)
    
    const [updated] = await db
      .update(volunteers)
      .set(body)
      .where(eq(volunteers.id, Number(id)))
      .returning()
    
    return updated
  }
})
```

### Points importants

**`[id].ts`** : bracket syntax = paramètre dynamique

- Accessible via `getRouterParam(event, 'id')`
- L'URL sera `/api/volunteers/42`

**`eq(column, value)`** : opérateur d'égalité Drizzle

- Import depuis `drizzle-orm`
- Équivalent SQL : `WHERE id = ?`

**`.set(body)`** : met à jour les champs fournis

- Seuls les champs dans `body` sont modifiés
- Les autres restent inchangés

---

### Composable : ajout dans `useVolunteers.ts`

```ts
const updateVolunteer = async (id: number, updates: Partial<VolunteerDTO>) => {
  await $fetch(`/api/volunteers/${id}`, {
    method: 'PUT',
    body: updates
  })
  
  await refresh()
}

return {
  volunteers: data,
  createVolunteer,
  updateVolunteer
}
```

### Utilisation

```ts
<script setup lang="ts">
const { volunteers, updateVolunteer } = useVolunteers()

const editVolunteer = async (id: number) => {
  await updateVolunteer(id, {
    status: 'inactive'
  })
}
</script>
```

---

## 3. DELETE - DELETE /api/volunteers/[id].ts

### Route API : dans le même fichier `[id].ts`

```ts
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const method = getMethod(event)
  
  if (method === 'PUT') {
    // ... code UPDATE
  }
  
  if (method === 'DELETE') {
    await db
      .delete(volunteers)
      .where(eq(volunteers.id, Number(id)))
    
    return { success: true }
  }
})
```

### Points importants

**Pas de `.returning()`** : pas nécessaire pour un DELETE

**Return custom** : on renvoie une confirmation simple

---

### Composable : ajout dans `useVolunteers.ts`

```ts
const deleteVolunteer = async (id: number) => {
  await $fetch(`/api/volunteers/${id}`, {
    method: 'DELETE'
  })
  
  await refresh()
}

return {
  volunteers: data,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer
}
```

---

## Résumé des différences clés

| Opération | Route | Méthode HTTP | Quand ? | Tool |
| --- | --- | --- | --- | --- |
| **GET ALL** | `/api/volunteers` | GET | Au chargement | `useFetch` |
| **CREATE** | `/api/volunteers` | POST | Action user | `$fetch` |
| **UPDATE** | `/api/volunteers/[id]` | PUT | Action user | `$fetch` |
| **DELETE** | `/api/volunteers/[id]` | DELETE | Action user | `$fetch` |

---

## Concepts clés à retenir

### 1. **useFetch vs $fetch**

- `useFetch` = données initiales, cache, SSR
- `$fetch` = actions ponctuelles, pas de cache

### 2. **refresh() après mutation**

- Synchronise l'état local avec la DB
- Évite de gérer manuellement l'ajout/suppression dans l'array

### 3. **Route dynamique [id]**

- Paramètres d'URL typés
- Réutilise la même route pour plusieurs IDs

### 4. **Drizzle operations**

- `.insert().values()` → CREATE
- `.update().set().where()` → UPDATE
- `.delete().where()` → DELETE
- `.returning()` → récupère l'objet modifié