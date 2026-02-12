# React Native - Fondamentaux

## Dans cette page

- **Composants & Layout** : View, Text, Image, StyleSheet, flexbox
- **Listes & Interaction** : FlatList, TouchableOpacity
- **État & Hooks** : useState, useMemo, immutabilité
- **Navigation** : Expo Router, routes dynamiques, useRouter

## Composants de base & Layout

### View & Text - Les fondations

`View` est ton conteneur, équivalent de `<div>`. `Text` affiche du texte. **Règle critique** : tout texte doit être dans un `Text`, jamais directement dans un `View`.

```tsx
import { View, Text, StyleSheet } from 'react-native'

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Westill 2026</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
})
```

Points clés :

- `StyleSheet.create()` optimise les styles (validation, performance)
- Pas de className, pas de CSS : tout en objets JavaScript
- Valeurs numériques = pixels (pas besoin de `'px'`)
- Pourcentages = strings : `width: '50%'`

> Les feuilles de styles peuvent aussi être mises dans un fichier indépendant et être exporté / importé.

#### Flexbox - Différences critiques avec le web

React Native utilise flexbox par défaut mais avec des différences :

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,                  // Prend tout l'espace disponible
    flexDirection: 'column',  // DÉFAUT (vs 'row' sur le web)
    justifyContent: 'center', // Axe principal (vertical si column)
    alignItems: 'center',     // Axe secondaire (horizontal si column)
  },
  card: {
    width: 300,               // Largeur EXPLICITE requise (pas de 100% par défaut)
    padding: 16,
    gap: 8,                   // Espacement entre enfants (moderne, propre)
  }
})
```

Pièges à éviter :

- `View` n'a pas de largeur 100% par défaut (contrairement aux divs)
- `alignItems`: `'stretch'` est le défaut, mais nécessite une largeur parente définie
- Oublie `display: block/inline`, tout est `flex`

#### Image - Deux modes

```tsx
import { Image } from 'react-native'

// Locale (dans assets/)
<Image 
  source={require('../assets/artist.jpg')} 
  style={{ width: 200, height: 200 }}
/>

// URL distante
<Image 
  source={{ uri: 'https://example.com/image.jpg' }}
  style={{ width: 200, height: 200 }}
/>
```

Attention : `Image` nécessite toujours `width` et `height` explicites. Pas de dimensionnement automatique.

#### StyleSheet - Organisation

Trois patterns courants :

```tsx
// 1. Inline (à éviter sauf cas très simple)
<View style={{ padding: 20 }} />

// 2. StyleSheet en bas du fichier (recommandé)
const styles = StyleSheet.create({ ... })

// 3. Composition
<View style={[styles.card, styles.shadow, isActive && styles.active]} />
```

La composition avec array permet de combiner/conditionner les styles.

## Exercice pratique - ArtistCard

Crée un composant `ArtistCard.tsx` dans `components/features/` qui affiche :

```text
┌─────────────────────────────┐
│  [Image]  Artist Name       │
│  [Image]  20:30 - Main Stage│
└─────────────────────────────┘
```

Structure attendue :

- Container principal (flex row)
- Image à gauche (100x100)
- Bloc texte à droite (flex column)
- Styles : fond sombre, bords arrondis, ombre

Ce que tu dois observer :

- Comment flex row/column affecte la disposition
- L'impact de flex: 1 sur le bloc texte
- La différence entre padding (intérieur) et margin (extérieur)

Bonus : Utilise-le dans App.tsx pour afficher 3 artistes différents avec des props :

```tsx
<ArtistCard 
  name="Electric Wizard" 
  time="20:30" 
  stage="Main Stage"
  imageUrl="..."
/>
```

Ressources ciblées

- [React Native Layout Props](https://reactnative.dev/docs/layout-props) - Référence flexbox complète
- [React Native Styling Cheat Sheet](https://github.com/vhpoet/react-native-styling-cheat-sheet) - Comparaison web vs RN
- [Guide "Premiers pas" section 3.1](./setup-first-steps) - Correspondances Vue → React (relis-le après avoir codé)

## Listes et intéractions

### FlatList - Virtualisation native

FlatList ne rend que les éléments visibles à l'écran. Critique pour les performances avec 50+ artistes.

```tsx
import { FlatList } from 'react-native'

