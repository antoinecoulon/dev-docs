# `C#`

## Introduction au langage `C#`

- C# est un langage orienté objet avec une syntaxe claire, supportant variables, types valeur et référence, opérateurs, structures de contrôle, fonctions, classes, héritage, polymorphisme et interfaces.
- La CLI .NET permet de créer divers projets : applications console (`dotnet new console`), API web (`dotnet new webapi`), applications mobiles (`dotnet new maui`), bibliothèques (`dotnet new classlib`) et tests unitaires (`dotnet new mstest` ou `xunit`).
- Les architectures logicielles courantes incluent l’architecture en couches, MVC et microservices, chacune adaptée à des besoins spécifiques de maintenabilité, évolutivité et distribution.
- Les bonnes pratiques couvrent la gestion des erreurs, la performance (ex. `StringBuilder`, LINQ optimisé, asynchronisme), la sécurité, les conventions de nommage (PascalCase, camelCase) et l’utilisation d’outils modernes.

## Concepts et syntaxe

### Variables et Types de Données

Les variables en C# sont des conteneurs pour stocker des données. Elles doivent être déclarées avec un type précis, qui détermine la nature des données stockées. C# distingue les types valeur (stockant directement la valeur) et les types référence (stockant une référence à l’emplacement mémoire de la valeur).

```csharp
int age = 25; // Variable de type valeur (entier)
string name = "Alice"; // Variable de type référence (chaîne de caractères)
```

Les types valeur incluent `int`, `float`, `double`, `bool`, `char`, etc. Les types référence incluent `string`, `object`, ainsi que les classes personnalisées.

### Opérateurs

C# propose une gamme complète d’opérateurs pour manipuler les variables et valeurs :

- **Opérateurs arithmétiques** : `+` (addition),  (soustraction),  (multiplication), `/` (division), `%` (modulo).
- **Opérateurs de comparaison** : `==` (égal), `!=` (différent), `<`, `>`, `<=`, `>=`.
- **Opérateurs logiques** : `&&` (ET), `||` (OU), `!` (NON).

```csharp
int a = 10, b = 20;
int sum = a + b; // sum = 30
bool isEqual = (a == b); // isEqual = false
bool isTrue = (a < b) && (b > a); // isTrue = true
```

### Structures de Contrôle

Les structures de contrôle permettent de gérer le flux d’exécution du programme :

- **Conditionnelles** : `if`, `else`, `switch`.
- **Boucles** : `for`, `while`, `do-while`, `foreach`.

```csharp
int number = 10;
if (number > 0) {
    Console.WriteLine("Le nombre est positif.");
} else {
    Console.WriteLine("Le nombre est négatif ou nul.");
}

for (int i = 0; i < 10; i++) {
    Console.WriteLine("Valeur de i : " + i);
}
```

### Fonctions

Les fonctions encapsulent un bloc de code réutilisable, avec un nom, des paramètres et un type de retour.

```csharp
int Add(int a, int b) {
    return a + b;
}

int result = Add(10, 20); // result = 30
```

### Programmation Orientée Objet

C# est un langage orienté objet, reposant sur les concepts de classes, objets, héritage, polymorphisme, interfaces, propriétés et méthodes.

- **Classes** : définissent les propriétés et méthodes des objets.
- **Objets** : instances de classes.
- **Héritage** : une classe peut hériter d’une autre, récupérant ses membres.
- **Polymorphisme** : une méthode peut se comporter différemment selon l’objet qui l’appelle.
- **Interfaces** : définissent un contrat que les classes doivent respecter.

```csharp
public class Animal {
    public virtual void MakeSound() {
        Console.WriteLine("L'animal fait un son.");
    }
}

public class Dog : Animal {
    public override void MakeSound() {
        Console.WriteLine("Le chien aboie.");
    }
}

Animal animal = new Dog();
animal.MakeSound(); // Affiche "Le chien aboie."
```

### Collections et LINQ

Les collections (`List<T>`, `Dictionary<TKey, TValue>`) permettent de stocker et manipuler des ensembles de données. LINQ (Language Integrated Query) offre une syntaxe puissante pour interroger ces collections.

