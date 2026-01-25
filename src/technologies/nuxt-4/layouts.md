# Layouts (+ Dashboard)

### Concept des Layouts

Un layout wrap plusieurs pages avec une structure commune. Parfait pour :

- Header/footer constants
- Sidebar de navigation
- Structure dashboard

### Layout par défaut

```tsx
<!-- app/layouts/default.vue -->
<template>
  <div class="min-h-screen">
    <header class="border-b p-4">
      <nav>Navigation publique</nav>
    </header>

    <main class="p-4">
      <slot />
    </main>

    <footer class="border-t p-4">
      Footer
    </footer>
  </div>
</template>
```

Appliqué automatiquement si aucun layout n'est spécifié.

### Layout Dashboard

```tsx
<!-- app/layouts/dashboard.vue -->
<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 border-r bg-gray-50 dark:bg-gray-900">
      <div class="p-4">
        <h1 class="text-xl font-bold">Mon App</h1>
      </div>
      <DashboardNavigation />
    </aside>

    <!-- Contenu principal -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header dashboard -->
      <header class="border-b p-4 flex justify-between items-center">
        <slot name="header">
          <h2 class="text-lg font-semibold">Dashboard</h2>
        </slot>
        <DashboardUserMenu />
      </header>

      <!-- Page content -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
```

### Appliquer un layout à une page

```tsx
<!-- app/pages/dashboard/index.vue -->
<script setup>
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div>
    <h1>Tableau de bord</h1>
    <!-- Contenu injecté dans <slot /> du layout -->
  </div>
</template>
```

### Slots nommés dans les layouts

```tsx
<!-- Page utilisant le slot header -->
<script setup>
definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <template #header>
    <div class="flex items-center gap-4">
      <h2>Utilisateurs</h2>
      <UBadge>{{ users.length }}</UBadge>
    </div>
  </template>

  <!-- Contenu principal (slot par défaut) -->
  <UsersList :users="users" />
</template>
```

### Composants Dashboard avec Nuxt UI

**Navigation sidebar :**

```tsx
<!-- app/components/dashboard/Navigation.vue -->
<script setup>
const route = useRoute()

const navigation = [
  { label: 'Dashboard', icon: 'i-heroicons-home', to: '/dashboard' },
  { label: 'Utilisateurs', icon: 'i-heroicons-users', to: '/dashboard/users' },
  { label: 'Paramètres', icon: 'i-heroicons-cog', to: '/dashboard/settings' }
]
</script>

<template>
  <nav class="p-2 space-y-1">
    <NuxtLink
      v-for="item in navigation"
      :key="item.to"
      :to="item.to"
      class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
      :class="route.path === item.to
        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
        : 'hover:bg-gray-100 dark:hover:bg-gray-800'"
    >
      <UIcon :name="item.icon" class="size-5" />
      <span>{{ item.label }}</span>
    </NuxtLink>
  </nav>
</template>
```

**Menu utilisateur :**

```tsx
<!-- app/components/dashboard/UserMenu.vue -->
<script setup>
const { user, logout } = useAuth()

const items = [
  { label: 'Profil', icon: 'i-heroicons-user', to: '/dashboard/profile' },
  { label: 'Paramètres', icon: 'i-heroicons-cog', to: '/dashboard/settings' },
  { type: 'separator' },
  { label: 'Déconnexion', icon: 'i-heroicons-arrow-right-on-rectangle', click: logout }
]
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton color="neutral" variant="ghost">
      <UAvatar :alt="user?.name" size="sm" />
      <span>{{ user?.name }}</span>
      <UIcon name="i-heroicons-chevron-down" />
    </UButton>
  </UDropdownMenu>
</template>
```

**Card de statistiques :**

```tsx
<!-- app/components/dashboard/StatCard.vue -->
<script setup>
defineProps<{
  title: string
  value: string | number
  icon: string
  trend?: { value: number; positive: boolean }
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ title }}</p>
        <p class="text-2xl font-bold mt-1">{{ value }}</p>
        <p v-if="trend" class="text-sm mt-2" :class="trend.positive ? 'text-green-600' : 'text-red-600'">
          {{ trend.positive ? '+' : '' }}{{ trend.value }}%
        </p>
      </div>
      <div class="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
        <UIcon :name="icon" class="size-6 text-primary-600 dark:text-primary-400" />
      </div>
    </div>
  </div>
</template>
```

**Utilisation :**

```tsx
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <DashboardStatCard
    title="Utilisateurs"
    :value="1234"
    icon="i-heroicons-users"
    :trend="{ value: 12, positive: true }"
  />
  <DashboardStatCard
    title="Revenus"
    :value="'45 678 €'"
    icon="i-heroicons-currency-euro"
  />
  <DashboardStatCard
    title="Commandes"
    :value="89"
    icon="i-heroicons-shopping-cart"
    :trend="{ value: 3, positive: false }"
  />
</div>
```

### Layout dynamique

Changer de layout selon une condition :

```tsx
<script setup>
const { user } = useAuth()

// Layout dynamique basé sur l'auth
definePageMeta({
  layout: false  // Désactive le layout auto
})
</script>

<template>
  <NuxtLayout :name="user ? 'dashboard' : 'default'">
    <NuxtPage />
  </NuxtLayout>
</template>
```

### Transitions entre layouts

```tsx
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
})
```

```css
/* app/assets/css/main.css */
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.2s ease;
}

.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
```

### Bonnes pratiques Layouts

1. **Un layout = une structure**, pas de logique métier
2. **Utilise les slots nommés** pour les zones variables (header, actions)
3. **Garde les layouts légers** — délègue aux composants
4. **Limite à 2-3 layouts** : `default`, `dashboard`, `auth` suffisent généralement
5. **Responsive first** : teste sur mobile dès le début

### Structure recommandée pour un dashboard

```
app/
├── layouts/
│   ├── default.vue        # Pages publiques
│   ├── dashboard.vue      # Pages admin
│   └── auth.vue           # Login/register
├── components/
│   └── dashboard/
│       ├── Navigation.vue
│       ├── UserMenu.vue
│       ├── StatCard.vue
│       ├── Sidebar.vue
│       └── Header.vue
├── pages/
│   ├── index.vue          # Landing (layout default)
│   ├── login.vue          # (layout auth)
│   └── dashboard/
│       ├── index.vue      # (layout dashboard)
│       ├── users/
│       │   ├── index.vue
│       │   └── [id].vue
│       └── settings.vue
└── composables/
    └── useAuth.ts
```