# Setup et Configuration

### Initialisation

```bash
npx nuxi@latest init mon-projet
cd mon-projet
npm install
```

Nuxt demande : 

- Which template would you like to use?
    - **`minimal`** : C'est le choix standard pour Nuxt 4. Il installe le strict nécessaire.
        - **Configuration générée** : Un fichier `nuxt.config.ts`, un dossier `app/` (la grande nouveauté de Nuxt 4), et un fichier `app.vue`.
        - **Pourquoi le choisir** : Tu veux construire ton projet de zéro sans fichiers d'exemple inutiles.
    - **Autres templates (Basic / Community)** : Parfois, le CLI propose des variantes incluant déjà des configurations pour des outils comme Content, UI, ou des exemples d'API.
        - **Pourquoi le choisir** : Pour apprendre en observant une structure déjà peuplée.
- Which package manager...?
    - **npm**
        - Standard
        - Installé par défaut avec Node.js.
        - Plus lent sur les gros projets.
    - **pnpm**
        - Très rapide
        - Économe en espace disque (utilise des liens symboliques). Très recommandé pour Nuxt.
    - **yarn**
        - Rapide
        - Classique, très stable, bien que pnpm soit souvent préféré aujourd'hui.
    - **bun**
        - Ultra rapide
        - Un runtime complet qui remplace Node.js. À choisir si tu veux tester les performances maximales.
- Initialize git repository? → Lance un `git init`
- Install any official modules? → Installer certains packages dès l’init

La structure devrait ressembler à ça : 

```bash
.
├── app/                <-- Ton code source (pages, composants, etc.)
│   ├── app.vue
│   └── pages/
├── nuxt.config.ts      <-- Configuration Nuxt
├── package.json
└── public/             <-- Fichiers statiques (images, robots.txt)
```

---

### Configuration indispensable (`nuxt.config.ts`)

```tsx
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01', // Requis - gère les breaking changes
  devtools: { enabled: true },     // Recommandé en dev
  future: {
    compatibilityVersion: 4        // Active les comportements Nuxt 4
  }
})
```

**Pourquoi `compatibilityDate` est obligatoire ?**

Nuxt introduit des changements de comportement datés. Cette date indique à Nuxt quels comportements appliquer. Sans elle, tu auras un warning et des comportements imprévisibles.

Cette feature sera améliorée plus tard.

### Configurations selon les besoins

| Besoin | Configuration |
| --- | --- |
| SPA uniquement | `ssr: false` |
| Désactiver Tailwind auto | `css: []` puis config manuelle |
| Variables d'env publiques | `runtimeConfig: { public: { apiBase: '' } }` |
| Variables d'env privées (server) | `runtimeConfig: { secretKey: '' }` |

[Nuxt Configuration v4](https://nuxt.com/docs/4.x/api/nuxt-config)