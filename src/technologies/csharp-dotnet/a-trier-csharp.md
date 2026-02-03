<!-- # C# - ASP.NET Core

<aside>
🔖

### Ressources

- **Documentation officielle** : [Microsoft Learn C#](https://learn.microsoft.com/fr-fr/dotnet/csharp/)
- **Tutoriels interactifs** : [Microsoft Learn C# Tutorials](https://learn.microsoft.com/fr-fr/dotnet/csharp/tour-of-csharp/tutorials/)
- **Livres recommandés** :
    - *C# in Depth* (Jon Skeet)
    - *Clean Architecture* (Robert C. Martin)
- **Communautés** : Stack Overflow, r/dotnet, forums developpez.com
- **Outils** : Visual Studio, ReSharper, Benchmark.NET
</aside>

---

# C#

## 📚 Concepts clés que vous maîtrisez maintenant

### 1. **Encapsulation** 🔒

Cacher les données et ne donner que des méthodes pour y accéder.

### 2. **Propriétés en lecture seule** 📖

csharp

`public int NombreContacts => contacts.Count;
*// On peut lire, mais pas modifier !*`

### 3. **Méthodes avec paramètres et retours** 🔄

csharp

`public bool SupprimerContact(int id)  *// ← Paramètre : id*
{
    *// ...*
    return true;  *// ← Retourne un bool*
}`

### 4. **LINQ pour manipuler les collections** 🎯

csharp

`*// Recherche*
contacts.Where(c => c.Nom.Contains(recherche))

*// Maximum*
contacts.Max(c => c.Id)

*// Tri*
contacts.OrderBy(c => c.Nom)`

---

## 🎓 Pourquoi cette architecture est professionnelle

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

---

### **📍 Étape 7 : Exceptions et robustesse** (2-3h)

- **Objectif** : Programmes qui ne crashent jamais
- **Mini-projet** : Calculatrice robuste
- **Concepts** : try/catch/finally, types d'exceptions, throw

### **📍 Étape 8 : Héritage et polymorphisme** (4-5h)

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

### **📍 Étape 9 : Interfaces et abstraction** (3-4h)

- **Objectif** : Créer des contrats de code
- **Mini-projet** : Système de paiement multi-méthodes
- **Concepts** : interface, abstract, implémentation multiple

### **📍 Étape 10 : Collections avancées** (2-3h)

- **Objectif** : Structures de données spécialisées
- **Mini-projet** : Gestionnaire de tâches avec priorités
- **Concepts** : Dictionary, Queue, Stack, HashSet

### **📍 Étape 11 : LINQ avancé** (3-4h)

- **Objectif** : Requêtes puissantes sur les données
- **Mini-projet** : Analyseur de données de vente
- **Concepts** : Where, Select, GroupBy, OrderBy, Join

### **📍 Étape 12 : Async et tâches** (4-5h)

- **Objectif** : Programmes qui font plusieurs choses en même temps
- **Mini-projet** : Téléchargeur de fichiers avec progression
- **Concepts** : async/await, Task, parallélisme

### **📍 Étape 13 : Projet final console** (8-10h)

- **Objectif** : Combiner tous les acquis
- **Options** :
    - Gestionnaire de bibliothèque
    - Jeu d'aventure textuel
    - Système de réservation
    - Tracker de finances personnelles

### **📍 Étape 14 : Transition vers GUI** (5-6h)

- **Objectif** : Passer aux interfaces graphiques
- **Choix** : WPF, WinForms ou API Web
- **Mini-projet** : Convertir une app console en GUI

---

## **🎮 Projets alternatifs disponibles à tout moment**

**Si tu veux changer de contexte :**

- **Jeu du pendu** → Manipulation de strings
- **Morpion** → Tableaux 2D et logique
- **Blackjack** → POO et règles métier
- **Gestionnaire de mots de passe** → Sécurité et chiffrement
- **Bot de discussion simple** → Pattern matching et IA basique

## Introduction au langage C#

- C# est un langage orienté objet avec une syntaxe claire, supportant variables, types valeur et référence, opérateurs, structures de contrôle, fonctions, classes, héritage, polymorphisme et interfaces.
- La CLI .NET permet de créer divers projets : applications console (`dotnet new console`), API web (`dotnet new webapi`), applications mobiles (`dotnet new maui`), bibliothèques (`dotnet new classlib`) et tests unitaires (`dotnet new mstest` ou `xunit`).
- Les architectures logicielles courantes incluent l’architecture en couches, MVC et microservices, chacune adaptée à des besoins spécifiques de maintenabilité, évolutivité et distribution.
- Les bonnes pratiques couvrent la gestion des erreurs, la performance (ex. `StringBuilder`, LINQ optimisé, asynchronisme), la sécurité, les conventions de nommage (PascalCase, camelCase) et l’utilisation d’outils modernes.

## Concepts et syntaxe

### Variables et Types de Données

Les variables en C# sont des conteneurs pour stocker des données. Elles doivent être déclarées avec un type précis, qui détermine la nature des données stockées. C# distingue les types valeur (stockant directement la valeur) et les types référence (stockant une référence à l’emplacement mémoire de la valeur).

```csharp
 Copier
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
 Copier
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
 Copier
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
 Copier
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
 Copier
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
 Copier
List<int> numbers = new List<int> { 1, 2, 3, 4, 5 };
var evenNumbers = numbers.Where(n => n % 2 == 0); // Filtrage LINQ
foreach (var num in evenNumbers) {
    Console.WriteLine(num); // Affiche 2, 4
}

```

### Gestion Asynchrone

Les mots-clés `async` et `await` permettent d’écrire du code non bloquant, essentiel pour les opérations d’E/S (ex. appels HTTP).

```csharp
 Copier
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

## Fondamentaux

## 📚 **FICHE RÉSUMÉ - Fondamentaux C#**

### **🎯 Progression actuelle**

Tu as parcouru les 4 premières étapes fondamentales. Voici tout ce que tu maîtrises maintenant !

---

## **1️⃣ CONCEPTS DE BASE**

### **Variables et Types**

csharp

`*// DÉCLARATION : type nomVariable = valeur;// Types primitifs*
int age = 25;                *// Nombres entiers*
double prix = 19.99;          *// Nombres décimaux*
string nom = "Alice";         *// Texte*
bool estMajeur = true;        *// Vrai/Faux*
char lettre = 'A';           *// Un seul caractère// Constantes (ne changent jamais)*
const double TVA = 0.20;`

### **Conversion de types**

csharp

`*// String vers nombre*
string texte = "42";
int nombre = int.Parse(texte);           *// ⚠️ Crash si invalide// Version sécurisée*
if (int.TryParse(texte, out int resultat))
{
    *// Conversion réussie, utilise 'resultat'*
}

*// Nombre vers string*
string texteNombre = nombre.ToString();`

### **Entrées/Sorties Console**

csharp

`*// Affichage*
Console.WriteLine("Texte avec retour ligne");
Console.Write("Texte sans retour ligne");

*// Lecture*
string saisie = Console.ReadLine();

*// Interpolation de chaînes (RECOMMANDÉ)*
Console.WriteLine($"Bonjour {nom}, tu as {age} ans");

*// Formatage*
double note = 15.666;
Console.WriteLine($"Note : {note:F2}");  *// 15.67 (2 décimales)*`

---

## **2️⃣ STRUCTURES DE CONTRÔLE**

### **Conditions (if/else)**

csharp

`if (condition)
{
    *// Si vrai*
}
else if (autreCondition)
{
    *// Sinon si*
}
else
{
    *// Sinon*
}

*// Opérateurs de comparaison*
==  *// Égal à (attention : pas un seul =)*
!=  *// Différent de*
>   *// Plus grand*
>=  *// Plus grand ou égal*
<   *// Plus petit*
<=  *// Plus petit ou égal// Opérateurs logiques*
&&  *// ET*
||  *// OU*
!   *// NON*`

### **Switch**

csharp

`switch (choix)
{
    case 1:
        *// Code pour choix 1*
        break;  *// OBLIGATOIRE !*
    case 2:
    case 3:  *// Cas 2 OU 3// Code*
        break;
    default:
        *// Tous les autres cas*
        break;
}`

---

## **3️⃣ BOUCLES**

### **For (nombre d'itérations connu)**

csharp

`for (int i = 0; i < 10; i++)
{
    *// S'exécute 10 fois (i de 0 à 9)*
}

*// Structure : for (initialisation; condition; incrémentation)*`

### **While (condition en début)**

csharp

`while (condition)
{
    *// Continue tant que condition est vraie// Peut ne JAMAIS s'exécuter si condition fausse au départ*
}`

### **Do-While (condition en fin)**

csharp

`do
{
    *// S'exécute AU MOINS une fois*
} while (condition);`

### **Contrôle de boucle**

csharp

`break;     *// Sort complètement de la boucle*
continue;  *// Passe à l'itération suivante*
return;    *// Sort de la méthode entière*`

---

## **4️⃣ MÉTHODES**

### **Structure d'une méthode**

csharp

`*// Méthode qui retourne une valeur*
static typeRetour NomMethode(type param1, type param2)
{
    *// Code*
    return valeur;  *// OBLIGATOIRE si typeRetour != void*
}

*// Méthode void (ne retourne rien)*
static void AfficherMessage(string message)
{
    Console.WriteLine(message);
    *// Pas de return nécessaire*
}`

### **Static vs Non-Static**

csharp

`*// STATIC : appartient à la CLASSE*
public static void MethodeStatique()
{
    *// Appelée directement : Classe.MethodeStatique()*
}

*// NON-STATIC : appartient à une INSTANCE*
public void MethodeInstance()
{
    *// Nécessite un objet : objet.MethodeInstance()*
}

*// Règle : Main est static, donc appelle des méthodes static// ou crée des objets pour appeler leurs méthodes*`

---

## **5️⃣ COLLECTIONS**

### **Array (tableau fixe)**

csharp

`*// Déclaration*
int[] nombres = new int[5];           *// Tableau de 5 places*
string[] jours = { "Lun", "Mar" };    *// Initialisé directement// Accès*
nombres[0] = 10;   *// Premier élément (index 0)*
int taille = nombres.Length;  *// Taille du tableau// Parcours*
for (int i = 0; i < nombres.Length; i++)
{
    Console.WriteLine(nombres[i]);
}`

### **List<T> (liste dynamique)**

csharp

`*// Déclaration*
List<string> noms = new List<string>();

*// Méthodes principales*
noms.Add("Alice");         *// Ajouter*
noms.Remove("Alice");      *// Supprimer par valeur*
noms.RemoveAt(0);         *// Supprimer par index*
noms.Clear();             *// Vider*
int nombre = noms.Count;  *// Nombre d'éléments (pas Length!)*
bool existe = noms.Contains("Bob");  *// Vérifier présence// Parcours*
foreach (string nom in noms)
{
    Console.WriteLine(nom);
}`

### **LINQ (requêtes sur collections)**

csharp

`using System.Linq;  *// NÉCESSAIRE en haut du fichier*

List<double> notes = new List<double> { 12, 15, 18, 9, 14 };

double moyenne = notes.Average();
double max = notes.Max();
double min = notes.Min();
double somme = notes.Sum();
int count = notes.Count(n => n >= 10);  *// Compte ceux >= 10*
var notesSup15 = notes.Where(n => n > 15).ToList();`

---

## **6️⃣ GESTION D'ERREURS DE BASE**

### **Try-Catch (pas encore vu en détail)**

csharp

`try
{
    *// Code qui peut échouer*
    int nombre = int.Parse("abc");  *// Va crasher*
}
catch (Exception e)
{
    *// Gestion de l'erreur*
    Console.WriteLine($"Erreur : {e.Message}");
}`

### **TryParse (recommandé pour conversions)**

csharp

`if (int.TryParse(saisie, out int nombre))
{
    *// Succès, utilise 'nombre'*
}
else
{
    *// Échec de conversion*
}`

---

## **7️⃣ BONNES PRATIQUES APPRISES**

### **Nommage**

csharp

`*// PascalCase pour classes et méthodes*
public class CompteBancaire { }
public void CalculerInteret() { }

*// camelCase pour variables locales*
int nombreEtudiants = 25;
string nomComplet = "Alice";

*// CONSTANTES en MAJUSCULES*
const double PI = 3.14159;`

### **Organisation du code**

csharp

`*// 1 méthode = 1 responsabilité*
static string DemanderNom() { }      *// JUSTE demander*
static int CalculerAge() { }         *// JUSTE calculer*
static void AfficherResultat() { }   *// JUSTE afficher// Main reste simple et orchestrateur*
static void Main()
{
    string nom = DemanderNom();
    int age = CalculerAge();
    AfficherResultat(nom, age);
}`

### **Validation des entrées**

csharp

`*// Toujours valider les entrées utilisateur*
if (note >= 0 && note <= 20)  *// Vérifier les limites*
{
    *// OK*
}

*// Vérifier si collection vide avant opérations*
if (liste.Count > 0)
{
    double moyenne = liste.Average();
}`

---

## **8️⃣ PIÈGES FRÉQUENTS À ÉVITER**

```
❌Erreur✅Correctionif (x = 5)if (x == 5)Oublierbreak dans switchToujours mettrebreakUtiliserLength sur ListUtiliserCount pour ListVariables non initialiséesInitialiser ou vérifier avant usageIndex hors limitesVérifierindex >= 0 && index < list.CountModifier collection dans foreachUtiliser for inversé ou copieConsole se ferme trop viteAjouterConsole.ReadKey()
```

---

## **📊 BILAN DE TES ACQUIS**

✅ **Ce que tu maîtrises :**

- Créer des programmes console interactifs
- Gérer des données avec variables et collections
- Contrôler le flux avec conditions et boucles
- Organiser le code avec des méthodes
- Valider les entrées utilisateur
- Utiliser LINQ pour les opérations sur listes

🎯 **Prochaines étapes :**

1. **Classes et POO** - Regrouper données et comportements
2. **Gestion d'exceptions** - Try/Catch/Finally avancé
3. **Fichiers** - Lire et écrire des données persistantes
4. **Héritage et Polymorphisme** - Concepts POO avancés
5. **Interfaces et Abstract** - Contrats de code

---

## **💡 CONSEILS POUR PROGRESSER**

1. **Pratique quotidienne** : 30 min/jour minimum
2. **Lis ton code à voix haute** : Si c'est difficile à lire, c'est mal écrit
3. **Débugge pas à pas** : Utilise F10/F11 dans Visual Studio
4. **Refactorise** : Améliore ton code existant régulièrement
5. **Lis du code d'autres** : GitHub est ton ami

---

---

# .NET

[Learning .NET](C#%20-%20ASP%20NET%20Core/Learning%20NET%2026e169213df180e9a32cc6129f0595d4.md)

### Types de projets avec la CLI .NET

La CLI .NET (`dotnet`) permet de créer rapidement différents types de projets, chacun adapté à un cas d’usage spécifique.

| Type de Projet | Commande CLI | Description | Structure typique | Cas d’usage |
| --- | --- | --- | --- | --- |
| Application Console | `dotnet new console` | Application exécutée en ligne de commande | `Program.cs`, `.csproj` | Scripts, outils CLI |
| Application Web | `dotnet new web` | Application web ASP.NET Core | `Controllers/`, `Views/`, `Models/`, `.csproj` | Sites web, applications interactives |
| API Web | `dotnet new webapi` | API RESTful avec ASP.NET Core | `Controllers/`, `Models/`, `.csproj` | Services backend, microservices |
| Application Mobile | `dotnet new maui` | Application multiplateforme mobile | `MainPage.xaml`, `App.xaml`, `.csproj` | Applications mobiles |
| Bibliothèque | `dotnet new classlib` | Bibliothèque de classes réutilisables | `Class1.cs`, `.csproj` | Composants logiciels, frameworks |
| Tests Unitaires | `dotnet new mstest` ou `dotnet new xunit` | Projets de tests unitaires | `UnitTest1.cs`, `.csproj` | Tests automatisés, assurance qualité |

### Architecture

### Architecture en Couches

L’architecture en couches sépare les responsabilités en plusieurs couches : présentation, logique métier, accès aux données, base de données. Cela facilite la maintenance et l’évolutivité.

![image.png](C#%20-%20ASP%20NET%20Core/image.png)

- **Avantages** : séparation claire des responsabilités, facilite la maintenance et l’évolutivité.
- **Exemple** : application console avec injection de dépendances (`IService`, `Service`, `Repository`).
- **Exemple complet**
    
    ### **1. Introduction à l’Architecture en Couches**
    
    L’architecture en couches est un modèle de conception qui sépare les responsabilités d’une application en plusieurs couches logiques. Chaque couche a un rôle précis et communique uniquement avec la couche directement inférieure ou supérieure. Cela permet une meilleure maintenabilité, testabilité et évolutivité du code.
    
    **Couches typiques :**
    
    - **Models** : Représente les données et la logique métier.
    - **Repository** : Gère l’accès aux données (base de données, API, etc.).
    - **Services** : Contient la logique métier et les règles de gestion.
    - **Controller** : Gère les requêtes HTTP et interagit avec les services.
    
    ---
    
    ### **2. Exemple Concret : Gestion des Utilisateurs**
    
    ### **2.1. Modèle (Model)**
    
    Le modèle représente les données et peut inclure des validations ou de la logique métier simple.
    
    ```csharp
     Copier
    // Models/User.cs
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    
        // Exemple de validation simple
        public bool IsValid()
        {
            return !string.IsNullOrEmpty(FirstName) &&
                   !string.IsNullOrEmpty(LastName) &&
                   !string.IsNullOrEmpty(Email) &&
                   Email.Contains("@");
        }
    }
    
    ```
    
    **Rôle :**
    
    - Définir la structure des données.
    - Inclure des validations ou de la logique métier simple.
    
    ---
    
    ### **2.2. Repository**
    
    Le repository est responsable de l’accès aux données. Il isole la logique d’accès à la base de données du reste de l’application.
    
    ```csharp
     Copier
    // Repositories/IUserRepository.cs
    public interface IUserRepository
    {
        User GetById(int id);
        IEnumerable<User> GetAll();
        void Add(User user);
        void Update(User user);
        void Delete(int id);
    }
    
    // Repositories/UserRepository.cs
    public class UserRepository : IUserRepository
    {
        private readonly List<User> _users = new List<User>();
        private int _nextId = 1;
    
        public User GetById(int id)
        {
            return _users.FirstOrDefault(u => u.Id == id);
        }
    
        public IEnumerable<User> GetAll()
        {
            return _users;
        }
    
        public void Add(User user)
        {
            user.Id = _nextId++;
            _users.Add(user);
        }
    
        public void Update(User user)
        {
            var existingUser = _users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser != null)
            {
                existingUser.FirstName = user.FirstName;
                existingUser.LastName = user.LastName;
                existingUser.Email = user.Email;
            }
        }
    
        public void Delete(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                _users.Remove(user);
            }
        }
    }
    
    ```
    
    **Rôle :**
    
    - Accéder aux données (base de données, fichier, API, etc.).
    - Isoler la logique d’accès aux données.
    - Faciliter les tests en utilisant des interfaces.
    
    ---
    
    ### **2.3. Service**
    
    Le service contient la logique métier et utilise le repository pour accéder aux données.
    
    ```csharp
     Copier
    // Services/IUserService.cs
    public interface IUserService
    {
        User GetUser(int id);
        IEnumerable<User> GetAllUsers();
        void CreateUser(User user);
        void UpdateUser(User user);
        void DeleteUser(int id);
    }
    
    // Services/UserService.cs
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
    
        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }
    
        public User GetUser(int id)
        {
            return _userRepository.GetById(id);
        }
    
        public IEnumerable<User> GetAllUsers()
        {
            return _userRepository.GetAll();
        }
    
        public void CreateUser(User user)
        {
            if (!user.IsValid())
            {
                throw new ArgumentException("L'utilisateur n'est pas valide.");
            }
            _userRepository.Add(user);
        }
    
        public void UpdateUser(User user)
        {
            if (!user.IsValid())
            {
                throw new ArgumentException("L'utilisateur n'est pas valide.");
            }
            _userRepository.Update(user);
        }
    
        public void DeleteUser(int id)
        {
            _userRepository.Delete(id);
        }
    }
    
    ```
    
    **Rôle :**
    
    - Implémenter la logique métier.
    - Valider les données avant de les transmettre au repository.
    - Coordonner les opérations entre plusieurs repositories si nécessaire.
    
    ---
    
    ### **2.4. Controller**
    
    Le controller gère les requêtes HTTP et interagit avec les services.
    
    ```csharp
     Copier
    // Controllers/UsersController.cs
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
    
        public UsersController(IUserService userService)
        {
            _userService = userService;
        }
    
        [HttpGet("{id}")]
        public ActionResult<User> GetUser(int id)
        {
            var user = _userService.GetUser(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }
    
        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            return Ok(_userService.GetAllUsers());
        }
    
        [HttpPost]
        public IActionResult CreateUser([FromBody] User user)
        {
            try
            {
                _userService.CreateUser(user);
                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User user)
        {
            if (id != user.Id)
            {
                return BadRequest("L'ID de l'utilisateur ne correspond pas.");
            }
    
            try
            {
                _userService.UpdateUser(user);
                return NoContent();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    
        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            _userService.DeleteUser(id);
            return NoContent();
        }
    }
    
    ```
    
    **Rôle :**
    
    - Recevoir les requêtes HTTP.
    - Appeler les services pour traiter les requêtes.
    - Retourner les réponses HTTP appropriées.
    
    ---
    
    ### **3. Injection de Dépendances**
    
    Pour que les couches communiquent entre elles, on utilise l’injection de dépendances (DI). Cela permet de découpler les composants et de faciliter les tests.
    
    **Exemple de configuration dans `Program.cs` :**
    
    ```csharp
     Copier
    // Program.cs
    var builder = WebApplication.CreateBuilder(args);
    
    // Ajouter les services au conteneur DI
    builder.Services.AddScoped<IUserRepository, UserRepository>();
    builder.Services.AddScoped<IUserService, UserService>();
    
    builder.Services.AddControllers();
    var app = builder.Build();
    
    app.MapControllers();
    app.Run();
    
    ```
    
    **Avantages :**
    
    - Découplage des composants.
    - Facilité de test (remplacement des dépendances par des mocks).
    - Gestion centralisée des dépendances.
    
    ---
    
    ### **4. Bonnes Pratiques**
    
    Fiche : Architecture en Couches (Models-Repository-Services-Controller)
    
    Couche
    
    Bonnes Pratiques
    
    **Models**
    
    Utiliser des propriétés et méthodes pour encapsuler la logique métier simple.
    
    **Repository**
    
    Toujours utiliser une interface pour le repository.
    
    **Services**
    
    Valider les données avant de les transmettre au repository.
    
    **Controller**
    
    Ne pas inclure de logique métier dans le controller.
    
    **DI**
    
    Utiliser l’injection de dépendances pour découpler les composants.
    
    ---
    
 
    ### **6. Exemple de Test Unitaire**
    
    Voici un exemple de test unitaire pour le service `UserService` en utilisant un mock du repository.
    
    ```csharp
     Copier
    // Tests/UserServiceTests.cs
    [TestClass]
    public class UserServiceTests
    {
        [TestMethod]
        public void CreateUser_WithValidUser_AddsUserToRepository()
        {
            // Arrange
            var mockRepository = new Mock<IUserRepository>();
            var userService = new UserService(mockRepository.Object);
            var user = new User { FirstName = "Antoine", LastName = "Coulon", Email = "antoine@example.com" };
    
            // Act
            userService.CreateUser(user);
    
            // Assert
            mockRepository.Verify(r => r.Add(It.IsAny<User>()), Times.Once);
        }
    
        [TestMethod]
        [ExpectedException(typeof(ArgumentException))]
        public void CreateUser_WithInvalidUser_ThrowsException()
        {
            // Arrange
            var mockRepository = new Mock<IUserRepository>();
            var userService = new UserService(mockRepository.Object);
            var user = new User { FirstName = "", LastName = "Coulon", Email = "antoine@example.com" };
    
            // Act
            userService.CreateUser(user);
        }
    }
    
    ```
    
    **Outils de test recommandés :**
    
    - **Moq** : Pour créer des mocks.
    - **xUnit** ou **MSTest** : Pour écrire les tests.
    
    ---
    
    ### **7. Résumé des Responsabilités**
    
    Couche
    
    Responsabilité
    
    **Model**
    
    Définir la structure des données et inclure des validations simples.
    
    **Repository**
    
    Gérer l’accès aux données (CRUD).
    
    **Service**
    
    Implémenter la logique métier et valider les données.
    
    **Controller**
    
    Gérer les requêtes HTTP et interagir avec les services.
    
    ---
    
    ### **8. Ressources Complémentaires**
    
    - **Documentation officielle** : [Dependency Injection in ASP.NET Core](https://learn.microsoft.com/fr-fr/aspnet/core/fundamentals/dependency-injection)
    - **Tutoriels** : [Microsoft Learn - Create a web API with ASP.NET Core](https://learn.microsoft.com/fr-fr/aspnet/core/tutorials/first-web-api)
    - **Livres** : *Clean Architecture* (Robert C. Martin), *Dependency Injection Principles, Practices, and Patterns* (Steven van Deursen, Mark Seemann)

### Architecture MVC

L’architecture MVC (Modèle-Vue-Contrôleur) sépare la logique métier (Modèle), l’interface utilisateur (Vue) et la gestion des interactions (Contrôleur).

![image.png](C#%20-%20ASP%20NET%20Core/image%201.png)

- **Avantages** : facilite la maintenance, la réutilisation du code, et la collaboration.
- **Exemple** : application web ASP.NET MVC.
- **Exemple complet**
    
    ### **1.1. Introduction à l’Architecture MVC**
    
    L’architecture **MVC** (Modèle-Vue-Contrôleur) est un modèle de conception qui sépare une application en trois composants principaux :
    
    - **Modèle** : Gère les données et la logique métier.
    - **Vue** : Affiche l’interface utilisateur.
    - **Contrôleur** : Traite les entrées de l’utilisateur et coordonne les interactions entre le modèle et la vue.
    
    **Avantages :**
    
    - Séparation claire des responsabilités.
    - Facilité de maintenance et d’évolutivité.
    - Réutilisabilité du code.
    
    ---
    
    ### **1.2. Exemple Concret : Application de Gestion des Tâches**
    
    ### **1.2.1. Modèle (Model)**
    
    Le modèle représente les données et la logique métier.
    
    ```csharp
     Copier
    // Models/Task.cs
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime DueDate { get; set; }
        public bool IsCompleted { get; set; }
    
        public bool IsOverdue()
        {
            return DueDate < DateTime.Now && !IsCompleted;
        }
    }
    
    ```
    
    **Rôle :**
    
    - Définir la structure des données.
    - Inclure des méthodes pour manipuler les données (ex. : `IsOverdue`).
    
    ---
    
    ### **1.2.2. Vue (View)**
    
    La vue est responsable de l’affichage des données à l’utilisateur. En ASP.NET Core, les vues sont généralement des fichiers `.cshtml` (Razor).
    
    ```html
     Copier
    @model IEnumerable<Task>
    
    <h1>Liste des tâches</h1>
    <table class="table">
        <thead>
            <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Date limite</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach (var task in Model)
            {
                <tr>
                    <td>@task.Title</td>
                    <td>@task.Description</td>
                    <td>@task.DueDate.ToShortDateString()</td>
                    <td>
                        @if (task.IsCompleted)
                        {
                            <span class="badge bg-success">Terminée</span>
                        }
                        else if (task.IsOverdue())
                        {
                            <span class="badge bg-danger">En retard</span>
                        }
                        else
                        {
                            <span class="badge bg-warning">En cours</span>
                        }
                    </td>
                </tr>
            }
        </tbody>
    </table>
    
    ```
    
    **Rôle :**
    
    - Afficher les données de manière conviviale.
    - Permettre à l’utilisateur d’interagir avec l’application.
    
    ---
    
    ### **1.2.3. Contrôleur (Controller)**
    
    Le contrôleur gère les requêtes HTTP et interagit avec le modèle et la vue.
    
    ```csharp
     Copier
    // Controllers/TasksController.cs
    public class TasksController : Controller
    {
        private static List<Task> _tasks = new List<Task>
        {
            new Task { Id = 1, Title = "Faire les courses", Description = "Acheter du lait et des œufs", DueDate = DateTime.Now.AddDays(2) },
            new Task { Id = 2, Title = "Réviser C#", Description = "Lire la documentation sur l'architecture MVC", DueDate = DateTime.Now.AddDays(1) }
        };
    
        public IActionResult Index()
        {
            return View(_tasks);
        }
    
        public IActionResult Details(int id)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == id);
            if (task == null)
            {
                return NotFound();
            }
            return View(task);
        }
    
        [HttpPost]
        public IActionResult Create(Task task)
        {
            task.Id = _tasks.Max(t => t.Id) + 1;
            _tasks.Add(task);
            return RedirectToAction(nameof(Index));
        }
    }
    
    ```
    
    **Rôle :**
    
    - Recevoir les requêtes HTTP.
    - Récupérer ou mettre à jour les données via le modèle.
    - Transmettre les données à la vue pour affichage.
    
    ---
    
    ### **1.2.4. Diagramme de Flux MVC**
    
    ```mermaid
     Copier
    graph TD
        A[Vue] |Interaction utilisateur| B[Contrôleur]
        B|Récupère/Met à jour les données| C[Modèle]
        C =Retourne les données| B
        B |Affiche les données| A
    
    ```
    
    ---
    
    ### **1.2.5. Bonnes Pratiques MVC**
    
    - **Modèle** : Garder le modèle simple et éviter d’y inclure de la logique d’affichage.
    - **Vue** : Utiliser des vues partielles pour réutiliser des composants.
    - **Contrôleur** : Éviter d’inclure de la logique métier complexe (utiliser des services si nécessaire).
    - **Validation** : Utiliser les attributs de validation (`[Required]`, `[StringLength]`) dans le modèle.
    
    ---
    
    ### **1.2.6. Exemple de Validation**
    
    ```csharp
     Copier
    // Models/Task.cs
    public class Task
    {
        [Required(ErrorMessage = "Le titre est obligatoire.")]
        public string Title { get; set; }
    
        [StringLength(500, ErrorMessage = "La description ne peut pas dépasser 500 caractères.")]
        public string Description { get; set; }
    }
    
    ```
    
    ---
    
    ### **1.2.7. Configuration de l’Application**
    
    Dans `Program.cs`, configurez les services MVC :
    
    ```csharp
     Copier
    var builder = WebApplication.CreateBuilder(args);
    builder.Services.AddControllersWithViews();
    var app = builder.Build();
    
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Tasks}/{action=Index}/{id?}");
    
    app.Run();
    
    ```
    
    ---
    
    ### **1.2.8. Ressources Complémentaires**
    
    - **Documentation** : [ASP.NET Core MVC](https://learn.microsoft.com/fr-fr/aspnet/core/mvc/overview)
    - **Tutoriel** : [Créer une application MVC avec ASP.NET Core](https://learn.microsoft.com/fr-fr/aspnet/core/tutorials/first-mvc-app/)

### Architecture Microservices

L’architecture microservices décompose une application en petits services indépendants, communiquant via des API.

![image.png](C#%20-%20ASP%20NET%20Core/image%202.png)

- **Avantages** : évolutivité, indépendance des services, facilite le déploiement et la maintenance.
- **Exemple** : application distribuée avec plusieurs services spécialisés.
- **Exemple complet**
    
    ### **2.1. Introduction aux Microservices**
    
    L’architecture **Microservices** décompose une application en petits services indépendants, chacun ayant sa propre responsabilité et communiquant via des API (généralement REST ou gRPC).
    
    **Avantages :**
    
    - Évolutivité : Chaque service peut être mis à l’échelle indépendamment.
    - Flexibilité : Les services peuvent être développés avec des technologies différentes.
    - Résilience : Une panne dans un service n’affecte pas les autres.
    
    ---
    
    ### **2.2. Exemple Concret : Application de Blog avec Deux Services**
    
    - **Service 1** : Gestion des articles.
    - **Service 2** : Gestion des commentaires.
    
    ---
    
    ### **2.2.1. Modèle pour le Service d’Articles**
    
    ```csharp
     Copier
    // Models/Article.cs (Service Articles)
    public class Article
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedDate { get; set; }
    }
    
    ```
    
    ---
    
    ### **2.2.2. Contrôleur pour le Service d’Articles**
    
    ```csharp
     Copier
    // Controllers/ArticlesController.cs (Service Articles)
    [ApiController]
    [Route("api/[controller]")]
    public class ArticlesController : ControllerBase
    {
        private static List<Article> _articles = new List<Article>
        {
            new Article { Id = 1, Title = "Introduction aux Microservices", Content = "Les microservices sont une architecture...", PublishedDate = DateTime.Now }
        };
    
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_articles);
        }
    
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var article = _articles.FirstOrDefault(a => a.Id == id);
            if (article == null)
            {
                return NotFound();
            }
            return Ok(article);
        }
    }
    
    ```
    
    ---
    
    ### **2.2.3. Modèle pour le Service de Commentaires**
    
    ```csharp
     Copier
    // Models/Comment.cs (Service Commentaires)
    public class Comment
    {
        public int Id { get; set; }
        public int ArticleId { get; set; }
        public string Author { get; set; }
        public string Content { get; set; }
        public DateTime PostedDate { get; set; }
    }
    
    ```
    
    ---
    
    ### **2.2.4. Contrôleur pour le Service de Commentaires**
    
    ```csharp
     Copier
    // Controllers/CommentsController.cs (Service Commentaires)
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private static List<Comment> _comments = new List<Comment>
        {
            new Comment { Id = 1, ArticleId = 1, Author = "Antoine", Content = "Merci pour cet article !", PostedDate = DateTime.Now }
        };
    
        [HttpGet("article/{articleId}")]
        public IActionResult GetByArticleId(int articleId)
        {
            var comments = _comments.Where(c => c.ArticleId == articleId).ToList();
            return Ok(comments);
        }
    }
    
    ```
    
    ---
    
    ### **2.2.5. Communication entre Services**
    
    Pour récupérer les commentaires d’un article, le service d’articles peut appeler le service de commentaires via une requête HTTP.
    
    ```csharp
     Copier
    // Services/CommentService.cs (Service Articles)
    public class CommentService
    {
        private readonly HttpClient _httpClient;
    
        public CommentService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }
    
        public async Task<List<Comment>> GetCommentsForArticle(int articleId)
        {
            var response = await _httpClient.GetAsync($"http://comment-service/api/comments/article/{articleId}");
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadFromJsonAsync<List<Comment>>();
        }
    }
    
    ```
    
    **Configuration dans `Program.cs` :**
    
    ```csharp
     Copier
    builder.Services.AddHttpClient<CommentService>();
    
    ```
    
    ---
    
    ### **2.2.6. Diagramme de Flux Microservices**
    
    ```mermaid
     Copier
    graph TD
        A[Client] Requête| B[Service Articles]
        B Requête| C[Service Commentaires]
        C Retourne les commentaires| B
        B Retourne les données| A
    
    ```
    
    ---
    
    ### **2.2.7. Bonnes Pratiques Microservices**
    
    - **Indépendance** : Chaque service doit avoir sa propre base de données.
    - **Communication** : Utiliser des API REST ou gRPC pour la communication inter-services.
    - **Résilience** : Implémenter des mécanismes de gestion des erreurs (ex. : Polly pour les retries).
    - **Découverte de services** : Utiliser un service registry (ex. : Consul, Eureka).
    
    ---
    
    ### **2.2.8. Exemple de Résilience avec Polly**
    
    ```csharp
     Copier
    // Services/CommentService.cs
    public class CommentService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<CommentService> _logger;
    
        public CommentService(HttpClient httpClient, ILogger<CommentService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }
    
        public async Task<List<Comment>> GetCommentsForArticle(int articleId)
        {
            var retryPolicy = Policy<List<Comment>>
                .Handle<HttpRequestException>()
                .RetryAsync(3, onRetry => _logger.LogWarning($"Retrying to fetch comments..."));
    
            return await retryPolicy.ExecuteAsync(async () =>
            {
                var response = await _httpClient.GetAsync($"http://comment-service/api/comments/article/{articleId}");
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadFromJsonAsync<List<Comment>>();
            });
        }
    }
    
    ```
    
    ---
    
    ### **2.2.9. Déploiement et Orchestration**
    
    - **Conteneurisation** : Utiliser Docker pour conteneuriser chaque service.
    - **Orchestration** : Utiliser Kubernetes ou Docker Swarm pour gérer les conteneurs.
    - **CI/CD** : Automatiser le déploiement avec GitHub Actions ou Azure DevOps.
    
    ---
    
    ### **2.2.10. Ressources Complémentaires**
    
    - **Documentation** : [Microservices avec .NET](https://learn.microsoft.com/fr-fr/dotnet/architecture/microservices/)
    - **Outil** : [Docker](https://www.docker.com/), [Kubernetes](https://kubernetes.io/)
    - **Livre** : *Microservices Patterns* (Chris Richardson)

### Domain-Driven Design (DDD)

### 1. Introduction au Domain-Driven Design (DDD)

Le **Domain-Driven Design** est une approche de conception logicielle qui met l’accent sur le **domaine métier** et sa logique. L’objectif est de créer un modèle logiciel qui reflète fidèlement les concepts, les règles et les processus du domaine réel. Le DDD est particulièrement utile pour les applications complexes où la logique métier est riche et évolutive.

**Concepts clés du DDD :**

- **Ubiquitous Language** : Un langage commun entre les développeurs et les experts métier.
- **Bounded Context** : Un contexte délimité où les termes et les règles du domaine ont un sens précis.
- **Entités** : Objets définis par leur identité (ex. : un utilisateur, une commande).
- **Value Objects** : Objets définis par leurs attributs (ex. : une adresse, une date).
- **Aggregates** : Groupes d’objets traités comme une unité cohérente pour garantir la cohérence des données.
- **Domain Services** : Logique métier qui ne appartient pas à une entité ou un value object spécifique.
- **Repositories** : Interfaces pour accéder aux objets du domaine.
- **Application Services** : Coordonnent les opérations du domaine et gèrent les transactions.

---

### 2. Structure en Couches du DDD

Couche

Rôle

**Presentation**

Interface utilisateur (API, UI)

**Application**

Coordination des opérations, gestion des transactions

**Domain**

Contient la logique métier pure (entités, value objects, aggregates)

**Infrastructure**

Implémentation technique (persistance, services externes)

---

### 3. Exemple Concret : Gestion des Commandes

### 3.1. Définition du Bounded Context

Pour cet exemple, nous allons modéliser un système de **gestion des commandes** pour un site e-commerce.
**Ubiquitous Language :**

- **Commande** : Une demande d’achat passée par un client.
- **Produit** : Un article disponible à la vente.
- **Ligne de Commande** : Un produit avec une quantité dans une commande.
- **Client** : La personne passant la commande.

---

### 3.2. Couche Domain

### 3.2.1. Value Objects

Les **Value Objects** sont immuables et définis par leurs attributs.

```csharp
 Copier
// Domain/ValueObjects/Address.cs
public record Address(string Street, string City, string PostalCode, string Country)
{
    public bool IsValid()
    {
        return !string.IsNullOrEmpty(Street) &&
               !string.IsNullOrEmpty(City) &&
               !string.IsNullOrEmpty(PostalCode) &&
               !string.IsNullOrEmpty(Country);
    }
}

// Domain/ValueObjects/ProductId.cs
public record ProductId(Guid Value);

```

---

### 3.2.2. Entités

Les **Entités** sont définies par leur identité.

```csharp
 Copier
// Domain/Entities/Customer.cs
public class Customer
{
    public CustomerId Id { get; private set; }
    public string Name { get; private set; }
    public Address Address { get; private set; }

    public Customer(CustomerId id, string name, Address address)
    {
        Id = id;
        Name = name;
        Address = address;
    }
}

// Domain/Entities/Product.cs
public class Product
{
    public ProductId Id { get; private set; }
    public string Name { get; private set; }
    public decimal Price { get; private set; }

    public Product(ProductId id, string name, decimal price)
    {
        Id = id;
        Name = name;
        Price = price;
    }
}

```

---

### 3.2.3. Aggregate Root : Order

Un **Aggregate** est un groupe d’objets traités comme une unité. Ici, `Order` est l’**aggregate root**.

```csharp
 Copier
// Domain/Entities/Order.cs
public class Order
{
    public OrderId Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public DateTime OrderDate { get; private set; }
    public Address ShippingAddress { get; private set; }
    public IReadOnlyCollection<OrderLine> Lines => _lines.AsReadOnly();
    private readonly List<OrderLine> _lines = new();

    public Order(OrderId id, CustomerId customerId, Address shippingAddress)
    {
        Id = id;
        CustomerId = customerId;
        OrderDate = DateTime.Now;
        ShippingAddress = shippingAddress;
    }

    public void AddLine(ProductId productId, string productName, decimal price, int quantity)
    {
        if (quantity <= 0)
            throw new InvalidOperationException("La quantité doit être supérieure à zéro.");

        var existingLine = _lines.FirstOrDefault(l => l.ProductId == productId);
        if (existingLine != null)
        {
            existingLine.IncreaseQuantity(quantity);
        }
        else
        {
            _lines.Add(new OrderLine(productId, productName, price, quantity));
        }
    }

    public decimal TotalAmount => _lines.Sum(l => l.TotalPrice);
}

// Domain/Entities/OrderLine.cs
public class OrderLine
{
    public ProductId ProductId { get; private set; }
    public string ProductName { get; private set; }
    public decimal Price { get; private set; }
    public int Quantity { get; private set; }

    public OrderLine(ProductId productId, string productName, decimal price, int quantity)
    {
        ProductId = productId;
        ProductName = productName;
        Price = price;
        Quantity = quantity;
    }

    public void IncreaseQuantity(int quantity)
    {
        if (quantity <= 0)
            throw new InvalidOperationException("La quantité doit être supérieure à zéro.");

        Quantity += quantity;
    }

    public decimal TotalPrice => Price * Quantity;
}

```

---

### 3.2.4. Domain Service

Un **Domain Service** contient la logique métier qui ne appartient pas à une entité spécifique.

```csharp
 Copier
// Domain/Services/OrderPricingService.cs
public class OrderPricingService
{
    public decimal CalculateShippingCost(Order order)
    {
        // Logique métier pour calculer les frais de livraison
        return order.TotalAmount > 100 ? 0 : 10;
    }
}

```

---

### 3.2.5. Repository Interface

Le **Repository** est une interface pour accéder aux aggregates.

```csharp
 Copier
// Domain/Repositories/IOrderRepository.cs
public interface IOrderRepository
{
    Task<Order> GetByIdAsync(OrderId id);
    Task AddAsync(Order order);
    Task UpdateAsync(Order order);
}

```

---

### 3.3. Couche Application

### 3.3.1. DTOs (Data Transfer Objects)

Les **DTOs** sont utilisés pour transférer des données entre les couches.

```csharp
 Copier
// Application/DTOs/OrderDto.cs
public record OrderDto(
    Guid Id,
    Guid CustomerId,
    DateTime OrderDate,
    Address ShippingAddress,
    IEnumerable<OrderLineDto> Lines,
    decimal TotalAmount,
    decimal ShippingCost);

// Application/DTOs/OrderLineDto.cs
public record OrderLineDto(
    Guid ProductId,
    string ProductName,
    decimal Price,
    int Quantity);

```

---

### 3.3.2. Application Service

Le **Application Service** coordonne les opérations du domaine.

```csharp
 Copier
// Application/Services/OrderService.cs
public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly OrderPricingService _pricingService;

    public OrderService(IOrderRepository orderRepository, OrderPricingService pricingService)
    {
        _orderRepository = orderRepository;
        _pricingService = pricingService;
    }

    public async Task<OrderDto> CreateOrderAsync(Guid customerId, Address shippingAddress)
    {
        var order = new Order(new OrderId(Guid.NewGuid()), new CustomerId(customerId), shippingAddress);
        await _orderRepository.AddAsync(order);
        var shippingCost = _pricingService.CalculateShippingCost(order);

        return new OrderDto(
            order.Id.Value,
            order.CustomerId.Value,
            order.OrderDate,
            order.ShippingAddress,
            order.Lines.Select(l => new OrderLineDto(l.ProductId.Value, l.ProductName, l.Price, l.Quantity)),
            order.TotalAmount,
            shippingCost);
    }

    public async Task AddProductToOrderAsync(Guid orderId, Guid productId, string productName, decimal price, int quantity)
    {
        var order = await _orderRepository.GetByIdAsync(new OrderId(orderId));
        order.AddLine(new ProductId(productId), productName, price, quantity);
        await _orderRepository.UpdateAsync(order);
    }
}

```

---

### 3.4. Couche Infrastructure

### 3.4.1. Implémentation du Repository

Implémentation concrète du repository utilisant Entity Framework Core.

```csharp
 Copier
// Infrastructure/Repositories/OrderRepository.cs
public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Order> GetByIdAsync(OrderId id)
    {
        return await _context.Orders
            .Include(o => o.Lines)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task AddAsync(Order order)
    {
        await _context.Orders.AddAsync(order);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Order order)
    {
        _context.Orders.Update(order);
        await _context.SaveChangesAsync();
    }
}

```

---

### 3.4.2. Configuration de Entity Framework Core

```csharp
 Copier
// Infrastructure/AppDbContext.cs
public class AppDbContext : DbContext
{
    public DbSet<Order> Orders { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(o => o.Id);
            entity.OwnsOne(o => o.ShippingAddress);
            entity.HasMany(o => o.Lines).WithOne().HasForeignKey("OrderId");
        });

        modelBuilder.Entity<OrderLine>(entity =>
        {
            entity.HasKey(l => new { l.OrderId, l.ProductId });
        });
    }
}

```

---

### 3.5. Couche Presentation

### 3.5.1. API Controller

Le **Controller** expose les fonctionnalités via une API REST.

```csharp
 Copier
// Presentation/Controllers/OrdersController.cs
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        var address = new Address(request.Street, request.City, request.PostalCode, request.Country);
        var orderDto = await _orderService.CreateOrderAsync(request.CustomerId, address);
        return CreatedAtAction(nameof(GetOrder), new { id = orderDto.Id }, orderDto);
    }

    [HttpPost("{id}/lines")]
    public async Task<IActionResult> AddProductToOrder(Guid id, [FromBody] AddProductRequest request)
    {
        await _orderService.AddProductToOrderAsync(id, request.ProductId, request.ProductName, request.Price, request.Quantity);
        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrder(Guid id)
    {
        // Implémentation pour récupérer une commande
        return Ok();
    }
}

// Presentation/Requests/CreateOrderRequest.cs
public record CreateOrderRequest(
    Guid CustomerId,
    string Street,
    string City,
    string PostalCode,
    string Country);

// Presentation/Requests/AddProductRequest.cs
public record AddProductRequest(
    Guid ProductId,
    string ProductName,
    decimal Price,
    int Quantity);

```

---

### 4. Configuration de l’Application

### 4.1. Injection de Dépendances

Dans `Program.cs`, configurez les services et le contexte de base de données :

```csharp
 Copier
var builder = WebApplication.CreateBuilder(args);

// Ajouter le contexte de base de données
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Ajouter les services du domaine et de l'application
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<OrderPricingService>();
builder.Services.AddScoped<OrderService>();

builder.Services.AddControllers();
var app = builder.Build();

app.MapControllers();
app.Run();

```

---

### 5. Bonnes Pratiques DDD

Concept

Bonnes Pratiques

**Ubiquitous Language**

Utiliser un langage commun avec les experts métier.

**Bounded Context**

Définir clairement les limites du contexte pour éviter les ambiguïtés.

**Aggregates**

Ne charger que l’aggregate root depuis le repository.

**Entités**

Éviter l’anémie du modèle : inclure la logique métier dans les entités.

**Value Objects**

Les rendre immuables et sans identité.

**Repositories**

Utiliser des interfaces pour découpler le domaine de l’infrastructure.

**Application Services**

Garder les services minces : déléguer la logique métier au domaine.

**Transactions**

Gérer les transactions au niveau de l’application service.

---

### 6. Exemple de Test Unitaire

### 6.1. Test du Domain Service

```csharp
 Copier
// Tests/Domain/Services/OrderPricingServiceTests.cs
[TestClass]
public class OrderPricingServiceTests
{
    [TestMethod]
    public void CalculateShippingCost_OrderOver100_ReturnsZero()
    {
        // Arrange
        var order = new Order(new OrderId(Guid.NewGuid()), new CustomerId(Guid.NewGuid()), new Address("123 Rue", "Paris", "75000", "France"));
        order.AddLine(new ProductId(Guid.NewGuid()), "Produit 1", 60, 2); // Total = 120
        var pricingService = new OrderPricingService();

        // Act
        var shippingCost = pricingService.CalculateShippingCost(order);

        // Assert
        Assert.AreEqual(0, shippingCost);
    }
}

```

---

### 6.2. Test du Application Service

```csharp
 Copier
// Tests/Application/Services/OrderServiceTests.cs
[TestClass]
public class OrderServiceTests
{
    [TestMethod]
    public async Task CreateOrderAsync_CreatesOrderSuccessfully()
    {
        // Arrange
        var mockRepository = new Mock<IOrderRepository>();
        var pricingService = new OrderPricingService();
        var orderService = new OrderService(mockRepository.Object, pricingService);
        var address = new Address("123 Rue", "Paris", "75000", "France");

        // Act
        var orderDto = await orderService.CreateOrderAsync(Guid.NewGuid(), address);

        // Assert
        Assert.IsNotNull(orderDto);
        mockRepository.Verify(r => r.AddAsync(It.IsAny<Order>()), Times.Once);
    }
}

```

---

### 7. Résumé des Responsabilités

Couche

Responsabilité

**Domain**

Contient la logique métier pure (entités, value objects, aggregates, services).

**Application**

Coordonne les opérations du domaine et gère les transactions.

**Infrastructure**

Implémente les détails techniques (persistance, services externes).

**Presentation**

Expose les fonctionnalités via une interface utilisateur ou une API.

---

### 8. Ressources Complémentaires

- **Livre** : *Domain-Driven Design: Tackling Complexity in the Heart of Software* (Eric Evans)
- **Documentation** : [Microsoft – DDD avec .NET](https://learn.microsoft.com/fr-fr/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice)
- **Outils** : Entity Framework Core, MediatR (pour les commandes et requêtes), AutoMapper (pour les DTOs)

---

### 9. Quand Utiliser le DDD ?

- **Pour** : Applications avec une logique métier complexe et évolutive.
- **Contre** : Applications simples ou CRUD (Create-Read-Update-Delete) sans règles métier spécifiques.

### Bonnes pratiques

### Gestion des Erreurs

- Utiliser des exceptions spécifiques (`ArgumentNullException`).
- Ne pas laisser les blocs `catch` vides.
- Tracer les erreurs critiques pour un suivi efficace.

### Performance

- Utiliser `StringBuilder` pour les concaténations en boucle.
- Optimiser les requêtes LINQ (filtrage précoce, éviter les appels multiples).
- Utiliser la programmation asynchrone pour les opérations d’E/S.
- Gérer la mémoire efficacement (éviter les allocations inutiles, utiliser des structs).

### Sécurité

- Valider les entrées pour éviter les erreurs logiques et les vulnérabilités.
- Se protéger contre les injections SQL (utiliser des paramètres de requête).
- Effectuer des revues de code régulières pour détecter les failles.

### AutoMapper

# AutoMapper - Guide de référence

## 📚 Vue d'ensemble

AutoMapper est une bibliothèque de mapping objet-objet pour .NET qui permet de transformer automatiquement un objet d'un type vers un autre type, en évitant d'écrire manuellement du code de mapping répétitif.

**Cas d'usage typique** : Transformer des entités de domaine (modèles) en DTOs (Data Transfer Objects) pour les APIs ou l'UI.

---

## 🎯 Pourquoi utiliser AutoMapper ?

### ✅ Avantages

- **Moins de code boilerplate** : Évite d'écrire des mappings manuels propriété par propriété
- **Maintenabilité** : Centralise la logique de mapping
- **Testabilité** : Les configurations de mapping peuvent être testées indépendamment
- **Performance** : Optimisé pour des transformations rapides

### ⚠️ Inconvénients

- **Courbe d'apprentissage** : Configuration initiale peut sembler complexe
- **Magie noire** : Les mappings implicites peuvent masquer des bugs
- **Debugging** : Plus difficile de tracer les erreurs de mapping

---

## 🔧 Installation

```bash
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

```

---

## 📝 Configuration de base

### 1. Créer un profil de mapping

Les profils AutoMapper définissent les règles de transformation entre types.

```csharp
using AutoMapper;

public class MonProfilMapping : Profile
{
    public MonProfilMapping()
    {
        // Mapping simple (convention par nom de propriété)
        CreateMap<Source, Destination>();

        // Mapping bidirectionnel
        CreateMap<Source, Destination>().ReverseMap();

        // Mapping avec configuration personnalisée
        CreateMap<Source, Destination>()
            .ForMember(dest => dest.NomComplet,
                opt => opt.MapFrom(src => $"{src.Prenom} {src.Nom}"))
            .ForMember(dest => dest.ProprieteIgnoree,
                opt => opt.Ignore());
    }
}

```

### 2. Enregistrer AutoMapper dans le DI

**Dans Startup.cs ou Program.cs** :

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Scan automatique de tous les profils dans l'assembly
    services.AddAutoMapper(typeof(Startup).Assembly);

    // Ou spécifier explicitement les profils
    services.AddAutoMapper(cfg =>
    {
        cfg.AddProfile<MonProfilMapping>();
        cfg.AddProfile<AutreProfilMapping>();
    });
}

```

### 3. Utiliser AutoMapper

**Via injection de dépendance** :

```csharp
public class MonService
{
    private readonly IMapper _mapper;

    public MonService(IMapper mapper)
    {
        _mapper = mapper;
    }

    public DestinationDto Transformer(Source source)
    {
        return _mapper.Map<DestinationDto>(source);
    }

    public List<DestinationDto> TransformerListe(List<Source> sources)
    {
        return _mapper.Map<List<DestinationDto>>(sources);
    }
}

```

---

## 🎨 Patterns de mapping courants

### Mapping simple (convention par nom)

```csharp
// Source
public class Produit
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public decimal Prix { get; set; }
}

// Destination
public class ProduitDto
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public decimal Prix { get; set; }
}

// Configuration
CreateMap<Produit, ProduitDto>();

// Utilisation
var dto = _mapper.Map<ProduitDto>(produit);

```

### Mapping avec transformation

```csharp
CreateMap<Utilisateur, UtilisateurDto>()
    .ForMember(dest => dest.NomComplet,
        opt => opt.MapFrom(src => $"{src.Prenom} {src.Nom}"))
    .ForMember(dest => dest.Age,
        opt => opt.MapFrom(src => DateTime.Now.Year - src.DateNaissance.Year));

```

### Ignorer des propriétés

```csharp
CreateMap<Utilisateur, UtilisateurDto>()
    .ForMember(dest => dest.MotDePasse, opt => opt.Ignore());

```

### Mapping conditionnel

```csharp
CreateMap<Source, Destination>()
    .ForMember(dest => dest.Propriete,
        opt => opt.Condition(src => src.Propriete != null));

```

### Mapping avec valeur par défaut

```csharp
CreateMap<Source, Destination>()
    .ForMember(dest => dest.Statut,
        opt => opt.NullSubstitute("Actif"));

```

### Mapping de collections

```csharp
CreateMap<Commande, CommandeDto>()
    .ForMember(dest => dest.Lignes,
        opt => opt.MapFrom(src => src.LignesCommande));

// AutoMapper mappe automatiquement les listes si les types éléments sont mappés
CreateMap<LigneCommande, LigneCommandeDto>();

```

### Mapping de hiérarchies (include)

```csharp
CreateMap<ComposantBase, ComposantDto>()
    .Include<Composant, ComposantArbreDto>()
    .Include<LienProduit, ComposantArbreDto>();

CreateMap<Composant, ComposantArbreDto>();
CreateMap<LienProduit, ComposantArbreDto>();

```

---

## 🏗️ Pattern Service de Mapping (meilleure pratique)

Au lieu d'injecter `IMapper` partout, créer un service dédié encapsule la logique de mapping et facilite les tests.

### 1. Définir l'interface

```csharp
public interface IComposantMappingService
{
    Task<ComposantArbreDto> MapToComposantArbreDto(Composant composant, ProductTreeDto productDto);
    Task<ComposantArbreDto> MapToComposantArbreDto(LienProduit lienProduit, ProductTreeDto productDto);
    Task<ComposantArbreDto> MapToComposantArbreDto(ILigne ligne, ProductTreeDto productDto);
    Dictionary<int, CellDataDto> MapCaracteristiquesToDto(List<Caracteristique> caracs, BaseProductDto productDto);
}

```

### 2. Implémenter le service

```csharp
public class ComposantMappingService : IComposantMappingService, ITransientDependency
{
    private readonly IMapper _mapper;

    public ComposantMappingService(IMapper mapper)
    {
        _mapper = mapper;
    }

    public async Task<ComposantArbreDto> MapToComposantArbreDto(Composant composant, ProductTreeDto productDto)
    {
        if (composant == null)
            throw new ArgumentNullException(nameof(composant));

        // Mapping de base via AutoMapper
        var dto = _mapper.Map<ComposantArbreDto>(composant);

        // Logique métier supplémentaire
        dto.ProductId = productDto.Id;
        dto.Children = await MapEnfants(composant, productDto);

        if (composant.Caracteristiques?.Count > 0)
        {
            dto.CellsValue = MapCaracteristiquesToDto(composant.Caracteristiques, productDto);
        }

        return dto;
    }

    public Dictionary<int, CellDataDto> MapCaracteristiquesToDto(List<Caracteristique> caracs, BaseProductDto productDto)
    {
        var result = new Dictionary<int, CellDataDto>();

        foreach (var carac in caracs)
        {
            var dto = _mapper.Map<CellDataDto>(carac);

            // Post-traitement spécifique
            InitializeMaitres(carac, dto);

            if (!string.IsNullOrEmpty(carac.Formule))
            {
                ProcessFormula(carac, dto);
            }

            if (!result.ContainsKey(dto.Code))
            {
                result.Add(dto.Code, dto);
            }
        }

        return result;
    }

    private async Task<List<ComposantArbreDto>> MapEnfants(Composant composant, ProductTreeDto productDto)
    {
        if (composant.Enfants == null || composant.Enfants.Count == 0)
            return new List<ComposantArbreDto>();

        var enfants = new List<ComposantArbreDto>();

        foreach (var enfant in composant.Enfants.OrderBy(e => e.Ordre))
        {
            var enfantDto = await MapToComposantArbreDto(enfant, productDto);
            enfants.Add(enfantDto);
        }

        return enfants;
    }
}

```

### 3. Enregistrer le service

```csharp
// Si utilise l'attribut ITransientDependency (ABP Framework)
// L'enregistrement est automatique

// Sinon, enregistrement manuel
services.AddTransient<IComposantMappingService, ComposantMappingService>();

```

### 4. Utiliser le service

```csharp
public class FormulaServiceCS
{
    private readonly IComposantMappingService _mappingService;

    public FormulaServiceCS(IComposantMappingService mappingService)
    {
        _mappingService = mappingService;
    }

    public async Task<CompactComponentDto> ExplodeIfsComponent(string partCode, string finishCode)
    {
        var comp = await FindIfsCatalog(partCode);

        // Utilisation du service de mapping
        ProductTreeDto prod = new ProductTreeDto();
        var component = await _mappingService.MapToComposantArbreDto(comp, prod);

        return component;
    }
}

```

---

## 🧪 Tester AutoMapper

### Tester la configuration

```csharp
[Fact]
public void AutoMapper_Configuration_Should_Be_Valid()
{
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<MonProfilMapping>();
    });

    // Lance une exception si la config est invalide
    config.AssertConfigurationIsValid();
}

```

### Mocker IMapper dans les tests

```csharp
public class MonServiceTests
{
    [Fact]
    public void MonTest()
    {
        // Setup du mock
        var mockMapper = new Mock<IMapper>();
        mockMapper
            .Setup(m => m.Map<DestinationDto>(It.IsAny<Source>()))
            .Returns((Source src) => new DestinationDto
            {
                Id = src.Id,
                Nom = src.Nom
            });

        var service = new MonService(mockMapper.Object);

        // Test...
    }
}

```

### Utiliser le vrai mapper dans les tests

```csharp
[Fact]
public void Test_Avec_Vrai_Mapper()
{
    var config = new MapperConfiguration(cfg =>
    {
        cfg.AddProfile<MonProfilMapping>();
    });
    var mapper = config.CreateMapper();

    var service = new MonService(mapper);

    // Test...
}

```

---

## 🚨 Pièges courants et solutions

### 1. Oubli d'enregistrer un profil

**Symptôme** : `AutoMapperMappingException: Missing type map configuration`

**Solution** : Vérifier que le profil est bien scanné ou ajouté manuellement

```csharp
services.AddAutoMapper(typeof(MonProfilMapping).Assembly);

```

### 2. Mapping circulaire

**Symptôme** : `StackOverflowException`

**Solution** : Utiliser `MaxDepth` ou ignorer la propriété circulaire

```csharp
CreateMap<Parent, ParentDto>()
    .ForMember(dest => dest.Enfants, opt => opt.MaxDepth(1));

```

### 3. Propriété non mappée involontairement

**Symptôme** : Propriété reste à `null` ou valeur par défaut

**Solution** : Vérifier les noms de propriétés ou utiliser `ForMember`

```csharp
CreateMap<Source, Destination>()
    .ForMember(dest => dest.ProprieteAvecNomDifferent,
        opt => opt.MapFrom(src => src.ProprieteSource));

```

### 4. Tests qui cassent après ajout de mapper

**Symptôme** : Tous les tests échouent avec `ArgumentNullException` ou erreur de constructeur

**Solution** : Ajouter le mock dans le helper de test

```csharp
private Mock<IMapper> _mockMapper;

public TestHelper()
{
    _mockMapper = new Mock<IMapper>();
}

public ServiceSousTest Build()
{
    return new ServiceSousTest(
        // ... autres dépendances
        _mockMapper.Object  // ← Ne pas oublier !
    );
}

```

### 5. Performance avec grandes collections

**Symptôme** : Lenteur lors du mapping de milliers d'objets

**Solution** : Utiliser `ProjectTo` avec IQueryable (EF Core)

```csharp
// ❌ Lent - charge tout en mémoire puis mappe
var dtos = _mapper.Map<List<ProduitDto>>(await context.Produits.ToListAsync());

// ✅ Rapide - projette directement en SQL
var dtos = await context.Produits
    .ProjectTo<ProduitDto>(_mapper.ConfigurationProvider)
    .ToListAsync();

```

---

## 📊 Comparaison AutoMapper vs Mapping manuel

| Critère | AutoMapper | Mapping manuel |
| --- | --- | --- |
| **Verbosité** | ⭐⭐⭐⭐⭐ Minimal | ⭐⭐ Répétitif |
| **Performance** | ⭐⭐⭐⭐ Très bon | ⭐⭐⭐⭐⭐ Optimal |
| **Maintenabilité** | ⭐⭐⭐⭐ Centralisé | ⭐⭐⭐ Dispersé |
| **Debugging** | ⭐⭐⭐ Moyen | ⭐⭐⭐⭐⭐ Facile |
| **Contrôle** | ⭐⭐⭐ Conventions | ⭐⭐⭐⭐⭐ Total |

**Recommandation** : Utiliser AutoMapper pour les mappings simples et répétitifs. Pour les transformations complexes avec beaucoup de logique métier, envisager du mapping manuel ou hybride (AutoMapper + post-traitement).

---

## 🔗 Ressources

- **Documentation officielle** : https://docs.automapper.org/
- **GitHub** : https://github.com/AutoMapper/AutoMapper
- **NuGet** : https://www.nuget.org/packages/AutoMapper

---

## 📝 Checklist d'implémentation

- [ ]  Installer les packages AutoMapper
- [ ]  Créer un ou plusieurs profils de mapping
- [ ]  Enregistrer AutoMapper dans le DI
- [ ]  Tester la configuration avec `AssertConfigurationIsValid()`
- [ ]  Créer un service de mapping dédié si logique complexe
- [ ]  Mettre à jour les tests (ajouter les mocks)
- [ ]  Documenter les mappings non-conventionnels

---

*Dernière mise à jour : 2025*

### Tests Unitaires

# Notes de référence : Tests unitaires en C# avec xUnit et Moq

*Synthèse de bonnes pratiques tirées d'un projet réel de calcul de formules*

---

## 1. Structure générale d'un test

### Anatomie d'un test unitaire

```csharp
[Fact]
public async Task MethodName_Should_ExpectedBehavior_When_Condition()
{
    // ARRANGE - Préparer les données et dépendances
    var input = ...;
    var mock = new Mock<IDependency>();

    // ACT - Exécuter la méthode à tester
    var result = await service.Method(input);

    // ASSERT - Vérifier le résultat
    result.ShouldBe(expected);
}

```

### Convention de nommage

- **Format** : `MethodName_Should_ExpectedBehavior_When_Condition`
- **Exemples** :
    - `UpdateCellAndRefresh_Should_Execute_Formula_And_Return_Result`
    - `Cl_Should_Return_Null_When_Guid_Not_Found`
    - `InitialiseProduct_Should_Throw_On_Circular_Dependencies`

---

## 2. Utilisation de Moq pour simuler les dépendances

### Créer un mock

```csharp
private Mock<ICaracteristiqueRepository> _mockRepository;

public TestClass()
{
    _mockRepository = new Mock<ICaracteristiqueRepository>();
}

```

### Configurer le comportement d'un mock

```csharp
// Retourner une valeur spécifique
_mockRepository
    .Setup(r => r.FindAsync(id, It.IsAny<bool>(), It.IsAny<CancellationToken>()))
    .ReturnsAsync(caracteristique);

// Retourner une valeur basée sur les paramètres
_mockRepository
    .Setup(r => r.GetCaracsWithSlaveAsync(It.IsAny<Guid>()))
    .ReturnsAsync((Guid productId) =>
        _caracs.Where(c => c.ProduitId == productId).ToList());

// Pour les méthodes asynchrones
_mockService
    .Setup(s => s.GetPrice(It.IsAny<string>(), It.IsAny<string>(),
                          It.IsAny<string>(), It.IsAny<Guid>(), It.IsAny<Guid?>()))
    .ReturnsAsync("100");

```

### Vérifier les appels

```csharp
// Vérifier qu'une méthode a été appelée
_mockRepository.Verify(
    r => r.GetCaracsWithSlaveAsync(productId),
    Times.Once()
);

// Vérifier qu'une méthode n'a jamais été appelée
_mockEngine.Verify(
    e => e.Execute(It.IsAny<string>(), It.IsAny<FormulaContext>()),
    Times.Never()
);

// Vérifier avec des critères spécifiques
_mockRepository.Verify(
    r => r.FindProduit(It.Is<ProductSearchParameter>(p =>
        p.ProductId == productId &&
        p.ChargePosition == false &&
        p.ClonerLien == false
    )),
    Times.Once()
);

```

### Capturer les paramètres passés

```csharp
FormulaContext capturedContext = null;

_mockEngine
    .Setup(e => e.Execute(It.IsAny<string>(), It.IsAny<FormulaContext>()))
    .Callback<string, IFormulaContext>((formula, ctx) =>
    {
        capturedContext = (FormulaContext)ctx;
    })
    .Returns(result);

// Ensuite, vérifier les propriétés du contexte capturé
capturedContext.ShouldNotBeNull();
capturedContext.CompanyId.ShouldBe(expectedCompanyId);

```

---

## 3. Pattern Builder pour simplifier les tests

### Principe

Créer une classe helper qui encapsule la logique de création des mocks et de configuration des tests.

### Exemple d'implémentation

```csharp
public class FormulaContextBuilder
{
    private Dictionary<Guid, Caracteristique> _allCaracs = new();
    private Dictionary<string, PricingEntry> _allParams = new();
    private Mock<ICaracteristiqueRepository> _caracRepoMock;
    private Mock<IPriceSheetService> _priceServMock;

    public FormulaContextBuilder()
    {
        _caracRepoMock = new Mock<ICaracteristiqueRepository>();
        _priceServMock = new Mock<IPriceSheetService>();
    }

    public FormulaContextBuilder WithCarac(Guid id, string valeur, int codeAtt, Guid? parentId)
    {
        var carac = new Caracteristique(id)
        {
            Valeur = valeur,
            CodeAttribut = codeAtt,
            ParentId = parentId ?? Guid.Empty
        };

        _allCaracs[id] = carac;

        _caracRepoMock
            .Setup(r => r.FindAsync(id, It.IsAny<bool>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(carac);

        return this;
    }

    public FormulaContextBuilder WithParam(string code, string value)
    {
        _allParams[code] = new PricingEntry { Code = code, Value = value };
        return this;
    }

    public FormulaContext Build()
    {
        return new FormulaContext(
            _caracRepoMock.Object,
            _priceServMock.Object
        )
        {
            AllCaracs = _allCaracs,
            AllParams = _allParams
        };
    }

    // Accès aux mocks pour vérifications
    public Mock<ICaracteristiqueRepository> CaracRepositoryMock() => _caracRepoMock;
}

```

### Utilisation dans les tests

```csharp
[Fact]
public void Param_Should_Return_Param_Found_As_Decimal()
{
    // ARRANGE
    var context = new FormulaContextBuilder()
        .WithParam("AR-12", "20")
        .Build();

    // ACT
    var result = context.Param("AR-12");

    // ASSERT
    result.ShouldBeOfType<Decimal>();
    result.ShouldBe(20);
}

```

### Avantages du pattern Builder

- Code de test plus lisible et concis
- Réutilisation facile des configurations
- Séparation claire entre la préparation et l'exécution
- Facilite la maintenance (changements centralisés)

---

## 4. Tests avec Shouldly

### Assertions de base

```csharp
// Égalité
result.ShouldBe(expected);

// Types
result.ShouldBeOfType<string>();

// Nullité
result.ShouldBeNull();
result.ShouldNotBeNull();

// Collections
list.ShouldBeEmpty();
list.ShouldNotBeEmpty();
list.Count.ShouldBe(3);
list.ShouldContain(item);

```

### Assertions avancées

```csharp
// Comparaisons
value.ShouldBeGreaterThan(10);
value.ShouldBeLessThanOrEqualTo(100);

// Exceptions
Should.Throw<UserFriendlyException>(() => service.Method());
await Should.ThrowAsync<UserFriendlyException>(service.MethodAsync());

// JSON
var deserialize = () => JsonSerializer.Deserialize<MyType>(json);
deserialize.ShouldNotThrow();

```

---

## 5. Tests de comportements complexes

### Tester les dépendances en cascade

```csharp
[Fact]
public async Task UpdateCellAndRefresh_Should_Handle_Deep_Dependencies()
{
    // A dépend de B qui dépend de C
    var carac1 = new Caracteristique { Valeur = "4", Esclaves = [carac2Id] };
    var carac2 = new Caracteristique { Formule = "cl('carac1') * 2", Esclaves = [carac3Id] };
    var carac3 = new Caracteristique { Formule = "cl('carac2') * 2" };

    var helper = new FormulaServiceTestHelper()
        .WithCaracs(carac1, carac2, carac3)
        .WithEngineExecution("cl('carac1') * 2", 8)
        .WithEngineExecution("cl('carac2') * 2", 16);

    var result = await helper.UpdateCellAndRefresh(dto);

    result.Count.ShouldBe(2);
    result.First(r => r.Id == carac2Id).Valeur.ShouldBe("8");
    result.First(r => r.Id == carac3Id).Valeur.ShouldBe("16");
}

```

### Tester l'ordre d'exécution

```csharp
[Fact]
public async Task Should_Calculate_Masters_Before_Slaves()
{
    var executionOrder = new List<string>();

    helper.WithEngineExecutionCallback((formula, ctx) =>
    {
        executionOrder.Add(formula);
        return formula == "50" ? 50 : 100;
    });

    await service.InitialiseProduct(productId);

    executionOrder[0].ShouldBe("50");           // Maître d'abord
    executionOrder[1].ShouldBe("cl('xxxx') * 2"); // Puis esclave
}

```

### Tester les cas limites

```csharp
[Fact]
public async Task Should_Handle_Not_Existing_Carac()
{
    var helper = new FormulaServiceTestHelper()
        .WithCaracs()  // Aucune carac
        .Build();

    var result = await helper.UpdateCellAndRefresh(dto);

    result.ShouldBeEmpty();
}

[Fact]
public async Task Should_Throw_On_Circular_Dependencies()
{
    // A dépend de B, B dépend de C, C dépend de A
    var carac1 = new Caracteristique
    {
        Formule = "cl('carac3') * 2",
        LienMaitres = new List<LienCaracteristique>
        {
            new LienCaracteristique { MaitreId = carac3Id }
        }
    };
    // ... même logique pour carac2 et carac3

    await Should.ThrowAsync<UserFriendlyException>(
        helper.InitialiseProduct(productId)
    );
}

```

---

## 6. Tests de conversion de types

### Utiliser [Theory] pour tester plusieurs valeurs

```csharp
[Theory]
[InlineData(200, "200")]
[InlineData(0, "0")]
[InlineData(3.14, "3.14")]
public async Task Numerics_Should_Be_Converted(double input, string expected)
{
    var helper = new FormulaServiceTestHelper()
        .WithEngineExecutionDefault(input)
        .Build();

    var result = await helper.UpdateCellAndRefresh(dto);

    result[0].Valeur.ShouldBe(expected);
}

[Theory]
[InlineData(true, "true")]
[InlineData(false, "false")]
public async Task Booleans_Should_Be_Returned_With_LowerCase(bool input, string expected)
{
    // ...
}

```

### Tester les types complexes

```csharp
[Fact]
public async Task ComplexObjects_Should_Be_Converted()
{
    var complexObj = new Dictionary<string, object>
    {
        { "prix", 100.5 },
        { "devise", "EUR" }
    };

    var helper = new FormulaServiceTestHelper()
        .WithEngineExecutionDefault(complexObj)
        .Build();

    var result = await helper.UpdateCellAndRefresh(dto);

    result[0].IsJson.ShouldBeTrue();

    var deserialize = () => JsonSerializer.Deserialize<Dictionary<string, object>>(result[0].Valeur);
    deserialize.ShouldNotThrow();
}

```

---

## 7. Bonnes pratiques apprises

### Organisation des tests

- **Un fichier par classe testée** : `FormulaServiceTests.cs` pour `FormulaServiceCS.cs`
- **Regrouper par fonctionnalité** : utiliser `#region` pour séparer les groupes de tests
- **Un test = un comportement** : éviter de tester plusieurs choses dans un seul test

### Nommage et lisibilité

- **Noms explicites** : le nom du test doit être une phrase qui décrit ce qui est testé
- **Commentaires uniquement si nécessaire** : le code doit se suffire à lui-même
- **Arrange/Act/Assert** : toujours séparer visuellement ces trois parties

### Isolation et indépendance

- **Chaque test doit être indépendant** : ne pas dépendre de l'ordre d'exécution
- **Réinitialiser les mocks** : créer de nouveaux mocks pour chaque test
- **Données de test dédiées** : ne pas partager les données entre tests

### Gestion des dépendances

- **Mock tout ce qui est externe** : base de données, services web, système de fichiers
- **Ne pas mocker ce que vous testez** : seulement les dépendances
- **Vérifier les interactions importantes** : utiliser `Verify()` pour les appels critiques

### Tests asynchrones

- **Toujours utiliser async/await** : même si la méthode est simple
- **Tester les cas d'erreur** : `Should.ThrowAsync<Exception>()`
- **Attention aux deadlocks** : ne jamais utiliser `.Result` ou `.Wait()`

### Performance et maintenance

- **Tests rapides** : éviter les Thread.Sleep() et les vraies dépendances
- **Tests maintenables** : utiliser des builders pour simplifier la création des données
- **Tests documentés** : les tests servent aussi de documentation

---

## 8. Erreurs courantes à éviter

### Erreur 1 : Tester l'implémentation au lieu du comportement

```csharp
// ❌ Mauvais : teste l'implémentation interne
[Fact]
public void Should_Call_Repository_Three_Times()
{
    service.Method();
    _mockRepo.Verify(r => r.Save(), Times.Exactly(3));
}

// ✅ Bon : teste le résultat observable
[Fact]
public void Should_Save_All_Items()
{
    var result = service.Method();
    result.SavedItems.Count.ShouldBe(3);
}

```

### Erreur 2 : Tests trop couplés

```csharp
// ❌ Mauvais : dépend d'un état global
private static Caracteristique _sharedCarac = new Caracteristique();

[Fact]
public void Test1() { _sharedCarac.Valeur = "10"; }

[Fact]
public void Test2() { _sharedCarac.Valeur.ShouldBe("10"); } // Échoue si Test1 n'est pas exécuté avant

// ✅ Bon : chaque test crée ses propres données
[Fact]
public void Test1()
{
    var carac = new Caracteristique { Valeur = "10" };
    // ...
}

```

### Erreur 3 : Assertions multiples sans contexte

```csharp
// ❌ Mauvais : difficile de savoir quelle assertion a échoué
[Fact]
public void Should_Return_Valid_Result()
{
    result.ShouldNotBeNull();
    result.Count.ShouldBe(3);
    result[0].ShouldBe("test");
    result.IsValid.ShouldBeTrue();
}

// ✅ Bon : tests séparés ou assertions groupées logiquement
[Fact]
public void Should_Return_Three_Items()
{
    result.Count.ShouldBe(3);
}

[Fact]
public void First_Item_Should_Be_Test()
{
    result[0].ShouldBe("test");
}

```

### Erreur 4 : Ne pas tester les cas limites

```csharp
// ❌ Incomplet : teste uniquement le cas nominal
[Fact]
public void Should_Process_Value()
{
    var result = service.Process("value");
    result.ShouldNotBeNull();
}

// ✅ Complet : teste tous les cas
[Fact]
public void Should_Process_Valid_Value() { }

[Fact]
public void Should_Return_Null_When_Value_Is_Null() { }

[Fact]
public void Should_Throw_When_Value_Is_Invalid() { }

```

---

## 9. Checklist avant de commit

- [ ]  Tous les tests passent
- [ ]  Les nouveaux tests suivent la convention de nommage
- [ ]  Chaque test est indépendant et isolé
- [ ]  Les cas limites sont couverts (null, empty, invalid)
- [ ]  Les exceptions attendues sont testées
- [ ]  Les mocks sont vérifiés quand nécessaire
- [ ]  Le code de test est lisible et maintenable
- [ ]  Pas de code commenté ou de tests désactivés sans raison

---

## 10. Ressources et outils

### Librairies utilisées

- **xUnit** : Framework de test principal
- **Moq** : Création de mocks et stubs
- **Shouldly** : Assertions fluides et lisibles
- **AutoMapper** : Mapping d'objets (peut nécessiter des tests spécifiques)

### Commandes utiles

```bash
# Exécuter tous les tests
dotnet test

# Exécuter un test spécifique
dotnet test --filter "FullyQualifiedName~MethodName_Should_Behavior"

# Exécuter avec couverture de code
dotnet test /p:CollectCoverage=true

```

### Raccourcis Visual Studio / Rider

- **Ctrl+R, T** : Exécuter tous les tests
- **Ctrl+R, Ctrl+T** : Déboguer tous les tests
- **Ctrl+R, L** : Exécuter les derniers tests

---

*Ces notes sont basées sur une expérience concrète de tests unitaires dans un projet de calcul de formules avec ClearScript, impliquant des dépendances complexes et des conversions de types variées.*

---

### ASP.NET Core (WebApi)

## 1. Mise en place du projet (Linux)

### Prérequis pour Linux

### Installation du SDK .NET 8 LTS

```bash
# Ubuntu/Debian
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update && sudo apt-get install -y dotnet-sdk-8.0
```

### Vérification de l'installation

```bash
dotnet --version  # Doit afficher 8.x.x
dotnet --list-sdks
dotnet --info
```

### Création d'un projet WebAPI

### Commandes CLI de base

```bash
# Créer un nouveau projet WebAPI
dotnet new webapi -n MonAPI
cd MonAPI

# Ajouter des packages essentiels
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlLite
dotnet add package Serilog.AspNetCore
dotnet add package FluentValidation.AspNetCore
dotnet add package Swashbuckle.AspNetCore

# Lancer le projet
dotnet run
# Ou en mode watch (rechargement automatique)
dotnet watch run

```

### Structure typique des dossiers

```
MonAPI/
├── Controllers/           # Contrôleurs API
├── Services/             # Logique métier
├── Repositories/         # Accès aux données
├── Models/              # Modèles de données
│   ├── DTOs/            # Data Transfer Objects
│   └── Entities/        # Entités de base de données
├── Data/                # Configuration EF Core
├── Middleware/          # Middleware personnalisés
├── Extensions/          # Méthodes d'extension
├── Configuration/       # Classes de configuration
├── Program.cs           # Point d'entrée
├── appsettings.json     # Configuration
└── appsettings.Development.json

```

## 2. Architectures logicielles détaillées

### Architecture en couches (Layered Architecture)

### Structure

```
Présentation (API Controllers)
    ↓
Application (Services/Use Cases)
    ↓
Domaine (Business Logic/Entities)
    ↓
Infrastructure (Repositories/Database)

```

### Avantages

- **Séparation claire des responsabilités** : chaque couche a un rôle défini
- **Facilité de maintenance** : modifications localisées par couche
- **Testabilité** : possibilité de mocker chaque couche
- **Compréhension intuitive** : structure familière pour la plupart des développeurs

### Exemple de flux de données

```csharp
// 1. Controller (Présentation)
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        return Ok(user);
    }
}

// 2. Service (Application)
public class UserService : IUserService
{
    private readonly IUserRepository _repository;

    public UserService(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<UserDto> GetUserByIdAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        // Logique métier ici
        return new UserDto { Id = user.Id, Name = user.Name };
    }
}

// 3. Repository (Infrastructure)
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }
}

```

### Clean Architecture

### Principes fondamentaux

1. **Indépendance des frameworks** : le cœur métier ne dépend d'aucun framework
2. **Testabilité** : les règles métier peuvent être testées sans UI, DB ou web
3. **Indépendance de l'UI** : changement d'interface sans impact sur le métier
4. **Indépendance de la base de données** : Oracle, SQL Server, MongoDB... peu importe
5. **Règle de dépendance** : les couches internes ne dépendent jamais des couches externes

### Structure des dossiers

```
MonAPI.Domain/           # Entités, interfaces métier
├── Entities/
├── Interfaces/
└── Exceptions/

MonAPI.Application/      # Use cases, DTOs, interfaces
├── UseCases/
├── DTOs/
├── Interfaces/
└── Validators/

MonAPI.Infrastructure/   # Implémentations concrètes
├── Repositories/
├── Services/
└── Data/

MonAPI.WebAPI/          # Controllers, configuration
├── Controllers/
├── Extensions/
└── Program.cs

```

### Exemple d'implémentation

```csharp
// Domain/Entities/User.cs
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }

    // Logique métier pure
    public bool IsEmailValid() => Email.Contains("@");
}

// Application/UseCases/GetUserUseCase.cs
public class GetUserUseCase
{
    private readonly IUserRepository _repository;

    public GetUserUseCase(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<UserDto> ExecuteAsync(int id)
    {
        var user = await _repository.GetByIdAsync(id);
        if (user == null) throw new UserNotFoundException(id);

        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };
    }
}

```

### CQRS (Command Query Responsibility Segregation)

### Quand l'utiliser

- **Systèmes complexes** avec besoins de lecture/écriture très différents
- **Scalabilité** nécessaire (lecture et écriture séparées)
- **Domaines métier complexes** avec de nombreuses règles de validation
- **Event Sourcing** en complément

### Exemple avec MediatR

```bash
# Installation de MediatR
dotnet add package MediatR
dotnet add package MediatR.Extensions.Microsoft.DependencyInjection

```

```csharp
// Commands/CreateUserCommand.cs
public record CreateUserCommand(string Name, string Email) : IRequest<int>;

public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, int>
{
    private readonly IUserRepository _repository;

    public CreateUserCommandHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var user = new User { Name = request.Name, Email = request.Email };
        await _repository.AddAsync(user);
        return user.Id;
    }
}

// Queries/GetUserQuery.cs
public record GetUserQuery(int Id) : IRequest<UserDto>;

public class GetUserQueryHandler : IRequestHandler<GetUserQuery, UserDto>
{
    private readonly IUserRepository _repository;

    public GetUserQueryHandler(IUserRepository repository)
    {
        _repository = repository;
    }

    public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await _repository.GetByIdAsync(request.Id);
        return new UserDto { Id = user.Id, Name = user.Name, Email = user.Email };
    }
}

// Controller
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<int>> CreateUser(CreateUserCommand command)
    {
        var id = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetUser), new { id }, id);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _mediator.Send(new GetUserQuery(id));
        return Ok(user);
    }
}

```

### Architecture modulaire

### Découpage par fonctionnalités

```
MonAPI/
├── Modules/
│   ├── Users/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Models/
│   │   └── Data/
│   ├── Products/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Models/
│   │   └── Data/
│   └── Orders/
│       ├── Controllers/
│       ├── Services/
│       ├── Models/
│       └── Data/
└── Shared/
    ├── Middleware/
    ├── Extensions/
    └── Common/

```

### Avantages

- **Développement en parallèle** : équipes indépendantes par module
- **Déploiement sélectif** : possibilité de déployer seulement certains modules
- **Maintenance ciblée** : modifications localisées
- **Réutilisabilité** : modules réutilisables dans d'autres projets

### Comparatif des architectures

| Critère | Couches | Clean Architecture | CQRS | Modulaire |
| --- | --- | --- | --- | --- |
| **Complexité** | Faible | Moyenne | Élevée | Moyenne |
| **Courbe d'apprentissage** | Douce | Moyenne | Raide | Douce |
| **Projets petits** | ✅ Excellent | ⚠️ Overkill | ❌ Overkill | ✅ Bon |
| **Projets moyens** | ✅ Bon | ✅ Excellent | ⚠️ À évaluer | ✅ Excellent |
| **Projets complexes** | ⚠️ Limité | ✅ Excellent | ✅ Excellent | ✅ Bon |
| **Testabilité** | ✅ Bonne | ✅ Excellente | ✅ Excellente | ✅ Bonne |
| **Scalabilité** | ⚠️ Limitée | ✅ Bonne | ✅ Excellente | ✅ Excellente |
| **Équipes multiples** | ⚠️ Difficile | ✅ Possible | ✅ Possible | ✅ Excellent |

## 3. Concepts et syntaxes clés

### C# 8+ Features essentielles

### Records (C# 9+)

```csharp
// DTO immutable avec égalité structurelle
public record UserDto(int Id, string Name, string Email);

// Record avec propriétés mutables
public record CreateUserDto
{
    public string Name { get; init; }
    public string Email { get; init; }
}

// Pattern matching avec records
public string GetUserStatus(UserDto user) => user switch
{
    { Email: var email } when email.EndsWith("@admin.com") => "Administrator",
    { Id: var id } when id > 1000 => "Premium User",
    _ => "Standard User"
};

```

### Nullable Reference Types

```csharp
#nullable enable

public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty; // Non-nullable
    public string? Email { get; set; } // Nullable

    public void ProcessEmail()
    {
        // Le compilateur force la vérification null
        if (Email is not null)
        {
            Console.WriteLine(Email.ToUpper());
        }
    }
}

```

### Pattern Matching avancé

```csharp
public async Task<ActionResult> HandleUserAction(UserAction action)
{
    return action switch
    {
        CreateUserAction { Name: var name, Email: var email } =>
            await CreateUser(name, email),
        UpdateUserAction { Id: var id, Name: var name } when id > 0 =>
            await UpdateUser(id, name),
        DeleteUserAction { Id: var id } =>
            await DeleteUser(id),
        _ => BadRequest("Unknown action")
    };
}

```

### ASP.NET Core 8 - Concepts avancés

### Minimal APIs vs Contrôleurs

**Minimal APIs** - Pour APIs simples

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/users/{id:int}", async (int id, IUserService service) =>
{
    var user = await service.GetByIdAsync(id);
    return user is not null ? Results.Ok(user) : Results.NotFound();
});

app.MapPost("/users", async (CreateUserDto dto, IUserService service) =>
{
    var id = await service.CreateAsync(dto);
    return Results.CreatedAtRoute("GetUser", new { id }, new { id });
});

app.Run();

```

**Contrôleurs classiques** - Pour APIs complexes

```csharp
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IValidator<CreateUserDto> _validator;

    public UsersController(IUserService userService, IValidator<CreateUserDto> validator)
    {
        _userService = userService;
        _validator = validator;
    }

    /// <summary>
    /// Récupère un utilisateur par son ID
    /// </summary>
    /// <param name="id">Identifiant de l'utilisateur</param>
    /// <returns>L'utilisateur correspondant</returns>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user is not null ? Ok(user) : NotFound();
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> CreateUser([FromBody] CreateUserDto dto)
    {
        var validationResult = await _validator.ValidateAsync(dto);
        if (!validationResult.IsValid)
        {
            return ValidationProblem(validationResult.ToDictionary());
        }

        var id = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id }, id);
    }
}

```

### Injection de dépendances avancée

```csharp
// Program.cs - Configuration des services
var builder = WebApplication.CreateBuilder(args);

// Scopes de services
builder.Services.AddScoped<IUserService, UserService>();        // Par requête
builder.Services.AddSingleton<IMemoryCache, MemoryCache>();     // Application
builder.Services.AddTransient<IEmailService, EmailService>();   // À chaque injection

// Factory pattern
builder.Services.AddScoped<Func<string, INotificationService>>(provider => key =>
{
    return key switch
    {
        "email" => provider.GetService<IEmailService>(),
        "sms" => provider.GetService<ISmsService>(),
        _ => throw new ArgumentException($"Service type '{key}' is not recognized.")
    };
});

// Configuration conditionnelle
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddScoped<IEmailService, MockEmailService>();
}
else
{
    builder.Services.AddScoped<IEmailService, SmtpEmailService>();
}

// Décorateur pattern
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.Decorate<IUserService, CachedUserService>();
builder.Services.Decorate<IUserService, LoggedUserService>();

```

### Configuration robuste

```csharp
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MonAPI;Trusted_Connection=true;",
    "Redis": "localhost:6379"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key-here",
    "Issuer": "MonAPI",
    "Audience": "MonAPI-Users",
    "ExpirationHours": 24
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "Username": "your-email@gmail.com",
    "Password": "your-app-password"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}

```

```csharp
// Configuration typée
public class JwtSettings
{
    public const string SectionName = "JwtSettings";

    public string SecretKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationHours { get; set; }
}

// Program.cs
var jwtSettings = builder.Configuration.GetSection(JwtSettings.SectionName).Get<JwtSettings>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection(JwtSettings.SectionName));

// Utilisation dans un service
public class TokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }
}

```

### Entity Framework Core optimisé

```csharp
// DbContext configuré
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration des entités
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Name).IsRequired().HasMaxLength(100);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
            entity.HasIndex(u => u.Email).IsUnique();
        });

        // Seed data pour le développement
        modelBuilder.Entity<User>().HasData(
            new User { Id = 1, Name = "Admin", Email = "admin@test.com" }
        );

        base.OnModelCreating(modelBuilder);
    }
}

