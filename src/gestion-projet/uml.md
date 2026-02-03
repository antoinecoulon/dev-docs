# UML

UML est un langage de modélisation standardisé qui permet de visualiser, spécifier, construire et documenter les artefacts d'un système logiciel. Les diagrammes UML se divisent en deux grandes catégories : les diagrammes de comportement (qui montrent ce que fait le système) et les diagrammes structurels (qui montrent comment le système est organisé).

# Diagrammes de comportement

### Diagramme de Cas d'Utilisation

**Explication simple**

Ce diagramme montre qui utilise le système (les acteurs) et ce qu'ils peuvent faire avec (les cas d'utilisation). C'est la vue "utilisateur" du système. On y représente des acteurs (bonhommes bâton), des cas d'utilisation (ovales) et les relations entre eux.

**Exemple courant**

Pour une application de bibliothèque en ligne :

- Acteurs : Lecteur, Bibliothécaire
- Cas d'utilisation : "Emprunter un livre", "Rechercher un livre", "Retourner un livre"
- Relations : Le Lecteur peut "Emprunter un livre" et "Rechercher un livre", tandis que le Bibliothécaire peut "Ajouter un livre" et "Gérer les emprunts"

**Application professionnelle**

Dans un système bancaire, ce diagramme permet de capturer toutes les interactions entre les différents acteurs (Client, Conseiller, Administrateur système, Système de paiement externe) et les fonctionnalités métier. Cela sert de base contractuelle avec le client et guide l'ensemble du développement. Par exemple, le cas d'utilisation "Effectuer un virement" peut inclure les extensions comme "Vérifier la provision" et "Notifier le bénéficiaire", et être relié au cas "S'authentifier" via une relation d'inclusion.

---

### Diagramme de Séquence

**Explication simple**

Ce diagramme montre comment les objets communiquent entre eux dans le temps, de haut en bas. Chaque objet a une ligne verticale (ligne de vie), et les messages qu'ils s'envoient sont représentés par des flèches horizontales. On lit le diagramme de haut en bas pour suivre l'ordre chronologique.

**Exemple courant**

Pour commander une pizza en ligne :

1. Le Client envoie "passerCommande()" au Système
2. Le Système envoie "vérifierDisponibilité()" au Stock
3. Le Stock répond "disponible"
4. Le Système envoie "effectuerPaiement()" à la Banque
5. La Banque répond "paiementValidé"
6. Le Système envoie "confirmerCommande()" au Client

**Application professionnelle**

Dans une architecture microservices pour un e-commerce, le diagramme de séquence permet de documenter précisément les flux d'appels entre services. Par exemple, lors d'une transaction d'achat, on peut modéliser l'orchestration entre le service de Commande, le service d'Inventaire, le service de Paiement, le service de Livraison et le service de Notification. Cela permet d'identifier les points de défaillance potentiels, les besoins en gestion d'erreur asynchrone, et d'optimiser les temps de réponse. C'est particulièrement utile pour documenter les transactions distribuées et implémenter des patterns comme le Saga Pattern.

---

### Diagramme d'Activité

**Explication simple**

Ce diagramme ressemble à un organigramme amélioré. Il montre le flux d'exécution d'un processus, avec des décisions (losanges), des actions (rectangles arrondis), des points de départ (cercle plein) et de fin (cercle dans un cercle). Il peut aussi montrer des activités qui se passent en parallèle.

**Exemple courant**

Processus de validation d'un formulaire en ligne :

1. Début
2. Remplir le formulaire
3. Décision : Tous les champs sont-ils remplis ?
    - Non → Afficher message d'erreur → Retour au remplissage
    - Oui → Valider le format des données
4. Décision : Les données sont-elles valides ?
    - Non → Afficher message d'erreur → Retour au remplissage
    - Oui → Enregistrer les données
5. Fin

**Application professionnelle**

