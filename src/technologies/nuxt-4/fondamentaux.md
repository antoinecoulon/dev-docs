# Fondamentaux

## Résumé des fichiers de config essentiels (nuxt.config.ts + .env)

### `nuxt.config.ts`
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

---

```ts
typescript: {
  typeCheck: true,
  strict: true,
  includeWorkspace: true
},
```

1. strict: true (Le Maître d'école)
C'est l'option la plus importante pour la qualité du code. Elle active un ensemble de règles de sécurité dans TypeScript (comme noImplicitAny, strictNullChecks, etc.).

Ce que ça fait : Ça force TypeScript à être intransigeant. Tu ne peux pas laisser de variables sans type défini, et tu dois gérer les cas où une valeur pourrait être null ou undefined.

L'intérêt : Éviter 90% des bugs stupides en production (le fameux Cannot read property 'x' of undefined).

2. includeWorkspace: true (La Vue d'ensemble)
Cette option est cruciale si tu travailles dans un monorepo ou avec des Nuxt Layers.

Ce que ça fait : Ça demande à Nuxt d'inclure les autres dossiers de ton espace de travail (en dehors du dossier app actuel) dans l'analyse TypeScript.

L'intérêt : Si ton dashboard utilise des composants ou des utilitaires situés dans un autre dossier du projet, TypeScript pourra les "voir" et vérifier que tu les utilises correctement.

3. typeCheck: true (Le Garde-frontière)
C'est ici que ton erreur ENOTEMPTY prenait racine.

Ce que ça fait : Au moment où tu lances npm run dev ou npm run build, Nuxt lance un processus séparé (souvent vue-tsc) qui scanne tout ton projet pour trouver des erreurs de type.

L'intérêt : Ça t'empêche de lancer ou de déployer une application qui contient des erreurs TypeScript, même si le code "semble" fonctionner visuellement.

### `.env`

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