// Requêtes optimisées
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .AsNoTracking() // Lecture seule pour les performances
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<PagedResult<User>> GetPagedAsync(int page, int size)
    {
        var query = _context.Users.AsNoTracking();

        var total = await query.CountAsync();
        var items = await query
            .Skip((page - 1) * size)
            .Take(size)
            .ToListAsync();

        return new PagedResult<User>
        {
            Items = items,
            TotalCount = total,
            Page = page,
            PageSize = size
        };
    }

    // Chargement optimisé avec Include
    public async Task<User?> GetWithProductsAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Products.Take(10)) // Limite le nombre de produits chargés
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}

```

- AppDbContext exemple
    
    Parfait 👌 allons droit au but. Je te redonne les trois exemples d’AppDbContext dans l’ordre, avec explications à chaque fois.
    
    ---
    🔹 1. Exemple ultra simple (strict nécessaire)
    Modèle
    using System.ComponentModel.DataAnnotations;
    public class Product{    public int Id { get; set; }
        [Required]    [MaxLength(100)]    public string Name { get; set; }
        [Range(0.01, 9999.99)]    public decimal Price { get; set; }}
    AppDbContext
    using Microsoft.EntityFrameworkCore;
    public class AppDbContext : DbContext{    public DbSet<Product> Products { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options)        : base(options) { }}
    👉 Ici :
    EF lit les annotations et génère la table.
    Minimum vital : un DbSet<T> + constructeur.
    
    ---
    🔹 2. Exemple avec bonnes pratiques (full Fluent API)
    AppDbContext
    using Microsoft.EntityFrameworkCore;
    public class AppDbContext : DbContext{    public DbSet<Product> Products { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options)        : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)    {        modelBuilder.Entity<Product>(entity =>        {            entity.ToTable("Products");            entity.HasKey(p => p.Id);
                entity.Property(p => p.Name)                  .IsRequired()                  .HasMaxLength(100);
                entity.Property(p => p.Price)                  .HasColumnType("decimal(10,2)")                  .IsRequired();        });
            base.OnModelCreating(modelBuilder);    }}
    👉 Ici :
    Tout est configuré côté SQL via OnModelCreating.
    Plus verbeux, mais tu maîtrises types exacts, noms, contraintes.
    Pratique quand tu travailles en équipe et que la BDD doit rester cohérente.
    
    ---
    🔹 3. Exemple hybride (annotations = validation, Fluent API = schéma SQL)
    C’est souvent l’approche la plus équilibrée :
    Annotations → règles de validation métier (ex: Required, Range).
    Fluent API → détails techniques de la BDD (noms de tables, types SQL).
    
    Modèle
    using System.ComponentModel.DataAnnotations;
    public class Product{    public int Id { get; set; }
        [Required]    [MaxLength(100)]    public string Name { get; set; }
        [Range(0.01, 9999.99)]    public decimal Price { get; set; }}
    AppDbContext
    using Microsoft.EntityFrameworkCore;
    public class AppDbContext : DbContext{    public DbSet<Product> Products { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options)        : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)    {        modelBuilder.Entity<Product>(entity =>        {            entity.ToTable("Products"); // Table propre et explicite
                entity.Property(p => p.Price)                  .HasColumnType("decimal(10,2)"); // Contrôle du type SQL        });
            base.OnModelCreating(modelBuilder);    }}
    👉 Ici :
    Les annotations assurent la validation côté C# (tu auras des erreurs si tu tentes de sauvegarder un produit sans Name ou avec un Price hors bornes).
    Le Fluent API prend le relais pour le schéma SQL (par ex. forcer decimal(10,2)).
    
    ---
    ⚖️ Résumé comparatif
    Cas	Quand l’utiliser	Avantage
    Exemple 1 (simple)	Petit projet, prototypage	Rapide, lisibleExemple 2 (full Fluent API)	Projet long, équipe, besoin de rigueur SQL	Contrôle total, séparation claireExemple 3 (hybride)	Cas courant	Validation métier en annotations + schéma précis en Fluent API
    
    ---
    👉 Tu veux que je te montre aussi comment tester concrètement ces trois variantes avec une migration EF Core (dotnet ef migrations add ...) et voir la différence dans le SQL généré ?
    

### Validation avec FluentValidation

```csharp
// Installation
// dotnet add package FluentValidation.AspNetCore

