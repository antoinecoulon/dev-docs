# MVC

L’acronyme MVC signifie Modèle-Vue-Contrôleur (”Model-View-Controller” en anglais) et **désigne un patron d’architecture logicielle.**

Comme vous l’aurez peut-être compris, c’est une architecture qui divise un logiciel, ou une application, en trois composants principaux : **le modèle, la vue et le contrôleur.**

Ce patron est utilisé pour les logiciels possédant une interface utilisateur, mais pas forcément une interface graphique (GUI), **il est également valable pour les logiciels fonctionnant en ligne de commandes (CLI).**

On pourrait résumer cette architecture avec un simple diagramme comme celui-ci :

![MVC.jpg](https://code-garage-strapi-bucket-production.cellar-c2.services.clever-cloud.com/MVC_3d1d885667.jpg)

> Mais voyons ensemble la théorie, le rôle de chaque composant, et les avantages.
> 

## **Fonctionnement**

### **Le modèle**

> Votre modèle, c’est là que les données sont manipulées et que le stockage est géré .
> 

Si vous avez une application météo, par exemple, le modèle pourrait contenir les informations sur la température, la pression atmosphérique, les différentes infos sur l’utilisateur et sa position géographique, etc…

### **La vue**

> La vue représente ce que voient les utilisateurs avec quoi ils interagissent directement.
> 

Si nous reprenons l'exemple de l'application météo, la vue serait l'interface utilisateur affichant les prévisions, les graphiques, etc.

### **Le contrôleur**

> Le contrôleur est comme le chef d'orchestre.
> 

Il prend les commandes de l'utilisateur depuis la vue, interagit avec le modèle pour récupérer ou mettre à jour les données, puis renvoie le résultat à la vue. C'est le lien entre le modèle et la vue.

## **Les avantages**

Maintenant que nous avons une idée de ce qu'est MVC, parlons de ses avantages. Il y en a 3 principaux, qui se recoupent :

- **Séparation des préoccupations :** MVC permet de séparer clairement les responsabilités. Le modèle gère les données, la vue gère l'interface utilisateur, et le contrôleur gère la logique de l'application. **Cela rend le code plus lisible** et plus facile à entretenir.
- **Réutilisation du code :** En découpant l'application en trois composants distincts, il devient plus facile de réutiliser le code. **Vous pouvez changer la vue sans toucher au modèle**, ou vice versa.
- **Facilité de test :** Chaque composant peut être testé indépendamment. **Vous pouvez tester la logique du modèle** sans vous soucier de l'interface utilisateur, ce qui rend les tests unitaires possibles.

## **Bonne pratiques**

### **Thin Controller and Fat Models**

> En français, “contrôleur maigre et gros modèles”
> 

Comme expliqué au début de l’article, le modèle MVC est un patron d’architecture, ce qui signifie qu’il pose les bases d’une structure pour la communication entre chacun de ces éléments, mais la manière dont **chaque composant est implémenté reste de l’ordre de la pratique.**

L’une des bonnes pratiques en MVC, est de réduire au maximum le traitement de données pur effectué par le contrôleur, et de **l’implémenter au maximum dans les différents modèles de données.**

> Exemple : Dans notre application météo, l’utilisateur demande la température moyenne pour un jour spécifique.
> 

Le contrôleur pourrait récupérer les données, faire le calcul lui-même et renvoyer le résultat, mais on va privilégier le fait d’avoir ce calcul directement dans le modèle, et **le contrôleur servira simplement à faire transiter le résultat jusqu’à la vue.**

La logique métier sera implémentée dans le contrôleur, mais **la logique des données sera implémentée dans le modèle !**

## **Patron d’architecture vs Patron de conception**

On lit parfois que le modèle MVC est un patron de conception (design pattern), **mais c’est une distortion de la réalité.**

Un patron d’architecture donne une structure à plus haut niveau, et **l’implémentation sous-jacente, elle, peut effectivement faire appel à un ou plusieurs patron de conception** (ex: Singleton, State, etc…)

> Le modèle MVC est donc un patron d’architecture, et pas un patron de conception.
>