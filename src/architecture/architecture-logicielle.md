# Architecture logicielle

Dans les métiers de la construction, l'architecte est celui ou celle qui conçoit, en amont, **les plans nécessaires à la fabrication d'un bâtiment**. L'objectif est de partir des besoins spécifiques du client, pour arriver à **un plan détaillé des solutions possibles en utilisant son expertise métier.**

> Et bien c'est la même chose pour l'architecture logicielle !
> 

Un.e architecte logiciel va prendre en compte les besoins et les contraintes du client, mais également du projet pour proposer **la modélisation d'une solution technique qui correspondra au mieux au projet de départ.**

> Il y a néanmoins une grosse différence entre l'architecture classique et logicielle :  c'est la fréquence des changements !
> 

**Lorsque l'on construit un bâtiment, il doit être fonctionnel et robuste.** Un logiciel, lui, sera en constante évolution. C'est donc le travail de l'architecte (et des développeurs/développeuses ensuite) de **faire en sorte que la solution technique soit fonctionnelle, robuste ET évolutive !**

Pour arriver à concevoir cette architecture, il faut donc bien comprendre les enjeux du projet, mais aussi avoir **une très bonne connaissance des contraintes techniques qui peuvent impacter le fonctionnement du projet.**

Si l'architecte n'est pas censé.e implémenter la solution, il/elle doit préparer les spécifications du projet au mieux possible afin que **l'implémentation se fasse avec le moins de problèmes.**

## **Quels outils ?**

L'architecture logicielle ne se repose pas sur des plans à proprement parlé, mais plutôt sur des **langages de modélisation comprenant des outils normalisés (diagrammes)** pour concevoir une architecture de logicielle.

> Le "langage" le plus utilisé est l'UML, qui signifie "Unified Modeling Language".
> 

En UML, on retrouve **une dizaine de types de diagrammes différents**, avec chacun leur représentation et leur utilité, parmi lesquels :

- "Diagramme de Cas d'Utilisation" pour représenter l'**interaction des utilisateurs avec le logiciel**
- "Diagramme d'activité" pour modéliser un **comportement logique**
- "Diagramme de classes" pour la **structure des données**
- "Diagramme de séquence " pour modéliser l'**échange des informations**/données
- Et bien d'autre...

Voici à quoi peuvent ressembler certains de ces diagrammes UML, utilisés pour l'architecture logicielle :

