# Authentification dans une architecture fullstack

# Authentification dans Nuxt 4 - Architecture Fullstack Pure

## Vue d’ensemble

En architecture fullstack pure, **Nuxt gère l’intégralité du cycle d’authentification** : stockage des utilisateurs, vérification des credentials, gestion des sessions, et protection des routes. Contrairement au BFF où tu délègues à un backend externe, ici tu es responsable de tout.

---

## 1. Concepts clés

### 1.1 Authentification vs Autorisation

| Concept | Question | Exemple |
| --- | --- | --- |
| **Authentification** | “Qui es-tu ?” | Login avec email/password |
| **Autorisation** | “Que peux-tu faire ?” | Accès admin, rôles |

### 1.2 Stratégies d’authentification

### Sessions (stateful)

Le serveur stocke l’état de connexion. Un identifiant de session est envoyé au client via cookie.

```
Client → Login → Serveur crée session → Cookie sessionId → Client
Client → Request + Cookie → Serveur vérifie session → Réponse
```

**Avantages** : révocation instantanée, données sensibles côté serveur
**Inconvénients** : état à gérer côté serveur, scaling plus complexe

### JWT - JSON Web Tokens (stateless)

Le serveur génère un token signé contenant les infos utilisateur. Le client le renvoie à chaque requête.

```
Client → Login → Serveur génère JWT → Token → Client
Client → Request + Token → Serveur vérifie signature → Réponse
```

**Structure d’un JWT** : `header.payload.signature`

**Avantages** : stateless, scalable
**Inconvénients** : révocation complexe, token potentiellement volumineux

### OAuth2 / OpenID Connect

Délégation de l’authentification à un provider externe (Google, GitHub, etc.).

```
Client → Redirect provider → User consent → Code → Serveur échange code → Tokens
```

### 1.3 Stockage côté client

| Méthode | Sécurité | Accessibilité |
| --- | --- | --- |
| **Cookie httpOnly** | ✅ Pas accessible en JS | Envoyé automatiquement |
| **Cookie standard** | ⚠️ Accessible en JS (XSS) | Envoyé automatiquement |
| **localStorage** | ❌ Vulnérable XSS | Manuel |
| **sessionStorage** | ❌ Vulnérable XSS | Manuel, perdu à la fermeture |

**Bonne pratique** : toujours `httpOnly` + `secure` + `sameSite` pour les tokens sensibles.

---

## 2. Architecture dans Nuxt Fullstack

### 2.1 Structure recommandée

```
server/
├── api/
│   └── auth/
│       ├── login.post.ts      # POST /api/auth/login
│       ├── logout.post.ts     # POST /api/auth/logout
│       ├── register.post.ts   # POST /api/auth/register
│       └── me.get.ts          # GET /api/auth/me
├── middleware/
│   └── auth.ts                # Middleware serveur (protection API)
├── utils/
│   ├── auth.ts                # Helpers : hash, verify, jwt
│   └── session.ts             # Gestion sessions
└── database/
    └── schema.ts              # Table users
app/
├── middleware/
│   └── auth.ts                # Middleware client (protection pages)
├── composables/
│   └── useAuth.ts             # État auth réactif
└── pages/
    ├── login.vue
    └── dashboard.vue          # Page protégée
```

### 2.2 Deux types de middleware

### Middleware serveur (`server/middleware/`)

Intercepte **toutes les requêtes HTTP** avant qu’elles n’atteignent les handlers API.

```tsx
// server/middleware/auth.ts
export default defineEventHandler((event) => {
  // Exécuté pour CHAQUE requête au serveur
  // event.context.user = ...
})
```

### Middleware application (`app/middleware/`)

Intercepte les **navigations de pages** côté client/SSR.

```tsx
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Exécuté lors des changements de route
  // return navigateTo('/login')
})
```

### 2.3 Flux d’authentification typique

