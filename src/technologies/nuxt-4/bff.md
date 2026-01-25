# Architecture Full Stack / BFF

### Concept BFF (Backend For Frontend)

Le BFF est une couche API dédiée à ton frontend. Au lieu que ton front appelle directement ton backend .NET, il passe par `server/api/` qui :

- Agrège/transforme les données
- Gère l'authentification côté serveur
- Cache les réponses
- Masque la complexité du backend

```
[Frontend] → [Nuxt server/api/] → [Backend .NET]
```

### Structure server/

```
server/
├── api/              # Routes API exposées sous /api/*
│   ├── users/
│   │   ├── index.get.ts      # GET /api/users
│   │   ├── index.post.ts     # POST /api/users
│   │   └── [id].get.ts       # GET /api/users/:id
│   └── auth/
│       └── login.post.ts     # POST /api/auth/login
├── middleware/       # Middleware serveur (auth, logs...)
├── utils/            # Utilitaires serveur (auto-importés)
└── plugins/          # Plugins serveur (init DB, etc.)
```

Propulsé par le moteur Nitro.

Tout ce qui se trouve dans `server/api/`, `server/routes/` ou `server/middleware/` ne sera **jamais envoyé au navigateur**.

- **Sécurité** : C'est ici que tu caches tes clés d'API secrètes.
- **Performance** : Tu peux transformer les données avant de les envoyer au client pour alléger le JSON.
- **Flexibilité** : Ton code peut s'exécuter sur Node.js, mais aussi sur des environnements "Edge" (Vercel, Cloudflare Workers).

### Bonnes pratiques BFF

**1. Nommer les fichiers avec la méthode HTTP**

```
index.get.ts   → GET uniquement
index.post.ts  → POST uniquement
index.ts       → Toutes méthodes (à éviter, moins explicite)
```

**2. Utiliser `defineCachedEventHandler` pour le cache**

```tsx
// server/api/products.get.ts
export default defineCachedEventHandler(async (event) => {
  // Cette partie n'est exécutée que si le cache est vide ou expiré
  const data = await $fetch('<https://api.backend.net/products>')
  return data
}, {
  maxAge: 60 * 5, // Durée de vie : 5 minutes (en secondes)
  name: 'getProducts', // Optionnel : nom pour identifier ce cache
  getKey: (event) => event.path, // Optionnel : définit ce qui rend la réponse unique, crucial si tu as des paramètres. Par exemple, si tu as /api/products?category=shoes, tu veux un cache différent pour chaque catégorie
  swr: true // Stale-While-Rendering : option souvent ajoutée. Si true, Nuxt servira une version périmée du cache tout en mettant à jour les données en arrière-plan (performance+++)
})
```

Dans une route classique (`defineEventHandler`), le code s'exécute à **chaque fois** qu'un utilisateur appelle l'URL. Si ton API externe est lente ou payante, cela devient problématique.

`defineCachedEventHandler` agit comme un **bouclier** :

1. **Première requête** : Nitro appelle l'API externe, stocke le résultat en mémoire, et te répond.
2. **Requêtes suivantes** : Nitro renvoie directement ce qu'il a en mémoire sans même exécuter le reste de la fonction.
3. **Expiration** : Une fois le temps écoulé, il rafraîchit les données.

Par défaut, Nuxt stocke cela **en mémoire** (L'application perd le cache si le serveur redémarre). Cependant, Nitro est extrêmement flexible. Tu peux configurer ton fichier `nuxt.config.ts` pour utiliser d'autres supports ("Storage Drivers") sans changer ton code :

- **Redis** (Idéal pour la production avec plusieurs serveurs).
- **FileSystem** (Stockage dans des fichiers sur le serveur).
- **Cloudflare KV** (Pour le déploiement en Edge).

**3. Centraliser la config API dans `server/utils/`**

```tsx
// server/utils/api.ts
// Exemple d'une instance configurée et réutilisable (équivalent instance Axios)
export const backendApi = $fetch.create({
  baseURL: process.env.BACKEND_URL,
  headers: { 'X-Api-Key': process.env.API_KEY }
})
```

Le dossier `server/utils/` est l'un des endroits les plus puissants de Nuxt pour structurer ton backend. La règle d'or ici est l'**auto-import** : toute fonction ou constante exportée dans ce dossier devient disponible partout dans ton dossier `server/` (dans tes API routes, tes middlewares et tes plugins serveurs) sans avoir à écrire de `import`.

Outre la configuration d'API, ce dossier sert de "boîte à outils" pour tout ton backend. Voici les cas d'usage les plus fréquents :

- Clients de Bases de Données ou Services

Si tu utilises un ORM (comme Prisma ou Drizzle) ou un service tiers (comme Stripe ou Resend pour les emails), tu les bloques ici pour n'avoir qu'une seule instance active.

```tsx
// server/utils/db.ts
import { createClient } from '@lib/database'

// Disponible partout via 'db'
export const db = createClient(process.env.DATABASE_URL)
```

- Helpers de Validation (Zod)

Il est très courant d'y placer des schémas de validation pour s'assurer que les données reçues par tes APIs sont correctes.

```tsx
// server/utils/validation.ts
import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

- Gestion des Erreurs Standardisées

Pour éviter de réécrire des blocs `try/catch` complexes, on peut créer des helpers qui renvoient des erreurs formatées pour Nuxt.

```tsx
// server/utils/errors.ts
export const throwUnauthorized = () => {
  throw createError({
    statusCode: 401,
    statusMessage: 'Accès non autorisé'
  })
}
```

**4. Gérer les erreurs proprement**

```tsx
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'ID requis' })
  }

  // ...
})
// Possible de créer des helpers dans utils/, voir ci-dessus...
```

**5. Valider les entrées**
Utilise `zod` ou les utilitaires H3 :

```tsx
const body = await readValidatedBody(event, schema.parse)
const query = await getValidatedQuery(event, schema.parse)
```

### Appeler ton API depuis le front

```tsx
// Dans une page ou composant
const { data } = await useFetch('/api/users')

// Avec paramètres
const { data } = await useFetch(`/api/users/${id}`)

// POST
const { data } = await useFetch('/api/auth/login', {
  method: 'POST',
  body: { email, password }
})
```

### Résumé de l’organisation Nuxt 4

| **Type de contenu** | **Emplacement conseillé** | **Visibilité** |
| --- | --- | --- |
| **Logique UI/Composants** | `app/utils/` | Client (Navigateur) |
| **Secrets / Appels API lourds** | `server/utils/` | Serveur uniquement |
| **Types TypeScript** | `shared/utils/` (nouveau en v4) | Les deux |