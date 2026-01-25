# SSR vs SPA : Choix et Implications

### Tableau comparatif

| Aspect | SSR | SPA |
| --- | --- | --- |
| SEO | ✅ Excellent | ❌ Limité |
| Performance initiale | ✅ Contenu immédiat | ❌ Écran blanc puis chargement |
| Serveur Node requis | ✅ Oui | ❌ Non (fichiers statiques) |
| Complexité | ⚠️ Hydratation, état serveur/client | ✅ Simple |
| Cas d'usage | Sites publics, e-commerce, blogs | Dashboards, apps internes |

### Configuration

**SSR (défaut) :**

```tsx
export default defineNuxtConfig({
  ssr: true  // Par défaut, pas besoin de le spécifier
})
```

**SPA global :**

```tsx
export default defineNuxtConfig({
  ssr: false
})
```

**Hybride (recommandé pour dashboard + landing) :**

```tsx
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },           // Landing pré-rendue
    '/about': { prerender: true },
    '/dashboard/**': { ssr: false },    // Dashboard en SPA
    '/api/**': { cors: true }
  }
})
```

### Ce que SSR implique dans ton code

**1. Le code s'exécute côté serveur ET client**

```tsx
// ❌ Erreur : window n'existe pas côté serveur
const width = window.innerWidth

// ✅ Solution 1 : Guard
if (process.client) {
  const width = window.innerWidth
}

// ✅ Solution 2 : onMounted (s'exécute uniquement côté client)
onMounted(() => {
  const width = window.innerWidth
})
```

**2. L'état doit être cohérent entre serveur et client**

```tsx
// ❌ Erreur : Hydration mismatch
const id = Math.random()  // Différent serveur vs client

// ✅ Solution : useId() de Vue
const id = useId()
```

**3. Fetch de données**

```tsx
// ✅ useFetch s'exécute côté serveur, évite le double fetch
const { data } = await useFetch('/api/users')

// ⚠️ $fetch dans onMounted = fetch côté client uniquement
onMounted(async () => {
  const data = await $fetch('/api/users')  // Pas de SSR
})
```

### Bonnes pratiques SSR

1. **Utilise `useFetch` ou `useAsyncData`** pour les données, jamais `$fetch` directement dans le setup (sauf dans des handlers d'événements)
2. **Gère les erreurs de fetch**

```tsx
const { data, error } = await useFetch('/api/users')

if (error.value) {
  throw createError({ statusCode: 500, message: 'Erreur serveur' })
}
```

1. **Préfère `useState` à `ref` pour l'état partagé**

```tsx
// ❌ ref n'est pas partagé entre serveur et client
const user = ref(null)

// ✅ useState est hydraté correctement
const user = useState('user', () => null)
```

### Bonnes pratiques SPA

1. **Ajoute un loading state** car pas de contenu initial

```
<template>
  <div v-if="pending">Chargement...</div>
  <div v-else>{{ data }}</div>
</template>
```

1. **Gère l'authentification côté client**

```tsx
// middleware/auth.ts en mode SPA
export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return  // Skip côté serveur

  const { user } = useAuth()
  if (!user.value) {
    return navigateTo('/login')
  }
})
```

### Erreurs courantes à éviter

| Erreur | Conséquence | Solution |
| --- | --- | --- |
| `window` dans setup | Crash serveur | `process.client` ou `onMounted` |
| `$fetch` dans setup sans `useFetch` | Double fetch, pas de SSR | Utiliser `useFetch` |
| `ref` pour état global | Hydration mismatch | Utiliser `useState` |
| Librairie client-only sans guard | Crash serveur | Composant `<ClientOnly>` ou `.client.vue` |
| Dates/random dans template | Hydration mismatch | `useId()`, timestamps fixes |

### Comment choisir ?

**Choisis SSR si :**

- SEO important (site public, e-commerce, blog)
- Performance perçue critique (contenu visible immédiatement)
- Tu as un serveur Node disponible

**Choisis SPA si :**

- Application interne (dashboard, admin)
- SEO non pertinent
- Déploiement sur CDN/statique uniquement
- Intégrations lourdes avec libs client-only

**Choisis Hybride si :**

- Landing publique + dashboard privé
- Certaines pages SEO, d'autres non
- C'est le meilleur des deux mondes