const DATA = [
  { id: '1', name: 'Sleep', time: '20:30', stage: 'Main Stage' },
  { id: '2', name: 'Electric Wizard', time: '22:00', stage: 'Stage 2' },
  // ... 8 autres
]

<FlatList
  data={DATA}
  renderItem={({ item }) => (
    <ArtistCard 
      name={item.name}
      dateTime={item.time}
      stage={item.stage}
      imageUrl="https://picsum.photos/200"
    />
  )}
  keyExtractor={(item) => item.id}
  contentContainerStyle={{ gap: 16, padding: 20 }}
/>
```

Props essentielles :

- `data` : tableau d'objets
- `renderItem` : fonction qui retourne un composant pour chaque item
- `keyExtractor` : fonction qui retourne l'identifiant unique (comme `:key` dans Vue)
- `contentContainerStyle` : styles du contenu scrollable (pas du container)

Différence avec `ScrollView` :

`ScrollView` rend TOUS les enfants immédiatement (mauvais pour >20 items)

`FlatList` virtualise (ne rend que ce qui est visible + buffer)

Props bonus utiles :

```tsx
<FlatList
  data={DATA}
  renderItem={...}
  ItemSeparatorComponent={() => <View style={{ height: 16 }} />}  // Espace entre items
  ListEmptyComponent={<Text>Aucun artiste</Text>}  // Si data vide
  refreshing={isLoading}  // Pull-to-refresh
  onRefresh={() => refetch()}
/>
```

### TouchableOpacity vs Pressable

Les deux gèrent les événements tactiles, `Pressable` est plus moderne et flexible.

```tsx
import { TouchableOpacity, Pressable, Alert } from 'react-native'

// TouchableOpacity - Simple, feedback visuel automatique
<TouchableOpacity 
  onPress={() => Alert.alert('Artiste', 'Sleep selected')}
  activeOpacity={0.7}  // Opacité au touch (défaut 0.2)
>
  <ArtistCard {...props} />
</TouchableOpacity>

// Pressable - Plus de contrôle
<Pressable
  onPress={() => Alert.alert('Artiste', 'Sleep selected')}
  style={({ pressed }) => [
    styles.card,
    pressed && styles.cardPressed  // Style conditionnel
  ]}
>
  <ArtistCard {...props} />
</Pressable>
```

Quand utiliser quoi :

- `TouchableOpacity` : Simple, effet fade suffit (ton cas)
- `Pressable` : Besoin de styles custom selon l'état (pressed, hovered sur web)
- `TouchableHighlight` : Overlay coloré (rare, UX agressive)

`onPress` vs `onClick` : `onPress` en React Native !

### Alert - Feedback simple

```tsx
import { Alert } from 'react-native'

// Simple
Alert.alert('Titre', 'Message')

// Avec boutons
Alert.alert(
  'Ajouter aux favoris ?',
  'Sleep sera ajouté à votre liste',
  [
    { text: 'Annuler', style: 'cancel' },
    { text: 'OK', onPress: () => addToFavorites() }
  ]
)
```

Limitation : Alert natif, design système (pas customisable). Pour du custom, utilise une modale.

## Exercice pratique - Liste cliquable

Modifie `App.tsx` pour :

- Créer un tableau de 10 artistes mockés en haut du fichier :

```tsx
const MOCK_ARTISTS = [
  { id: '1', name: 'Sleep', time: '20:30', stage: 'Main Stage', imageUrl: 'https://picsum.photos/200' },
  // ... 9 autres
]
```

- Remplacer tes `ArtistCard` individuels par une `FlatList`

- Rendre chaque card cliquable :
  - Wrapper `ArtistCard` dans un `TouchableOpacity`
  - Au clic, afficher `Alert.alert()` avec le nom de l'artiste

Structure attendue :

```tsx
<FlatList
  data={MOCK_ARTISTS}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={...}>
      <ArtistCard {...item} />
    </TouchableOpacity>
  )}
  keyExtractor={...}
/>
```

Ce que tu dois observer :

- Le scroll est fluide même avec 10+ items
- L'effet visuel au touch (opacity)
- Le gap entre les cards (via contentContainerStyle ou ItemSeparatorComponent)

### Type safety bonus

Définis un type pour tes artistes :

```tsx
// types/index.ts
export type Artist = {
  id: string
  name: string
  time: string
  stage: string
  imageUrl: string
}

