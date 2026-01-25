# Nuxt UI v3 + TailwindCSS v4

### Installation

```bash
npx nuxi module add ui
```

C'est tout. Nuxt UI v3 inclut Tailwind CSS v4, les icônes, et les fonts automatiquement.

### Ce qui est installé automatiquement

- **Tailwind CSS v4** : nouvelle syntaxe CSS-first
- **@nuxt/icon** : accès à 200k+ icônes via `<UIcon name="i-heroicons-home" />`
- **@nuxt/fonts** : optimisation auto des fonts Google

### Configuration (`nuxt.config.ts`)

```tsx
export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  ui: {
    // Optionnel : désactiver certaines features
    fonts: true,       // Gestion des fonts
    colorMode: true,   // Dark/light mode
  },

  // Couleur principale de l'app
  colorMode: {
    preference: 'system'  // 'light', 'dark', ou 'system'
  }
})
```

### Configuration Tailwind v4 (`app/assets/css/main.css`)

Tailwind v4 utilise une approche CSS-first :

```css
@import "tailwindcss";
@import "@nuxt/ui";

/*
  Nuxt UI crée ce fichier automatiquement.
  Tu peux le personnaliser ici.
*/

@theme {
  /* Personnalisation des couleurs */
  --color-primary-50: #faf5ff;
  --color-primary-500: #8b5cf6;
  --color-primary-900: #4c1d95;

  /* Personnalisation des fonts */
  --font-sans: 'Inter', sans-serif;
}
```

### Changer la couleur principale

```tsx
// app.config.ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'violet',    // Couleur Tailwind
      neutral: 'slate'      // Couleur neutre (gris)
    }
  }
})
```

**Couleurs disponibles :** `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`

### Composants essentiels

**Boutons :**

```tsx
<UButton>Default</UButton>
<UButton color="neutral" variant="outline">Outline</UButton>
<UButton icon="i-heroicons-plus" />
<UButton loading>Chargement...</UButton>
```

**Formulaires :**

```tsx
<UFormField label="Email" name="email" required>
  <UInput v-model="email" placeholder="email@exemple.com" />
</UUFormField>

<UFormField label="Rôle" name="role">
  <USelect v-model="role" :items="['Admin', 'User', 'Guest']" />
</UFormField>

<UFormField label="Bio" name="bio">
  <UTextarea v-model="bio" />
</UFormField>
```

**Feedback :**

```tsx
<UAlert title="Attention" description="Message important" color="warning" />
<UBadge>Nouveau</UBadge>
<UBadge color="red" variant="subtle">Erreur</UBadge>
```

**Navigation :**

```tsx
<UTabs :items="[
  { label: 'Profil', icon: 'i-heroicons-user' },
  { label: 'Paramètres', icon: 'i-heroicons-cog' }
]" />

<UDropdownMenu :items="menuItems">
  <UButton>Menu</UButton>
</UDropdownMenu>
```

### Icônes

Nuxt UI utilise `@nuxt/icon` avec Iconify. Syntaxe : `i-{collection}-{name}`

```tsx
<!-- Heroicons (défaut) -->
<UIcon name="i-heroicons-home" />
<UIcon name="i-heroicons-user-circle" class="size-8" />

<!-- Autres collections -->
<UIcon name="i-lucide-settings" />
<UIcon name="i-simple-icons-github" />
<UIcon name="i-mdi-account" />
```

**Rechercher des icônes :** [icones.js.org](https://icones.js.org/)

### Theming avancé

**Personnaliser un composant globalement :**

```tsx
// app.config.ts
export default defineAppConfig({
  ui: {
    button: {
      defaultVariants: {
        size: 'lg',
        color: 'primary'
      },
      slots: {
        base: 'rounded-full'  // Tous les boutons arrondis
      }
    }
  }
})
```

**Personnaliser une instance :**

```tsx
<UButton :ui="{ base: 'rounded-none' }">Carré</UButton>
```

### Dark Mode

```tsx
<script setup>
const colorMode = useColorMode()
</script>

<template>
  <UButton
    :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
    @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
  />
</template>
```

### Bonnes pratiques Nuxt UI

1. **Utilise `app.config.ts`** pour la personnalisation globale, pas le CSS
2. **Préfère les variantes** (`color`, `variant`, `size`) au CSS custom
3. **Utilise les slots** pour la composition complexe
4. **Reste cohérent** : choisis 1-2 couleurs principales max
5. **Consulte la doc** : [ui.nuxt.com](https://ui.nuxt.com/) — chaque composant a des exemples