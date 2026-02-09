# React Native - Fondamentaux

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