```
┌─────────────────────────────────────────────────────────────┐
│                        LOGIN                                │
├─────────────────────────────────────────────────────────────┤
│  1. Client POST /api/auth/login { email, password }         │
│  2. Serveur vérifie credentials en DB                       │
│  3. Serveur crée session/JWT                                │
│  4. Serveur set cookie httpOnly                             │
│  5. Client reçoit confirmation + infos user                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    REQUÊTE AUTHENTIFIÉE                     │
├─────────────────────────────────────────────────────────────┤
│  1. Client request + cookie automatique                     │
│  2. Middleware serveur lit cookie                           │
│  3. Middleware valide session/JWT                           │
│  4. Middleware injecte user dans event.context              │
│  5. Handler API accède à event.context.user                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Librairies recommandées

### 3.1 `nuxt-auth-utils` (recommandé pour fullstack)

Module officiel Nuxt Labs, léger et flexible. Gère sessions et OAuth.

```tsx
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['nuxt-auth-utils']
})
```

**Concepts clés** :

| Fonction | Côté | Rôle |
| --- | --- | --- |
| `setUserSession()` | Serveur | Crée/met à jour la session |
| `getUserSession()` | Serveur | Lit la session |
| `clearUserSession()` | Serveur | Supprime la session |
| `useUserSession()` | Client | Composable réactif |
| `requireUserSession()` | Serveur | Throw 401 si pas de session |

**Configuration session** (`.env`) :

```
NUXT_SESSION_PASSWORD=min-32-caracteres-secret-key-here
```

### 3.2 Hashing des mots de passe

**`bcrypt`** : standard éprouvé, mais nécessite compilation native.

```tsx
import bcrypt from 'bcrypt'
const hash = await bcrypt.hash(password, 12)  // 12 = cost factor
const valid = await bcrypt.compare(password, hash)
```

**`@node-rs/argon2`** : plus moderne, recommandé par OWASP, bindings Rust performants.

```tsx
import { hash, verify } from '@node-rs/argon2'
const hashed = await hash(password)
const valid = await verify(hashed, password)
```

### 3.3 Validation avec Zod

Toujours valider les entrées côté serveur :

```tsx
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

// Dans le handler
const body = await readValidatedBody(event, loginSchema.parse)
```

### 3.4 ORM pour les utilisateurs

Avec **Drizzle** :

```tsx
// server/database/schema.ts
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('user'),
  createdAt: integer('created_at', { mode: 'timestamp' })
})
```

---

## 4. Patterns d’implémentation

### 4.1 Handler de login (pattern)

```tsx
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  // 1. Valider l'entrée
  const { email, password } = await readValidatedBody(event, schema.parse)

  // 2. Chercher l'utilisateur
  const user = await db.query.users.findFirst({ where: eq(users.email, email) })
  if (!user) throw createError({ statusCode: 401, message: 'Invalid credentials' })

  // 3. Vérifier le mot de passe
  const valid = await verify(user.passwordHash, password)
  if (!valid) throw createError({ statusCode: 401, message: 'Invalid credentials' })

  // 4. Créer la session (avec nuxt-auth-utils)
  await setUserSession(event, {
    user: { id: user.id, email: user.email, role: user.role }
  })

  // 5. Retourner les infos (jamais le hash !)
  return { user: { id: user.id, email: user.email } }
})
```

**Points importants** :
- Message d’erreur générique (ne pas révéler si l’email existe)
- Ne jamais retourner `passwordHash`
- Session stockée dans cookie chiffré automatiquement

### 4.2 Middleware serveur de protection

```tsx
// server/middleware/01.auth.ts (01 pour ordre d'exécution)
export default defineEventHandler(async (event) => {
  // Routes publiques
  const publicPaths = ['/api/auth/login', '/api/auth/register']
  if (publicPaths.some(p => event.path.startsWith(p))) return

  // Routes API protégées
  if (event.path.startsWith('/api/')) {
    const session = await getUserSession(event)
    if (!session?.user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }
    // Injection pour les handlers suivants
    event.context.user = session.user
  }
})
```

### 4.3 Composable client

```tsx
// app/composables/useAuth.ts
export function useAuth() {
  const { loggedIn, user, session, clear, fetch } = useUserSession()

  async function login(email: string, password: string) {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password }
    })
    await fetch() // Refresh session state
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await clear()
    await navigateTo('/login')
  }

  return { loggedIn, user, login, logout }
}
```

### 4.4 Middleware de page

```tsx
// app/middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value && to.path !== '/login') {
    return navigateTo('/login')
  }
})
```

**Application sur une page** :

```
<script setup>
definePageMeta({ middleware: 'auth' })
</script>
```

**Ou globalement** :

```tsx
// app/middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  // Appliqué à toutes les routes
})
```

---

## 5. Gestion des rôles (RBAC)

### 5.1 Pattern basique

```tsx
// server/utils/auth.ts
export function requireRole(event: H3Event, allowedRoles: string[]) {
  const user = event.context.user
  if (!user || !allowedRoles.includes(user.role)) {
    throw createError({ statusCode: 403, message: 'Forbidden' })
  }
}
```

```tsx
// server/api/admin/users.get.ts
export default defineEventHandler((event) => {
  requireRole(event, ['admin'])
  // ... logique admin
})
```

### 5.2 Côté client

```tsx
// Dans un composable ou component
const { user } = useAuth()
const isAdmin = computed(() => user.value?.role === 'admin')
```

```
<template>
  <AdminPanel v-if="isAdmin" />