// Validator
public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Le nom est obligatoire")
            .Length(2, 50).WithMessage("Le nom doit contenir entre 2 et 50 caractères");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("L'email est obligatoire")
            .EmailAddress().WithMessage("Format d'email invalide")
            .MustAsync(BeUniqueEmail).WithMessage("Cet email est déjà utilisé");
    }

    private async Task<bool> BeUniqueEmail(string email, CancellationToken token)
    {
        // Logique de vérification d'unicité
        return await Task.FromResult(true); // Placeholder
    }
}

// Configuration dans Program.cs
builder.Services.AddValidatorsFromAssemblyContaining<CreateUserDtoValidator>();

```

### Gestion des erreurs centralisée

```csharp
// Middleware de gestion d'erreurs
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Une erreur inattendue s'est produite");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var problemDetails = exception switch
        {
            ValidationException validationEx => new ValidationProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                Title = "Validation Error",
                Status = StatusCodes.Status400BadRequest,
                Detail = "One or more validation errors occurred.",
                Instance = context.Request.Path
            },
            UserNotFoundException => new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.5.4",
                Title = "User Not Found",
                Status = StatusCodes.Status404NotFound,
                Detail = exception.Message,
                Instance = context.Request.Path
            },
            _ => new ProblemDetails
            {
                Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                Title = "Internal Server Error",
                Status = StatusCodes.Status500InternalServerError,
                Detail = "An internal server error occurred.",
                Instance = context.Request.Path
            }
        };

        context.Response.StatusCode = problemDetails.Status ?? 500;
        await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}

