# Architecture en microservices

Le développement back-end a évolué rapidement au fil des années pour répondre aux besoins croissants **de flexibilité, de maintenabilité et de performance des applications.**

L'une des approches qui s'est imposée dans le monde du développement logiciel **est l'architecture en microservices.**

Ce modèle architectural s'oppose à l'[*architecture 3-tiers*](https://code-garage.com/blog/comprendre-l-architecture-3-tiers) plus classique, et apporte des avantages non négligeables **pour les projets de grande ampleur !**

> Mais qu'est-ce qu'un microservice, exactement ?

C’est ce que l’on va découvrir ensemble en comprenant les bases de cette architecture, **ses avantages, ses inconvénients et quelques cas d’utilisation.**

![Frame 102.png](https://code-garage-strapi-bucket-production.cellar-c2.services.clever-cloud.com/Frame_102_7c03080d23.png)

## **Définition d’un microservice**

Un microservice est **une petite application autonome qui gère un ensemble de fonctions liées à un domaine métier spécifique**, au sein d'un système plus large.

> Dans une architecture de microservices, une application complète est décomposée en une série de services indépendants.

Ces “micro”-services communiquent entre eux via le réseau, **souvent au travers du protocole HTTP** ou d’autres protocoles de messages/évènements.

Chaque microservice est conçu pour accomplir une tâche bien définie, comme :

- la gestion des utilisateurs
- la facturation
- l’authentification
- le traitement des commandes
- etc...

Contrairement à une architecture 3-tiers, où toutes ces fonctions **sont gérées par une seule base de code pour traiter la logique, et déployée sur un seul serveur.**

> Un point clé des microservices est leur indépendance.

Chaque service peut être **développé, testé, déployé et mis à jour indépendamment des autres**.

Cela permet notamment à une équipe de développement d’itérer rapidement sur une partie du logiciel sans affecter les autres parties, **mais c’est loin d’être le seul avantage de cette architecture.**

## **Les avantages des microservices**

1. **Modularité et maintenabilité** : Le principal avantage des microservices est la modularité. Chaque service est responsable d’une tâche spécifique, ce qui facilite la compréhension, la maintenance et l’évolution du code.
2. **Passage à l’échelle** : L'un des défis majeurs d'une architecture monolithique est l’évolutivité. Avec les microservices, il est possible de dimensionner individuellement chaque service en fonction de ses besoins spécifiques. Par exemple, si un service de gestion des utilisateurs reçoit plus de trafic, il peut être mis à l'échelle indépendamment des autres services.
3. **Flexibilité technologique** : Les microservices permettent aux développeurs de choisir la meilleure technologie pour chaque service. Un service peut être développé en Java, un autre en Python, et un autre encore en Node.js. Cette flexibilité permet de tirer parti des forces de chaque langage ou cadre pour les besoins spécifiques de chaque composant.
4. **Déploiement indépendant** : Comme mentionné précédemment, chaque microservice peut être déployé de manière indépendante, ce qui permet des mises à jour plus fréquentes et plus sûres. Si une partie du système échoue ou doit être modifiée, cela n'affecte pas nécessairement l’ensemble de l'application.
5. **Résilience** : Si un service tombe en panne dans une architecture de microservices, cela n'entraîne pas forcément la panne de l'ensemble de l’application. Les autres services continuent de fonctionner, ce qui rend le système global plus résilient face aux erreurs.

## **Les inconvénients des microservices**

Une architecture en microservices ne convient pas à tous les projets, notamment car **elle possède quelques défauts qui sont non-négligeables :**

1. **Complexité accrue** : Développer et maintenir une architecture de microservices peut s'avérer complexe, surtout lorsqu'il s'agit de la gestion des communications entre les services.

> Il est souvent nécessaire d'utiliser des outils supplémentaires pour orchestrer et surveiller les interactions entre les différents microservices.

1. **Gestion des données distribuées** : Chaque service peut avoir sa propre base de données, ce qui complique **la gestion des transactions et la cohérence des données** à travers les services.
2. **Débogage et traçabilité** : Déboguer un système de microservices est souvent plus difficile qu'un monolithe. Avec plusieurs services interagissant entre eux, **il peut être complexe de suivre le flux d’une requête à travers les différentes parties du système.**
3. Déploiement : Chaque microservice nécessitant des ressources et des instances indépendantes, **le déploiement peut très vite devenir complexe et les coûts d’infrastructure** peuvent augmenter par rapport à une application monolithique qui tourne sur un seul serveur.

## **Un exemple d’utilisation**

Certains géants de la tech utilisent aujourd'hui des microservices pour **assurer la scalabilité et la flexibilité de leurs systèmes.**

> C’est par exemple le cas de Netflix.

Netflix, comme toutes les autres plateformes de VOD, fait face à de très gros besoins de puissance de calcul sur des modules très spécifiques, **comme l’encodage vidéo par exemple.**

Tandis que de l’autre côté, la gestion des autres APIs comme la liste des catégories, des films, des paramètres, etc… **sont très peu gourmandes en ressources.**

L’architecture en microservices permet donc d’avoir une myriade de petits services provisionnés sur des serveurs juste assez puissants pour tenir la charge utilisateurs, et **quelques énormes services réparties sur de gigantesques datacenters pour le traitement de la vidéo !**

## **Conclusion**

Bien qu’ils apportent de nombreux avantages tels que l’évolutivité, la résilience et le passage à l’échelle de services ciblés, **les microservices introduisent également une couche de complexité à ne pas minimiser dans la gestion d’un projet.**

> Comme pour toute architecture, la décision doit être prise en fonction des contraintes et des besoins du projets, et non pas en fonction de la popularité de l’architecture en question.