Dans un pipeline CI/CD, ce diagramme permet de modéliser l'ensemble du processus de déploiement continu. On peut représenter les activités parallèles (tests unitaires, tests d'intégration, analyse de code statique qui s'exécutent simultanément), les points de décision (le code passe-t-il tous les tests ?), les swimlanes pour identifier les responsabilités (développeur, système CI, environnement de staging, production). Cela permet d'optimiser le workflow, d'identifier les goulots d'étranglement et de documenter les stratégies de rollback. C'est également utile pour modéliser les processus métier complexes dans le cadre du BPM (Business Process Management).

---

### Diagramme d'État-Transition

**Explication simple**

Ce diagramme montre les différents états dans lesquels un objet peut se trouver et comment il passe d'un état à un autre (les transitions). Chaque transition est déclenchée par un événement. C'est comme une machine à états.

**Exemple courant**

États d'une commande en ligne :

- État initial : Panier
- Transitions :
    - Panier → En attente de paiement (événement : valider le panier)
    - En attente de paiement → Payée (événement : paiement réussi)
    - En attente de paiement → Annulée (événement : paiement échoué)
    - Payée → En préparation (événement : commande prise en charge)
    - En préparation → Expédiée (événement : colis envoyé)
    - Expédiée → Livrée (événement : réception confirmée)

**Application professionnelle**

Dans une application de gestion de workflow documentaire, le diagramme d'état-transition modélise le cycle de vie complet d'un document : Brouillon → En révision → Approuvé → Publié → Archivé, avec des transitions conditionnelles et des actions associées à chaque changement d'état. Cela permet d'implémenter un pattern State ou State Machine robuste dans le code, de gérer les droits d'accès selon l'état, et d'assurer la traçabilité réglementaire. C'est particulièrement critique dans les domaines soumis à conformité (pharmaceutique, finance) où chaque transition doit être auditable et potentiellement réversible selon des règles métier strictes.

# Diagrammes structurels

### Diagramme de Classes

**Explication simple**

C'est le diagramme le plus utilisé en UML. Il montre les classes du système (rectangles divisés en trois parties : nom, attributs, méthodes) et les relations entre elles (association, héritage, composition, agrégation). C'est la vue statique de la structure du code.

**Exemple courant**

Système de gestion de bibliothèque :

`Classe Livre
- titre : String
- auteur : String
- ISBN : String
+ emprunter()
+ retourner()

Classe Emprunt
- dateEmprunt : Date
- dateRetour : Date
+ calculerRetard()

Classe Lecteur
- nom : String
- numeroLecteur : int
+ emprunterLivre()`

Relations : Un Lecteur peut avoir plusieurs Emprunts (1..*), chaque Emprunt concerne un Livre (1..1).

**Application professionnelle**