// Enregistrement du middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

```

### Sécurité

### Authentification JWT

```csharp
// Installation des packages
// dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

// Configuration JWT dans Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

// Service de génération de tokens
public class TokenService : ITokenService
{
    private readonly JwtSettings _jwtSettings;

    public TokenService(IOptions<JwtSettings> jwtSettings)
    {
        _jwtSettings = jwtSettings.Value;
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim("role", user.Role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtSettings.ExpirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

```

### Autorisation basée sur les rôles

```csharp
// Contrôleur avec autorisation
[ApiController]
[Route("api/[controller]")]
[Authorize] // Authentification requise pour toute l'API
public class UsersController : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin,Manager")] // Autorisation par rôles
    public async Task<ActionResult<List<UserDto>>> GetAllUsers()
    {
        // Logique pour récupérer tous les utilisateurs
    }

    [HttpGet("{id}")]
    [Authorize(Policy = "CanViewUser")] // Autorisation par politique
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        // Vérifier si l'utilisateur peut voir ce profil
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        // Logique d'autorisation...
    }
}

// Configuration des politiques
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("CanViewUser", policy =>
        policy.RequireAuthenticatedUser()
              .RequireAssertion(context =>
                  context.User.IsInRole("Admin") ||
                  context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value ==
                  context.Resource?.ToString()));

```

### Configuration CORS pour production

```csharp
// Configuration CORS sécurisée
builder.Services.AddCors(options =>
{
    options.AddPolicy("ProductionPolicy", builder =>
    {
        builder.WithOrigins("https://mondomaine.com", "https://www.mondomaine.com")
               .WithMethods("GET", "POST", "PUT", "DELETE")
               .WithHeaders("Content-Type", "Authorization")
               .SetIsOriginAllowedToReturnTrue() // Attention: seulement pour le dev
               .AllowCredentials();
    });

    options.AddPolicy("DevelopmentPolicy", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Utilisation conditionnelle
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevelopmentPolicy");
}
else
{
    app.UseCors("ProductionPolicy");
}

```

## 4. Bonnes pratiques approfondies

### Code propre

### Principe de responsabilité unique (SRP)

```csharp
// ❌ Mauvais : classe avec trop de responsabilités
public class UserManager
{
    public async Task<User> CreateUser(CreateUserDto dto)
    {
        // Validation
        if (string.IsNullOrEmpty(dto.Email)) throw new ArgumentException();

        // Envoi d'email
        await SendWelcomeEmail(dto.Email);

        // Sauvegarde en base
        var user = new User { Name = dto.Name, Email = dto.Email };
        await _repository.SaveAsync(user);

        // Log
        _logger.LogInformation("User created: {UserId}", user.Id);

        return user;
    }
}

// ✅ Bon : responsabilités séparées
public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IValidator<CreateUserDto> _validator;
    private readonly INotificationService _notificationService;
    private readonly ILogger<UserService> _logger;

    public async Task<User> CreateUserAsync(CreateUserDto dto)
    {
        await _validator.ValidateAndThrowAsync(dto);

        var user = new User { Name = dto.Name, Email = dto.Email };
        await _repository.SaveAsync(user);

        await _notificationService.SendWelcomeEmailAsync(dto.Email);
        _logger.LogInformation("User created: {UserId}", user.Id);

        return user;
    }
}

```

### Nommage et conventions

```csharp
// ✅ Bonnes pratiques de nommage
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository; // Préfixe _ pour les champs privés
    private readonly ILogger<UserService> _logger;

    // Méthodes async avec suffixe Async
    public async Task<UserDto> GetUserByIdAsync(int userId)
    {
        // Variables avec noms explicites
        var existingUser = await _userRepository.GetByIdAsync(userId);
        if (existingUser == null)
        {
            throw new UserNotFoundException($"User with ID {userId} not found");
        }

        // Constantes pour les valeurs magiques
        const int maxRetries = 3;
        const string defaultRole = "StandardUser";

        return new UserDto
        {
            Id = existingUser.Id,
            Name = existingUser.Name,
            Email = existingUser.Email,
            Role = existingUser.Role ?? defaultRole
        };
    }

    // Méthodes avec un seul niveau d'abstraction
    public async Task<bool> IsUserEligibleForPremiumAsync(int userId)
    {
        var user = await GetUserByIdAsync(userId);
        return HasValidSubscription(user) && HasCompletedProfile(user);
    }

    private static bool HasValidSubscription(UserDto user) =>
        user.SubscriptionEndDate > DateTime.UtcNow;

    private static bool HasCompletedProfile(UserDto user) =>
        !string.IsNullOrEmpty(user.Name) && !string.IsNullOrEmpty(user.Email);
}

```

### Éviter les anti-patterns

```csharp
// ❌ Anti-pattern : God Object
public class UserController : ControllerBase
{
    // Trop de dépendances = responsabilités trop nombreuses
    private readonly IUserService _userService;
    private readonly IEmailService _emailService;
    private readonly IPaymentService _paymentService;
    private readonly IAnalyticsService _analyticsService;
    private readonly IAuditService _auditService;
    // ... 10 autres services
}

// ✅ Solution : Utiliser le pattern Mediator ou diviser en plusieurs contrôleurs
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator; // Une seule dépendance

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var query = new GetUserQuery(id);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}