// App.tsx
const MOCK_ARTISTS: Artist[] = [...]

// ArtistCard.tsx
type Props = Artist  // Réutilise le type
```

Ça évite la duplication et assure la cohérence.

## SafeAreaView

Le composant SafeAreaView permet de gérer le remplissage de l'écran sans cacher les barres de notifications et de navigation du téléphone.

```bash
npx expo install react-native-safe-area-context
```

Exemple :

```tsx
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* ... header ... */}

        <FlatList
          ...
        />

        {/* ... footer ... */}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
```

## État & Hooks

### useState - Gérer la réactivité

En React, l'état ne se modifie jamais directement. Tu passes toujours par un setter.

```tsx
import { useState } from 'react'

// Déclaration
const [favorites, setFavorites] = useState<string[]>([])
//     ↑ valeur     ↑ fonction      ↑ valeur initiale
```

Différence critique avec Vue :

```tsx
// Vue
const favorites = ref<string[]>([])
favorites.value.push('1')  // Mutation directe

// React
const [favorites, setFavorites] = useState<string[]>([])
// favorites.push('1')  // ❌ NE MARCHE PAS, pas de re-render
setFavorites([...favorites, '1'])  // ✅ Crée un nouveau tableau
```

Pourquoi l'immutabilité :

- React compare les références, pas le contenu
- Si tu mutes favorites.push(), la référence reste identique → pas de re-render
- Créer un nouveau tableau change la référence → re-render déclenché

Opérations courantes sur les tableaux

```tsx
// Ajouter
setFavorites([...favorites, newId])

// Retirer
setFavorites(favorites.filter(id => id !== idToRemove))

// Toggle (ajouter si absent, retirer si présent)
setFavorites(prev => 
  prev.includes(id) 
    ? prev.filter(f => f !== id)  // Retirer
    : [...prev, id]                // Ajouter
)
```

Pattern `prev =>` recommandé : Quand le nouvel état dépend de l'ancien, utilise la fonction callback. Ça évite les bugs avec les closures.

```tsx
// ❌ Risqué si plusieurs updates rapides
setCount(count + 1)

// ✅ Toujours correct
setCount(prev => prev + 1)
```

### useMemo - Calculs dérivés

Équivalent de computed en Vue. Recalcule uniquement si les dépendances changent.

```tsx
import { useMemo } from 'react'

const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
const [favorites, setFavorites] = useState<string[]>([])

// Filtrage coûteux
const displayedArtists = useMemo(() => {
  if (!showOnlyFavorites) return MOCK_ARTIST
  return MOCK_ARTIST.filter(artist => favorites.includes(artist.id))
}, [showOnlyFavorites, favorites])  // Recalcule si l'un change
```

Quand l'utiliser :

- Calculs lourds (filtrage, tri, transformations)
- Objets/tableaux passés en props (évite re-renders inutiles)

Quand ne PAS l'utiliser :

- Calculs triviaux (addition, accès direct)
- Pas de dépendances ou trop complexes

*Piège* : Oublier une dépendance → valeur stale. ESLint t'avertit normalement.

### Combinaison useState + useMemo

Pattern typique pour filtres :

```tsx
const [favorites, setFavorites] = useState<string[]>([])
const [filter, setFilter] = useState<'all' | 'favorites'>('all')

const displayedArtists = useMemo(() => {
  if (filter === 'all') return MOCK_ARTIST
  return MOCK_ARTIST.filter(a => favorites.includes(a.id))
}, [filter, favorites])

// Dans le JSX
<FlatList data={displayedArtists} ... />
```

### Exercice pratique - Système de favoris

**Modifie ton app pour :**

État dans `App.tsx`

```tsx
const [favorites, setFavorites] = useState<string[]>([])
const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
```

Fonction toggle

```tsx
const toggleFavorite = (id: string) => {
  setFavorites(prev =>
    prev.includes(id)
      ? prev.filter(f => f !== id)
      : [...prev, id]
  )
}
```

Liste filtrée :

```tsx
const displayedArtists = useMemo(() => {
  if (!showOnlyFavorites) return MOCK_ARTIST
  return MOCK_ARTIST.filter(artist => favorites.includes(artist.id))
}, [showOnlyFavorites, favorites])
```

Passer les props à ArtistCard

```tsx
type Props = Artist & {
  isFavorite: boolean
  onToggleFavorite: () => void
}
```

Ajoute un bouton cœur (utilise un Text avec emoji ou TouchableOpacity)

```tsx
<TouchableOpacity onPress={onToggleFavorite}>
  <Text style={styles.heartIcon}>
    {isFavorite ? '❤️' : '🤍'}
  </Text>
