# Clean Architecture

## Le principe général

L'Architecture Clean organise le code en couches concentriques, comme des poupées russes. La règle d'or : **les flèches de dépendance pointent toujours vers l'intérieur**. Les couches internes ne connaissent jamais les couches externes.

## Les couches, du centre vers l'extérieur

### 1. **Entities (Entités)** - Le cœur jaune

Ce sont tes objets métier fondamentaux. Par exemple, dans une app de e-commerce : User, Product, Order. Ces entités contiennent la logique métier la plus stable, qui ne change jamais selon la technologie utilisée.

### 2. **Use Cases (Cas d'usage)** - La couche rouge

Ce sont les actions que ton application peut faire : "Créer un utilisateur", "Passer une commande", "Calculer le prix total". Chaque use case orchestre les entités pour accomplir une tâche métier précise.

### 3. **Controllers & Presenters** - La couche verte

- **Controllers** : Reçoivent les requêtes (HTTP, CLI, etc.) et appellent les use cases appropriés
- **Presenters** : Formatent les données pour l'affichage (JSON, HTML, etc.)
- **Gateways** : Interfaces pour accéder aux données externes (base de données, APIs)

### 4. **External Interfaces** - La couche bleue

Tout ce qui est "technique" : Web, UI, Base de données, Frameworks, Devices. Ces éléments peuvent changer sans affecter le cœur métier.

## Le diagramme de flux (à droite)

Montre comment une requête voyage :

1. **Controller** reçoit la requête
2. Appelle le **Use Case** via l'**Input Port**
3. Le **Use Case Interactor** traite la logique
4. Retourne le résultat via l'**Output Port**
5. Le **Presenter** formate la réponse

## Pourquoi c'est utile ?

- **Testabilité** : Tu peux tester ton métier sans base de données
- **Flexibilité** : Changer de framework n'impacte pas ton cœur métier
- **Maintenabilité** : Chaque couche a sa responsabilité claire
- **Indépendance** : Ton métier ne dépend d'aucune technologie

En résumé : garde ton métier au centre, protégé des détails techniques qui changent souvent !
