# Architecture 3-tiers

L'architecture 3-tiers est **un modèle de conception logicielle** qui sépare une application en trois couches distinctes :

- la **présentation**
- la **logique** métier
- la gestion des **données**

> C’est un modèle qu’on retrouve très souvent dans le développement web et logiciel !
> 

---

L'architecture 3-tiers est tout simplement **une évolution des architectures monolithiques** et 2-tiers.

Dans une architecture monolithique (en un seul bloc), **toutes les fonctionnalités de l'application, et ses dépendances, sont intégrées dans un seul programme**, ce qui peut rendre la maintenance et l'évolution du système difficiles.

> Imaginez un programme qui va tout gérer, et stocker les données directement dans les fichiers du système par exemple.
> 

**L'architecture 2-tiers, quant à elle, sépare l'application en deux couches** : la présentation et la gestion des données. C’est mieux, mais cette approche peut encore **poser des problèmes de couplage entre les composants, voir de sécurité en fonction du projet.**

L'architecture 3-tiers résout ces problèmes en introduisant **une couche intermédiaire dédiée à la logique métier**, ce qui permet de mieux organiser le code et de faciliter les modifications et les extensions.

> En général, on va souvent parler de client, serveur et base de données.
> 

![image.png](attachment:a999297a-c243-489e-a11d-a3c823873bbc:image.png)

### **Les trois couches de l'architecture**

1. **Couche de Présentation** :
    - La couche de présentation est l'interface utilisateur de l'application.
    - Elle est responsable de l'affichage des données et de l'interaction avec l'utilisateur.

> Objectif : Fournir une expérience utilisateur fluide et intuitive.
> 
1. **Couche de Logique Métier** :
    - La couche de logique métier est le cœur de l'application.
    - Elle contient les règles et les processus qui définissent le fonctionnement de l'application.

> Objectif : Traiter les données et appliquer les règles métier.
> 
1. **Couche de Gestion des Données** :
    - La couche de gestion des données est responsable du stockage et de la récupération des données.
    - Technologies utilisées : Bases de données relationnelles (MySQL, PostgreSQL) ou non relationnelles (MongoDB, Cassandra).

> Objectif : Assurer l'intégrité et la sécurité des données.
> 

### **Les avantages de cette architecture**

- **Modularité** : Développement, tests et déploiement indépendants de chaque couche.
- **Maintenabilité** : Réduction des risques d'introduction de bugs lors des modifications.
- **Évolutivité** : Évolution indépendante de chaque couche en fonction des besoins.
- **Sécurité** : Meilleur contrôle des accès aux données et renforcement de la sécurité.

## **Différence entre l'architecture 3-Tiers et le MVC**

Même si l'architecture 3-tiers et [*le modèle MVC*](https://code-garage.com/blog/comprendre-l-architecture-modele-vue-controleur-mvc) (modèle-vue-contrôleur) **partagent des similitudes en termes de séparation des préoccupations**, ils sont bien différents.

L'architecture 3-tiers se concentre sur la séparation physique des composants d'une application en trois couches distinctes : présentation, logique métier et gestion des données.

> Cette séparation permet de déployer chaque couche sur des serveurs différents, notamment pour améliorer l'évolutivité et la performance.
> 

En revanche, **le modèle MVC est un patron de conception logicielle** qui sépare un logiciel en trois composants interconnectés :

- le Modèle (données et logique métier)
- la Vue (interface utilisateur)
- le Contrôleur (gestion des interactions utilisateur).

> Contrairement à l'architecture 3-tiers, le MVC ne nécessite pas une séparation physique des composants et peut être implémenté au sein d'un même logiciel.
> 

En résumé : Les deux approches peuvent être complémentaires, avec une architecture 3-tiers utilisée pour structurer **les composants à un niveau macro**, tandis que le MVC organise **le code au niveau micro.**