Dans une architecture hexagonale (Clean Architecture), le diagramme de classes permet de modéliser clairement la séparation entre les couches Domain (entités métier), Application (cas d'utilisation), Infrastructure (adapters) et Presentation. On peut représenter les interfaces des ports, les implémentations des adapters, et les dépendances entre couches avec le principe d'inversion de dépendance. Cela facilite la communication avec l'équipe sur les patterns appliqués (Repository, Factory, Strategy), aide à maintenir le principe SOLID, et sert de référence pour le refactoring. Ce diagramme est essentiel pour documenter les décisions architecturales et évaluer l'impact des modifications sur le couplage et la cohésion du système.

---

### Diagramme de Composants

**Explication simple**

Ce diagramme montre les composants logiciels du système (modules, bibliothèques, fichiers exécutables) et comment ils dépendent les uns des autres. Un composant est représenté par un rectangle avec un petit symbole de composant dans le coin. Les dépendances sont des flèches pointillées.

**Exemple courant**

Application web simple :

- Composant "Interface Utilisateur" (HTML/CSS/JS)
- Composant "API REST" (contrôleurs)
- Composant "Logique Métier" (services)
- Composant "Accès aux Données" (DAO/Repository)
- Composant "Base de données"

L'Interface Utilisateur dépend de l'API REST, qui dépend de la Logique Métier, qui dépend de l'Accès aux Données, qui dépend de la Base de données.

**Application professionnelle**

Dans un système distribué complexe, ce diagramme permet de cartographier l'architecture technique complète : services frontend (React, Angular), API Gateway, services backend (microservices métier), services transverses (authentification, logging, monitoring), message brokers (Kafka, RabbitMQ), bases de données (SQL, NoSQL), caches (Redis), systèmes externes. On peut y représenter les interfaces exposées et consommées, les protocoles de communication (REST, gRPC, WebSocket), et identifier les dépendances circulaires à éliminer. C'est crucial pour planifier la stratégie de déploiement, évaluer l'impact d'une panne d'un composant, et mettre en place une architecture résiliente avec des circuit breakers. Ce diagramme guide également les décisions sur la conteneurisation et l'orchestration (Docker, Kubernetes).

---

### Diagramme de Déploiement

**Explication simple**

Ce diagramme montre comment les composants logiciels sont déployés sur le matériel (serveurs, ordinateurs, appareils). On y voit les nœuds (machines physiques ou virtuelles), les artefacts (fichiers déployés) et les connexions réseau entre les nœuds.

**Exemple courant**

Application web classique à trois niveaux :

- Nœud "Navigateur Client" (ordinateur utilisateur) contenant l'application web
- Nœud "Serveur Web" (serveur Apache/Nginx) contenant les fichiers statiques
- Nœud "Serveur d'Application" (serveur Tomcat/Node.js) contenant l'API
- Nœud "Serveur de Base de Données" (serveur MySQL/PostgreSQL) contenant la base de données

Connexions : HTTP/HTTPS entre Client et Serveur Web, HTTP entre Serveur Web et Serveur d'Application, TCP/IP entre Serveur d'Application et Serveur de Base de Données.

**Application professionnelle**

Dans une architecture cloud moderne multi-région, ce diagramme modélise l'infrastructure complète : régions géographiques, availability zones, VPC (Virtual Private Cloud), sous-réseaux, load balancers, clusters Kubernetes, pods, instances EC2/VM, CDN, services managés (RDS, S3, Lambda), firewall/WAF, et leurs interconnexions. On peut représenter la stratégie de haute disponibilité, la répartition de charge, les mécanismes de failover, et la configuration réseau (routing, security groups). C'est essentiel pour documenter la conformité RGPD (localisation des données), optimiser les coûts cloud (placement des ressources), planifier la disaster recovery, et identifier les single points of failure. Dans un contexte DevOps/Infrastructure as Code, ce diagramme complète les configurations Terraform ou CloudFormation en fournissant une vue d'ensemble compréhensible par les non-techniciens.

---

### Diagramme de Paquetage

**Explication simple**

Ce diagramme organise les éléments du système en paquetages (packages) logiques, comme des dossiers. Il montre comment le code est structuré en modules et les dépendances entre ces modules. Un paquetage est représenté par un rectangle avec un petit onglet en haut.

**Exemple courant**

Organisation d'une application Java/Spring :

- Paquetage "com.entreprise.monapp"
    - Sous-paquetage "controller" (contrôleurs REST)
    - Sous-paquetage "service" (logique métier)
    - Sous-paquetage "repository" (accès aux données)
    - Sous-paquetage "model" (entités)
    - Sous-paquetage "config" (configuration)

Le paquetage "controller" dépend de "service", qui dépend de "repository" et "model".

**Application professionnelle**

Dans une application enterprise de grande taille, ce diagramme structure l'architecture en domaines métier (Domain-Driven Design) et modules techniques. Par exemple, dans un système bancaire : paquetages "gestion-compte", "gestion-credit", "gestion-client", "virements", chacun avec sa propre architecture en couches (domain, application, infrastructure). On peut représenter les dépendances entre bounded contexts, identifier les modules anti-corruption layer, et visualiser les shared kernels. Cela permet de définir une stratégie de modularisation en microservices ou en architecture modulaire monolithique, de planifier la migration progressive d'un legacy system, et d'établir des règles de gouvernance architecturale (quels modules peuvent communiquer entre eux). Le diagramme de paquetage est également utilisé pour documenter la structure des APIs publiques d'une bibliothèque ou framework, facilitant ainsi l'onboarding des nouveaux développeurs.