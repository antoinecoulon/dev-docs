# Conventional commits

## 1. Pourquoi les commits conventionnels ?

**Problème classique** :
```
git log
- "fix bug"
- "update"
- "wip"
- "ça marche enfin !!!!"
```

Impossible de :
- Générer un changelog automatique
- Savoir quel commit a cassé quoi
- Déterminer automatiquement la prochaine version

**Solution** : format standardisé qui permet l'automatisation.

## 2. Le format (Conventional Commits)

### Structure de base
```
type(scope): description courte

[corps optionnel]

[footer optionnel]
```

### Types standardisés

| Type | Quand l'utiliser | Impact version |
|------|------------------|----------------|
| `feat` | Nouvelle fonctionnalité | MINOR (0.1.0 → 0.2.0) |
| `fix` | Correction de bug | PATCH (0.1.0 → 0.1.1) |
| `docs` | Documentation uniquement | Aucun |
| `style` | Formatage code (prettier, etc.) | Aucun |
| `refactor` | Refactoring sans changer le comportement | Aucun |
| `perf` | Amélioration performance | PATCH |
| `test` | Ajout/modification tests | Aucun |
| `chore` | Maintenance (deps, config...) | Aucun |
| `ci` | Modification CI/CD | Aucun |
| `build` | Système de build (webpack, expo...) | Aucun |

### Scope (optionnel mais recommandé)

Indique **quelle partie** du code est touchée :
```
feat(auth): add JWT token refresh
fix(api): handle timeout on concert fetch
chore(deps): upgrade expo to 52
```

Scopes possibles pour ton projet :
- `auth`, `api`, `ui`, `wallet`, `notifications`, `map`, `schedule`

### Description

- **Impératif présent** : "add" pas "added" ou "adds"
- **Minuscule** : `feat: add login` pas `feat: Add Login`
- **Sans point final**
- **50 caractères max** (idéalement)

### Breaking changes

Changement qui casse la compatibilité :
```
feat(api)!: change artist endpoint response format

BREAKING CHANGE: Artists now return nested venue object
instead of venueId
```

Le `!` ou le footer `BREAKING CHANGE:` trigger une version MAJOR (0.1.0 → 1.0.0).

## 3. Comment ça marche (sous le capot)

```
┌─────────────────┐
│  Tu codes       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  git add .      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  git cz         │  ← Commitizen te guide interactivement
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Husky hook     │  ← Avant commit : lint-staged + commitlint
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Commit créé    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ standard-version│  ← Génère changelog + bump version
└─────────────────┘
```

**Commitlint** : valide que ton message respecte le format
**Commitizen** : interface CLI qui te guide pour créer le bon format
**Husky** : déclenche commitlint automatiquement avant chaque commit

## 4. Installation pas à pas

### Étape 1 : Installer les packages

Dans ton projet **westill-app** :
```bash
cd westill-app

# Commitizen
npm install -D commitizen cz-conventional-changelog

# Validation des commits
npm install -D @commitlint/cli @commitlint/config-conventional

# Hooks Git
npm install -D husky

# Formatage automatique (optionnel mais recommandé)
npm install -D lint-staged prettier eslint
```

### Étape 2 : Configurer Commitizen

```bash
# Initialise commitizen
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

Ou manuellement dans `package.json` :
```json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

### Étape 3 : Configurer Commitlint

Crée `commitlint.config.js` à la racine :
```js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'ci',
        'build'
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'api',
        'ui',
        'wallet',
        'notifications',
        'map',
        'schedule',
        'core'
      ]
    ],
    'subject-case': [0] // Désactive la vérification de casse si besoin
  }
}
```

### Étape 4 : Configurer Husky

```bash
# Initialise husky
npx husky init

# Crée le hook commit-msg
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg

# Rend exécutable
chmod +x .husky/commit-msg
```

### Étape 5 : (Optionnel) Pre-commit hook avec lint-staged

Crée `.husky/pre-commit` :
```bash
npx lint-staged
```

Configure `package.json` :
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

### Étape 6 : Ajouter des scripts npm

Dans `package.json` :
```json
{
  "scripts": {
    "commit": "cz",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write \"**/*.{ts,tsx,json,md}\""
  }
}
```

## 5. Utilisation quotidienne

### Workflow classique

```bash
# 1. Tu codes
# ...

# 2. Tu ajoutes les fichiers
git add .

# 3. Au lieu de "git commit -m"
npm run commit
# ou directement
git cz
```

### Interface Commitizen

```
? Select the type of change that you're committing:
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests

? What is the scope of this change (e.g. component or file name):
❯ auth

? Write a short, imperative tense description:
❯ add login screen with email/password

? Provide a longer description (optional):
❯ Implemented LoginScreen component with form validation

? Are there any breaking changes?
❯ No

? Does this change affect any open issues?
❯ No
```

**Résultat** :
```
feat(auth): add login screen with email/password

Implemented LoginScreen component with form validation
```

### Si tu oublies le format

**Mauvais commit** :
```bash
git commit -m "fixed bug"
```

**Husky bloque** :
```
⧗   input: fixed bug
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings
```

Tu dois corriger :
```bash
git commit -m "fix(api): handle null artist response"
```

## 6. Générer automatiquement le changelog

### Installation
```bash
npm install -D standard-version
```

### Config dans `package.json`
```json
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major"
  }
}
```

### Utilisation
```bash
# Analyse les commits depuis le dernier tag
# Génère CHANGELOG.md
# Bump version dans package.json
# Crée un tag Git
npm run release
```

**Résultat** (`CHANGELOG.md`) :
```markdown
# Changelog

## [0.2.0] - 2026-02-02

### Features
- **auth**: add login screen with email/password
- **schedule**: add filter by venue

### Bug Fixes
- **api**: handle null artist response
- **ui**: fix schedule card spacing
```

## 7. Configuration backend ASP.NET Core

Même logique, mais adapté :

### `.commitlintrc.json` (ou `.js`)
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "scope-enum": [
      2,
      "always",
      [
        "auth",
        "api",
        "wallet",
        "notifications",
        "db",
        "services",
        "controllers"
      ]
    ]
  }
}
```

Pas besoin de Husky en .NET, mais tu peux utiliser :
- **Git hooks manuels** (`.git/hooks/commit-msg`)
- **Commitizen CLI globalement** : `git cz` marche partout

## 8. Pièges courants

### Piège 1 : Scope trop générique
```
❌ feat(app): add stuff
✅ feat(schedule): add day filter
```

### Piège 2 : Description vague
```
❌ fix: fix bug
✅ fix(auth): prevent token refresh loop
```

### Piège 3 : Commits atomiques
Un commit = une modification logique
```
❌ feat: add login, fix bug, update deps
✅ feat(auth): add login screen
✅ fix(api): handle timeout
✅ chore(deps): update expo
```

### Piège 4 : Oublier le scope
Sans scope, difficile de comprendre où est le changement :
```
❌ feat: add filter
✅ feat(schedule): add venue filter
```

## 9. Résumé pratique

**Pour chaque commit** :
1. `git add .`
2. `npm run commit` (Commitizen te guide)
3. Husky valide automatiquement
4. Commit créé ✅

**Avant une release** :
1. `npm run release`
2. Changelog généré
3. Version bumpée
4. Tag Git créé
5. `git push --follow-tags`