```csharp
List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
var evenNumbers = numbers.Where(n => n % 2 == 0); // Filtrage LINQ
foreach (var num in evenNumbers) {
    Console.WriteLine(num); // Affiche 2, 4
}
```

### Gestion Asynchrone

Les mots-clés `async` et `await` permettent d’écrire du code non bloquant, essentiel pour les opérations d’E/S (ex. appels HTTP).

```csharp
public async Task<string> FetchDataAsync() {
    using (HttpClient client = new HttpClient()) {
        return await client.GetStringAsync("https://example.com/api");
    }
}
```

### Bonnes Pratiques

- **Nommage** : utiliser des noms explicites (`userRepository` plutôt que `repo`), respecter PascalCase pour classes et méthodes, camelCase pour variables locales.
- **Gestion des erreurs** : utiliser des exceptions spécifiques, ne pas laisser les blocs `catch` vides, tracer les erreurs critiques.
- **Performance** : utiliser `StringBuilder` pour les concaténations en boucle, optimiser les requêtes LINQ, éviter le boxing/unboxing, utiliser la programmation asynchrone.
- **Sécurité** : valider les entrées, se protéger contre les injections SQL, effectuer des revues de code régulières.
- **Outils** : utiliser Visual Studio, ReSharper pour l’analyse de code, Benchmark.NET pour les tests de performance.

## Fondamentaux (résumé)

### Variables et Types

```csharp
// DÉCLARATION : type nomVariable = valeur;
// Types primitifs
int age = 25;                // Nombres entiers
double prix = 19.99;          // Nombres décimaux
string nom = "Alice";         // Texte
bool estMajeur = true;        // Vrai/Faux
char lettre = 'A';           // Un seul caractère// Constantes (ne changent jamais)
const double TVA = 0.20;
```

### Conversion de types

```csharp
// String vers nombre
string texte = "42";
int nombre = int.Parse(texte);          // Crash si invalide
if (int.TryParse(texte, out int resultat))  // Version sécurisée
{
    // Conversion réussie, utilise 'resultat'
}

// Nombre vers string
string texteNombre = nombre.ToString();
```

### Entrées/Sorties Console

```csharp
// Affichage
Console.WriteLine("Texte avec retour ligne");
Console.Write("Texte sans retour ligne");

// Lecture
string saisie = Console.ReadLine();

// Interpolation de chaînes (RECOMMANDÉ)
Console.WriteLine($"Bonjour {nom}, tu as {age} ans");

// Formatage
double note = 15.666;
Console.WriteLine($"Note : {note:F2}");  // 15.67 (2 décimales)
```

### Conditions (if/else)

```csharp
if (condition)
{
    // Si vrai
}
else if (autreCondition)
{
    // Sinon si
}
else
{
    // Sinon
}

// Opérateurs de comparaison
==  // Égal à (attention : pas un seul =)
!=  // Différent de
>   // Plus grand
>=  // Plus grand ou égal
<   // Plus petit
<=  // Plus petit ou égal// Opérateurs logiques
&&  // ET
||  // OU
!   // NON
```

### Switch

```csharp
switch (choix)
{
    case 1:
        // Code pour choix 1
        break;  // OBLIGATOIRE !
    case 2:
    case 3:  // Cas 2 OU 3
        // Code
        break;
    default:
        // Tous les autres cas
        break;
}
```

### For (nombre d'itérations connu)

```csharp
for (int i = 0; i < 10; i++)
{
    // S'exécute 10 fois (i de 0 à 9)
}

// Structure : for (initialisation; condition; incrémentation)
```

### While (condition en début)

```csharp
while (condition)
{
    // Continue tant que condition est vraie// Peut ne JAMAIS s'exécuter si condition fausse au départ
}
```

### Do-While (condition en fin)

```csharp
do
{
    // S'exécute AU MOINS une fois
} while (condition);
```

### Contrôle de boucle

```csharp
break;     // Sort complètement de la boucle
continue;  // Passe à l'itération suivante
return;    // Sort de la méthode entière
```

### Structure d'une méthode