// ❌ Anti-pattern : Anemic Domain Model
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    // Aucune logique métier
}

// ✅ Rich Domain Model
public class User
{
    public int Id { get; private set; }
    public string Name { get; private set; }
    public string Email { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public UserStatus Status { get; private set; }

    public User(string name, string email)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));
        if (!IsValidEmail(email))
            throw new ArgumentException("Invalid email format", nameof(email));

        Name = name;
        Email = email;
        CreatedAt = DateTime.UtcNow;
        Status = UserStatus.Active;
    }

    public void UpdateEmail(string newEmail)
    {
        if (!IsValidEmail(newEmail))
            throw new ArgumentException("Invalid email format", nameof(newEmail));

        Email = newEmail;
    }

    public bool CanReceiveNotifications() => Status == UserStatus.Active;

    private static bool IsValidEmail(string email) =>
        !string.IsNullOrWhiteSpace(email) && email.Contains("@");
}

```

### Performance

### Async/Await optimisé

```csharp
// ✅ Bonnes pratiques async/await
public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly IEmailService _emailService;

    // Éviter Task.Result et .Wait()
    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        // Validation synchrone avant les opérations async
        if (string.IsNullOrEmpty(dto.Email))
            throw new ArgumentException("Email is required");

        var user = new User(dto.Name, dto.Email);

        // Opérations parallèles quand possible
        var saveTask = _repository.SaveAsync(user);
        var emailTask = _emailService.SendWelcomeEmailAsync(dto.Email);

        await Task.WhenAll(saveTask, emailTask);

        return new UserDto { Id = user.Id, Name = user.Name, Email = user.Email };
    }

    // ConfigureAwait(false) dans les bibliothèques
    public async Task<bool> EmailExistsAsync(string email)
    {
        var user = await _repository.GetByEmailAsync(email).ConfigureAwait(false);
        return user != null;
    }

    // Gestion des exceptions async
    public async Task<List<UserDto>> GetUsersWithRetryAsync()
    {
        const int maxRetries = 3;

        for (int attempt = 0; attempt < maxRetries; attempt++)
        {
            try
            {
                return await _repository.GetAllAsync();
            }
            catch (Exception ex) when (attempt < maxRetries - 1)
            {
                await Task.Delay(TimeSpan.FromSeconds(Math.Pow(2, attempt))); // Exponential backoff
            }
        }

        throw new InvalidOperationException("Failed to retrieve users after multiple attempts");
    }
}

```

### Caching stratégique

```csharp
// Cache en mémoire pour les données fréquemment consultées
public class CachedUserService : IUserService
{
    private readonly IUserService _innerService;
    private readonly IMemoryCache _cache;
    private readonly ILogger<CachedUserService> _logger;

    public CachedUserService(IUserService innerService, IMemoryCache cache, ILogger<CachedUserService> logger)
    {
        _innerService = innerService;
        _cache = cache;
        _logger = logger;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var cacheKey = $"user:{id}";

        if (_cache.TryGetValue(cacheKey, out UserDto cachedUser))
        {
            _logger.LogDebug("User {UserId} retrieved from cache", id);
            return cachedUser;
        }

        var user = await _innerService.GetByIdAsync(id);
        if (user != null)
        {
            var cacheOptions = new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(15),
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1),
                Priority = CacheItemPriority.Normal
            };

            _cache.Set(cacheKey, user, cacheOptions);
            _logger.LogDebug("User {UserId} cached", id);
        }

        return user;
    }

    public async Task<UserDto> UpdateAsync(int id, UpdateUserDto dto)
    {
        var updatedUser = await _innerService.UpdateAsync(id, dto);

        // Invalider le cache après modification
        var cacheKey = $"user:{id}";
        _cache.Remove(cacheKey);
        _logger.LogDebug("Cache invalidated for user {UserId}", id);

        return updatedUser;
    }
}

// Cache distribué avec Redis
public class DistributedCachedUserService : IUserService
{
    private readonly IUserService _innerService;
    private readonly IDistributedCache _distributedCache;
    private readonly JsonSerializerOptions _jsonOptions;

    public DistributedCachedUserService(IUserService innerService, IDistributedCache distributedCache)
    {
        _innerService = innerService;
        _distributedCache = distributedCache;
        _jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var cacheKey = $"user:{id}";
        var cachedValue = await _distributedCache.GetStringAsync(cacheKey);

        if (!string.IsNullOrEmpty(cachedValue))
        {
            return JsonSerializer.Deserialize<UserDto>(cachedValue, _jsonOptions);
        }

        var user = await _innerService.GetByIdAsync(id);
        if (user != null)
        {
            var serializedUser = JsonSerializer.Serialize(user, _jsonOptions);
            var options = new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(30)
            };

            await _distributedCache.SetStringAsync(cacheKey, serializedUser, options);
        }

        return user;
    }
}

```

### Pagination efficace

```csharp
// Modèle de pagination
public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}

public class PagedQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? SortBy { get; set; }
    public bool SortDescending { get; set; } = false;
    public string? SearchTerm { get; set; }

    // Validation des paramètres
    public void Validate()
    {
        if (Page < 1) Page = 1;
        if (PageSize < 1) PageSize = 10;
        if (PageSize > 100) PageSize = 100; // Limite maximale
    }
}

// Repository avec pagination
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    public async Task<PagedResult<UserDto>> GetPagedAsync(PagedQuery query)
    {
        query.Validate();

        var baseQuery = _context.Users.AsNoTracking();

        // Filtrage
        if (!string.IsNullOrEmpty(query.SearchTerm))
        {
            baseQuery = baseQuery.Where(u =>
                u.Name.Contains(query.SearchTerm) ||
                u.Email.Contains(query.SearchTerm));
        }

        // Comptage total (avant pagination)
        var totalCount = await baseQuery.CountAsync();

        // Tri
        baseQuery = query.SortBy?.ToLower() switch
        {
            "name" => query.SortDescending ?
                baseQuery.OrderByDescending(u => u.Name) :
                baseQuery.OrderBy(u => u.Name),
            "email" => query.SortDescending ?
                baseQuery.OrderByDescending(u => u.Email) :
                baseQuery.OrderBy(u => u.Email),
            "created" => query.SortDescending ?
                baseQuery.OrderByDescending(u => u.CreatedAt) :
                baseQuery.OrderBy(u => u.CreatedAt),
            _ => baseQuery.OrderBy(u => u.Id) // Tri par défaut
        };

        // Pagination
        var items = await baseQuery
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email
            })
            .ToListAsync();

        return new PagedResult<UserDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = query.Page,
            PageSize = query.PageSize
        };
    }
}

// Contrôleur avec pagination
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserRepository _repository;

    [HttpGet]
    public async Task<ActionResult<PagedResult<UserDto>>> GetUsers([FromQuery] PagedQuery query)
    {
        var result = await _repository.GetPagedAsync(query);

        // Ajout des headers de pagination
        Response.Headers.Add("X-Total-Count", result.TotalCount.ToString());
        Response.Headers.Add("X-Page", result.Page.ToString());
        Response.Headers.Add("X-Page-Size", result.PageSize.ToString());
        Response.Headers.Add("X-Total-Pages", result.TotalPages.ToString());

        return Ok(result);
    }
}

```

### Tests

### Tests unitaires avec xUnit et Moq

```csharp
// Installation des packages de test
// dotnet add package Microsoft.NET.Test.Sdk
// dotnet add package xunit
// dotnet add package xunit.runner.visualstudio
// dotnet add package Moq
// dotnet add package Microsoft.EntityFrameworkCore.InMemory

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _mockRepository;
    private readonly Mock<ILogger<UserService>> _mockLogger;
    private readonly UserService _userService;

    public UserServiceTests()
    {
        _mockRepository = new Mock<IUserRepository>();
        _mockLogger = new Mock<ILogger<UserService>>();
        _userService = new UserService(_mockRepository.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserExists_ReturnsUser()
    {
        // Arrange
        var userId = 1;
        var expectedUser = new User { Id = userId, Name = "Test User", Email = "test@example.com" };

        _mockRepository.Setup(r => r.GetByIdAsync(userId))
                      .ReturnsAsync(expectedUser);

        // Act
        var result = await _userService.GetByIdAsync(userId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(expectedUser.Id, result.Id);
        Assert.Equal(expectedUser.Name, result.Name);
        Assert.Equal(expectedUser.Email, result.Email);

        // Vérifier que la méthode a été appelée une seule fois
        _mockRepository.Verify(r => r.GetByIdAsync(userId), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserNotExists_ThrowsUserNotFoundException()
    {
        // Arrange
        var userId = 999;
        _mockRepository.Setup(r => r.GetByIdAsync(userId))
                      .ReturnsAsync((User)null);

        // Act & Assert
        var exception = await Assert.ThrowsAsync<UserNotFoundException>(
            () => _userService.GetByIdAsync(userId));

        Assert.Equal($"User with ID {userId} not found", exception.Message);
    }

    [Theory]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("   ")]
    public async Task CreateAsync_WhenNameIsInvalid_ThrowsArgumentException(string invalidName)
    {
        // Arrange
        var dto = new CreateUserDto { Name = invalidName, Email = "test@example.com" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => _userService.CreateAsync(dto));

        Assert.Contains("Name", exception.Message);
    }

    [Fact]
    public async Task CreateAsync_WhenValidData_ReturnsCreatedUser()
    {
        // Arrange
        var dto = new CreateUserDto { Name = "New User", Email = "new@example.com" };
        var savedUser = new User { Id = 1, Name = dto.Name, Email = dto.Email };

        _mockRepository.Setup(r => r.SaveAsync(It.IsAny<User>()))
                      .ReturnsAsync(savedUser);

        // Act
        var result = await _userService.CreateAsync(dto);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(dto.Name, result.Name);
        Assert.Equal(dto.Email, result.Email);
        Assert.True(result.Id > 0);

        // Vérifier les interactions
        _mockRepository.Verify(r => r.SaveAsync(It.Is<User>(u =>
            u.Name == dto.Name && u.Email == dto.Email)), Times.Once);
    }
}

```

### Tests d'intégration avec TestServer

```csharp
public class UsersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public UsersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remplacer la base de données par une base en mémoire
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                // Remplacer les services externes par des mocks
                services.AddScoped<IEmailService, MockEmailService>();
            });

            builder.UseEnvironment("Testing");
        });

        _client = _factory.CreateClient();
    }

    [Fact]
    public async Task GetUsers_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        response.EnsureSuccessStatusCode();

        var responseString = await response.Content.ReadAsStringAsync();
        var users = JsonSerializer.Deserialize<PagedResult<UserDto>>(responseString, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(users);
        Assert.NotNull(users.Items);
    }

    [Fact]
    public async Task CreateUser_WithValidData_ReturnsCreatedUser()
    {
        // Arrange
        var newUser = new CreateUserDto
        {
            Name = "Integration Test User",
            Email = "integration@test.com"
        };

        var jsonContent = JsonSerializer.Serialize(newUser);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/users", content);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var responseString = await response.Content.ReadAsStringAsync();
        var createdUserId = JsonSerializer.Deserialize<int>(responseString);
        Assert.True(createdUserId > 0);

        // Vérifier que l'utilisateur a été créé
        var getResponse = await _client.GetAsync($"/api/users/{createdUserId}");
        getResponse.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task CreateUser_WithInvalidData_ReturnsBadRequest()
    {
        // Arrange
        var invalidUser = new CreateUserDto
        {
            Name = "", // Nom vide
            Email = "invalid-email" // Email invalide
        };

        var jsonContent = JsonSerializer.Serialize(invalidUser);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/users", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var responseString = await response.Content.ReadAsStringAsync();
        var problemDetails = JsonSerializer.Deserialize<ValidationProblemDetails>(responseString, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(problemDetails);
        Assert.Contains("Name", problemDetails.Errors.Keys);
        Assert.Contains("Email", problemDetails.Errors.Keys);
    }
}

```

### Configuration de test

```csharp
// appsettings.Testing.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=:memory:"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "JwtSettings": {
    "SecretKey": "test-secret-key-for-testing-purposes-only",
    "Issuer": "TestAPI",
    "Audience": "TestUsers",
    "ExpirationHours": 1
  }
}

