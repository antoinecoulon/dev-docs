# Setup et premiers pas

> Pour développeur Vue/Nuxt sur Linux Pop OS, backend ASP.NET Core

## 1. Setup environnement Linux

### 1.1 Prérequis système

```bash
# Node.js (v18+ recommandé) via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20

# Watchman (surveillance fichiers, recommandé)
sudo apt install watchman

# JDK 17 (requis pour Android)
sudo apt install openjdk-17-jdk
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
```

### 1.2 Android Studio (optionnel: si utilisation des émulateurs)

1. Télécharger depuis [developer.android.com/studio](https://developer.android.com/studio)
2. Extraire et lancer `studio.sh`
3. Installer via SDK Manager :
    - Android SDK Platform 34 (ou dernière stable)
    - Android SDK Build-Tools
    - Android Emulator
    - Android SDK Platform-Tools
4. Variables d'environnement (`~/.bashrc`) :

```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Créer un AVD (Android Virtual Device) via Device Manager

### 1.3 Expo CLI

```bash
npm install -g expo-cli eas-cli
```

Créer un compte sur [expo.dev](https://expo.dev/) pour les builds cloud.

## 2. Expo vs React Native CLI

### Pourquoi Expo pour ton projet

| Critère | Expo | React Native CLI |
| --- | --- | --- |
| Setup initial | 5 min | 30+ min |
| Build iOS sans Mac | Oui (EAS Build) | Non |
| Notifications push | Expo Notifications (simplifié) | Config manuelle FCM/APNs |
| OTA Updates | Intégré | À configurer |
| Accès natif avancé | Limité (mais suffisant pour toi) | Total |

**Verdict :** Expo couvre 100% de tes besoins (prog, plan, cashless, push). Tu n'as pas besoin d'écrire de code natif Swift/Kotlin.

### Expo Go vs Development Build

- **Expo Go** : app de test rapide, limitations sur certains packages
- **Development Build** : ton app compilée avec les dépendances natives, plus flexible

Commence avec Expo Go, passe en Development Build quand tu intègreras les notifications push ou le paiement.

### Initialiser le projet

```bash
npx create-expo-app@latest westill-app --template blank-typescript
cd westill-app
npx expo start
```

Scanner le QR code avec Expo Go sur ton téléphone, ou appuyer sur `a` pour lancer l'émulateur Android.

### Comprendre la structure de base

Voilà ce que vous voyez en tant que fichiers de base après un `create-expo-app` avec le template `blank-typescript` :

```text
westill-app/
├── App.tsx              ← chargé par index.ts (ce que tu vois sur le tel)
├── app.json             ← configuration de l'app (nom, icônes, bundle ID...)
├── index.ts             ← ton point d'entrée
├── package.json         ← tes dépendances et scripts npm
├── tsconfig.json        ← config TypeScript
├── babel.config.js      ← config du bundler Metro
├── node_modules/        ← dépendances installées
└── assets/
    ├── adaptive-icon.png
    ├── favicon.png
    └── icon.png
```

`app.json` — C'est la config de ton app, un peu comme un nuxt.config.ts mais pour le mobile. Elle contient le nom de l'app, le slug, les chemins vers les icônes, l'orientation d'écran, etc. Expo lit ce fichier pour savoir comment packager l'app. Tu n'as pas besoin de le toucher pour l'instant, sauf si tu veux changer le nom.

`package.json` — Classique. À ce stade il ne contient que expo comme dépendance principale. C'est ici que vont s'accumuler tes packages au fil du développement (axios, zustand, react-navigation…). Le script important c'est npm start qui lance Metro, le bundler React Native.

`tsconfig.json` — Config TypeScript, pré-générée par Expo avec des valeurs correctes pour React Native. Tu n'as rien à changer.

`babel.config.js` — Config du bundler Metro (l'équivalent de Vite/Webpack chez vous). Il contient juste `module.exports = { presets: ['babel-preset-expo'] }`. Tu ne le touches qu'en cas de besoin spécifique (alias de chemins par exemple).

`assets/` — Tes icônes d'app pour le moment. Les trois fichiers sont utilisés par Expo selon la plateforme : `adaptive-icon.png` pour Android, `icon.png` pour iOS, `favicon.png` pour le web.

## 3. Correspondances Vue → React

### 3.1 Syntaxe de base

| Concept | Vue (SFC) | React Native |
| --- | --- | --- |
| Template | `<template>` | JSX dans `return()` |
| Logique | `<script setup>` | Corps de la fonction |
| Styles | `<style scoped>` | `StyleSheet.create()` |
| Binding texte | `{{ variable }}` | `{variable}` |
| Binding attribut | `:prop="val"` | `prop={val}` |
| Événement | `@click="handler"` | `onPress={handler}` |
| Condition | `v-if` | `{condition && <Comp />}` |
| Boucle | `v-for` | `{array.map(item => <Comp key={item.id} />)}` |

### 3.2 Réactivité

```tsx
// Vue 3
const count = ref(0)
const increment = () => count.value++

// React
const [count, setCount] = useState(0)
const increment = () => setCount(prev => prev + 1)
```

**Différence clé :** React impose l'immutabilité. Tu ne modifies jamais `count` directement, tu appelles `setCount` avec la nouvelle valeur.

### 3.3 Computed / Derived state

```tsx
// Vue
const double = computed(() => count.value * 2)

// React
const double = useMemo(() => count * 2, [count])
```

### 3.4 Watch / Effects

```tsx
// Vue
watch(count, (newVal) => {
  console.log('count changed:', newVal)
})

// React
useEffect(() => {
  console.log('count changed:', count)
}, [count])
```

### 3.5 Props

```tsx
// Vue
defineProps<{ title: string }>()

// React
type Props = { title: string }
function MyComponent({ title }: Props) {
  return <Text>{title}</Text>
}
```

### 3.6 Exemple comparatif complet

**Vue :**

```vue
<template>
  <View>
    <Text>{{ count }}</Text>
    <Button @click="increment">+1</Button>
  </View>
</template>

<script setup lang="ts">
const count = ref(0)
const increment = () => count.value++
</script>
```

**React Native :**

```tsx
import { View, Text, Button } from 'react-native'
import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <View>
      <Text>{count}</Text>
      <Button title="+1" onPress={() => setCount(c => c + 1)} />
    </View>
  )
}
```

## 4. Architecture recommandée

### 4.1 Structure de dossiers

```text
westill-app/
├── app/                    # Routes (Expo Router = file-based routing comme Nuxt)
│   ├── (tabs)/             # Layout avec navigation par onglets
│   │   ├── index.tsx       # Accueil / Programmation
│   │   ├── map.tsx         # Plan du festival
│   │   ├── infos.tsx       # Infos pratiques
│   │   └── wallet.tsx      # Cashless
│   ├── artist/[id].tsx     # Page artiste dynamique
│   └── _layout.tsx         # Layout racine
├── components/             # Composants réutilisables
│   ├── ui/                 # Boutons, cards, inputs...
│   └── features/           # Composants métier (ArtistCard, StageSchedule...)
├── hooks/                  # Custom hooks
│   ├── useApi.ts           # Fetch wrapper
│   └── useAuth.ts          # Authentification
├── services/               # Logique métier, appels API
│   ├── api.ts              # Client HTTP (axios/fetch)
│   └── notifications.ts    # Push notifications
├── stores/                 # State management (Zustand recommandé)
│   └── useScheduleStore.ts
├── types/                  # Types TypeScript
│   └── index.ts
├── constants/              # Couleurs, config, URLs
│   └── theme.ts
└── assets/                 # Images, fonts
```

### 4.2 Stack technique recommandée

| Besoin | Solution | Pourquoi |
| --- | --- | --- |
| Navigation | Expo Router | File-based comme Nuxt, intuitif pour toi |
| State global | Zustand | Simple, léger, pas de boilerplate (alternative à Pinia) |
| Requêtes API | TanStack Query | Cache, retry, loading states (comme VueQuery) |
| HTTP Client | Axios ou fetch natif | Tu connais déjà |
| Formulaires | React Hook Form | Performant, validations |
| UI Kit | Tamagui ou Nativewind | Styling moderne, proche Tailwind |
| Notifications | Expo Notifications | Abstraction FCM/APNs |
| Storage local | expo-secure-store | Tokens, données sensibles |
| Offline | TanStack Query + MMKV | Cache persistant |

### 4.3 Communication avec ASP.NET Core

```tsx
// services/api.ts
import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: __DEV__
    ? 'http://10.0.2.2:5000/api'  // Android emulator → localhost
    : 'https://api.westill.fr/api',
})

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
```

> Note : 10.0.2.2 est l'alias pour localhost depuis l'émulateur Android.

## 5. Pièges courants à éviter

### Performance

- **FlatList vs ScrollView** : Toujours `FlatList` pour les listes longues (virtualisation)
- **Re-renders** : Utilise `React.memo`, `useCallback` quand nécessaire
- **Images** : Utilise `expo-image` (plus performant que `Image` natif)

### Développement

- **Hot reload cassé** : Redémarre Metro (`npx expo start -c` pour clear cache)
- **Dépendances natives** : Vérifie la compatibilité Expo sur [React Native Directory](https://reactnative.directory/)
- **iOS sans Mac** : Toujours tester via TestFlight avant release

### Architecture

- **Ne pas sur-architecturer** : Commence simple, refacto quand ça devient nécessaire
- **Types TypeScript** : Définis-les tôt, ça t'évitera des bugs runtime

## 6. Checklist avant de coder

- [x]  Node 20+ installé
- [x]  Android Studio + émulateur fonctionnel
- [x]  Compte Expo créé
- [x]  Projet initialisé et lancé sur émulateur
- [x]  Extension VS Code : "ES7+ React/Redux/React-Native snippets"
- [ ]  Lire la section Expo Router de la doc officielle