```csharp
// Méthode qui retourne une valeur
static typeRetour NomMethode(type param1, type param2)
{
    // Code
    return valeur;  // OBLIGATOIRE si typeRetour != void
}

// Méthode void (ne retourne rien)
static void AfficherMessage(string message)
{
    Console.WriteLine(message);
    // Pas de return nécessaire
}
```

### Static vs Non-Static

```csharp
// STATIC : appartient à la CLASSE
public static void MethodeStatique()
{
    // Appelée directement : Classe.MethodeStatique()
}

// NON-STATIC : appartient à une INSTANCE
public void MethodeInstance()
{
    // Nécessite un objet : objet.MethodeInstance()
}

// Règle : Main est static, donc appelle des méthodes static// ou crée des objets pour appeler leurs méthodes
```

### Array (tableau fixe)

```csharp
// Déclaration
int[] nombres = new int[5];           // Tableau de 5 places
string[] jours = { "Lun", "Mar" };   // Initialisé directement

// Accès
nombres[0] = 10;   // Premier élément (index 0)
int taille = nombres.Length;  // Taille du tableau// Parcours
for (int i = 0; i < nombres.Length; i++)
{
    Console.WriteLine(nombres[i]);
}
```

### `List<T>` (liste dynamique)

```csharp
// Déclaration
List<string> noms = new List<string>();

// Méthodes principales
noms.Add("Alice");         // Ajouter
noms.Remove("Alice");      // Supprimer par valeur
noms.RemoveAt(0);         // Supprimer par index
noms.Clear();             // Vider
int nombre = noms.Count;  // Nombre d'éléments (pas Length!)
bool existe = noms.Contains("Bob");  // Vérifier présence// Parcours
foreach (string nom in noms)
{
    Console.WriteLine(nom);
}
```

### LINQ (requêtes sur collections)

```csharp
using System.Linq;  // NÉCESSAIRE en haut du fichier

List<double> notes = new List<double> { 12, 15, 18, 9, 14 };

double moyenne = notes.Average();
double max = notes.Max();
double min = notes.Min();
double somme = notes.Sum();
int count = notes.Count(n => n >= 10);  // Compte ceux >= 10
var notesSup15 = notes.Where(n => n > 15).ToList();
```

### Try-Catch

```csharp
try
{
    // Code qui peut échouer
    int nombre = int.Parse("abc");  // Va crasher
}
catch (Exception e)
{
    // Gestion de l'erreur
    Console.WriteLine($"Erreur : {e.Message}");
}
```

### TryParse (recommandé pour conversions)

```csharp
if (int.TryParse(saisie, out int nombre))
{
    // Succès, utilise 'nombre'
}
else
{
    // Échec de conversion
}
```

### Nommage

```csharp
// PascalCase pour classes et méthodes
public class CompteBancaire { }
public void CalculerInteret() { }

// camelCase pour variables locales
int nombreEtudiants = 25;
string nomComplet = "Alice";

// CONSTANTES en MAJUSCULES
const double PI = 3.14159;
```

### Organisation du code

```csharp
// 1 méthode = 1 responsabilité
static string DemanderNom() { }      // JUSTE demander
static int CalculerAge() { }         // JUSTE calculer
static void AfficherResultat() { }   // JUSTE afficher
static void Main()                   // Main reste simple et orchestrateur
{
    string nom = DemanderNom();
    int age = CalculerAge();
    AfficherResultat(nom, age);
}
```

### Validation des entrées

```csharp
// Toujours valider les entrées utilisateur
if (note >= 0 && note <= 20)  // Vérifier les limites
{
    // OK
}

// Vérifier si collection vide avant opérations
if (liste.Count > 0)
{
    double moyenne = liste.Average();
}
```

## Ressources