Une fois le travail d'architecture logicielle terminé, **on peut alors démarrer l'implémentation** (même si une phase d'architecture est requise à chaque évolution du projet).

Attention : **Il ne faut pas confondre l'architecture logicielle avec l'architecture des systèmes d'information**, qui consiste à concevoir/planifier les serveurs, les réseaux et toute l'infrastructure d'un projet et/ou d'une entreprise !

---

## Évolution historique des architectures logicielles

## 1. Server Pages (années 1990)

**Contexte** : Débuts du web dynamique

**Principe** : Le code métier et la présentation HTML sont mélangés dans un même fichier côté serveur (PHP, ASP, JSP). Le serveur génère la page HTML complète à chaque requête.

**Besoin résolu** : Passer de pages statiques à du contenu dynamique généré selon les données et les utilisateurs.

**Limite** : Code difficile à maintenir car tout est entremêlé (logique, données, affichage).

---

## 2. Architecture Monolithique (années 1990-2000)

**Contexte** : Structuration des applications d'entreprise

**Principe** : L'application entière est un seul bloc déployé ensemble. Toutes les fonctionnalités (interface, logique métier, accès données) sont dans une même application, même si elles peuvent être organisées en couches.

**Besoin résolu** : Créer des applications structurées et complètes, plus faciles à développer et déployer que des scripts éparpillés.

**Limite** : Difficile à faire évoluer (tout redéployer pour un petit changement), problématique pour les grandes équipes, scalabilité limitée.

---

## 3. MVC - Model-View-Controller (fin années 1970, popularisé web années 2000)

**Contexte** : Besoin de séparer les responsabilités

**Principe** : Séparation en trois couches distinctes :

- **Model** : gère les données et la logique métier
- **View** : gère l'affichage
- **Controller** : fait le lien, gère les requêtes utilisateur

**Besoin résolu** : Remédier au désordre des Server Pages en séparant clairement présentation, logique et données. Permet à plusieurs développeurs de travailler en parallèle.

**Limite** : Dans les applications complexes, le Controller peut devenir trop chargé. Pas adapté pour la scalabilité distribuée.

---

## 4. SOA - Service-Oriented Architecture (années 2000)

**Contexte** : Intégration entre systèmes d'entreprise hétérogènes

**Principe** : L'application est découpée en services métier autonomes qui communiquent via des protocoles standardisés (SOAP, XML, ESB - Enterprise Service Bus).

**Besoin résolu** : Permettre à différents systèmes de communiquer et réutiliser des fonctionnalités métier. Favoriser l'interopérabilité entre applications.

**Limite** : Complexité de l'infrastructure (ESB), couplage encore présent, gouvernance lourde, performance limitée par les protocoles.

---

## 5. Microservices (début années 2010)

**Contexte** : Ère du cloud, agilité, déploiement continu

**Principe** : Découpage en petits services indépendants, chacun responsable d'une fonctionnalité métier précise. Chaque service a sa propre base de données, peut être développé, déployé et scalé indépendamment. Communication légère (REST, événements).

**Besoin résolu** : Répondre aux limites de SOA avec plus de simplicité et d'indépendance. Permettre aux équipes de travailler de façon autonome, déployer rapidement, scaler finement selon les besoins.

**Limite** : Complexité opérationnelle (orchestration, monitoring), gestion de la cohérence des données distribuées.

---

## 6. MVVM - Model-View-ViewModel (fin années 2000)

**Contexte** : Applications riches côté client (WPF, applications mobiles)

**Principe** : Évolution de MVC adaptée au data binding :

- **Model** : données métier
- **View** : interface utilisateur
- **ViewModel** : intermédiaire qui expose les données du Model dans un format adapté à la View, gère les commandes utilisateur

**Besoin résolu** : Faciliter le développement d'interfaces réactives avec liaison de données bidirectionnelle. Meilleure testabilité de la logique de présentation sans dépendre de l'UI.

**Limite** : Peut devenir complexe pour des vues simples, courbe d'apprentissage.

---

## 7. MVI - Model-View-Intent (milieu années 2010)

**Contexte** : Applications mobiles complexes, programmation réactive

**Principe** : Architecture unidirectionnelle inspirée de la programmation fonctionnelle :

- **Intent** : intentions utilisateur (actions)
- **Model** : état immutable de l'application
- **View** : affiche l'état et émet des intentions

Le flux est circulaire et unidirectionnel : Intent → Model → View → Intent

**Besoin résolu** : Rendre l'état de l'application prévisible et traçable. Faciliter le débogage et gérer la complexité des applications réactives (Android notamment).

**Limite** : Verbosité du code, courbe d'apprentissage importante.

---

## 8. Architecture Hexagonale (années 2000, par Alistair Cockburn)

**Contexte** : Besoin de découpler le métier de l'infrastructure

**Principe** : Le cœur métier (domaine) est au centre, isolé. Il est entouré de ports (interfaces) et d'adaptateurs (implémentations). Les dépendances vont toujours vers l'intérieur. Les détails techniques (base de données, framework web, API externes) sont en périphérie.

**Besoin résolu** : Rendre l'application testable indépendamment de l'infrastructure. Protéger la logique métier des changements technologiques. Faciliter le changement de base de données, de framework, etc.

**Limite** : Peut sembler sur-architecturé pour des applications simples, nécessite une discipline de conception.

---

## Synthèse de l'évolution

L'évolution montre une tendance claire :

- **Séparation des responsabilités** : du chaos initial vers des couches bien définies
- **Indépendance et testabilité** : isoler la logique pour pouvoir la tester et la modifier
- **Scalabilité** : passer d'un bloc unique à des services distribués
- **Réactivité** : gérer la complexité des interfaces modernes avec des flux de données maîtrisés

Chaque architecture a apporté une réponse à un problème spécifique de son époque, et plusieurs peuvent coexister dans un même écosystème moderne (microservices pour le backend, MVI pour le frontend mobile, architecture hexagonale au sein d'un microservice).