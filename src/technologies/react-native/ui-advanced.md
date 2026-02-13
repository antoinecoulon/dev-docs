# UI Avancé

Dans cette section :

- Custom Hooks -- extraire de la logique réutilisable
- Context API -- partager un état sans prop drilling
- AsyncStorage -- persister des données localement
- Filtres avancés -- combiner état, mémoïsation et UX

## Custom Hooks

Un custom hook, c'est simplement une fonction qui commence par `use` et qui encapsule de la logique avec d'autres hooks. Tu connais déjà le principe des composables en Vue (useXxx) -- c'est exactement la même idée.
Pourquoi ? Quand plusieurs composants ont besoin de la même logique (état + comportement), tu l'extrais dans un hook plutôt que de dupliquer le code.

**Règles :**

- Le nom commence par `use` (convention obligatoire, React s'en sert pour appliquer les règles des hooks)
- On peut utiliser n'importe quel hook dedans (`useState`, `useEffect`, `useMemo`...)
- Le hook retourne ce dont les composants ont besoin (état, fonctions, valeurs dérivées)

### Exemple générique -- un hook de toggle

```typescript
function useToggle(initial: boolean = false) {
  const [value, setValue] = useState(initial)

  const toggle = useCallback(() => setValue(v => !v), [])
  const setOn = useCallback(() => setValue(true), [])
  const setOff = useCallback(() => setValue(false), [])

  return { value, toggle, setOn, setOff }
}
```

### Utilisation

```typescript
function MyComponent() {
  const { value: isVisible, toggle } = useToggle(false)
  
  return (
    <View>
      {isVisible && <Text>Coucou</Text>}
      <Button title="Toggle" onPress={toggle} />
    </View>
  )
}
```

Exemple plus concret -- un hook de liste avec favoris :

```typescript
function useFavorites<T extends { id: string }>() {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set())

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (id: string) => favoriteIds.has(id),
    [favoriteIds]
  )

  return { favoriteIds, toggleFavorite, isFavorite }
}
```

### Rappels

- `useCallback` : il mémorise une fonction pour éviter qu'elle soit recréée à chaque render. En Vue, tu n'as pas ce problème car la réactivité fonctionne différemment. En React, chaque render recrée toutes les fonctions du composant, ce qui peut déclencher des re-renders inutiles chez les enfants.

- `Set` pour les IDs : plus performant que `array.includes()` pour vérifier l'appartenance, et sémantiquement correct (pas de doublons).

**Le problème actuel :** ce hook garde l'état en mémoire. Si deux composants appellent `useFavorites()` séparément, ils auront chacun leur propre copie de l'état. C'est là qu'intervient le Context API.

*Exercice 1 :* Crée un hook useFavorites dans ton dossier hooks/. Pour l'instant, utilise-le dans ton écran Programme pour pouvoir toggle des artistes en favoris. Constate le problème : si tu navigues vers un autre écran et reviens, ou si tu essaies d'accéder aux favoris depuis un autre onglet, l'état n'est pas partagé.

## Context API

En Vue/Nuxt, tu utilises Pinia pour partager un état global. En React, le mécanisme natif s'appelle Context.

**Le problème qu'il résout :** passer des données à travers l'arbre de composants sans les faire transiter par chaque niveau de props (prop drilling).

**3 éléments :**

- `createContext()` -- crée le "canal" de communication
- `Provider` -- composant qui fournit la valeur à ses enfants
- `useContext()` -- hook qui consomme la valeur dans un enfant

Exemple générique -- un thème :

```typescript
// 1. Créer le contexte avec un type
type ThemeContextType = {
  dark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

// 2. Créer le Provider (composant wrapper)
function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false)
  const toggle = useCallback(() => setDark(d => !d), [])

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

// 3. Hook custom pour consommer proprement
function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
```

**Points importants :**

- Le Provider se place haut dans l'arbre (souvent dans `_layout.tsx` avec Expo Router), pour que tous les écrans y aient accès.
- Le hook custom (useTheme) encapsule useContext + la vérification de null. C'est un pattern standard -- ne jamais utiliser useContext directement dans les composants.
- Tout enfant du Provider qui appelle `useTheme()` accède au même état. C'est la différence avec ton useFavorites actuel.

*Attention performance :* quand la valeur du Context change, tous les composants qui le consomment re-renderent. Pour ton app de 30-50 artistes, c'est négligeable. Mais c'est pour ça que sur des apps plus grosses on préfère Zustand ou d'autres solutions. Pour Westill, le Context natif suffit largement.

*Exercice 2 :* Crée un FavoritesContext qui wrape ton useFavorites. Concrètement :

- Un fichier `contexts/FavoritesContext.tsx` avec le createContext, le Provider, et un hook useFavoritesContext
- Le Provider placé dans ton `_layout.tsx` racine
- Remplacer l'appel à `useFavorites()` dans ton écran Programme par `useFavoritesContext()`
- Vérifier que les favoris sont maintenant accessibles depuis un autre onglet

## AsyncStorage

Actuellement, tes favoris disparaissent à chaque fermeture de l'app. AsyncStorage est le localStorage du mobile -- un stockage clé/valeur persistant sur l'appareil.

Différences avec localStorage :

- Asynchrone (d'où le nom) -- toutes les opérations retournent des Promises
- Strings uniquement -- tu dois `JSON.stringify` / `JSON.parse` toi-même
- Pas de limite de taille stricte mais conçu pour de petites données (préférences, IDs), pas pour du cache lourd

**API essentielle :**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'

// Écrire
await AsyncStorage.setItem('key', JSON.stringify(data))

// Lire
const raw = await AsyncStorage.getItem('key')
const data = raw ? JSON.parse(raw) : defaultValue

// Supprimer
await AsyncStorage.removeItem('key')
```

**Le pattern classique avec useState**: Le défi c'est de synchroniser un state React avec AsyncStorage. Il faut:

- Au montage : lire AsyncStorage et initialiser le state
- À chaque changement : écrire dans AsyncStorage

```typescript
function usePersistentState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [loaded, setLoaded] = useState(false)

  // 1. Lire au montage
  useEffect(() => {
    AsyncStorage.getItem(key).then(raw => {
      if (raw !== null) setValue(JSON.parse(raw))
      setLoaded(true)
    })
  }, [key])

  // 2. Écrire à chaque changement (mais pas avant le chargement initial)
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value, loaded])

  return [value, setValue, loaded] as const
}
```

Le flag `loaded` est critique. Sans lui, le state démarre avec defaultValue, et le deuxième useEffect écrase immédiatement ce qui était stocké dans AsyncStorage avant d'avoir eu le temps de le lire. Séquence sans `loaded` :

- State initialisé à defaultValue (Set vide)
- useEffect d'écriture se déclenche -> écrase AsyncStorage avec Set vide
- useEffect de lecture se déclenche -> lit le Set vide qu'on vient d'écrire

Note sur Set : `JSON.stringify(new Set([...]))` donne `{}`, pas un tableau. Tu devras convertir : `Array.from(set)` pour sérialiser, `new Set(array)` pour désérialiser.

*Exercice 3 :* Modifie ton useFavorites pour persister les favoris avec AsyncStorage.

- `npx expo install @react-native-async-storage/async-storage`
- Adapte le hook pour charger les IDs au montage et sauvegarder à chaque changement
- Expose le flag loaded pour pouvoir afficher un état de chargement si nécessaire
- Teste : ajoute des favoris, ferme l'app complètement, relance -- ils doivent être là

## Filtres avancés

On va combiner tout ce que tu as appris. **L'objectif** : filtrer la programmation par scène, par jour, et par recherche texte.

**Le principe :** l'état des filtres vit dans un seul endroit, et la liste affichée est une valeur dérivée (comme un computed en Vue) qui combine les données brutes + l'état des filtres.

### Structurer l'état des filtres

Plutôt que 3 useState séparés, un seul objet :

```typescript
type Filters = {
  stage: string | null    // null = toutes les scènes
  day: string | null      // null = tous les jours
  search: string          // "" = pas de recherche
}