</TouchableOpacity>
```

Bouton de filtre dans le header

```tsx
<TouchableOpacity onPress={() => setShowOnlyFavorites(prev => !prev)}>
  <Text>
    {showOnlyFavorites ? 'Tous les artistes' : 'Mes favoris'}
  </Text>
</TouchableOpacity>
```

### Ce que tu dois observer

- **Réactivité** : Le cœur change instantanément au clic
- **Filtrage** : La liste se met à jour quand tu toggles le filtre
- **Performance** : useMemo évite de refiltrer si favorites n'a pas changé
- **Immutabilité** : Modifier favorites directement casserait tout

### Points de vigilance

Passer des fonctions aux enfants

```tsx
// ❌ Crée une nouvelle fonction à chaque render
<ArtistCard onToggleFavorite={() => toggleFavorite(item.id)} />

// ✅ Mieux (si beaucoup d'items, sinon ok)
const handleToggle = useCallback(
  () => toggleFavorite(item.id),
  [item.id]
)
<ArtistCard onToggleFavorite={handleToggle} />
```

`useCallback` n'est utile que pour des listes >100 items ou composants lourds.

## Navigation (Expo Router)

### File-based routing

Installer les dépendances

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Package | Utilisé | Quand |
------- | ----------------- | ----- |
expo-router | Oui | Navigation file-based(Stack, Tabs, useRouter) |
react-native-safe-area-context | Oui | Éviter encoches/barres système (SafeAreaView) |
react-native-screens | Non (auto) | Écrans natifs optimisés |
expo-linking | Oui | Notifications push, liens externes |
expo-constants | Peut-être | Afficher version app, debug |
expo-status-bar | Oui | Déjà fait, contrôle statut bar |

Expo Router cherche les routes dans `app/`, il faut donc adapter la structure de notre application.

```text
westill-app/
├── app/
│   ├── _layout.tsx      # Layout racine
│   └── index.tsx        # Page d'accueil (ton ancienne App.tsx)
├── components/
├── constants/
├── types/
└── package.json
```

`App.tsx` est devenu app/index.tsx (-> `export default function Index() {}`).

Il faut aussi modifier la configuration de `app.json` et `package.json` :

```json
{
  "expo": {
    "name": "westill-app",
    "slug": "westill-app",
    "scheme": "westill-app",
    "web": {
      "bundler": "metro",
      "output": "static"
    }
  }
}
```

```json
{
  "main": "expo-router/entry"
}
```

Expo Router utilise la structure de fichiers pour générer les routes automatiquement.

```text
app/
├── index.tsx           → /
├── about.tsx           → /about
├── artist/
│   └── [id].tsx        → /artist/:id (dynamique)
└── (tabs)/             → Layout avec navigation
    ├── _layout.tsx
    ├── index.tsx       → Tab 1
    └── map.tsx         → Tab 2
```

Concepts clés :

- Fichiers = routes
- [param] = segment dynamique
- (folder) = groupe sans ajouter de segment d'URL
- _layout.tsx = layout partagé

### useRouter & Link - Navigation

Deux façons de naviguer :

```tsx
import { Link, useRouter } from 'expo-router'

// 1. Composant Link (préféré pour les listes)
<Link href="/artist/1">
  <ArtistCard {...artist} />
</Link>