// Mock services pour les tests
public class MockEmailService : IEmailService
{
    public Task SendWelcomeEmailAsync(string email)
    {
        // Log ou stockage pour vérification dans les tests
        Console.WriteLine($"Mock email sent to: {email}");
        return Task.CompletedTask;
    }

    public Task SendPasswordResetEmailAsync(string email, string resetToken)
    {
        Console.WriteLine($"Mock password reset email sent to: {email}");
        return Task.CompletedTask;
    }
}

```

### Logging avec Serilog

```csharp
// Installation
// dotnet add package Serilog.AspNetCore
// dotnet add package Serilog.Sinks.File
// dotnet add package Serilog.Sinks.Console

// Configuration dans Program.cs
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Configuration Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("ApplicationName", "MonAPI")
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext}: {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        path: "logs/api-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {SourceContext}: {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();

try
{
    Log.Information("Starting MonAPI application");

    builder.Host.UseSerilog();

    // ... configuration des services

    var app = builder.Build();

    // Middleware de logging des requêtes
    app.UseSerilogRequestLogging(options =>
    {
        options.MessageTemplate = "Handled {RequestMethod} {RequestPath} in {Elapsed:0.0000}ms";
        options.GetLevel = (httpContext, elapsed, ex) =>
        {
            if (ex != null) return LogEventLevel.Error;
            if (httpContext.Response.StatusCode > 499) return LogEventLevel.Error;
            if (elapsed > 5000) return LogEventLevel.Warning;
            return LogEventLevel.Information;
        };
    });

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}

```

### Utilisation structurée du logging

```csharp
public class UserService : IUserService
{
    private readonly IUserRepository _repository;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository repository, ILogger<UserService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        using var activity = _logger.BeginScope("Getting user {UserId}", id);

        try
        {
            _logger.LogDebug("Fetching user {UserId} from repository", id);

            var user = await _repository.GetByIdAsync(id);

            if (user == null)
            {
                _logger.LogInformation("User {UserId} not found", id);
                return null;
            }

            _logger.LogDebug("Successfully retrieved user {UserId} with email {Email}", id, user.Email);

            return new UserDto { Id = user.Id, Name = user.Name, Email = user.Email };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while fetching user {UserId}", id);
            throw;
        }
    }

    public async Task<UserDto> CreateAsync(CreateUserDto dto)
    {
        using var activity = _logger.BeginScope("Creating user {Email}", dto.Email);

        _logger.LogInformation("Creating new user with email {Email}", dto.Email);

        try
        {
            var user = new User(dto.Name, dto.Email);
            var savedUser = await _repository.SaveAsync(user);

            _logger.LogInformation("User {UserId} created successfully with email {Email}",
                savedUser.Id, savedUser.Email);

            return new UserDto { Id = savedUser.Id, Name = savedUser.Name, Email = savedUser.Email };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create user with email {Email}", dto.Email);
            throw;
        }
    }
}

```

### Documentation avec Swagger/OpenAPI

```csharp
// Configuration avancée de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Mon API",
        Version = "v1",
        Description = "API pour la gestion des utilisateurs et des produits",
        Contact = new OpenApiContact
        {
            Name = "Support",
            Email = "support@monapi.com",
            Url = new Uri("https://monapi.com/support")
        },
        License = new OpenApiLicense
        {
            Name = "MIT",
            Url = new Uri("https://opensource.org/licenses/MIT")
        }
    });

    // Inclusion des commentaires XML
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    options.IncludeXmlComments(xmlPath);

    // Configuration JWT pour Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Exemple de réponses
    options.OperationFilter<SwaggerResponseExamplesFilter>();
});

// Contrôleur avec documentation complète
/// <summary>
/// Contrôleur pour la gestion des utilisateurs
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class UsersController : ControllerBase
{
    /// <summary>
    /// Récupère un utilisateur par son identifiant
    /// </summary>
    /// <param name="id">L'identifiant unique de l'utilisateur</param>
    /// <returns>L'utilisateur correspondant à l'identifiant</returns>
    /// <response code="200">Utilisateur trouvé</response>
    /// <response code="404">Utilisateur non trouvé</response>
    /// <response code="400">Identifiant invalide</response>
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(UserDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UserDto>> GetUser(
        /// <summary>L'identifiant de l'utilisateur (doit être positif)</summary>
        [Range(1, int.MaxValue)] int id)
    {
        var user = await _userService.GetByIdAsync(id);
        return user is not null ? Ok(user) : NotFound();
    }

    /// <summary>
    /// Crée un nouvel utilisateur
    /// </summary>
    /// <param name="dto">Les données du nouvel utilisateur</param>
    /// <returns>L'identifiant du nouvel utilisateur</returns>
    /// <remarks>
    /// Exemple de requête:
    ///
    ///     POST /api/users
    ///     {
    ///         "name": "John Doe",
    ///         "email": "john.doe@example.com"
    ///     }
    ///
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<int>> CreateUser([FromBody] CreateUserDto dto)
    {
        var id = await _userService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetUser), new { id }, id);
    }
}

```

## 5. Intégration avec un front-end externe

### Configuration CORS pour SPA

```csharp
// Configuration CORS complète pour différents environnements
builder.Services.AddCors(options =>
{
    if (builder.Environment.IsDevelopment())
    {
        options.AddPolicy("DevelopmentPolicy", policy =>
        {
            policy.WithOrigins(
                    "http://localhost:3000",    // React dev server
                    "http://localhost:4200",    // Angular dev server
                    "http://localhost:8080"     // Vue dev server
                  )
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials()
                  .SetIsOriginAllowed(_ => true); // Permissif pour le développement
        });
    }
    else
    {
        options.AddPolicy("ProductionPolicy", policy =>
        {
            policy.WithOrigins(
                    "https://monapp.com",
                    "https://www.monapp.com",
                    "https://app.mondomaine.fr"
                  )
                  .WithMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                  .WithHeaders("Content-Type", "Authorization", "X-Requested-With", "Accept")
                  .AllowCredentials()
                  .SetPreflightMaxAge(TimeSpan.FromMinutes(10)); // Cache preflight
        });
    }

    // Politique spécifique pour les webhooks
    options.AddPolicy("WebhookPolicy", policy =>
    {
        policy.WithOrigins("https://webhook-provider.com")
              .WithMethods("POST")
              .WithHeaders("Content-Type", "X-Webhook-Signature");
    });
});

// Application de la politique CORS
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevelopmentPolicy");
}
else
{
    app.UseCors("ProductionPolicy");
}

```

### Format des réponses standardisées

```csharp
// Modèle de réponse standardisé
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Message { get; set; }
    public List<string> Errors { get; set; } = new();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? TraceId { get; set; }
}

// Extension pour créer des réponses standardisées
public static class ApiResponseExtensions
{
    public static ApiResponse<T> ToSuccessResponse<T>(this T data, string? message = null)
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Message = message
        };
    }

    public static ApiResponse<object> ToErrorResponse(this List<string> errors, string? message = null)
    {
        return new ApiResponse<object>
        {
            Success = false,
            Message = message ?? "An error occurred",
            Errors = errors
        };
    }
}

// Contrôleur utilisant les réponses standardisées
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetUser(int id)
    {
        try
        {
            var user = await _userService.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound(new List<string> { $"User with ID {id} not found" }
                    .ToErrorResponse("User not found"));
            }

            return Ok(user.ToSuccessResponse("User retrieved successfully"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new List<string> { ex.Message }
                .ToErrorResponse("Internal server error"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var user = await _userService.CreateAsync(dto);
            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                user.ToSuccessResponse("User created successfully"));
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Errors.Select(e => e.ErrorMessage).ToList()
                .ToErrorResponse("Validation failed"));
        }
    }
}

// Middleware pour ajouter le TraceId automatiquement
public class TraceIdMiddleware
{
    private readonly RequestDelegate _next;

    public TraceIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var traceId = context.TraceIdentifier;
        context.Response.Headers.Add("X-Trace-Id", traceId);

        await _next(context);
    }
}

```

### Versioning d'API

```csharp
// Installation du package de versioning
// dotnet add package Microsoft.AspNetCore.Mvc.Versioning
// dotnet add package Microsoft.AspNetCore.Mvc.Versioning.ApiExplorer

// Configuration du versioning
builder.Services.AddApiVersioning(options =>
{
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),           // /api/v1/users
        new HeaderApiVersionReader("X-Version"),    // Header X-Version: 1.0
        new QueryStringApiVersionReader("version")  // ?version=1.0
    );

    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ApiVersionSelector = new CurrentImplementationApiVersionSelector(options);
});

builder.Services.AddVersionedApiExplorer(setup =>
{
    setup.GroupNameFormat = "'v'VVV";
    setup.SubstituteApiVersionInUrl = true;
});

// Contrôleurs versionnés
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersV1Controller : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDtoV1>> GetUser(int id)
    {
        // Implémentation version 1
        var user = await _userService.GetByIdAsync(id);
        return Ok(new UserDtoV1
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        });
    }
}

[ApiController]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/[controller]")]
public class UsersV2Controller : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDtoV2>> GetUser(int id)
    {
        // Implémentation version 2 avec plus de champs
        var user = await _userService.GetByIdWithProfileAsync(id);
        return Ok(new UserDtoV2
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Profile = new UserProfileDto
            {
                Bio = user.Profile?.Bio,
                Avatar = user.Profile?.Avatar
            },
            CreatedAt = user.CreatedAt,
            LastLoginAt = user.LastLoginAt
        });
    }
}

// DTOs versionnés
public class UserDtoV1
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class UserDtoV2 : UserDtoV1
{
    public UserProfileDto? Profile { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class UserProfileDto
{
    public string? Bio { get; set; }
    public string? Avatar { get; set; }
}

// Configuration Swagger pour le versioning
builder.Services.AddSwaggerGen(options =>
{
    var provider = builder.Services.BuildServiceProvider()
        .GetService<IApiVersionDescriptionProvider>();

    foreach (var description in provider!.ApiVersionDescriptions)
    {
        options.SwaggerDoc(description.GroupName, new OpenApiInfo
        {
            Title = "Mon API",
            Version = description.ApiVersion.ToString(),
            Description = description.IsDeprecated ? " - DEPRECATED" : ""
        });
    }
});

// Configuration des endpoints Swagger
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        var provider = app.Services.GetService<IApiVersionDescriptionProvider>();
        foreach (var description in provider!.ApiVersionDescriptions)
        {
            options.SwaggerEndpoint(
                $"/swagger/{description.GroupName}/swagger.json",
                $"Mon API {description.GroupName.ToUpperInvariant()}");
        }
    });
}

```

### Gestion des WebSockets pour le temps réel

```csharp
// Service de gestion des connexions WebSocket
public class WebSocketConnectionManager
{
    private readonly ConcurrentDictionary<string, WebSocket> _connections = new();

    public void AddConnection(string connectionId, WebSocket webSocket)
    {
        _connections.TryAdd(connectionId, webSocket);
    }

    public void RemoveConnection(string connectionId)
    {
        _connections.TryRemove(connectionId, out _);
    }

    public async Task SendMessageAsync(string connectionId, string message)
    {
        if (_connections.TryGetValue(connectionId, out var webSocket) &&
            webSocket.State == WebSocketState.Open)
        {
            var bytes = Encoding.UTF8.GetBytes(message);
            await webSocket.SendAsync(
                new ArraySegment<byte>(bytes),
                WebSocketMessageType.Text,
                true,
                CancellationToken.None);
        }
    }

    public async Task BroadcastAsync(string message)
    {
        var tasks = _connections.Values
            .Where(ws => ws.State == WebSocketState.Open)
            .Select(async ws =>
            {
                var bytes = Encoding.UTF8.GetBytes(message);
                await ws.SendAsync(
                    new ArraySegment<byte>(bytes),
                    WebSocketMessageType.Text,
                    true,
                    CancellationToken.None);
            });

        await Task.WhenAll(tasks);
    }
}

// Configuration WebSocket
builder.Services.AddSingleton<WebSocketConnectionManager>();

var app = builder.Build();

app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromMinutes(2),
    ReceiveBufferSize = 4 * 1024
});

// Middleware WebSocket
app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws")
    {
        if (context.WebSockets.IsWebSocketRequest)
        {
            var webSocket = await context.WebSockets.AcceptWebSocketAsync();
            var connectionId = Guid.NewGuid().ToString();

            var connectionManager = context.RequestServices.GetService<WebSocketConnectionManager>();
            connectionManager!.AddConnection(connectionId, webSocket);

            await HandleWebSocketAsync(webSocket, connectionId, connectionManager);
        }
        else
        {
            context.Response.StatusCode = 400;
        }
    }
    else
    {
        await next();
    }
});

static async Task HandleWebSocketAsync(WebSocket webSocket, string connectionId, WebSocketConnectionManager connectionManager)
{
    var buffer = new byte[1024 * 4];

    try
    {
        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer),
                CancellationToken.None);

            if (result.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                // Traitement du message reçu
                await ProcessWebSocketMessage(message, connectionId, connectionManager);
            }
            else if (result.MessageType == WebSocketMessageType.Close)
            {
                break;
            }
        }
    }
    finally
    {
        connectionManager.RemoveConnection(connectionId);
        if (webSocket.State != WebSocketState.Closed)
        {
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
        }
    }
}

static async Task ProcessWebSocketMessage(string message, string connectionId, WebSocketConnectionManager connectionManager)
{
    // Exemple de traitement : écho du message
    var response = $"Echo: {message} (from {connectionId})";
    await connectionManager.SendMessageAsync(connectionId, response);
}

```

## 6. Exemples concrets

### Configuration Entity Framework avec PostgreSQL

```bash
# Installation des packages PostgreSQL
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
dotnet add package Microsoft.EntityFrameworkCore.Design

```

```csharp
// Configuration dans Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
    {
        npgsqlOptions.MigrationsAssembly("MonAPI");
        npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3, maxRetryDelay: TimeSpan.FromSeconds(10), null);
    });

    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
});

// Modèle d'entité avec relations
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public UserProfile? Profile { get; set; }
    public List<Order> Orders { get; set; } = new();
}

