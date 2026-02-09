# Fondamentaux

## PATTERNS DE CRÉATION

> Concernent la création d'objets

| Pattern          | Problème                                  | Quand l'Utiliser                                 | Avantages                                     | Inconvénients                                                |
| ---------------- | ----------------------------------------- | ------------------------------------------------ | --------------------------------------------- | ------------------------------------------------------------ |
| Singleton        | Garantir une instance unique globale      | Pool de connexions, Cache, Logs                  | Instance unique, Accès global, Init contrôlée | État global caché, Tests difficiles, Viole SRP, Anti-pattern |
| Factory Method   | Créer objets sans spécifier classe exacte | Familles de produits, Décision basée sur logique | Découplage, OCP, Facilite tests               | Beaucoup de classes, Complexité                              |
| Abstract Factory | Créer familles d'objets liés              | UI multi-plateformes, Thèmes, Env différents     | Cohérence produits, Isolation classes         | Rigide, Complexe                                             |
| Builder          | Construire objets complexes par étapes    | Nombreux paramètres, Constructions multiples     | Contrôle processus, Code lisible, Fluent API  | Plus de code, Peut être surdimensionné                       |
| Prototype        | Créer objets par clonage                  | Coût création élevé, Instances similaires        | Performance, Réduit sous-classes              | Clonage profond complexe, Refs circulaires                   |

| Pattern          | Exemple en C# / .NET                            |
| ---------------- | ----------------------------------------------- |
| Singleton        | Pool connexions BD, Config (préférer DI)        |
| Factory Method   | ILogger (FileLogger, ConsoleLogger, DbLogger)   |
| Abstract Factory | UI Kit (Windows vs Mac : Button, TextBox, Menu) |
| Builder          | StringBuilder, HttpClient, FluentValidation     |
| Prototype        | Clonage objets métier, Cache objets             |

## PATTERNS DE STRUCTURE

Concernent la composition de classes et d'objets

| Pattern   | Problème                                        | Quand l'Utiliser                                       | Avantages                                 | Inconvénients                           |
| --------- | ----------------------------------------------- | ------------------------------------------------------ | ----------------------------------------- | --------------------------------------- |
| Adapter   | Rendre compatibles interfaces incompatibles     | Intégration bibliothèques tierces, Legacy              | Réutilisation code, SRP, OCP              | Complexité, Masque problèmes conception |
| Bridge    | Séparer abstraction et implémentation           | Variations 2 dimensions, Éviter explosion sous-classes | Découplage, Extensibilité                 | Complexité, Over-engineering            |
| Composite | Traiter uniformément objets et compositions     | Structures arborescentes, Hiérarchies partie-tout      | Uniformité client, Ajout facile           | Difficile restreindre, Généralise trop  |
| Decorator | Ajouter responsabilités dynamiquement           | Extension fonctionnalités, Alternative héritage        | Flexibilité, Ajout/retrait dynamique, SRP | Nombreux objets, Ordre important        |
| Facade    | Interface simplifiée pour sous-système complexe | Système complexe, Découplage sous-systèmes             | Simplicité client, Découplage, Couches    | Risque God Object, Masque trop          |
| Flyweight | Partager efficacement objets similaires         | Grand nombre objets, Mémoire limitée                   | Économie mémoire, Performance             | Complexité état intrinsèque/extrinsèque |
| Proxy     | Contrôler accès à un objet                      | Lazy loading, Contrôle accès, Logging, Cache           | Contrôle sans modifier objet, OCP         | Latence, Complexité                     |

| Pattern   | Exemple en C# / .NET                                          |
| --------- | ------------------------------------------------------------- |
| Adapter   | Wrapper services REST, Bibliothèques externes                 |
| Bridge    | Drivers BD (MySQL, PostgreSQL) avec abstraction               |
| Composite | Système fichiers, DOM HTML, Organisation entreprise           |
| Decorator | Streams (FileStream > BufferedStream), Middleware ASP.NET     |
| Facade    | API unifiée paiement (Stripe, PayPal)                         |
| Flyweight | Rendu caractères éditeur, Pool objets, Cache tuiles jeu       |
| Proxy     | Entity Framework (Lazy Loading), `Lazy<T>`, Services distants |

## PATTERNS COMPORTEMENTAUX

Concernent la communication entre objets

| Pattern         | Problème                                     | Quand l'Utiliser                              | Avantages                                | Inconvénients                        |
| --------------- | -------------------------------------------- | --------------------------------------------- | ---------------------------------------- | ------------------------------------ |
| Observer        | Notifier automatiquement dépendants          | Relations 1-N, Événements, MVC/MVVM           | Couplage faible, Communication dynamique | Ordre non garanti, Fuites mémoire    |
| Strategy        | Définir famille algorithmes interchangeables | Algorithmes multiples, Éliminer conditionnels | Interchangeables, Élimine if/else, OCP   | Clients doivent connaître stratégies |
| Command         | Encapsuler requête comme objet               | Paramétrer opérations, Undo/Redo, Logging     | Découplage, Composable, Historique       | Nombreuses classes                   |
| State           | Modifier comportement selon état interne     | Comportement dépend état, Machines à états    | États organisés, Transitions explicites  | Complexe si peu d'états              |
| Template Method | Squelette d'algorithme, déléguer détails     | Algorithme avec variations, Code commun       | Réutilisation, Contrôle algorithme       | Héritage requis, Peut violer Liskov  |