const [filters, setFilters] = useState<Filters>({
  stage: null,
  day: null,
  search: '',
})
```

Pour mettre à jour un champ sans toucher aux autres :

```typescript
// Mettre à jour uniquement "stage"
setFilters(prev => ({ ...prev, stage: 'Main Stage' }))

// Reset un filtre
setFilters(prev => ({ ...prev, stage: null }))
```

C'est le spread operator -- équivalent React de modifier une seule propriété d'un objet réactif en Vue.

### La liste filtrée avec useMemo

```typescript
const filteredItems = useMemo(() => {
  return items.filter(item => {
    if (filters.stage && item.stage !== filters.stage) return false
    if (filters.day && item.day !== filters.day) return false
    if (filters.search) {
      const term = filters.search.toLowerCase()
      if (!item.name.toLowerCase().includes(term)) return false
    }
    return true
  })
}, [items, filters])
```

Chaque condition est une porte : si le filtre est actif et que l'item ne correspond pas, on l'exclut. Si le filtre est null ou vide, on laisse passer.

### Extraire dans un hook

Ce pattern (état des filtres + liste dérivée) se prête bien à un custom hook :

```typescript
function useFiltered<T>(items: T[], filterFn: (item: T, filters: Filters) => boolean) {
  const [filters, setFilters] = useState<Filters>(/*...*/)
  
  const filtered = useMemo(
    () => items.filter(item => filterFn(item, filters)),
    [items, filters, filterFn]
  )

  return { filters, setFilters, filtered }
}
```

### Composant de filtre -- le pattern des chips/pills

Pour l'UI, un pattern classique en mobile : des boutons horizontaux scrollables. Pense à ScrollView horizontal avec des TouchableOpacity. Le bouton actif a un style différent (fond plein vs bordure).

*Exercice 4 :*

- Enrichis tes données mockées si ce n'est pas déjà fait : chaque concert doit avoir une scène et une date/jour
- Crée un état de filtres dans ton écran Programme (ou dans un hook dédié)
- Implémente le useMemo qui filtre la liste
- Ajoute l'UI : une barre de recherche (TextInput) + des chips pour scènes et jours
- Combine avec ton filtre favoris existant