public class UserProfile
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? Bio { get; set; }
    public string? Avatar { get; set; }
    public DateTime DateOfBirth { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
}

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public decimal TotalAmount { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatus Status { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
    public List<OrderItem> Items { get; set; } = new();
}

public enum OrderStatus
{
    Pending,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

// Configuration du DbContext
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<UserProfile> UserProfiles { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Configuration User
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Name)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(u => u.Email)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.HasIndex(u => u.Email).IsUnique();

            entity.Property(u => u.CreatedAt)
                  .HasDefaultValueSql("CURRENT_TIMESTAMP");
        });

        // Configuration UserProfile (relation 1:1)
        modelBuilder.Entity<UserProfile>(entity =>
        {
            entity.ToTable("user_profiles");
            entity.HasKey(p => p.Id);

            entity.HasOne(p => p.User)
                  .WithOne(u => u.Profile)
                  .HasForeignKey<UserProfile>(p => p.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuration Order (relation 1:N)
        modelBuilder.Entity<Order>(entity =>
        {
            entity.ToTable("orders");
            entity.HasKey(o => o.Id);

            entity.Property(o => o.TotalAmount)
                  .HasColumnType("decimal(18,2)");

            entity.Property(o => o.Status)
                  .HasConversion<string>();

            entity.HasOne(o => o.User)
                  .WithMany(u => u.Orders)
                  .HasForeignKey(o => o.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }
}

// Commandes de migration
/*
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet ef migrations add AddUserProfile
dotnet ef database update
*/

```

### Repository pattern avec génériques

```csharp
// Interface générique du repository
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<PagedResult<T>> GetPagedAsync(int page, int pageSize);
    Task<T> AddAsync(T entity);
    Task<T> UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}

// Implémentation générique
public class Repository<T> : IRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public Repository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(int id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public virtual async Task<PagedResult<T>> GetPagedAsync(int page, int pageSize)
    {
        var totalCount = await _dbSet.CountAsync();
        var items = await _dbSet
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<T>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task<T> UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public virtual async Task DeleteAsync(int id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
            await _context.SaveChangesAsync();
        }
    }

    public virtual async Task<bool> ExistsAsync(int id)
    {
        return await _dbSet.FindAsync(id) != null;
    }
}

// Repository spécialisé pour User
public interface IUserRepository : IRepository<User>
{
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetWithProfileAsync(int id);
    Task<PagedResult<User>> SearchAsync(string searchTerm, int page, int pageSize);
}

public class UserRepository : Repository<User>, IUserRepository
{
    public UserRepository(AppDbContext context) : base(context) { }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetWithProfileAsync(int id)
    {
        return await _dbSet
            .Include(u => u.Profile)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<PagedResult<User>> SearchAsync(string searchTerm, int page, int pageSize)
    {
        var query = _dbSet.AsNoTracking();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(u =>
                u.Name.Contains(searchTerm) ||
                u.Email.Contains(searchTerm));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(u => u.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<User>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }
}

```

### Service avec pattern Unit of Work

```csharp
// Interface Unit of Work
public interface IUnitOfWork : IDisposable
{
    IUserRepository Users { get; }
    IOrderRepository Orders { get; }
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}

// Implémentation Unit of Work
public class UnitOfWork : IUnitOfWork
{
    private readonly AppDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Users = new UserRepository(_context);
        Orders = new OrderRepository(_context);
    }

    public IUserRepository Users { get; }
    public IOrderRepository Orders { get; }

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}

// Service utilisant Unit of Work
public class OrderService : IOrderService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<OrderService> _logger;

    public OrderService(IUnitOfWork unitOfWork, ILogger<OrderService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<OrderDto> CreateOrderAsync(CreateOrderDto dto)
    {
        await _unitOfWork.BeginTransactionAsync();

        try
        {
            // Vérifier que l'utilisateur existe
            var user = await _unitOfWork.Users.GetByIdAsync(dto.UserId);
            if (user == null)
                throw new UserNotFoundException($"User {dto.UserId} not found");

            // Créer la commande
            var order = new Order
            {
                UserId = dto.UserId,
                TotalAmount = dto.Items.Sum(i => i.Price * i.Quantity),
                OrderDate = DateTime.UtcNow,
                Status = OrderStatus.Pending
            };

            await _unitOfWork.Orders.AddAsync(order);

            // Ajouter les articles
            foreach (var itemDto in dto.Items)
            {
                var orderItem = new OrderItem
                {
                    OrderId = order.Id,
                    ProductId = itemDto.ProductId,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price
                };

                // Logique métier supplémentaire...
            }

            await _unitOfWork.SaveChangesAsync();
            await _unitOfWork.CommitTransactionAsync();

            _logger.LogInformation("Order {OrderId} created for user {UserId}", order.Id, dto.UserId);

            return new OrderDto
            {
                Id = order.Id,
                UserId = order.UserId,
                TotalAmount = order.TotalAmount,
                Status = order.Status.ToString()
            };
        }
        catch (Exception ex)
        {
            await _unitOfWork.RollbackTransactionAsync();
            _logger.LogError(ex, "Error creating order for user {UserId}", dto.UserId);
            throw;
        }
    }
}

```

### Contrôleur CRUD complet

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private readonly ILogger<UsersController> _logger;

    public UsersController(
        IUserService userService,
        IMapper mapper,
        ILogger<UsersController> logger)
    {
        _userService = userService;
        _mapper = mapper;
        _logger = logger;
    }

    /// <summary>
    /// Récupère tous les utilisateurs avec pagination
    /// </summary>
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedResult<UserDto>>>> GetUsers([FromQuery] UserSearchQuery query)
    {
        var result = await _userService.SearchAsync(query);
        return Ok(result.ToSuccessResponse());
    }

    /// <summary>
    /// Récupère un utilisateur par son ID
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<UserDetailDto>>> GetUser(int id)
    {
        var user = await _userService.GetByIdAsync(id);
        if (user == null)
        {
            return NotFound(new List<string> { $"User with ID {id} not found" }
                .ToErrorResponse());
        }

        return Ok(user.ToSuccessResponse());
    }

    /// <summary>
    /// Crée un nouvel utilisateur
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<UserDto>>> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var user = await _userService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetUser),
                new { id = user.Id },
                user.ToSuccessResponse("User created successfully"));
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Errors.Select(e => e.ErrorMessage).ToList()
                .ToErrorResponse("Validation failed"));
        }
        catch (DuplicateEmailException ex)
        {
            return Conflict(new List<string> { ex.Message }
                .ToErrorResponse("Email already exists"));
        }
    }

    /// <summary>
    /// Met à jour un utilisateur
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateUser(int id, [FromBody] UpdateUserDto dto)
    {
        // Vérifier les permissions : seul l'utilisateur lui-même ou un admin peut modifier
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var isAdmin = User.IsInRole("Admin");

        if (currentUserId != id && !isAdmin)
        {
            return Forbid();
        }

        try
        {
            var user = await _userService.UpdateAsync(id, dto);
            if (user == null)
            {
                return NotFound(new List<string> { $"User with ID {id} not found" }
                    .ToErrorResponse());
            }

            return Ok(user.ToSuccessResponse("User updated successfully"));
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Errors.Select(e => e.ErrorMessage).ToList()
                .ToErrorResponse("Validation failed"));
        }
    }

    /// <summary>
    /// Supprime un utilisateur (soft delete)
    /// </summary>
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUser(int id)
    {
        var success = await _userService.DeleteAsync(id);
        if (!success)
        {
            return NotFound(new List<string> { $"User with ID {id} not found" }
                .ToErrorResponse());
        }

        return Ok(new { }.ToSuccessResponse("User deleted successfully"));
    }

    /// <summary>
    /// Active ou désactive un utilisateur
    /// </summary>
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApiResponse<UserDto>>> ToggleUserStatus(int id, [FromBody] ToggleStatusDto dto)
    {
        try
        {
            var user = await _userService.ToggleStatusAsync(id, dto.IsActive);
            if (user == null)
            {
                return NotFound(new List<string> { $"User with ID {id} not found" }
                    .ToErrorResponse());
            }

            var message = dto.IsActive ? "User activated" : "User deactivated";
            return Ok(user.ToSuccessResponse(message));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error toggling status for user {UserId}", id);
            return StatusCode(500, new List<string> { "Internal server error" }
                .ToErrorResponse());
        }
    }

    /// <summary>
    /// Upload d'avatar pour un utilisateur
    /// </summary>
    [HttpPost("{id:int}/avatar")]
    public async Task<ActionResult<ApiResponse<string>>> UploadAvatar(int id, IFormFile file)
    {
        // Vérifier les permissions
        var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
        var isAdmin = User.IsInRole("Admin");

        if (currentUserId != id && !isAdmin)
        {
            return Forbid();
        }

        // Validation du fichier
        if (file == null || file.Length == 0)
        {
            return BadRequest(new List<string> { "No file provided" }
                .ToErrorResponse());
        }

        const int maxFileSize = 5 * 1024 * 1024; // 5MB
        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };

        if (file.Length > maxFileSize)
        {
            return BadRequest(new List<string> { "File size exceeds 5MB limit" }
                .ToErrorResponse());
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!allowedExtensions.Contains(extension))
        {
            return BadRequest(new List<string> { "Invalid file type. Only JPG, PNG, GIF allowed" }
                .ToErrorResponse());
        }

        try
        {
            var avatarUrl = await _userService.UploadAvatarAsync(id, file);
            return Ok(avatarUrl.ToSuccessResponse("Avatar uploaded successfully"));
        }
        catch (UserNotFoundException)
        {
            return NotFound(new List<string> { $"User with ID {id} not found" }
                .ToErrorResponse());
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading avatar for user {UserId}", id);
            return StatusCode(500, new List<string> { "Error uploading file" }
                .ToErrorResponse());
        }
    }
}

// DTOs pour les opérations CRUD
public class CreateUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(200)]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }

    public CreateUserProfileDto? Profile { get; set; }
}

public class UpdateUserDto
{
    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string Name { get; set; } = string.Empty;

    [Phone]
    public string? PhoneNumber { get; set; }

    public UpdateUserProfileDto? Profile { get; set; }
}

public class UserSearchQuery : PagedQuery
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public bool? IsActive { get; set; }
    public DateTime? CreatedAfter { get; set; }
    public DateTime? CreatedBefore { get; set; }
}

public class ToggleStatusDto
{
    public bool IsActive { get; set; }
}

```

### Exemple de test d'intégration complet

```csharp
public class UsersControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;
    private readonly string _adminToken;
    private readonly string _userToken;

    public UsersControllerIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remplacer la vraie base de données par une base en mémoire
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                services.AddDbContext<AppDbContext>(options =>
                {
                    options.UseInMemoryDatabase("TestDb");
                });

                // Remplacer les services externes
                services.AddScoped<IEmailService, MockEmailService>();
                services.AddScoped<IFileStorageService, MockFileStorageService>();
            });

            builder.UseEnvironment("Testing");
        });

        _client = _factory.CreateClient();

        // Générer des tokens pour les tests
        _adminToken = GenerateJwtToken("1", "admin@test.com", "Admin");
        _userToken = GenerateJwtToken("2", "user@test.com", "User");
    }

    [Fact]
    public async Task GetUsers_WithoutAuth_ReturnsUnauthorized()
    {
        // Act
        var response = await _client.GetAsync("/api/users");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetUsers_WithValidAuth_ReturnsPagedUsers()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _userToken);

        // Act
        var response = await _client.GetAsync("/api/users?page=1&pageSize=10");

        // Assert
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<PagedResult<UserDto>>>(content, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.True(result.Data.Items.Count >= 0);
    }

    [Fact]
    public async Task CreateUser_AsAdmin_WithValidData_ReturnsCreatedUser()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _adminToken);

        var newUser = new CreateUserDto
        {
            Name = "Test User",
            Email = "testuser@example.com",
            PhoneNumber = "+1234567890"
        };

        var json = JsonSerializer.Serialize(newUser);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/users", content);

        // Assert
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<UserDto>>(responseContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.NotNull(result.Data);
        Assert.Equal(newUser.Name, result.Data.Name);
        Assert.Equal(newUser.Email, result.Data.Email);

        // Vérifier l'en-tête Location
        Assert.True(response.Headers.Location != null);
        Assert.Contains("/api/users/", response.Headers.Location.ToString());
    }

    [Fact]
    public async Task CreateUser_AsUser_ReturnsForbidden()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _userToken);

        var newUser = new CreateUserDto
        {
            Name = "Unauthorized User",
            Email = "unauthorized@example.com"
        };

        var json = JsonSerializer.Serialize(newUser);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/users", content);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Theory]
    [InlineData("", "valid@email.com", "Name is required")]
    [InlineData("Valid Name", "", "Email is required")]
    [InlineData("Valid Name", "invalid-email", "Email format is invalid")]
    [InlineData("A", "valid@email.com", "Name must be at least 2 characters")]
    public async Task CreateUser_WithInvalidData_ReturnsBadRequest(string name, string email, string expectedError)
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _adminToken);

        var invalidUser = new CreateUserDto
        {
            Name = name,
            Email = email
        };

        var json = JsonSerializer.Serialize(invalidUser);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PostAsync("/api/users", content);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var responseContent = await response.Content.ReadAsStringAsync();
        Assert.Contains(expectedError.ToLower(), responseContent.ToLower());
    }

    [Fact]
    public async Task UpdateUser_OwnProfile_ReturnsUpdatedUser()
    {
        // Arrange - Créer d'abord un utilisateur
        await SeedTestUser();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _userToken);

        var updateDto = new UpdateUserDto
        {
            Name = "Updated Name",
            PhoneNumber = "+9876543210"
        };

        var json = JsonSerializer.Serialize(updateDto);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        // Act
        var response = await _client.PutAsync("/api/users/2", content);

        // Assert
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<ApiResponse<UserDto>>(responseContent, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        Assert.NotNull(result);
        Assert.True(result.Success);
        Assert.Equal(updateDto.Name, result.Data?.Name);
    }

    [Fact]
    public async Task DeleteUser_AsAdmin_ReturnsSuccess()
    {
        // Arrange
        await SeedTestUser();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _adminToken);

        // Act
        var response = await _client.DeleteAsync("/api/users/2");

        // Assert
        response.EnsureSuccessStatusCode();

        // Vérifier que l'utilisateur n'existe plus
        var getResponse = await _client.GetAsync("/api/users/2");
        Assert.Equal(HttpStatusCode.NotFound, getResponse.StatusCode);
    }

    private async Task SeedTestUser()
    {
        using var scope = _factory.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var user = new User
        {
            Id = 2,
            Name = "Test User",
            Email = "user@test.com",
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();
    }

    private string GenerateJwtToken(string userId, string email, string role)
    {
        var jwtSettings = new JwtSettings
        {
            SecretKey = "test-secret-key-for-testing-purposes-only",
            Issuer = "TestAPI",
            Audience = "TestUsers",
            ExpirationHours = 1
        };

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(jwtSettings.ExpirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

```

## 7. Déploiement avec Docker

### Dockerfile optimisé

```docker
# Dockerfile multi-stage pour optimiser la taille
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Créer un utilisateur non-root pour la sécurité
RUN addgroup --system --gid 1001 dotnetgroup && \
    adduser --system --uid 1001 --ingroup dotnetgroup dotnetuser

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copier les fichiers de projet et restaurer les dépendances
COPY ["MonAPI/MonAPI.csproj", "MonAPI/"]
RUN dotnet restore "MonAPI/MonAPI.csproj"

# Copier tout le code source et builder
COPY . .
WORKDIR "/src/MonAPI"
RUN dotnet build "MonAPI.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "MonAPI.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app

# Copier l'application depuis l'étape publish
COPY --from=publish /app/publish .

# Changer vers l'utilisateur non-root
USER dotnetuser

# Définir les variables d'environnement
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dotnet", "MonAPI.dll"]

```

### Docker Compose pour le développement

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: monapi
    ports:
      - "5000:8080"
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Host=postgres;Database=MonAPIDB;Username=postgres;Password=password123
      - JwtSettings__SecretKey=your-super-secret-jwt-key-here
      - Redis__ConnectionString=redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./logs:/app/logs
    networks:
      - api-network
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      - POSTGRES_DB=MonAPIDB
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - api-network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: redis_cache
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass redispassword
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - api-network
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    container_name: nginx_proxy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - api
    networks:
      - api-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:

networks:
  api-network:
    driver: bridge

```

### Configuration Nginx

```
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream api_backend {
        server api:8080;
    }

    # Configuration SSL
    server {
        listen 443 ssl http2;
        server_name monapi.example.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Sécurité headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # Configuration pour l'API
        location /api/ {
            proxy_pass http://api_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;

            # Buffers
            proxy_buffering on;
            proxy_buffer_size 128k;
            proxy_buffers 4 256k;
            proxy_busy_buffers_size 256k;
        }

        # Health check
        location /health {
            proxy_pass http://api_backend/health;
            access_log off;
        }

        # Rate limiting
        limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
        location /api/ {
            limit_req zone=api burst=20 nodelay;
        }
    }

    # Redirection HTTP vers HTTPS
    server {
        listen 80;
        server_name monapi.example.com;
        return 301 https://$server_name$request_uri;
    }
}

```

### GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy API

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v4

    - name: Setup .NET
      uses: actions/setup-dotnet@v4
      with:
        dotnet-version: 8.0.x

    - name: Restore dependencies
      run: dotnet restore

    - name: Build
      run: dotnet build --no-restore --configuration Release

    - name: Test
      run: dotnet test --no-build --verbosity normal --configuration Release --collect:"XPlat Code Coverage"
      env:
        ConnectionStrings__DefaultConnection: Host=localhost;Database=testdb;Username=postgres;Password=postgres

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage.cobertura.xml

  build-and-push:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'

    permissions:
      contents: read
      packages: write

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata
      id: meta
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
        tags: |
          type=ref,event=branch
          type=ref,event=pr
          type=sha,prefix={{branch}}-
          type=raw,value=latest,enable={{is_default_branch}}

    - name: Build and push Docker image
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ steps.meta.outputs.tags }}
        labels: ${{ steps.meta.outputs.labels }}
        build-args: |
          BUILD_CONFIGURATION=Release

  deploy:
    runs-on: ubuntu-latest
    needs: build-and-push
    if: github.ref == 'refs/heads/main'

    environment: production

    steps:
    - name: Deploy to production
      uses: appleboy/ssh-action@v1.0.0
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /opt/monapi
          docker-compose pull
          docker-compose up -d --remove-orphans
          docker system prune -f

```

### Commandes utiles pour le déploiement

```bash
# Construction et déploiement local
docker-compose build
docker-compose up -d

# Logs
docker-compose logs -f api
docker-compose logs -f postgres

# Migrations dans le conteneur
docker-compose exec api dotnet ef database update

# Backup de la base de données
docker-compose exec postgres pg_dump -U postgres MonAPIDB > backup.sql

# Restauration
docker-compose exec -T postgres psql -U postgres MonAPIDB < backup.sql

# Monitoring des ressources
docker stats

# Nettoyage
docker-compose down
docker system prune -f
docker volume prune -f

```

## 8. Ressources utiles

### Documentation officielle Microsoft

- **ASP.NET Core** : https://docs.microsoft.com/aspnet/core/
- **Entity Framework Core** : https://docs.microsoft.com/ef/core/
- **Authentication & Authorization** : https://docs.microsoft.com/aspnet/core/security/
- **Configuration** : https://docs.microsoft.com/aspnet/core/fundamentals/configuration/
- **Logging** : https://docs.microsoft.com/aspnet/core/fundamentals/logging/
- **Testing** : https://docs.microsoft.com/aspnet/core/test/

### Projets GitHub exemplaires

### Clean Architecture

- **CleanArchitecture** : https://github.com/jasontaylordev/CleanArchitecture
- **CleanArchitecture.NET** : https://github.com/ardalis/CleanArchitecture

### CQRS et Event Sourcing

- **CQRS Sample** : https://github.com/ddd-by-examples/library
- **EventStore Sample** : https://github.com/EventStore/EventStore

### Microservices

- **eShopOnContainers** : https://github.com/dotnet-architecture/eShopOnContainers
- **Sample Microservices** : https://github.com/dotnet-architecture/microservices-sample

### Outils recommandés

### Développement

- **Postman** : Test d'API - https://www.postman.com/
- **Insomnia** : Alternative à Postman - https://insomnia.rest/
- **JetBrains Rider** : IDE complet pour .NET - https://www.jetbrains.com/rider/
- **VS Code** avec extensions C#

### Base de données

- **pgAdmin** : Interface PostgreSQL - https://www.pgadmin.org/
- **Redis Commander** : Interface Redis - https://github.com/joeferner/redis-commander
- **DBeaver** : Client universel - https://dbeaver.io/

### Déploiement et monitoring

- **Docker Desktop** : https://www.docker.com/products/docker-desktop
- **Portainer** : Management Docker UI - https://www.portainer.io/
- **Grafana** : Monitoring et alertes - https://grafana.com/
- **Seq** : Logging centralisé - https://datalust.co/seq

### CLI Tools

```bash
# EF Core CLI
dotnet tool install --global dotnet-ef

# User Secrets pour le développement
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Database=DevDB;Username=dev;Password=dev"

# Watch tool pour le rechargement automatique
dotnet watch run

# Format de code
dotnet format

# Analyse de code
dotnet tool install --global sonarscanner --version 5.8.0

```

### Patterns et bonnes pratiques

### Books et ressources

- **Clean Code** par Robert Martin
- **Domain-Driven Design** par Eric Evans
- **Patterns of Enterprise Application Architecture** par Martin Fowler
- **Building Microservices** par Sam Newman

### Blogs et articles

- **Microsoft .NET Blog** : https://devblogs.microsoft.com/dotnet/
- **Code Maze** : https://code-maze.com/
- **Andrew Lock's Blog** : https://andrewlock.net/
- **Steve Gordon's Blog** : https://www.stevejgordon.co.uk/

### Checklist finale pour la mise en production

### Sécurité

- [ ]  HTTPS configuré avec certificats SSL valides
- [ ]  Authentication JWT avec des secrets sécurisés
- [ ]  Authorization configurée pour toutes les endpoints sensibles
- [ ]  CORS configuré de manière restrictive
- [ ]  Rate limiting activé
- [ ]  Headers de sécurité configurés
- [ ]  Validation des inputs côté serveur
- [ ]  Protection contre les injections SQL (paramètres)

### Performance

- [ ]  Caching activé (mémoire + distribué)
- [ ]  Pagination implémentée
- [ ]  Requêtes EF Core optimisées (AsNoTracking, Include limité)
- [ ]  Compression des réponses HTTP
- [ ]  Connection pooling configuré
- [ ]  Async/await utilisé correctement

### Monitoring et logs

- [ ]  Logging structuré configuré (Serilog)
- [ ]  Health checks implémentés
- [ ]  Métriques applicatives configurées
- [ ]  Alertes configurées pour les erreurs critiques
- [ ]  Traces distribuées pour le debugging

### Qualité du code

- [ ]  Tests unitaires > 80% de couverture
- [ ]  Tests d'intégration pour les endpoints critiques
- [ ]  Code review process en place
- [ ]  Documentation API à jour (Swagger)
- [ ]  Gestion des erreurs centralisée

### Infrastructure

- [ ]  Base de données sauvegardée automatiquement
- [ ]  Environnements séparés (dev/staging/prod)
- [ ]  CI/CD pipeline configuré
- [ ]  Rollback strategy définie
- [ ]  Scaling horizontal possible

## 9. Bonus

## AutoMapper : Le pont entre vos couches

AutoMapper est une bibliothèque qui automatise la copie de données entre objets de types différents. Dans votre architecture en couches, vous allez souvent avoir besoin de transformer vos entités de base de données en objets destinés à l'API (DTOs).

## Pourquoi utiliser AutoMapper ?

**Sans AutoMapper** (mapping manuel) :

```csharp
public TaskDto GetTask(int id)
{
    var task = _repository.GetById(id);

    return new TaskDto
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        Priority = task.Priority.ToString(),
        IsCompleted = task.IsCompleted,
        CategoryName = task.Category?.Name
        // Imagine avec 15-20 propriétés...
    };
}

```

**Avec AutoMapper** :

```csharp
public TaskDto GetTask(int id)
{
    var task = _repository.GetById(id);
    return _mapper.Map<TaskDto>(task);
}

```

## Concepts clés à comprendre

### 1. Entités vs DTOs

- **Entité** : représentation exacte de votre table en base
- **DTO** (Data Transfer Object) : objet optimisé pour les échanges API

```csharp
// Entité (ce qui est en base)
public class Task
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public TaskPriority Priority { get; set; } // Enum
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? DueDate { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
}

// DTO (ce qui sort de votre API)
public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Priority { get; set; } // String au lieu d'enum
    public bool IsCompleted { get; set; }
    public string CreatedAt { get; set; } // Formaté en string
    public string DueDate { get; set; }
    public string CategoryName { get; set; } // Nom au lieu de l'objet complet
}

```

## Installation et configuration

### 1. Installation du package

```bash
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection

```

### 2. Création des profils de mapping

Créez un dossier `Mappings` et une classe `MappingProfile` :

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Mapping simple (propriétés identiques)
        CreateMap<Task, TaskDto>()
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => src.Priority.ToString()))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.ToString("dd/MM/yyyy HH:mm")))
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate.HasValue ? src.DueDate.Value.ToString("dd/MM/yyyy") : null))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));

        // Mapping inverse pour les créations/mises à jour
        CreateMap<CreateTaskDto, Task>()
            .ForMember(dest => dest.Priority, opt => opt.MapFrom(src => Enum.Parse<TaskPriority>(src.Priority)))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.Id, opt => opt.Ignore()); // L'ID sera généré par la base
    }
}

```

### 3. Configuration dans Program.cs

```csharp
builder.Services.AddAutoMapper(typeof(MappingProfile));

```

## Utilisation dans vos services

```csharp
public class TaskService : ITaskService
{
    private readonly ITaskRepository _taskRepository;
    private readonly IMapper _mapper;

    public TaskService(ITaskRepository taskRepository, IMapper mapper)
    {
        _taskRepository = taskRepository;
        _mapper = mapper;
    }

    public async Task<TaskDto> GetTaskByIdAsync(int id)
    {
        var task = await _taskRepository.GetByIdAsync(id);
        return _mapper.Map<TaskDto>(task);
    }

    public async Task<List<TaskDto>> GetAllTasksAsync()
    {
        var tasks = await _taskRepository.GetAllAsync();
        return _mapper.Map<List<TaskDto>>(tasks);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto createTaskDto)
    {
        var task = _mapper.Map<Task>(createTaskDto);
        var createdTask = await _taskRepository.AddAsync(task);
        return _mapper.Map<TaskDto>(createdTask);
    }
}

```

## Types de DTOs à prévoir

```csharp
// Pour lire les données
public class TaskDto { /* propriétés complètes */ }

// Pour créer une tâche
public class CreateTaskDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Priority { get; set; }
    public DateTime? DueDate { get; set; }
    public int CategoryId { get; set; }
}

// Pour modifier une tâche
public class UpdateTaskDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public string Priority { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime? DueDate { get; set; }
}

```

## Avantages concrets dans votre projet

1. **Sécurité** : vos entités ne sont jamais exposées directement
2. **Performance** : vous ne renvoyez que les données nécessaires
3. **Flexibilité** : vous pouvez formater les données selon les besoins de l'API
4. **Maintenance** : un seul endroit pour gérer les transformations

## Règles de mapping automatique

AutoMapper détecte automatiquement les propriétés avec le même nom. Pour les cas particuliers, utilisez `ForMember()` :

```csharp
.ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
.ForMember(dest => dest.TotalTasks, opt => opt.MapFrom(src => src.Tasks.Count))
.ForMember(dest => dest.Id, opt => opt.Ignore()) // Pour ignorer une propriété

```

Voulez-vous que je détaille un aspect particulier d'AutoMapper ou préférez-vous qu'on passe à la structuration générale du projet de gestionnaire de tâches ?

### ASP.NET Core (Layered Architecture)

# Guide Setup ASP.NET Core + Vue.js en Architecture Layered

## Vue d'ensemble de l'architecture

L'architecture en couches (Layered Architecture) sépare l'application en plusieurs couches distinctes :

- **Presentation Layer** : Vue.js (Frontend)
- **API Layer** : ASP.NET Core Web API
- **Business Logic Layer** : Services métier
- **Data Access Layer** : Repositories et Entity Framework
- **Domain Layer** : Entités et interfaces

## Étape 1 : Création de la structure du projet

### 1.1 Créer le dossier racine

```bash
mkdir MonApp
cd MonApp

```

### 1.2 Créer la solution .NET

```bash
dotnet new sln -n MonApp

```

### 1.3 Créer la structure des projets backend

```bash
# Domain Layer (Entités et interfaces)
dotnet new classlib -n MonApp.Domain
dotnet sln add MonApp.Domain