| Pattern         | Exemple en C# / .NET                                          |
| --------------- | ------------------------------------------------------------- |
| Observer        | Events C#, `IObservable<T>`, WPF Binding, Reactive Extensions |
| Strategy        | Algorithmes tri, Validation données, Calcul prix (promos)     |
| Command         | Undo/Redo, Transactions, Task scheduling, Boutons UI          |
| State           | Workflow commande (Attente > Validée > Expédiée)              |
| Template Method | Pipeline traitement données, Tests (Setup/Teardown)           |

| Pattern                 | Problème                                    | Quand l'Utiliser                              | Avantages                                       | Inconvénients                                |
| ----------------------- | ------------------------------------------- | --------------------------------------------- | ----------------------------------------------- | -------------------------------------------- |
| Chain of Responsibility | Passer requête le long d'une chaîne         | Plusieurs objets traitent requête             | Couplage réduit, Flexibilité                    | Réception non garantie, Difficile déboguer   |
| Iterator                | Parcourir collection sans exposer structure | Accès séquentiel, Structures complexes        | Encapsulation structure, Plusieurs parcours     | Over-engineering pour collections simples    |
| Mediator                | Centraliser communications complexes        | Interactions complexes, Réduire couplage      | Couplage réduit, Centralisé                     | Mediator peut devenir complexe               |
| Memento                 | Sauvegarder/restaurer état objet            | Undo/Redo, Snapshots                          | Encapsulation état, Restauration simple         | Coût mémoire, Sérialisation complexe         |
| Visitor                 | Séparer algorithmes de structure objets     | Opérations sur structure, Classes différentes | Nouvelles opérations faciles, Logique regroupée | Ajout classes difficile, Brise encapsulation |
| Interpreter             | Interpréter langage ou expressions          | Grammaire simple, DSL                         | Grammaire modifiable, Extensible                | Inefficace si complexe, Performance limitée  |

| Pattern                 | Exemple en C# / .NET                                       |
| ----------------------- | ---------------------------------------------------------- |
| Chain of Responsibility | Middleware ASP.NET, Validation cascade, Support client     |
| Iterator                | `IEnumerable<T>`, yield return, Parcours arbres/graphes    |
| Mediator                | MediatR (CQRS), Contrôleur UI, Chat room                   |
| Memento                 | Éditeur texte (Undo/Redo), Sauvegarde jeu                  |
| Visitor                 | Compilation (AST), Export données (JSON, XML, CSV)         |
| Interpreter             | Regex, Moteurs règles métier, Calculatrices, Parsers SQL   |

## Tableau de Décision Rapide

### Par Problématique

| Vous Voulez...                              | Pattern à Utiliser               |
| ------------------------------------------- | -------------------------------- |
| Une seule instance globale                  | Singleton (préférer DI)          |
| Créer objets sans spécifier type            | Factory Method, Abstract Factory |
| Construire objets complexes par étapes      | Builder                          |
| Cloner objets                               | Prototype                        |
| Adapter interface incompatible              | Adapter                          |
| Séparer abstraction/implémentation          | Bridge                           |
| Traiter objets et compositions uniformément | Composite                        |
| Ajouter responsabilités dynamiquement       | Decorator                        |
| Simplifier interface complexe               | Facade                           |
| Économiser mémoire objets similaires        | Flyweight                        |
| Contrôler accès objet                       | Proxy                            |
| Notifier automatiquement dépendants         | Observer                         |
| Changer algorithme à la volée               | Strategy                         |
| Encapsuler requêtes comme objets            | Command                          |
| Changer comportement selon état             | State                            |
| Déléguer traitement dans chaîne             | Chain of Responsibility          |
| Parcourir collection                        | Iterator                         |
| Centraliser communications                  | Mediator                         |
| Sauvegarder/restaurer état                  | Memento                          |
| Définir squelette algorithme                | Template Method                  |
| Ajouter opérations sans modifier classes    | Visitor                          |
| Interpréter langage                         | Interpreter                      |

## Patterns par Fréquence d'Utilisation

### 🔥 Très Fréquents (Essentiels)

| Pattern        | Technologies C# / .NET                         | Importance |
| -------------- | ---------------------------------------------  | ---------- |
| Observer       | Events, `IObservable<T>`, Reactive Extensions  | *****      |
| Strategy       | Validation, Business Rules, LINQ               | *****      |
| Factory Method | Dependency Injection, Service Locator          | *****      |
| Decorator      | Middleware ASP.NET, Streams                    | *****      |
| Adapter        | Intégration services tiers                     | *****      |