- **Documentation officielle** : [Microsoft Learn C#](https://learn.microsoft.com/fr-fr/dotnet/csharp/)
- **Tutoriels interactifs** : [Microsoft Learn C# Tutorials](https://learn.microsoft.com/fr-fr/dotnet/csharp/tour-of-csharp/tutorials/)
- **Livres recommandés** :
  - *C# in Depth* (Jon Skeet)
  - *Clean Architecture* (Robert C. Martin)
- **Communautés** : Stack Overflow, r/dotnet, forums developpez.com
- **Outils** : Visual Studio, ReSharper, Benchmark.NET

## Concepts clés que vous maîtrisez maintenant

### 1. Encapsulation

Cacher les données et ne donner que des méthodes pour y accéder.

### 2. Propriétés en lecture seule

```csharp
public int NombreContacts => contacts.Count;
// On peut lire, mais pas modifier !
```

### 3. Méthodes avec paramètres et retours

```csharp
public bool SupprimerContact(int id)  // ← Paramètre : id
{
    // ...
    return true;  // ← Retourne un bool
}
```

### 4. LINQ pour manipuler les collections

```csharp
// Recherche
contacts.Where(c => c.Nom.Contains(recherche))

// Maximum
contacts.Max(c => c.Id)

// Tri
contacts.OrderBy(c => c.Nom)`
```

## Pourquoi cette architecture est professionnelle

### Principe SOLID - Single Responsibility

Chaque classe a UNE seule responsabilité :

- `Contact` : Représenter un contact
- `GestionnaireContacts` : Gérer les contacts
- `Program` : Interface utilisateur

### Principe d'encapsulation

Les données sont protégées, accessibles uniquement via des méthodes contrôlées.

### Facilité de test

Vous pourriez facilement tester `GestionnaireContacts` sans interface utilisateur !

### Évolutivité

Ajouter des fonctionnalités est facile car tout est bien organisé.

## Concepts à travailler

### Exceptions et robustesse

- **Objectif** : Programmes qui ne crashent jamais
- **Mini-projet** : Calculatrice robuste
- **Concepts** : try/catch/finally, types d'exceptions, throw

### Héritage et polymorphisme

- **Objectif** : Réutiliser et étendre du code existant
- **Mini-projet** : Jeu RPG simple (Personnage → Guerrier/Mage)
- **Concepts** : classe parent, override, virtual, protected

**Vocabulaire important** :

- `class Enfant : Parent` → Enfant **hérite de** Parent
- `virtual` → Méthode qui **peut** être redéfinie
- `override` → Redéfinir une méthode virtuelle
- `base` → Référence au parent (appeler ses méthodes/constructeur)
- `abstract` → Classe qui ne peut pas être instanciée directement (on verra plus tard)

**Pourquoi c'est important** :

- Éviter la duplication de code (DRY - Don't Repeat Yourself)
- Ajouter facilement de nouveaux types
- Le code est plus maintenable

### Interfaces et abstraction

- **Objectif** : Créer des contrats de code
- **Mini-projet** : Système de paiement multi-méthodes
- **Concepts** : interface, abstract, implémentation multiple

### Collections avancées

- **Objectif** : Structures de données spécialisées
- **Mini-projet** : Gestionnaire de tâches avec priorités
- **Concepts** : Dictionary, Queue, Stack, HashSet

### LINQ avancé

- **Objectif** : Requêtes puissantes sur les données
- **Mini-projet** : Analyseur de données de vente
- **Concepts** : Where, Select, GroupBy, OrderBy, Join

### Async et tâches

- **Objectif** : Programmes qui font plusieurs choses en même temps
- **Mini-projet** : Téléchargeur de fichiers avec progression
- **Concepts** : async/await, Task, parallélisme

### Projet final console

- **Objectif** : Combiner tous les acquis
- **Options** :
  - Gestionnaire de bibliothèque
  - Jeu d'aventure textuel
  - Système de réservation
  - Tracker de finances personnelles

### Transition vers GUI

- **Objectif** : Passer aux interfaces graphiques
- **Choix** : WPF, WinForms ou API Web
- **Mini-projet** : Convertir une app console en GUI

### Projets alternatifs disponibles à tout moment

**Si tu veux changer de contexte :**

- **Jeu du pendu** → Manipulation de strings
- **Morpion** → Tableaux 2D et logique
- **Blackjack** → POO et règles métier
- **Gestionnaire de mots de passe** → Sécurité et chiffrement
- **Bot de discussion simple** → Pattern matching et IA basique
