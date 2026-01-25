# Fondamentaux

## Résumé des fichiers de config essentiels (nuxt.config.ts + .env)

```tsx
// nuxt.config.ts - Configuration minimale recommandée
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },

  runtimeConfig: {
    // Variables serveur (process.env.BACKEND_URL)
    backendUrl: '',
    apiKey: '',
    public: {
      // Variables client (exposées au navigateur)
      appName: 'Mon App'
    }
  },

  routeRules: {
    // Personnalisation par route
  }
})
```

```
// .env (jamais commité)
NUXT_BACKEND_URL=https://api.monbackend.net
NUXT_API_KEY=secret123
NUXT_PUBLIC_APP_NAME=Mon App
```

**Convention :** Préfixe `NUXT_` + chemin en SCREAMING_SNAKE_CASE. `runtimeConfig.backendUrl` → `NUXT_BACKEND_URL`


## Structure d’un composant Vue

```tsx
<template>
  <!-- HTML reactif -->
</template>

<script setup lang="ts">
// Logique TypeScript
// "setup" = Composition API (moderne)
// "lang=ts" = TypeScript
</script>

<style scoped>
/* CSS scope au composant */
/* "scoped" = les styles ne s'appliquent qu'a ce composant */
</style>
```

## **`ref` vs `shallowRef`**

```tsx
const tableRef = ref<HTMLElement | null>(null)        // Reactive profond
const tabulatorInstance = shallowRef<Tabulator | null>(null)  // Reactive superficiel
```

- `ref` : rend l'objet et toutes ses proprietes reactives
- `shallowRef` : seule la reference elle-meme est reactive, pas le contenu
- Utilise `shallowRef` pour les objets complexes externes (comme Tabulator)

## `defineProps` et `defineEmits`

```tsx
const props = defineProps<Props>()
const emit = defineEmits<Emits>()
```

- C'est la facon Vue 3 + TypeScript de declarer les entrees/sorties du composant
- Le typage est automatique grace aux interfaces

### withDefaults

```tsx
const props = withDefaults(defineProps<Props>(), {
  showSelectionCheckbox: false,
  title: undefined,
})
```

En TypeScript, `defineProps<Props>()` ne permet pas de definir des valeurs par defaut directement. `withDefaults` resout ce probleme en permettant de specifier les defaults dans un objet separe.

## `watch`

```tsx
watch(
  () => props.data,      // Ce qu'on surveille
  (newData) => { ... },  // Ce qu'on fait quand ca change
  { deep: true }         // Options
)
```

- Permet de reagir aux changements de valeurs reactives
- `deep: true` surveille aussi les changements dans les objets/tableaux



## Lifecycle hooks

```tsx
onMounted(() => { ... })      // Composant monte dans le DOM
onBeforeUnmount(() => { ... }) // Juste avant destruction
```

## `defineExpose`

```tsx
defineExpose({
  getSelectedData: () => { ... }
})
```

- Par defaut, un composant `<script setup>` n'expose rien
- `defineExpose` permet au parent d'appeler des methodes du composant

## `scoped` vs non-scoped

- `<style scoped>` : Vue ajoute un attribut unique aux elements (ex: `data-v-7ba5bd90`) et modifie les selecteurs CSS pour ne cibler que ces elements. Les styles ne peuvent pas "fuir" vers d'autres composants.
- `<style>` (sans scoped) : CSS global classique. Necessaire quand tu dois cibler des elements generes par une librairie externe (Tabulator, Chart.js, etc.) car ces elements n'ont pas l'attribut scope de Vue.

## `key`

```tsx
<ExecutionOverviewGrid
  :key="`grid-${showCheckboxes}`"
  ...
/>
```

En Vue, l'attribut `key` sert a identifier de maniere unique un element ou composant. Quand la `key` change, Vue considere que c'est un element different et :

1. Detruit l'ancien composant (appelle `onBeforeUnmount`)
2. Cree un nouveau composant (appelle `onMounted`)