### 🔶 Fréquents (Importants)

| Pattern         | Technologies C# / .NET                      | Importance |
| --------------- | ------------------------------------------- | ---------- |
| Builder         | StringBuilder, HttpClient, FluentValidation | ****       |
| Command         | MediatR (CQRS), Task Parallel Library       | ****       |
| Facade          | APIs unifiées, Service Layer                | ****       |
| Proxy           | Entity Framework, Castle DynamicProxy       | ****       |
| Template Method | Base classes abstraites, Frameworks         | ****       |

### 🔵 Occasionnels (Utiles)

| Pattern                 | Technologies C# / .NET            | Importance |
| ----------------------- | --------------------------------- | ---------- |
| Singleton               | DI avec AddSingleton (préférer)   | ***        |
| State                   | Workflow Engines                  | ***        |
| Composite               | UI Components, File Systems       | ***        |
| Chain of Responsibility | ASP.NET Core Middleware           | ***        |
| Iterator                | `IEnumerable<T>`, yield           | ***        |

### 🔹 Rares (Spécialisés)

| Pattern          | Technologies C# / .NET           | Importance |
| ---------------- | -------------------------------- | ---------- |
| Abstract Factory | Multi-plateforme, Themes         | **         |
| Bridge           | Drivers, Abstraction Layer       | **         |
| Flyweight        | String interning, Object pooling | **         |
| Mediator         | MediatR, Message Bus             | **         |
| Memento          | Undo/Redo systems                | **         |
| Prototype        | Deep cloning                     | **         |
| Visitor          | Compilateurs, AST                | *          |
| Interpreter      | Expression parsers               | *          |

## Combinaisons Fréquentes de Patterns

| Combinaison                       | Cas d'Usage                        | Exemple Concret                  |
| --------------------------------- | ---------------------------------- | -------------------------------- |
| Factory + Singleton               | Créer et gérer instance unique     | Configuration Manager            |
| Observer + Mediator               | Événements centralisés             | Event Bus, MediatR               |
| Strategy + Factory                | Sélection algorithme dynamique     | Calcul prix avec règles métier   |
| Command + Memento                 | Undo/Redo avec historique          | Éditeur de texte                 |
| Decorator + Strategy              | Pipeline traitement flexible       | Middleware + Routing             |
| Composite + Iterator              | Parcours hiérarchies               | Système de fichiers              |
| Proxy + Decorator                 | Contrôle accès avec enrichissement | Logging + Caching autour service |
| Builder + Prototype               | Construction avec modèles          | Génération configurations        |
| Chain of Responsibility + Command | Pipeline de commandes              | Validation en cascade            |

## Patterns et Principes SOLID

| Principe SOLID        | Patterns Conformes                            |
| --------------------- | --------------------------------------------- |
| Single Responsibility | Strategy, Command, State, Visitor             |
| Open/Closed           | Strategy, Decorator, Template Method, Factory |
| Liskov Substitution   | Factory Method, Abstract Factory, Strategy    |
| Interface Segregation | Adapter, Facade                               |
| Dependency Inversion  | Factory, Strategy, Observer, Command          |

## Aide-Mémoire pour le titre EADL

### C1 - Veille Technologique

Patterns émergents à surveiller :

- **Event Sourcing** (évolution de Command + Memento)
- **CQRS** (Command + Strategy)
- **Saga Pattern** (Chain of Responsibility distribué)

### C4 - Conception d'Architecture

Patterns essentiels pour la conception :

- **Factory** pour l'extensibilité
- **Strategy** pour les variations
- **Observer** pour la réactivité
- **Facade** pour la simplification

### C16-C18 - CI/CD et DevSecOps

Patterns dans les pipelines :

- **Chain of Responsibility** (étapes de build)
- **Command** (tâches de déploiement)
- **Strategy** (environnements différents)

### C19 - Clean Code

Patterns favorisant la maintenabilité :

- **Strategy** > if/else multiples
- **Command** > méthodes avec nombreux paramètres
- **Factory** > new disséminés
- **Observer** > callback hell

## Conclusion Pratique

**Règles d'Or :**

1. **Ne pas forcer les patterns** - Si la solution simple fonctionne, utilisez-la
2. **Comprendre le problème** - Avant d'appliquer un pattern
3. **Privilégier la composition** - Combiner patterns simples plutôt qu'en créer de complexes
4. **Tester** - Les patterns doivent faciliter les tests, pas les compliquer
5. **Documenter** - Expliquer pourquoi un pattern a été choisi

**Pour votre préparation :**

- Maîtrisez parfaitement les 5 patterns très fréquents (Observer, Strategy, Factory, Decorator, Adapter)
- Comprenez bien les 5 patterns fréquents (Builder, Command, Facade, Proxy, Template Method)
- Connaissez l'existence et le principe des autres pour les reconnaître
