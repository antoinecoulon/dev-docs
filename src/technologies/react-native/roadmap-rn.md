# Roadmap d'apprentissage React Native

> En lien avec le projet Westill App

## Phase 1 : Fondations

- [x]  Setup environnement complet
- [x]  Créer le projet Expo avec TypeScript
- [x]  Comprendre les composants de base (`View`, `Text`, `Image`, `ScrollView`, `FlatList`)
- [x]  Maîtriser les hooks essentiels (`useState`, `useEffect`, `useMemo`)
- [x]  Implémenter la navigation avec Expo Router
- [x]  Créer un écran statique pour chaque onglet

**Exercice :** Afficher une liste d'artistes mockée avec navigation vers une page détail. (DONE)

## Phase 2 : Améliorations Frontend (2-3 semaines)

- [x]  Favoris (stockage local)
- [x]  Custom Hooks -- extraire de la logique réutilisable
- [x]  Context API -- partager un état sans prop drilling
- [x]  AsyncStorage -- persister des données localement
- [x]  Filtres avancés -- combiner état, mémoïsation et UX

**Exercice :** Filtrer la prog par scène avec état persisté. (DONE)

## Phase 3 : Intégration API (1-2 semaines)

- [ ]  Setup / Mettre en place le backend
- [ ]  Créer les endpoints côté ASP.NET Core (CRUD artistes, programme)
- [ ]  Configurer Axios + TanStack Query
- [ ]  Fetcher et afficher les données réelles
- [ ]  Gérer les états loading/error
- [ ]  Implémenter le pull-to-refresh

**Exercice :** Programmation temps réel avec rafraîchissement automatique.

## Phase 4 : Notifications & Offline (1-2 semaines)

- [ ]  Setup Expo Notifications
- [ ]  Intégrer les push côté [ASP.NET](http://asp.net/) Core (Firebase Admin SDK)
- [ ]  Notifications locales (rappel avant concert favori)
- [ ]  Mode offline basique (cache TanStack Query)

## Phase 5 : Cashless (2-3 semaines)

- [ ]  Authentification (JWT)
- [ ]  Intégration prestataire paiement (dépend du partenaire cashless du festival)
- [ ]  Écran solde + historique
- [ ]  Rechargement (redirection web ou in-app selon prestataire)

## Phase 6 : Production (1-2 semaines)

- [ ]  Configuration EAS Build (Android + iOS)
- [ ]  Tests sur devices réels
- [ ]  Optimisation performances (pourquoi c'est lent ?)
- [ ]  Déploiement stores (Google Play + App Store)

## Backlog post-MVP

- [ ]  Plan du festival (image zoomable ou carte interactive)
- [ ]  Evaluer l'app dans Informations
