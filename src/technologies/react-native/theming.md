# Theming

Context API est un bon choix ici, surtout si tu envisages un dark mode ou des variations de thème plus tard.

## Concept

**Le principe :**

- Définir ton thème (couleurs, espacements, typographies) dans un objet
- Fournir ce thème à toute l'app via un Provider (wrapping ton app)
- Consommer le thème partout avec un hook `useTheme()`

**Résultat :** tu changes une couleur à un seul endroit, toute l'app se met à jour.

**Structure recommandée :**

```text
constants/
  └── theme.ts          # Objet de thème
contexts/
  └── ThemeContext.tsx  # Provider + hook
app/
  └── _layout.tsx       # Wrapper avec <ThemeProvider>
```

## Définir ton thème (constants/theme.ts)

```typescript
export const theme = {
  colors: {
    primary: '#E63946',
    secondary: '#457B9D',
    background: '#1D3557',
    text: '#F1FAEE',
    // ...
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    // ...
  }
}

export type Theme = typeof theme
```

## Créer le Context (contexts/ThemeContext.tsx)

```typescript
import { createContext, useContext, ReactNode } from 'react'

// 1. Définir le type du thème
type Theme = {
  colors: {
    primary: string
    background: string
    text: string
    // ... autres couleurs
  }
  spacing: {
    sm: number
    md: number
    // ...
  }
}

// 2. Créer le Context (avec valeur par défaut undefined)
const ThemeContext = createContext<Theme | undefined>(undefined)

// 3. Créer le Provider
type ThemeProviderProps = {
  children: ReactNode
  theme: Theme  // On passe le thème en prop
}

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  )
}

// 4. Créer le hook personnalisé
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  
  return context
}
```

Pourquoi le throw Error ? Protection : si quelqu'un utilise useTheme() hors du Provider, erreur explicite au lieu d'un crash obscur.

## Wrapper l'app

```typescript
import { Stack } from 'expo-router'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { theme } from '@/constants/theme'

export default function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
```

## Utilisation dans un composant

Exemple : components/ArtistCard.tsx

```typescript
import { View, Text } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

export function ArtistCard({ name }: { name: string }) {
  const { colors, spacing } = useTheme()
  
  return (
    <View style={{ 
      backgroundColor: colors.background,
      padding: spacing.md 
    }}>
      <Text style={{ color: colors.text }}>
        {name}
      </Text>
    </View>
  )
}
```

Le truc clé : Tu imports useTheme(), tu déstructures ce dont tu as besoin, et tu l'utilises dans tes styles. Pas de duplication de couleurs hardcodées.

## Avec Stylesheet

### Option 1 : StyleSheet dans le composant (recommandé)

```typescript
import { View, Text, StyleSheet } from 'react-native'
import { useTheme } from '@/contexts/ThemeContext'

export function ArtistCard({ name }: { name: string }) {
  const { colors, spacing } = useTheme()
  
  // Créer les styles DANS le composant avec les valeurs du thème
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: spacing.md,
      borderRadius: 8,
    },
    title: {
      color: colors.text,
      fontSize: 18,
    }
  })
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
    </View>
  )
}
```

Problème : Les styles sont recréés à chaque render. Pour des listes longues, ça peut ralentir.

### Option 2 : Fonction factory (performant)

```typescript
import { StyleSheet } from 'react-native'
import { Theme } from '@/contexts/ThemeContext'

// Fonction qui retourne les styles
const createStyles = (theme: Theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  title: {
    color: theme.colors.text,
  }
})

export function ArtistCard({ name }: { name: string }) {
  const theme = useTheme()
  const styles = createStyles(theme)  // Appelé à chaque render
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
    </View>
  )
}
```

### Option 3 : useMemo (optimal pour listes)

```typescript
import { useMemo } from 'react'

export function ArtistCard({ name }: { name: string }) {
  const { colors, spacing } = useTheme()
  
  // Les styles ne sont recréés QUE si colors/spacing changent
  const styles = useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    title: {
      color: colors.text,
    }
  }), [colors, spacing])
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
    </View>
  )
}
```

Les StyleSheet.create offrent :

- Validation des styles
- Optimisation interne de React Native
- Autocomplétion TypeScript

## Alternative plus simple

Si tu n'as pas besoin de dark mode ou de thème dynamique, un simple fichier constants/theme.ts que tu importes directement suffit :

```typescript
import { theme } from '@/constants/theme'
<Text style={{ color: theme.colors.primary }}>Hello</Text>
```

Moins de boilerplate, mais moins flexible.