// 2. Hook useRouter (pour navigation programmatique)
const router = useRouter()
router.push('/artist/1')
router.back()
router.replace('/home')  // Remplace dans l'historique
```

Différences :

`push` : Ajoute à la pile (bouton retour disponible)
`replace` : Remplace l'écran actuel (pas de retour)
`back` : Retour arrière

### Routes dynamiques - [id].tsx

Fichier : app/artist/[id].tsx

```tsx
import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function ArtistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  
  // Trouve l'artiste dans MOCK_ARTIST avec cet id
  const artist = MOCK_ARTIST.find(a => a.id === id)
  
  if (!artist) {
    return <Text>Artiste non trouvé</Text>
  }
  
  return (
    <View>
      <Text>{artist.name}</Text>
      <Text>{artist.time} - {artist.stage}</Text>
    </View>
  )
}
```

`useLocalSearchParams` : Récupère les paramètres de l'URL.

### Passer des paramètres

Trois syntaxes :

```tsx
// 1. Simple
<Link href="/artist/1">Voir détail</Link>

// 2. Objet (plus lisible)
<Link href={{ pathname: '/artist/[id]', params: { id: '1' } }}>
  Voir détail
</Link>

// 3. useRouter
router.push({
  pathname: '/artist/[id]',
  params: { id: artist.id }
})
```

Pour plusieurs params :

```tsx
<Link href={{
  pathname: '/concert/[id]',
  params: { id: '1', from: 'favorites' }
}} />

// Récupération
const { id, from } = useLocalSearchParams<{ id: string, from?: string }>()
```

### Exercice pratique - Page détail artiste

Crée la structure

```bash
mkdir app/artist
touch app/artist/[id].tsx
```

Implémente la page détail, affiche :

- Grande image de l'artiste (300x300)
- Nom en gros titre
- Heure et scène
- Bouton "Retour" qui appelle `router.back()`

Structure de base :

```tsx
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'

export default function ArtistDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  
  // TODO : Trouver l'artiste
  // TODO : Afficher les infos
  // TODO : Bouton retour
  
  return (
    <View style={styles.container}>
      {/* Ton code ici */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebe8d4',
    padding: 20,
  },
  // ... autres styles
})
```

Modifie ArtistList pour naviguer: remplace `Alert.alert()` par la navigation :

```tsx
import { useRouter } from 'expo-router'

export default function ArtistList() {
  const router = useRouter()
  // ... état existant
  
  return (
    <FlatList
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => router.push({
            pathname: '/artist/[id]',
            params: { id: item.id }
          })}
          activeOpacity={0.7}
        >
          <ArtistCard {...item} ... />
        </TouchableOpacity>
      )}
      // ... reste
    />
  )
}
```

-> Problème potentiel - `MOCK_ARTIST` dupliqué : tu vas avoir besoin de `MOCK_ARTIST` dans plusieurs fichiers. Deux solutions :

- Solution A : Exporter les mocks (simple, temporaire)

```tsx
// constants/mockData.ts
export const MOCK_ARTIST: Artist[] = [...]
```

- Solution B : Context API (mieux, pour plus tard)

Partager l'état favorites entre écrans. On verra ça après si besoin.
Pour l'instant, utilise la solution A : crée `constants/mockData.ts` et importe-le où tu en as besoin.

**Ce que tu dois observer:**

- Navigation fluide : Le slide entre liste et détail
- Bouton retour natif : Apparaît automatiquement en haut (Android & iOS)
- Passage de paramètres : L'id est bien récupéré
- Typage : `useLocalSearchParams<{ id: string }>()` type-safe

**Pièges courants:**

- Oublier de créer le dossier `app/` : Expo Router cherche les routes dans `app/`, pas à la racine.
- Typage des params : Sans le générique, TypeScript infère `string | string[]`. Toujours spécifier :

```tsx
const { id } = useLocalSearchParams<{ id: string }>()
```

`MOCK_ARTIST` non trouvé : Tu auras une erreur d'import si tu ne l'exportes pas correctement.

### Layouts

Expo Router utilise un système de layouts. Toutes les pages héritent du layout parent.

Le `_layout.tsx` wraps toutes les pages dans son dossier et sous-dossiers :

```text
app/
├── _layout.tsx          ← Wrapper pour TOUT
│   └── index.tsx        ← Wrapped
│   └── artist/
│       ├── _layout.tsx  ← Wrapper pour /artist/*
│       └── [id].tsx     ← Wrapped par les 2 layouts
```

Hiérarchie : `Root Layout` → `Nested Layout` → `Page`

Deux stratégies pouur placer SafeAreaView :

Stratégie A : SafeAreaView dans le layout racine

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </SafeAreaProvider>
  )
}
```

**Résultat** : Toutes les pages ont accès à SafeArea, mais tu dois utiliser SafeAreaView dans chaque page individuellement.

```tsx
// app/index.tsx
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Contenu */}
    </SafeAreaView>
  )
}
```

Stratégie B : Header/Footer globaux dans le layout (si tu veux un header/footer identiques partout) :

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, View } from 'react-native'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header global */}
        <View style={styles.header}>
          <Text style={styles.title}>Westill 2026</Text>
        </View>

        {/* Pages ici */}
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#ebe8d4' }
          }}
        />

        {/* Footer global */}
        <View style={styles.footer}>
          <Text>Footer</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
```