# Data Access Layer (Repositories et EF)
dotnet new classlib -n MonApp.Infrastructure
dotnet sln add MonApp.Infrastructure

# Business Logic Layer (Services)
dotnet new classlib -n MonApp.Application
dotnet sln add MonApp.Application

# API Layer (Contrôleurs et configuration)
dotnet new webapi -n MonApp.API
dotnet sln add MonApp.API

```

### 1.4 Créer le projet frontend

```bash
# Dans le dossier racine MonApp
npm create vue@latest MonApp.Frontend
cd MonApp.Frontend
npm install
cd ..

```

## Étape 2 : Configuration des références entre projets

### 2.1 Ajouter les références pour Infrastructure

```bash
cd MonApp.Infrastructure
dotnet add reference ../MonApp.Domain/MonApp.Domain.csproj
cd ..

```

### 2.2 Ajouter les références pour Application

```bash
cd MonApp.Application
dotnet add reference ../MonApp.Domain/MonApp.Domain.csproj
dotnet add reference ../MonApp.Infrastructure/MonApp.Infrastructure.csproj
cd ..

```

### 2.3 Ajouter les références pour API

```bash
cd MonApp.API
dotnet add reference ../MonApp.Domain/MonApp.Domain.csproj
dotnet add reference ../MonApp.Infrastructure/MonApp.Infrastructure.csproj
dotnet add reference ../MonApp.Application/MonApp.Application.csproj
cd ..

```

## Étape 3 : Configuration de la couche Domain

### 3.1 Supprimer le fichier Class1.cs

```bash
rm MonApp.Domain/Class1.cs

```

### 3.2 Créer les entités de base

Créer `MonApp.Domain/Entities/BaseEntity.cs` :

```csharp
namespace MonApp.Domain.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}

```

### 3.3 Créer une entité exemple

Créer `MonApp.Domain/Entities/Product.cs` :

```csharp
namespace MonApp.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; } = true;
    }
}

```

### 3.4 Créer les interfaces de repository

Créer `MonApp.Domain/Interfaces/IRepository.cs` :

```csharp
namespace MonApp.Domain.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(int id);
    }
}

```

Créer `MonApp.Domain/Interfaces/IProductRepository.cs` :

```csharp
using MonApp.Domain.Entities;

namespace MonApp.Domain.Interfaces
{
    public interface IProductRepository : IRepository<Product>
    {
        Task<IEnumerable<Product>> GetActiveProductsAsync();
        Task<IEnumerable<Product>> SearchByNameAsync(string name);
    }
}

```

## Étape 4 : Configuration de la couche Infrastructure

### 4.1 Installer les packages NuGet nécessaires

```bash
cd MonApp.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Design
cd ..

```

### 4.2 Supprimer Class1.cs et créer le DbContext

```bash
rm MonApp.Infrastructure/Class1.cs

```

Créer `MonApp.Infrastructure/Data/ApplicationDbContext.cs` :

```csharp
using Microsoft.EntityFrameworkCore;
using MonApp.Domain.Entities;

namespace MonApp.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.CreatedAt).IsRequired();
            });
        }
    }
}

```

### 4.3 Créer l'implémentation du repository générique

Créer `MonApp.Infrastructure/Repositories/Repository.cs` :

```csharp
using Microsoft.EntityFrameworkCore;
using MonApp.Domain.Interfaces;
using MonApp.Infrastructure.Data;

namespace MonApp.Infrastructure.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public Repository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<T> GetByIdAsync(int id)
        {
            return await _dbSet.FindAsync(id);
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _dbSet.ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task UpdateAsync(T entity)
        {
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }

        public virtual async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _dbSet.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}

```

### 4.4 Créer l'implémentation du ProductRepository

Créer `MonApp.Infrastructure/Repositories/ProductRepository.cs` :

```csharp
using Microsoft.EntityFrameworkCore;
using MonApp.Domain.Entities;
using MonApp.Domain.Interfaces;
using MonApp.Infrastructure.Data;

namespace MonApp.Infrastructure.Repositories
{
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Product>> GetActiveProductsAsync()
        {
            return await _dbSet.Where(p => p.IsActive).ToListAsync();
        }

        public async Task<IEnumerable<Product>> SearchByNameAsync(string name)
        {
            return await _dbSet
                .Where(p => p.Name.Contains(name) && p.IsActive)
                .ToListAsync();
        }
    }
}

```

## Étape 5 : Configuration de la couche Application

### 5.1 Supprimer Class1.cs et créer les DTOs

```bash
rm MonApp.Application/Class1.cs

```

Créer `MonApp.Application/DTOs/ProductDto.cs` :

```csharp
namespace MonApp.Application.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

```

Créer `MonApp.Application/DTOs/CreateProductDto.cs` :

```csharp
using System.ComponentModel.DataAnnotations;

namespace MonApp.Application.DTOs
{
    public class CreateProductDto
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int Stock { get; set; }
    }
}

```

### 5.2 Créer les interfaces de services

Créer `MonApp.Application/Interfaces/IProductService.cs` :

```csharp
using MonApp.Application.DTOs;

namespace MonApp.Application.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<ProductDto>> GetAllProductsAsync();
        Task<ProductDto> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task UpdateProductAsync(int id, CreateProductDto updateProductDto);
        Task DeleteProductAsync(int id);
        Task<IEnumerable<ProductDto>> SearchProductsAsync(string name);
    }
}

```

### 5.3 Créer l'implémentation du service

Créer `MonApp.Application/Services/ProductService.cs` :

```csharp
using MonApp.Application.DTOs;
using MonApp.Application.Interfaces;
using MonApp.Domain.Entities;
using MonApp.Domain.Interfaces;

namespace MonApp.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepository.GetAllAsync();
            return products.Select(MapToDto);
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            return product != null ? MapToDto(product) : null;
        }

        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            var product = new Product
            {
                Name = createProductDto.Name,
                Description = createProductDto.Description,
                Price = createProductDto.Price,
                Stock = createProductDto.Stock,
                IsActive = true
            };

            var createdProduct = await _productRepository.AddAsync(product);
            return MapToDto(createdProduct);
        }

        public async Task UpdateProductAsync(int id, CreateProductDto updateProductDto)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product != null)
            {
                product.Name = updateProductDto.Name;
                product.Description = updateProductDto.Description;
                product.Price = updateProductDto.Price;
                product.Stock = updateProductDto.Stock;
                product.UpdatedAt = DateTime.UtcNow;

                await _productRepository.UpdateAsync(product);
            }
        }

        public async Task DeleteProductAsync(int id)
        {
            await _productRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<ProductDto>> SearchProductsAsync(string name)
        {
            var products = await _productRepository.SearchByNameAsync(name);
            return products.Select(MapToDto);
        }

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                Stock = product.Stock,
                IsActive = product.IsActive,
                CreatedAt = product.CreatedAt
            };
        }
    }
}

```

## Étape 6 : Configuration de la couche API

### 6.1 Installer les packages nécessaires

```bash
cd MonApp.API
dotnet add package Microsoft.EntityFrameworkCore.Tools
cd ..

```

### 6.2 Configurer les services dans Program.cs

Remplacer le contenu de `MonApp.API/Program.cs` :

```csharp
using Microsoft.EntityFrameworkCore;
using MonApp.Application.Interfaces;
using MonApp.Application.Services;
using MonApp.Domain.Interfaces;
using MonApp.Infrastructure.Data;
using MonApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Services
builder.Services.AddScoped<IProductService, ProductService>();

// CORS pour Vue.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueApp",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173", "http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowVueApp");
app.UseAuthorization();
app.MapControllers();

app.Run();

```

### 6.3 Configurer la chaîne de connexion

Modifier `MonApp.API/appsettings.json` :

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MonAppDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}

```

### 6.4 Créer le contrôleur Products

Remplacer `MonApp.API/Controllers/WeatherForecastController.cs` par `MonApp.API/Controllers/ProductsController.cs` :

```csharp
using Microsoft.AspNetCore.Mvc;
using MonApp.Application.DTOs;
using MonApp.Application.Interfaces;

namespace MonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> GetAllProducts()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetProduct(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> CreateProduct(CreateProductDto createProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var product = await _productService.CreateProductAsync(createProductDto);
            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, CreateProductDto updateProductDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _productService.UpdateProductAsync(id, updateProductDto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            await _productService.DeleteProductAsync(id);
            return NoContent();
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<ProductDto>>> SearchProducts([FromQuery] string name)
        {
            var products = await _productService.SearchProductsAsync(name);
            return Ok(products);
        }
    }
}

```

### 6.5 Supprimer les fichiers non utilisés

```bash
rm MonApp.API/Controllers/WeatherForecastController.cs
rm MonApp.API/WeatherForecast.cs

```

## Étape 7 : Création et application des migrations

### 7.1 Créer la migration initiale

```bash
cd MonApp.API
dotnet ef migrations add InitialCreate --project ../MonApp.Infrastructure

```

### 7.2 Appliquer la migration à la base de données

```bash
dotnet ef database update --project ../MonApp.Infrastructure
cd ..

```

## Étape 8 : Configuration du frontend Vue.js

### 8.1 Installer Axios pour les appels API

```bash
cd MonApp.Frontend
npm install axios

```

### 8.2 Créer le service API

Créer `MonApp.Frontend/src/services/api.js` :

```jsx
import axios from 'axios'

const API_BASE_URL = 'https://localhost:7000/api' // Ajustez selon votre port

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const productApi = {
  getAllProducts: () => api.get('/products'),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (product) => api.post('/products', product),
  updateProduct: (id, product) => api.put(`/products/${id}`, product),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  searchProducts: (name) => api.get(`/products/search?name=${name}`)
}

export default api

```

### 8.3 Créer le composant Products

Créer `MonApp.Frontend/src/components/Products.vue` :

```
<template>
  <div class="products">
    <h2>Gestion des Produits</h2>

    <div class="search-section">
      <input
        v-model="searchTerm"
        @input="searchProducts"
        placeholder="Rechercher un produit..."
        class="search-input"
      />
    </div>

    <div class="product-form">
      <h3>{{ editingProduct ? 'Modifier' : 'Ajouter' }} un produit</h3>
      <form @submit.prevent="submitProduct">
        <input v-model="productForm.name" placeholder="Nom" required />
        <textarea v-model="productForm.description" placeholder="Description"></textarea>
        <input v-model.number="productForm.price" type="number" step="0.01" placeholder="Prix" required />
        <input v-model.number="productForm.stock" type="number" placeholder="Stock" required />
        <div class="form-actions">
          <button type="submit">{{ editingProduct ? 'Modifier' : 'Ajouter' }}</button>
          <button v-if="editingProduct" type="button" @click="cancelEdit">Annuler</button>
        </div>
      </form>
    </div>

    <div class="products-list">
      <h3>Liste des Produits</h3>
      <div v-if="loading" class="loading">Chargement...</div>
      <div v-else-if="products.length === 0" class="no-products">Aucun produit trouvé</div>
      <div v-else class="product-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <h4>{{ product.name }}</h4>
          <p>{{ product.description }}</p>
          <p><strong>Prix:</strong> {{ product.price }}€</p>
          <p><strong>Stock:</strong> {{ product.stock }}</p>
          <p><strong>Statut:</strong> {{ product.isActive ? 'Actif' : 'Inactif' }}</p>
          <div class="product-actions">
            <button @click="editProduct(product)" class="edit-btn">Modifier</button>
            <button @click="deleteProduct(product.id)" class="delete-btn">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { productApi } from '../services/api'

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      searchTerm: '',
      loading: false,
      editingProduct: null,
      productForm: {
        name: '',
        description: '',
        price: 0,
        stock: 0
      }
    }
  },
  async mounted() {
    await this.loadProducts()
  },
  methods: {
    async loadProducts() {
      try {
        this.loading = true
        const response = await productApi.getAllProducts()
        this.products = response.data
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error)
        alert('Erreur lors du chargement des produits')
      } finally {
        this.loading = false
      }
    },

    async searchProducts() {
      if (this.searchTerm.trim() === '') {
        await this.loadProducts()
        return
      }

      try {
        this.loading = true
        const response = await productApi.searchProducts(this.searchTerm)
        this.products = response.data
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
      } finally {
        this.loading = false
      }
    },

    async submitProduct() {
      try {
        if (this.editingProduct) {
          await productApi.updateProduct(this.editingProduct.id, this.productForm)
        } else {
          await productApi.createProduct(this.productForm)
        }

        this.resetForm()
        await this.loadProducts()
        alert('Produit sauvegardé avec succès!')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Erreur lors de la sauvegarde du produit')
      }
    },

    editProduct(product) {
      this.editingProduct = product
      this.productForm = {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      }
    },

    cancelEdit() {
      this.resetForm()
    },

    async deleteProduct(id) {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
        try {
          await productApi.deleteProduct(id)
          await this.loadProducts()
          alert('Produit supprimé avec succès!')
        } catch (error) {
          console.error('Erreur lors de la suppression:', error)
          alert('Erreur lors de la suppression du produit')
        }
      }
    },

    resetForm() {
      this.editingProduct = null
      this.productForm = {
        name: '',
        description: '',
        price: 0,
        stock: 0
      }
    }
  }
}
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-section {
  margin-bottom: 30px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.product-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 30px;
}

.product-form form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.product-form input,
.product-form textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 5px;
  background: white;
}

.product-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
}

button[type="submit"] {
  background: #007bff;
  color: white;
}

.edit-btn {
  background: #28a745;
  color: white;
}

.delete-btn {
  background: #dc3545;
  color: white;
}

.loading {
  text-align: center;
  font-size: 18px;
  margin: 20px;
}

.no-products {
  text-align: center;
  font-style: italic;
  color: #666;
}
</style>

```

### 8.4 Mettre à jour App.vue

Remplacer le contenu de `MonApp.Frontend/src/App.vue` :

```
<template>
  <div id="app">
    <header>
      <h1>Mon Application ASP.NET Core + Vue.js</h1>
    </header>
    <main>
      <Products />
    </main>
  </div>
</template>

<script>
import Products from './components/Products.vue'

export default {
  name: 'App',
  components: {
    Products
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  background: #282c34;
  color: white;
  padding: 20px;
  text-align: center;
}

main {
  padding: 20px;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #f5f5f5;
}
</style>

```

## Étape 9 : Test de l'application

### 9.1 Démarrer le backend

```bash
cd MonApp.API
dotnet run

```

Le backend sera accessible sur `https://localhost:7000` (ou le port indiqué dans la console).

### 9.2 Démarrer le frontend

Dans un nouveau terminal :

```bash
cd MonApp.Frontend
npm run dev

```

Le frontend sera accessible sur `http://localhost:5173`.

### 9.3 Vérifications à effectuer

1. Ouvrez Swagger UI sur `https://localhost:7000/swagger` pour tester l'API
2. Testez les endpoints Products via Swagger
3. Ouvrez l'application Vue.js et testez les fonctionnalités CRUD
4. Vérifiez que les données sont persistées dans la base de données

### Migrations EF Core

Pour les migrations, vous devez spécifier le projet de startup (API) et le projet contenant le DbContext (Infrastructure) :

bash

`*# Depuis le dossier racine*
dotnet ef migrations add InitialCreate --project MonApp.Infrastructure --startup-project MonApp.API
dotnet ef database update --project MonApp.Infrastructure --startup-project MonApp.API`

### SQLite

### 6.1 Installer les packages nécessaires

### Dans MonApp.Infrastructure (où se trouve le DbContext)

```bash
cd MonApp.Infrastructure
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
dotnet add package Microsoft.EntityFrameworkCore.Design
cd ..

```

### Dans MonApp.API (pour les outils de migration)

```bash
cd MonApp.API
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
cd ..

```

**Explication des packages :**

- `Microsoft.EntityFrameworkCore.Sqlite` : Provider SQLite pour EF Core
- `Microsoft.EntityFrameworkCore.Design` : Nécessaire pour les migrations
- `Microsoft.EntityFrameworkCore.Tools` : Commandes `dotnet ef` pour les migrations

### 6.2 Configurer les services dans Program.cs

Remplacer le contenu de `MonApp.API/Program.cs` :

```csharp
using Microsoft.EntityFrameworkCore;
using MonApp.Application.Interfaces;
using MonApp.Application.Services;
using MonApp.Domain.Interfaces;
using MonApp.Infrastructure.Data;
using MonApp.Infrastructure.Repositories;
using MonApp.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database - SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
//         ^^^^^^^^^ UseSqlite au lieu de UseSqlServer

// Repositories (Infrastructure Layer)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Services (Application Layer)
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IUserService, UserService>();

// Infrastructure Services
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

// CORS pour Vue.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVueApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials(); // Si vous utilisez des cookies/auth
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowVueApp");
app.UseAuthorization();
app.MapControllers();

app.Run();

```

### 6.3 Configurer la chaîne de connexion SQLite

Modifier `MonApp.API/appsettings.json` :

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  },
  "AllowedHosts": "*",
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=MonApp.db"
  }
}

```

**Explication de la chaîne de connexion :**

- `Data Source=MonApp.db` : Fichier de base de données SQLite (sera créé à la racine du projet API)
- Vous pouvez aussi utiliser un chemin absolu : `Data Source=/path/to/MonApp.db`
- Ou un chemin relatif : `Data Source=../Data/MonApp.db`

### 6.4 Configuration alternative avec chemin personnalisé

Si vous voulez organiser votre base de données dans un dossier spécifique :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=./Data/MonApp.db;Cache=Shared"
  }
}

```

**Options SQLite utiles :**

- `Cache=Shared` : Permet plusieurs connexions simultanées
- `Mode=ReadWriteCreate` : Crée la DB si elle n'existe pas (par défaut)
- `Foreign Keys=True` : Active les contraintes de clés étrangères

### 6.5 Créer le dossier Data (optionnel)

Si vous utilisez un sous-dossier pour la base de données :

```bash
mkdir MonApp.API/Data

```

Et ajoutez au `.gitignore` :

```
# Base de données SQLite
*.db
*.db-shm
*.db-wal

```

### 6.6 Différences SQLite vs SQL Server à noter

### Dans votre DbContext (si nécessaire)

```csharp
// MonApp.Infrastructure/Data/AppDbContext.cs
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    modelBuilder.Entity<Product>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
        entity.Property(e => e.Description).HasMaxLength(1000);

        // ⚠️ SQLite stocke les decimals comme REAL (float)
        // Pour garder la précision, vous pouvez :
        entity.Property(e => e.Price)
            .HasColumnType("TEXT")  // Stocker comme texte
            .HasConversion<string>(); // Conversion automatique

        // Ou accepter la perte de précision minime avec REAL (plus simple)
        // entity.Property(e => e.Price).HasColumnType("REAL");

        entity.Property(e => e.CreatedAt).IsRequired();
    });

    modelBuilder.Entity<User>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e.UserName).IsRequired().HasMaxLength(50);
        entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
        entity.Property(e => e.PasswordHash).IsRequired();
        entity.HasIndex(e => e.Email).IsUnique();
        entity.HasIndex(e => e.UserName).IsUnique();
    });
}

```

### 6.7 Créer et appliquer les migrations

```bash
# Depuis le dossier racine MonApp
cd MonApp.API

# Créer la migration initiale
dotnet ef migrations add InitialCreate --project ../MonApp.Infrastructure --startup-project .

# Appliquer la migration (crée le fichier MonApp.db)
dotnet ef database update --project ../MonApp.Infrastructure --startup-project .

cd ..

```

**Vérification :** Après `dotnet ef database update`, vous devriez voir un fichier `MonApp.db` créé dans `MonApp.API/`.

### 6.8 Tester la connexion

Ajoutez un endpoint de test dans un contrôleur :

```csharp
// MonApp.API/Controllers/HealthController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MonApp.Infrastructure.Data;

namespace MonApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HealthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> Check()
        {
            var canConnect = await _context.Database.CanConnectAsync();
            return Ok(new
            {
                status = canConnect ? "healthy" : "unhealthy",
                database = "SQLite",
                timestamp = DateTime.UtcNow
            });
        }
    }
}

```

Testez avec :

```bash
cd MonApp.API
dotnet run
# Puis ouvrez https://localhost:7000/api/health

```

## Avantages de SQLite pour le développement

✅ **Pas d'installation** : Pas besoin de SQL Server

✅ **Portable** : Un seul fichier `.db`

✅ **Rapide** : Excellent pour le développement local

✅ **Simple** : Pas de configuration serveur

✅ **Cross-platform** : Fonctionne partout (Windows, Mac, Linux)

## Limitations SQLite à connaître

⚠️ **Pas de types natifs** : `decimal` stocké comme `REAL` (float) ou `TEXT`

⚠️ **Concurrence limitée** : Moins performant avec beaucoup d'écritures simultanées

⚠️ **Pas de procédures stockées** : Logique uniquement dans le code

⚠️ **Production** : Pour la production, envisagez PostgreSQL ou SQL Server

Votre application est maintenant configurée avec SQLite et prête pour le développement !

## Structure finale

`MonApp/
├── MonApp.API/
│   ├── Controllers/
│   ├── Program.cs ✅ (SEUL NÉCESSAIRE)
│   └── appsettings.json
├── MonApp.Application/
│   ├── Services/
│   ├── DTOs/
│   ├── Interfaces/
│   └── DependencyInjection/
├── MonApp.Infrastructure/
│   ├── Data/
│   ├── Repositories/
│   ├── Services/
│   └── DependencyInjection/
├── MonApp.Domain/
│   ├── Entities/
│   └── Interfaces/
└── MonApp.Frontend/ (Vue.js)
    └── package.json (pas Program.cs, c'est du JS!)`

**Résumé :** Seul le projet **MonApp.API** a besoin d'un `Program.cs`. Les autres sont des bibliothèques de classes qui sont référencées et configurées dans l'API. Les extensions dans chaque couche permettent d'organiser proprement la configuration sans dupliquer le code.

## Points clés de l'architecture

### Séparation des responsabilités

- **Domain** : Logique métier pure, indépendante de toute technologie
- **Infrastructure** : Accès aux données et services externes
- **Application** : Orchestration et règles d'application
- **API** : Point d'entrée et configuration

### Inversion de dépendance

- Les couches supérieures dépendent des abstractions (interfaces)
- L'injection de dépendance configure les implémentations concrètes

### Testabilité

- Chaque couche peut être testée indépendamment grâce aux interfaces
- Les repositories et services peuvent être mockés pour les tests unitaires

Cette architecture respecte les principes SOLID et facilite la maintenance et l'évolution de l'application. -->
