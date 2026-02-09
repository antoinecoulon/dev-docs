# Structure et Architecture Détaillée

## `app/pages/`

Routing automatique basé sur les fichiers.

```text
pages/
├── index.vue           # /
├── about.vue           # /about
├── users/
│   ├── index.vue       # /users
│   └── [id].vue        # /users/:id (dynamique)
└── [...slug].vue       # Catch-all (404 custom)
```

**Config associée :**

```tsx
// nuxt.config.ts - optionnel
routeRules: {
  '/admin/**': { ssr: false },    // SPA pour l'admin
  '/api/**': { cors: true }       // CORS sur l'API
}
```

## `app/components/`

Auto-importés, pas besoin d'import manuel.

```text
components/
├── AppHeader.vue           # <AppHeader />
├── AppFooter.vue           # <AppFooter />
└── dashboard/
    ├── Sidebar.vue         # <DashboardSidebar />
    └── Stats.vue           # <DashboardStats />
```

**Conseil :** Préfixe par dossier pour éviter les collisions. `dashboard/Sidebar.vue` devient `<DashboardSidebar />`.

## `app/composables/`

Logique réutilisable, auto-importée.

```tsx
// composables/useAuth.ts
export function useAuth() {
  const user = useState<User | null>('user', () => null)

  async function login(credentials: Credentials) {
    user.value = await $fetch('/api/auth/login', {
      method: 'POST',
      body: credentials
    })
  }

  function logout() {
    user.value = null
    navigateTo('/login')
  }

  return { user, login, logout }
}
```

**Règle :** Le nom du fichier doit commencer par `use` pour l'auto-import.

## `app/layouts/`

Structure commune pour plusieurs pages.

```tsx
<!-- layouts/default.vue -->
<template>
  <div>
    <AppHeader />
    <main>
      <slot />  <!-- Contenu de la page -->
    </main>
    <AppFooter />
  </div>
</template>
```

```tsx
<!-- layouts/dashboard.vue -->
<template>
  <div class="flex">
    <DashboardSidebar />
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
```

**Utilisation dans une page :**

```tsx
<script setup>
definePageMeta({
  layout: 'dashboard'
})
</script>
```

## `app/middleware/`

Guards de navigation (auth, permissions...).

```tsx
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()

  if (!user.value) {
    return navigateTo('/login')
  }
})
```

**Application :**

```tsx
<script setup>
definePageMeta({
  middleware: 'auth'
  // ou middleware: ['auth', 'admin'] pour plusieurs
})
</script>
```

**Middleware global :** Suffixe `.global.ts`

```tsx
middleware/
└── auth.global.ts   # S'exécute sur TOUTES les routes
```

## `app/plugins/`

Code exécuté à l'initialisation.

```tsx
// plugins/api.ts
export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    baseURL: '/api',
    onResponseError({ response }) {
      if (response.status === 401) {
        navigateTo('/login')
      }
    }
  })

  return { provide: { api } }
})
```

**Utilisation :** `const { $api } = useNuxtApp()`

**Plugins client/serveur only :**

```text
plugins/
├── analytics.client.ts   # Côté client uniquement
└── database.server.ts    # Côté serveur uniquement
```

## `app/utils/`

Fonctions utilitaires pures, auto-importées.

```tsx
// utils/format.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR').format(date)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}
```

**Différence avec composables :** Les utils sont des fonctions pures sans état réactif ni hooks Vue.
