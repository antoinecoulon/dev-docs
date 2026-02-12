# Introduction

## Comment fonctionne React Native

Pour faire face aux problèmes que peuvent apporter le développement d'applications Swift / Kotlin (deux développement pour une app, budget, temps) et PWA (Progressive Web Apps, performances plus faibles), React Native a vu le jour.

![native](./assets/native-apps.png)

On écrit du code React Native, qui est ensuite transformé via un bridge en code natif Android, IOS ou même Web.

![bridge](./assets/bridge.png)

## Expo

[Voir la documentation officielle](https://docs.expo.dev/)

Expo est un client qui va nous permettre d'initialiser une application React Native. Il est aussi possible d'utiliser le CLI React Native standard, mais Expo apporte quelques fonctionnalités pratiques et reste le plus utilisé.

![expo](./assets/expo.png)

Expo permet aussi d'accéder à [Expo Snack](https://snack.expo.dev/) qui est un environnement playground pour écrire son code React Native et le tester sur des émulateurs ou son propre device.

## Rappels (React)

### Props

Comme avec React, il est possible de passer des propriétés, appelées props, à un composant depuis son composant parent.

```tsx
<PersonComponent 
  lastName={"Doe"}
  firstName={"John"}
  age={18}
/>
```

Ensuite ses props peuvent être réutilisées dans le composant enfant (ici: `PersonComponent`):

```tsx
export default function PersonComponent(props) {
  <Text>
    { props.firstName } { props.lastName } - { props.age }
  </Text>
}

// Ou avec la destructuration:
export default function PersonComponent({ lastName, firstName, age }) {
  <Text>
    { firstName } { lastName } - { age }
  </Text>
}
```

`children` est une prop spéciale qui permet de pointer vers un composant imbriqué dans le composant enfant:

```tsx
<PersonComponent>
  <Image />
</PersonComponent>

// Dans le composant:
export default function PersonComponent({ children }) {
  <View>
    { children } {/* Sera remplacé par le composant Image */}
  </View>
}
```

> Les props avec un état provoqueront le re-render du composant si elles changent.

### Conditional rendering

Exemples:

```tsx
{ age > 18 ? "Tu es majeur" : "Tu n'es pas majeur !" }

{isHappy && <DisplayHappy />}
```

### State

```tsx
const [age, setAge] = useState(30)

// Ne fonctionne pas:
age = age + 1 // Pas de re-render

// Infinite loops
setAge(age + 1) // Re-render composant, relance la fonction, setAge à nouveau, re-render...

// Faire:
const addYear = () => {
  setAge(age + 1) // Le composant re-render !
}
```

> Il est tout a fait possible de passer un state à un composant enfant dans ses props.

Un changement de state, comme un changement de props, provoque le re-rendering du composant.