</template>
```

---

## 6. OAuth2 avec nuxt-auth-utils

### 6.1 Configuration provider

```tsx
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    oauth: {
      github: {
        clientId: '',
        clientSecret: ''
      }
    }
  }
})
```

### 6.2 Route OAuth

```tsx
// server/routes/auth/github.get.ts
export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    // user = données GitHub
    // Créer ou lier le compte local
    await setUserSession(event, { user: { /* ... */ } })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    return sendRedirect(event, '/login?error=oauth')
  }
})
```

**Providers supportés** : GitHub, Google, Discord, Microsoft, et autres via config manuelle.

---

## 7. Bonnes pratiques

### 7.1 Sécurité

| Pratique | Raison |
| --- | --- |
| **Toujours HTTPS** | Cookies secure, pas d’interception |
| **Cookie httpOnly + secure + sameSite=lax** | Protection XSS et CSRF |
| **Hash passwords avec Argon2/bcrypt** | Jamais en clair ou MD5/SHA |
| **Rate limiting sur login** | Protection brute force |
| **Messages d’erreur génériques** | Ne pas révéler l’existence d’un compte |
| **Validation Zod côté serveur** | Ne jamais faire confiance au client |
| **Session timeout** | Expiration automatique |

### 7.2 Configuration session sécurisée

```tsx
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    session: {
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      cookie: {
        sameSite: 'lax',
        secure: true,  // false en dev
        httpOnly: true
      }
    }
  }
})
```

### 7.3 Anti-patterns à éviter

❌ Stocker le JWT dans localStorage
❌ Inclure des données sensibles dans le JWT payload
❌ Faire confiance uniquement au middleware client
❌ Retourner le hash du mot de passe dans les réponses
❌ Utiliser des secrets faibles ou hardcodés
❌ Oublier de valider côté serveur

### 7.4 Double protection

Toujours combiner :
1. **Middleware serveur** → protège les données
2. **Middleware client** → améliore l’UX (redirection rapide)

Le client peut être contourné, le serveur jamais.

---

## 8. Refresh tokens (optionnel, avancé)

Pour les sessions longues avec révocation granulaire :

```
Access Token : courte durée (15 min), utilisé pour les requêtes
Refresh Token : longue durée (7 jours), stocké httpOnly, sert à renouveler l'access token
```

**Pattern** :

```tsx
// Si access token expiré
// → Client appelle /api/auth/refresh
// → Serveur vérifie refresh token en DB
// → Serveur génère nouveau access token
// → Anciens tokens révoqués si compromission détectée
```

Avec `nuxt-auth-utils`, les sessions chiffrées gèrent cela automatiquement via le cookie. Le refresh token pattern est plus pertinent pour les architectures API-first ou mobile.

---

## 9. Checklist d’implémentation

- [x]  Installer `nuxt-auth-utils`
- [x]  Configurer `NUXT_SESSION_PASSWORD` (32+ caractères)
- [x]  Créer la table `users` avec Drizzle
- [ ]  Implémenter `/api/auth/register` avec hash Argon2
- [ ]  Implémenter `/api/auth/login` avec validation Zod
- [ ]  Implémenter `/api/auth/logout`
- [ ]  Créer middleware serveur pour protéger `/api/*`
- [ ]  Créer composable `useAuth()` client
- [ ]  Créer middleware page pour routes protégées
- [ ]  Configurer HTTPS en production
- [ ]  Ajouter rate limiting (optionnel mais recommandé)

---

## Ressources

- [nuxt-auth-utils documentation](https://github.com/atinux/nuxt-auth-utils)
- [OWASP Authentication Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [Nuxt Security Module](https://nuxt-security.vercel.app/)