**Résultat** : Header/Footer sur toutes les pages automatiquement. Les pages n'ont plus besoin de SafeAreaView.

```tsx
// app/index.tsx - Plus simple
export default function Index() {
  return <ArtistList />  // Pas de wrapper, déjà géré
}
```

Quelle stratégie choisir ?

*Stratégie A* si :

- Certaines pages ont des headers différents
- Tu veux plus de contrôle par page
- Navigation avec tabs (chaque tab son header)

*Stratégie B* si :

- Header/Footer identiques partout
- App simple avec une structure fixe
- Ton cas actuel (1 seul header)

#### Options de `Stack`

```tsx
<Stack
  screenOptions={{
    headerShown: false,           // Cache le header natif
    contentStyle: { 
      backgroundColor: '#ebe8d4'  // Fond de toutes les pages
    },
    animation: 'slide_from_right', // Animation de transition
  }}
>
  {/* Ou personnaliser par route */}
  <Stack.Screen 
    name="artist/[id]" 
    options={{
      headerShown: true,           // Affiche le header pour cette page
      title: 'Détail artiste',
      headerBackTitle: 'Retour',
    }}
  />
</Stack>
```

### Navigation par onglets (`Tabs`)

Actuellement tu as une navigation Stack (pile d'écrans). Pour les onglets, il faut restructurer avec un dossier `(tabs)`.

```text
app/
├── _layout.tsx                # Layout racine (Stack)
├── (tabs)/                    # Groupe d'onglets
│   ├── _layout.tsx            # Layout tabs
│   ├── index.tsx              # Tab 1 : Programmation
│   ├── map.tsx                # Tab 2 : Plan
│   ├── infos.tsx              # Tab 3 : Infos pratiques
│   └── wallet.tsx             # Tab 4 : Cashless
└── artist/
    └── [id].tsx               # Détail (hors tabs)
```

Le `(tabs)` avec parenthèses : Groupe les routes sans ajouter /tabs dans l'URL.

Créer le layout des tabs: fichier `app/(tabs)/_layout.tsx`:

```jsx
import { Tabs } from 'expo-router'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#18110b',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#ebe8d4',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Programme',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🎸</Text>,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🗺️</Text>,
        }}
      />
      <Tabs.Screen
        name="infos"
        options={{
          title: 'Infos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>ℹ️</Text>,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Cashless',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>💳</Text>,
        }}
      />
    </Tabs>
  )
}
```

**Options utiles :**

- `tabBarActiveTintColor` : Couleur de l'onglet actif
- `tabBarIcon` : Icône de l'onglet (emoji ou icône vectorielle)
- `title` : Label affiché

Modifier le layout racine: fichier `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="artist/[id]" 
          options={{ 
            presentation: 'modal',  // Présentation modale (optionnel)
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  )
}
```

Placer les pages dans `(tabs)`:

- `app/(tabs)/index.tsx`
- `app/(tabs)/artists.tsx`
- `app/(tabs)/map.tsx`
- `app/(tabs)/infos.tsx`
- `app/(tabs)/wallet.tsx`

#### Bonus : Icônes vectorielles

Pour des vraies icônes au lieu d'emojis, utilise `@expo/vector-icons` (déjà inclus) :

```tsx
import { MaterialCommunityIcons } from '@expo/vector-icons'

<Tabs.Screen
  name="index"
  options={{
    title: 'Programme',
    tabBarIcon: ({ color, size }) => (
      <MaterialCommunityIcons name="guitar-electric" size={size} color={color} />
    ),
  }}
/>
```

Icônes disponibles : <https://icons.expo.fyi>
