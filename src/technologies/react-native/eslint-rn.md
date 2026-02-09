# ESLint dans un projet React Native

## Fonctionnement

ESLint analyse statiquement ton code pour détecter :

- Erreurs potentielles (variables non utilisées, imports manquants)
- Problèmes de style (conventions non respectées)
- Anti-patterns React/React Native

Il parse ton code en AST (Abstract Syntax Tree), applique des règles configurables, et remonte les violations.

## Installation

Expo inclut déjà une config ESLint. Pour l'activer :

```bash
npx expo lint
```

Cela va :

1. Installer `eslint` et `eslint-config-expo` si absents
2. Créer un fichier de config de base

## Configuration

**Pour la sécurité et les bugs async (critique pour ton app) :**

```bash
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser`
```

```javascript
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "node_modules/*", ".expo/*"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
    },
    rules: {
      // Sécurité critique
      "@typescript-eslint/no-floating-promises": "error", // Détecte les await oubliés
      "@typescript-eslint/no-misused-promises": "error",  // Évite async dans onClick etc.
      
      // Qualité TS
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_" 
      }],
      
      // Interdit les trucs dangereux
      "no-eval": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);`
```

## Intégration Prettier

Pour éviter les conflits ESLint/Prettier :

```bash
npm install -D prettier eslint-config-prettier
```

Ajoute `'prettier'` en dernier dans `extends` (comme ci-dessus). Prettier gère le formatage, ESLint gère la qualité.

## Utilisation

```bash
# Analyser tout le projet
npx eslint .

# Analyser avec auto-fix
npx eslint . --fix

# Via Expo (recommandé)
npx expo lint
```

## Intégration VS Code

Installe l'extension **ESLint** (dbaeumer.vscode-eslint).

Dans `.vscode/settings.json` :

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["javascript", "typescript", "typescriptreact"]
}
```

## Intégration Husky

Dans `.husky/pre-commit` ou via lint-staged :

```bash
npm install -D lint-staged
```

Dans `package.json` :

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

Et dans ton hook pre-commit :

```bash
npx lint-staged
```

## Résumé du workflow

1. **Dev** : VS Code corrige en temps réel
2. **Pre-commit** : lint-staged vérifie les fichiers stagés
3. **CI** : `npx expo lint` bloque les PR non conformes
