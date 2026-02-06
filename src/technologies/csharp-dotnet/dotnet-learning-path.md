# Learning .NET

## Phase 1: Configuration de l'environnement (1-2 jours)

### 1.1 Installation du SDK .NET

```bash
# Ajouter le repository Microsoft
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Installer le SDK .NET
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0
```

**Pourquoi cette étape** : Le SDK .NET contient le compilateur C#, le runtime, et tous les outils nécessaires pour développer et exécuter vos applications.

### 1.2 Configuration de VS Code

Extensions essentielles à installer :

- **C# Dev Kit** : Support complet pour C# (IntelliSense, debugging, tests)
- **C#** : Extension de base pour la syntaxe C#
- **NuGet Package Manager** : Gestion des packages
- **GitLens** : Pour le contrôle de version
- **.NET Install Tool** : Gestion des versions .NET

### 1.3 Vérification de l'installation

```bash
# Vérifier la version installée
dotnet --version

# Créer votre premier projet
dotnet new console -n MonPremierProjet
cd MonPremierProjet
dotnet run
```

## Phase 2: Syntaxe de base (1-2 semaines)

### 2.1 Structure d'un programme `C#`

```csharp
using System; // Import des namespaces

namespace MonNamespace // Organisation du code
{
    class Program // Point d'entrée
    {
        static void Main(string[] args) // Méthode principale
        {
            Console.WriteLine("Hello World!");
        }
    }
}
```

**Concepts à maîtriser** :

- **Namespace** : Organisation logique du code, évite les conflits de noms
- **Class** : Modèle pour créer des objets
- **Method** : Bloc de code réutilisable
- **static** : Appartient à la classe, pas à une instance

### 2.2 Types de données et variables

```csharp
// Types valeur (stockés dans la stack)
int age = 25;
double prix = 19.99;
bool estActif = true;
char lettre = 'A';

// Types référence (stockés dans la heap)
string nom = "Jean";
int[] nombres = {1, 2, 3, 4, 5};

// Déclaration avec var (inférence de type)
var message = "Bonjour"; // Compilateur déduit string
```

**Pourquoi cette distinction** : Comprendre stack vs heap est crucial pour la performance et la gestion mémoire.

**Heap vs Stack - Gestion mémoire en C#** - Vue d'ensemble conceptuelle

La mémoire en C# est divisée en deux zones principales avec des comportements très différents :

```text
┌─────────────────────────────────────┐
│            MÉMOIRE RAM              │
├─────────────────┬───────────────────┤
│     STACK       │       HEAP        │
│   (Pile)        │     (Tas)         │
│                 │                   │
│ • Rapide        │ • Plus lent       │
│ • LIFO          │ • Accès aléatoire │
│ • Automatique   │ • Garbage Collector│
│ • Limitée       │ • Plus grande     │
└─────────────────┴───────────────────┘
```

- **La Stack (Pile)** - Principe de fonctionnement

La stack fonctionne comme une pile d'assiettes : **Last In, First Out (LIFO)**

```csharp
public void ExempleStack()
{
int a = 10;        // Empilé en premier
char c = 'X';      // Empilé au-dessus de 'a'
bool b = true;     // Empilé au-dessus de 'c'

// Quand la méthode se termine :
// 'b' est dépilé en premier
// puis 'c'
// puis 'a'
}
```

**Représentation mémoire** :

```text
Stack (croît vers le bas)
┌──────────────┐ ← Stack Pointer (sommet)
│ bool b=true  │
├──────────────┤
│ char c='X'   │
├──────────────┤
│ int a=10     │
├──────────────┤
│     ...      │
```

- Ce qui est stocké dans la Stack

```csharp
public void ExemplesStack()
{
// Types valeur → Stack
int nombre = 42;
double prix = 19.99;
bool actif = true;
char lettre = 'A';
DateTime maintenant = DateTime.Now;

// Structures personnalisées → Stack
Point point = new Point(10, 20);

// Paramètres de méthodes → Stack
// Variables locales → Stack
// Adresses de retour → Stack
}

public struct Point  // struct = type valeur
{
public int X;
public int Y;

public Point(int x, int y)
{
    X = x;
    Y = y;
}
}
```

- Caractéristiques de la Stack

**Avantages** :

- **Très rapide** : allocation/libération en une instruction
- **Gestion automatique** : nettoyage automatique à la fin de portée
- **Pas de fragmentation** : allocation séquentielle

**Limitations** :

- **Taille limitée** : ~1MB par thread (Windows)
- **Portée limitée** : données perdues à la fin de la méthode
- **Pas de redimensionnement** : taille fixe à la compilation

```csharp
public void DangerStackOverflow()
{
int[] grandTableau = new int[1000000]; // StackOverflowException !
// Les gros tableaux doivent être alloués sur le heap
}
```

**Le Heap (Tas)** - Principe de fonctionnement

Le heap est une zone mémoire où les objets sont alloués de manière dynamique.

```csharp
public void ExempleHeap()
{
// L'objet string est créé sur le heap
string texte = "Bonjour";

// L'objet List et son contenu sont sur le heap
List<int> nombres = new List<int>();
nombres.Add(1);
nombres.Add(2);

// L'objet Person est créé sur le heap
Person personne = new Person("Alice", 30);
}

public class Person  // class = type référence
{
public string Nom;
public int Age;

public Person(string nom, int age)
{
    Nom = nom;
    Age = age;
}
}
```

- Ce qui est stocké dans le Heap

```csharp
public void ExemplesHeap()
{
// Types référence → Heap
string texte = "Hello";           // Objet string sur heap
object obj = new object();        // Object sur heap
int[] tableau = new int[100];     // Tableau sur heap
List<int> liste = new List<int>(); // Liste sur heap
Person p = new Person();          // Instance de classe sur heap

// Même les types valeur peuvent aller sur le heap s'ils sont boxed
object nombreBoxed = 42;          // int boxé → heap
}
```

- Représentation mémoire complète

```csharp
public void ExempleComplet()
{
int age = 25;                    // Stack
string nom = "Alice";            // Référence sur Stack, objet sur Heap
Person personne = new Person();   // Référence sur Stack, objet sur Heap
}

```

**Mémoire** :

```text
STACK                    HEAP
┌─────────────────┐     ┌──────────────────────┐
│ age = 25        │     │                      │
├─────────────────┤     │ "Alice"              │ ← nom pointe ici
│ nom = 0x1A2B3C  │────→│ [A][l][i][c][e][\0] │
├─────────────────┤     │                      │
│ personne= 0x4D5E│────→│ Person object        │
└─────────────────┘     │ {                    │
                    │   Nom = "Alice"      │
                    │   Age = 25           │
                    │   ...                │
                    │ }                    │
                    └──────────────────────┘

```

- Garbage Collection

Le heap nécessite un nettoyage périodique par le **Garbage Collector (GC)** :

```csharp
public void ExempleGarbageCollection()
{
for (int i = 0; i < 1000; i++)
{
    // Chaque itération crée un nouvel objet sur le heap
    string temp = "Iteration " + i;
    // 'temp' devient inaccessible à la fin de l'itération
    // → Candidat pour le Garbage Collection
}

// Forcer le GC (généralement pas recommandé)
GC.Collect();
}
```

**Générations du GC** :

- **Génération 0** : Objets jeunes, collectés fréquemment
- **Génération 1** : Objets moyens, collectés moins souvent
- **Génération 2** : Objets anciens, collectés rarement

- Comparaison pratique : Performance

```csharp
public void ComparaisonPerformance()
{
// RAPIDE - Stack allocation
Stopwatch sw = Stopwatch.StartNew();
for (int i = 0; i < 1000000; i++)
{
    int nombre = i;  // Stack - très rapide
}
sw.Stop();
Console.WriteLine($"Stack: {sw.ElapsedMilliseconds}ms");

// PLUS LENT - Heap allocation
sw.Restart();
for (int i = 0; i < 1000000; i++)
{
    object nombre = i;  // Boxing → Heap - plus lent
}
sw.Stop();
Console.WriteLine($"Heap: {sw.ElapsedMilliseconds}ms");
}
```

- Tableau comparatif

| Aspect | Stack | Heap |
| --- | --- | --- |
| **Vitesse** | Très rapide (1-2 cycles CPU) | Plus lent (allocation + GC) |
| **Taille** | Limitée (~1MB) | Limitée par RAM disponible |
| **Gestion** | Automatique (LIFO) | Garbage Collector |
| **Fragmentation** | Aucune | Possible |
| **Thread Safety** | Un stack par thread | Partagé entre threads |
| **Durée de vie** | Portée locale | Jusqu'au GC |

- Types valeur vs Types référence : Types valeur (Value Types)

```csharp
// Stockés directement sur la stack (ou inline dans un objet)
int nombre = 42;
bool actif = true;
DateTime date = DateTime.Now;
Point point = new Point(1, 2);  // struct

// Copie par valeur
int a = 10;
int b = a;  // 'b' obtient une COPIE de 'a'
a = 20;     // 'b' reste à 10

```

- Types valeur vs Types référence : Types référence (Reference Types)

```csharp
// L'objet est sur le heap, la référence sur la stack
Person p1 = new Person("Alice");
Person p2 = p1;  // p2 pointe vers le MÊME objet que p1

p1.Nom = "Bob";
Console.WriteLine(p2.Nom);  // Affiche "Bob" !
// Car p1 et p2 pointent vers le même objet

```

- Cas particuliers et subtilités

- Boxing et Unboxing

```csharp
public void ExempleBoxing()
{
int nombre = 42;        // Stack
object obj = nombre;    // Boxing : copie sur le heap
int retour = (int)obj;  // Unboxing : copie vers la stack

// Performance impact !
}

```

- Closures et captures

```csharp
public Func<int> ExempleClosure()
{
int compteur = 0;  // Normalement sur stack

return () => ++compteur;  // Closure capture 'compteur'
// → 'compteur' est déplacé sur le heap !
}

```

- Strings - Cas spécial

```csharp
public void ExempleString()
{
string s1 = "Hello";
string s2 = "Hello";  // Même référence (string interning)

string s3 = "Hel" + "lo";  // Optimisation compilateur → même référence
string s4 = "Hel".ToString() + "lo";  // Nouvelle instance sur heap

Console.WriteLine(ReferenceEquals(s1, s2));  // True
Console.WriteLine(ReferenceEquals(s1, s4));  // False
}

```

- Implications pratiques pour le développeur

- Optimisations possibles

```csharp
// ❌ Éviter - Allocations inutiles
public string FormatMessage(int count)
{
return "Il y a " + count + " éléments";  // 3 allocations string
}

// ✅ Mieux - StringBuilder pour concatenations multiples
public string FormatMessageOptimized(int count)
{
var sb = new StringBuilder();
sb.Append("Il y a ");
sb.Append(count);
sb.Append(" éléments");
return sb.ToString();  // 1 allocation finale
}

// ✅ Encore mieux - Interpolation (C# 6+)
public string FormatMessageBest(int count)
{
return $"Il y a {count} éléments";  // Optimisé par le compilateur
}

```

- `Span<T>` et `Memory<T>` (C# 7.2+)

```csharp
public void ExempleSpan()
{
// Span permet de travailler avec des portions de mémoire
// sans allocation supplémentaire

string texte = "Hello World";
ReadOnlySpan<char> portion = texte.AsSpan(0, 5);  // "Hello"
// Pas d'allocation ! Juste une "vue" sur la string existante
}
```

- Détection des problèmes mémoire

- Stack Overflow

```csharp
public void RecursionInfinie()
{
RecursionInfinie();  // Stack overflow après ~1000 appels
}
```

- Memory Leaks sur le Heap

```csharp
public class ProblemeMemoire
{
private static List<string> _cache = new List<string>();

public void AjouterAuCache(string donnee)
{
    _cache.Add(donnee);  // Jamais nettoyé → Memory leak !
}
}
```

- Outils de diagnostic

```csharp
// Informations mémoire
long memoryBefore = GC.GetTotalMemory(false);
// ... code à analyser ...
long memoryAfter = GC.GetTotalMemory(false);
Console.WriteLine($"Mémoire utilisée: {memoryAfter - memoryBefore} bytes");

// Profilers recommandés :
// - dotMemory (JetBrains)
// - PerfView (Microsoft, gratuit)
// - Visual Studio Diagnostic Tools
```

- Points clés à retenir

1. **Types valeur → Stack** (rapide, automatique, limité)
2. **Types référence → Heap** (flexible, GC requis, plus lent)
3. **Performance** : Préférer la stack quand possible
4. **Mémoire** : Attention aux allocations inutiles sur le heap
5. **Debugging** : Comprendre où sont vos données aide à diagnostiquer les problèmes

Cette compréhension est essentielle pour écrire du code C# performant et éviter les pièges mémoire courants.

### 2.3 Opérateurs et expressions

```csharp
// Arithmétiques
int resultat = 10 + 5 * 2; // Ordre des opérations

// Comparaison
bool estEgal = (a == b);
bool estSuperieur = (a > b);

// Logiques
bool condition = (age >= 18) && (permisValide == true);

// Assignment composé
age += 1; // Équivaut à age = age + 1;
```

### 2.4 Structures de contrôle

```csharp
// Conditions
if (age >= 18)
{
Console.WriteLine("Majeur");
}
else if (age >= 16)
{
Console.WriteLine("Adolescent");
}
else
{
Console.WriteLine("Mineur");
}

// Switch (C# 8.0+)
string message = age switch
{
< 13 => "Enfant",
< 18 => "Adolescent",
>= 18 => "Adulte"
};

// Boucles
for (int i = 0; i < 10; i++)
{
Console.WriteLine($"Iteration {i}");
}

foreach (int nombre in nombres)
{
Console.WriteLine(nombre);
}

while (condition)
{
// Code à répéter
}
```

## Phase 3: Programmation Orientée Objet (2-3 semaines)

### 3.1 Classes et objets

```csharp
public class Personne
{
// Champs (fields)
private string _nom;
private int _age;

// Propriétés (properties) - Encapsulation
public string Nom
{
get { return _nom; }
set { _nom = value; }
}

// Auto-implemented property
public string Email { get; set; }

// Constructeur
public Personne(string nom, int age)
{
_nom = nom;
_age = age;
}

// Méthode
public void SePresenter()
{
Console.WriteLine($"Je suis {_nom}, j'ai {_age} ans");
}
}

// Utilisation
Personne personne = new Personne("Alice", 30);
personne.SePresenter();
```

**Concepts clés** :

- **Encapsulation** : Cacher les détails d'implémentation
- **Constructeur** : Initialise l'objet lors de sa création
- **Propriétés vs Champs** : Contrôle d'accès et validation

### 3.2 Héritage

```csharp
public class Employe : Personne
{
public string Poste { get; set; }
public decimal Salaire { get; set; }

public Employe(string nom, int age, string poste) : base(nom, age)
{
Poste = poste;
}

// Override d'une méthode
public override void SePresenter()
{
base.SePresenter();
Console.WriteLine($"Je travaille comme {Poste}");
}
}
```

### 3.3 Polymorphisme et interfaces

```csharp
public interface ICalculateur
{
double Calculer(double a, double b);
}

public class Additonneur : ICalculateur
{
public double Calculer(double a, double b)
{
return a + b;
}
}

public class Multiplicateur : ICalculateur
{
public double Calculer(double a, double b)
{
return a * b;
}
}
```

**Pourquoi les interfaces** : Elles définissent un contrat que les classes doivent respecter, permettant le polymorphisme.

## Phase 4: Concepts avancés (2-3 semaines)

### 4.1 Collections génériques

```csharp
// List<T> - Tableau dynamique
List<string> noms = new List<string>();
noms.Add("Alice");
noms.Add("Bob");

// Dictionary<TKey, TValue> - Clé-valeur
Dictionary<string, int> ages = new Dictionary<string, int>
{
{"Alice", 30},
{"Bob", 25}
};

// LINQ - Language Integrated Query
var adultes = noms.Where(nom => ages[nom] >= 18).ToList();
```

### 4.2 Gestion des exceptions

```csharp
try
{
int resultat = 10 / 0; // Division par zéro
}
catch (DivideByZeroException ex)
{
    Console.WriteLine($"Erreur: {ex.Message}");
}
catch (Exception ex)
{
    Console.WriteLine($"Erreur générale: {ex.Message}");
}
finally
{
    Console.WriteLine("Bloc toujours exécuté");
}
```

### 4.3 Programmation asynchrone

```csharp
public async Task<string> TelechargerDonneesAsync(string url)
{
    using HttpClient client = new HttpClient();
    string contenu = await client.GetStringAsync(url);
    return contenu;
}

// Utilisation
string donnees = await TelechargerDonneesAsync("https://api.exemple.com");
```

**Pourquoi async/await** : Évite de bloquer l'interface utilisateur lors d'opérations longues (I/O, réseau).

## Phase 5: Architectures et design patterns (3-4 semaines)

### 5.1 Architecture en couches

```text
Présentation (UI)
    ↓
Logique métier (Business Logic)
    ↓
Accès aux données (Data Access)
    ↓
Base de données
```

### 5.2 Design patterns essentiels

- **Repository Pattern** : Abstraction de l'accès aux données
- **Dependency Injection** : Inversion de contrôle
- **Singleton** : Une seule instance d'une classe
- **Observer** : Notification automatique des changements

### 5.3 Principes SOLID

- **S**ingle Responsibility : Une classe, une responsabilité
- **O**pen/Closed : Ouvert à l'extension, fermé à la modification
- **L**iskov Substitution : Les sous-classes doivent être substituables
- **I**nterface Segregation : Interfaces spécifiques plutôt que générales
- **D**ependency Inversion : Dépendre d'abstractions, pas de concrétions

## Phase 6: Écosystème .NET (2-3 semaines)

### 6.1 Types d'applications .NET

- **.NET Console** : Applications en ligne de commande
- **ASP.NET Core** : Applications web et APIs
- **Blazor** : Applications web avec C# (côté client)
- **MAUI** : Applications multiplateformes (mobile/desktop)
- **WPF** : Applications Windows desktop

### 6.2 Gestion des packages avec NuGet

```bash
# Ajouter un package
dotnet add package Newtonsoft.Json

# Restaurer les packages
dotnet restore

# Lister les packages
dotnet list package
```

### 6.3 Entity Framework Core (ORM)

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Produit> Produits { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=app.db");
    }
}

// Utilisation
using var context = new ApplicationDbContext();
var produits = await context.Produits.Where(p => p.Prix > 100).ToListAsync();
```

## Phase 7: Outils et bonnes pratiques (1-2 semaines)

### 7.1 Tests unitaires

```csharp
[TestClass]
public class CalculatriceTests
{
    [TestMethod]
    public void Addition_DeuxNombres_RetourneResultatCorrect()
    {
        // Arrange
        var calculatrice = new Calculatrice();

        // Act
        var resultat = calculatrice.Additionner(2, 3);

        // Assert
        Assert.AreEqual(5, resultat);
    }
}
```

### 7.2 Debugging dans VS Code

- **Points d'arrêt** : F9 pour ajouter/supprimer
- **Exécution pas à pas** : F10 (over), F11 (into)
- **Variables** : Inspection dans le panneau de debug
- **Console de debug** : Évaluation d'expressions

### 7.3 Git et contrôle de version

```bash
# Initialiser un repository
git init
git add .
git commit -m "Initial commit"

# Branches pour les fonctionnalités
git checkout -b nouvelle-fonctionnalite
```

## Ressources recommandées

### Documentation officielle

- [Microsoft Learn C#](https://docs.microsoft.com/learn/paths/csharp-first-steps/)
- [.NET Documentation](https://docs.microsoft.com/dotnet/)

### Projets pratiques suggérés

1. **Gestionnaire de tâches** (console) - POO, collections
2. **API de blog** (ASP.NET Core) - Web, base de données
3. **Calculatrice graphique** (WPF/MAUI) - Interface utilisateur
4. **Chat en temps réel** (SignalR) - Programmation asynchrone

### Conseils pour progresser efficacement

### 1. Pratique régulière

- Codez au minimum 30 minutes par jour
- Alternez théorie et pratique (70% pratique, 30% théorie)

### 2. Projets personnels

- Choisissez des projets qui vous passionnent
- Commencez petit, ajoutez des fonctionnalités progressivement

### 3. Communauté

- Participez aux forums (Stack Overflow, Reddit r/csharp)
- Contribuez à des projets open source
- Rejoignez des groupes locaux de développeurs

### 4. Veille technologique

- Suivez les annonces Microsoft (.NET Conf)
- Lisez des blogs techniques
- Testez les nouvelles fonctionnalités C#

Cette roadmap vous donnera une base solide pour devenir un développeur C# compétent. L'important est de pratiquer régulièrement et de ne pas hésiter à revenir sur les concepts fondamentaux quand vous abordez des sujets plus complexes.

## Guide complet des solutions .NET

### Vue d'ensemble de l'écosystème .NET

L'écosystème .NET moderne est organisé autour de **.NET** (anciennement .NET Core), qui a unifié la plupart des technologies Microsoft. Voici toutes les solutions disponibles :

### 1. Applications Console

```bash
dotnet new console -n MonApp
```

**Utilisation** :

- Scripts d'automatisation et outils en ligne de commande
- Applications de traitement par lots (batch processing)
- Services de traitement de données
- Outils de développement et utilitaires

**Intérêts** :

- Démarrage rapide et simple
- Consommation mémoire minimale
- Parfait pour l'apprentissage des concepts C#
- Facilité de déploiement et d'exécution

**À savoir** :

- Exécution séquentielle par défaut
- Idéal pour les tâches automatisées (cron jobs sur Linux)
- Supporte tous les concepts avancés de .NET (async/await, DI, etc.)

### 2. Applications Web

#### 2.1 ASP.NET Core Web API

```bash
dotnet new webapi -n MonAPI
```

**Utilisation** :

- APIs REST pour applications mobiles et web
- Microservices
- Intégrations système-à-système
- Backend pour applications SPA (Single Page Applications)

**Intérêts** :

- Performance élevée (parmi les plus rapides du marché)
- Support natif des standards REST et OpenAPI/Swagger
- Middleware pipeline flexible
- Injection de dépendances intégrée

**À savoir** :

- Format JSON par défaut, mais supporte XML, MessagePack
- Authentification JWT, OAuth2, Identity Server
- Versioning d'API intégré
- Excellente integration avec Entity Framework Core

#### 2.2 ASP.NET Core MVC

```bash
dotnet new mvc -n MonSiteWeb
```

**Utilisation** :

- Sites web traditionnels avec rendu côté serveur
- Applications web d'entreprise
- Portails d'administration
- Sites e-commerce

**Intérêts** :

- Pattern Model-View-Controller bien établi
- Razor Pages pour un développement rapide
- Support complet des formulaires et validation
- SEO-friendly (rendu serveur)

**À savoir** :

- Courbe d'apprentissage plus élevée que les APIs
- Moins populaire depuis l'essor des SPA
- Toujours pertinent pour certains cas d'usage

#### 2.3 Blazor Server

```bash
dotnet new blazorserver -n MonAppBlazor
```

**Utilisation** :

- Applications web interactives avec C# côté client
- Dashboards et applications d'entreprise
- Prototypage rapide d'interfaces

**Intérêts** :

- Écrire du code client en C# au lieu de JavaScript
- Debugging côté serveur pour le code "client"
- Partage de code entre client et serveur
- Composants réutilisables

**À savoir** :

- Connexion SignalR obligatoire (problème de latence)
- Pas de fonctionnement offline
- Consommation serveur plus élevée

#### 2.4 Blazor WebAssembly (WASM)

```bash
dotnet new blazorwasm -n MonAppWasm
```

**Utilisation** :

- Applications web qui fonctionnent entièrement côté client
- PWA (Progressive Web Apps)
- Applications nécessitant un fonctionnement offline

**Intérêts** :

- Aucune dépendance serveur après le téléchargement
- Performance native grâce à WebAssembly
- Développement 100% C#

**À savoir** :

- Taille de téléchargement importante (~2MB minimum)
- Temps de démarrage plus lent
- Support limité des APIs navigateur (pas d'accès direct au DOM)
- Technologie relativement récente, écosystème en développement

### 3. Applications Desktop

#### 3.1 WPF (Windows Presentation Foundation)

```bash
dotnet new wpf -n MonAppWPF

```

**Utilisation** :

- Applications Windows desktop riches
- Applications d'entreprise complexes
- Outils de productivité
- Applications nécessitant des interfaces sophistiquées

**Intérêts** :

- Interface utilisateur très flexible avec XAML
- Data binding puissant
- Styles et templates avancés
- Pattern MVVM bien supporté

**À savoir** :

- Windows uniquement
- Courbe d'apprentissage élevée
- Très mature et stable
- Toujours activement développé par Microsoft

#### 3.2 Windows Forms (WinForms)

```bash
dotnet new winforms -n MonAppWinForms

```

**Utilisation** :

- Applications Windows desktop simples
- Outils internes d'entreprise
- Applications de migration depuis .NET Framework

**Intérêts** :

- Développement rapide avec designer visuel
- Concepts simples (événements, contrôles)
- Très stable et prévisible

**À savoir** :

- Interface moins moderne que WPF
- Windows uniquement
- Moins flexible pour les interfaces complexes
- Toujours supporté mais moins d'évolutions

#### 3.3 .NET MAUI (Multi-platform App UI)

```bash
dotnet new maui -n MonAppMAUI

```

**Utilisation** :

- Applications multiplateformes (Windows, macOS, iOS, Android)
- Applications métier nécessitant une présence sur plusieurs plateformes
- Applications avec logique métier partagée

**Intérêts** :

- Une seule base de code pour toutes les plateformes
- Performance native sur chaque plateforme
- Accès aux APIs natives de chaque plateforme

**À savoir** :

- Relativement nouveau (successeur de Xamarin)
- Complexité de débogage multiplateforme
- Nécessite des SDK spécifiques pour chaque plateforme
- Performances inférieures aux apps natives pures

### 4. Applications Mobile

#### 4.1 .NET MAUI Mobile

**Utilisation** :

- Applications iOS et Android avec C#
- Applications d'entreprise mobile
- Applications avec beaucoup de logique métier

**Intérêts** :

- Partage de code entre mobile et desktop
- Accès aux APIs natives (caméra, GPS, etc.)
- Performance proche du natif

**À savoir** :

- Compilation AOT sur iOS (contraintes spécifiques)
- Taille d'application plus importante qu'une app native
- Courbe d'apprentissage pour les spécificités mobiles

### 5. Services et Applications Cloud

#### 5.1 Azure Functions

```bash
dotnet new func -n MaFunction

```

**Utilisation** :

- Computing serverless
- Traitement d'événements
- APIs légères et rapides
- Intégrations et automatisations

**Intérêts** :

- Pay-per-execution (coût optimisé)
- Scaling automatique
- Intégration native Azure
- Cold start optimisé

**À savoir** :

- Limites de timeout (par défaut 5 minutes)
- État non persistant entre exécutions
- Debugging local possible avec Azure Functions Core Tools

#### 5.2 Worker Services

```bash
dotnet new worker -n MonService

```

**Utilisation** :

- Services Windows/systemd Linux
- Traitement en arrière-plan
- Tâches planifiées
- Microservices sans interface

**Intérêts** :

- Template optimisé pour les services long-running
- Intégration native avec le système d'exploitation
- Support complet de l'injection de dépendances
- Logging et configuration standardisés

**À savoir** :

- Parfait pour remplacer les anciens services Windows
- Support natif Docker
- Monitoring et health checks intégrés

### 6. Applications Temps Réel

#### 6.1 SignalR

```bash
dotnet add package Microsoft.AspNetCore.SignalR

```

**Utilisation** :

- Chat en temps réel
- Notifications push
- Dashboards live
- Jeux multijoueurs simples
- Applications collaboratives

**Intérêts** :

- Abstraction des protocoles (WebSockets, Long Polling, etc.)
- Scaling avec Redis backplane
- Support client JavaScript, .NET, Java

**À savoir** :

- Gestion automatique des reconnexions
- Peut consommer beaucoup de ressources serveur
- Excellent pour les applications Blazor Server

#### 6.2 gRPC Services

```bash
dotnet new grpc -n MonServiceGRPC

```

**Utilisation** :

- Communication inter-services haute performance
- Microservices architecture
- APIs internes d'entreprise
- Streaming de données

**Intérêts** :

- Performance supérieure à REST
- Contrats typés avec Protocol Buffers
- Support bidirectionnel streaming
- Génération automatique de clients

**À savoir** :

- Courbe d'apprentissage plus élevée que REST
- Moins de support dans les outils standard (ex: navigateurs)
- Excellent pour la communication service-to-service

### 7. Tests et Qualité

#### 7.1 MSTest / NUnit / xUnit

```bash
dotnet new mstest -n MesTests
dotnet new nunit -n MesTests
dotnet new xunit -n MesTests

```

**Utilisation** :

- Tests unitaires
- Tests d'intégration
- TDD (Test Driven Development)

**Différences** :

- **MSTest** : Microsoft officiel, intégration Visual Studio
- **NUnit** : Plus de features, syntaxe expressive
- **xUnit** : Moderne, utilisé par Microsoft pour .NET Core

#### 7.2 Benchmarking avec BenchmarkDotNet

```csharp
[Benchmark]
public void MaMethodeAOptimiser() { }

```

**Utilisation** :

- Mesure de performance précise
- Comparaison d'algorithmes
- Optimisation de code critique

### 8. Technologies Spécialisées

#### 8.1 ML.NET

```bash
dotnet add package Microsoft.ML

```

**Utilisation** :

- Machine Learning intégré en .NET
- Classification, régression, clustering
- Recommandations
- Analyse de sentiments

**Intérêts** :

- Pas besoin d'apprendre Python
- Intégration native avec applications .NET
- AutoML pour automatiser la création de modèles

#### 8.2 .NET Interactive (Notebooks)

**Utilisation** :

- Exploration de données
- Prototypage
- Documentation exécutable
- Apprentissage et démonstrations

**Intérêts** :

- Jupyter-like experience avec C#
- Parfait pour l'analyse de données
- Partage facile de code et résultats

### 9. Accès aux Données

#### 9.1 Entity Framework Core

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer

```

**Utilisation** :

- ORM (Object-Relational Mapping)
- Applications avec base de données relationnelle
- Code-First ou Database-First development

**Intérêts** :

- LINQ pour les requêtes
- Migrations automatiques
- Support multi-SGBD
- Lazy/Eager loading

**À savoir** :

- Performance parfois inférieure au SQL brut
- Courbe d'apprentissage pour les concepts avancés
- Excellent tooling (dotnet ef)

#### 9.2 Dapper

```bash
dotnet add package Dapper

```

**Utilisation** :

- Micro-ORM haute performance
- Applications nécessitant un contrôle SQL précis
- Optimisation de requêtes critiques

**Intérêts** :

- Performance excellente
- Contrôle total du SQL
- Simplicité d'utilisation

**À savoir** :

- Pas de tracking d'entités
- SQL à écrire manuellement
- Parfait complément à EF Core

### 10. Nouvelles Technologies Émergentes

#### 10.1 .NET Aspire (Preview)

**Utilisation** :

- Orchestration d'applications cloud-native
- Microservices development
- Applications distribuées

**Intérêts** :

- Orchestration locale pour le développement
- Observabilité intégrée
- Configuration simplifiée

#### 10.2 Blazor Hybrid

**Utilisation** :

- Applications desktop avec UI web
- Migration progressive d'applications web vers desktop

### Matrice de choix technologique

| Besoin | Solution recommandée | Alternative |
| --- | --- | --- |
| API REST | ASP.NET Core Web API | Minimal APIs |
| Site web traditionnel | ASP.NET Core MVC | Blazor Server |
| App interactive moderne | Blazor WASM | Blazor Server |
| Desktop Windows | WPF | WinForms |
| Desktop multiplateforme | .NET MAUI | Avalonia UI |
| Mobile | .NET MAUI | Xamarin (legacy) |
| Service en arrière-plan | Worker Service | Console + Scheduler |
| Microservice haute perf | gRPC | Web API |
| Machine Learning | ML.NET | Python interop |
| Temps réel | SignalR | WebSockets bruts |
| Serverless | Azure Functions | AWS Lambda |

### Conseils de sélection

#### Pour débuter

1. **Console Application** - Apprendre C#
2. **ASP.NET Core Web API** - Services web
3. **Blazor Server** - Interface web interactive

#### Pour la production

- **Performance critique** : gRPC, Dapper, AOT compilation
- **Scaling** : Microservices avec Docker/Kubernetes
- **Multiplateforme** : .NET MAUI, Blazor WASM
- **Enterprise** : ASP.NET Core + Entity Framework Core

#### Tendances actuelles

- **Cloud-native** : Containerisation, microservices
- **Performance** : AOT compilation, minimal APIs
- **Developer Experience** : Hot reload, minimal setup
- **Cross-platform** : Linux first-class citizen

Cette vue d'ensemble vous donne les outils pour choisir la bonne technologie .NET selon votre contexte. Chaque solution a sa place dans l'écosystème moderne.

## Débuter un projet

### Phase 0 — Planification & contrat API (fondation)

#### 1. **Définir le périmètre fonctionnel**

- Liste claire des ressources (ex. `Ticket`, `User`, `Comment`).
- Pour chaque ressource : actions nécessaires (CRUD, search, filter, bulk?).
- Prioriser MVP vs features secondaires.
- DoD : liste validée (README / Trello) avec endpoints principaux.

#### 2. **Écrire le contrat API minimal (OpenAPI)**

- Esquisser endpoints avec méthode, route, paramètres, status codes attendus.
- Définir modèles d’entrée/sortie (DTOs) pour chaque endpoint.
- DoD : fichier `openapi.yml` ou un mock Swagger (Postman/Insomnia) avec les routes CRUD.

#### 3. **Décider contraintes non-fonctionnelles**

- Auth (JWT? Identity?), quotas, taux, SLA, exigences de persistance (Postgres), observabilité, versioning.
- DoD : document `nonfunctional.md` avec choix et raisons.

### Phase 1 — Initialisation du projet & repo

#### 1. **Créer repo & structure initiale**

- `git init`, `.gitignore` (.NET template), `README.md`.
- Choix single vs multi-project (pour apprentissage single ok; pour prod multi-project recommandé).
- DoD : repo en place, README sommaire, `.gitignore`.

#### 2. **Générer projet / solution**

- Commandes usuelles :
  - `dotnet new webapi -n MyApp.Api`
  - (optionnel multi-projet) `dotnet new classlib -n MyApp.Core` & `dotnet new classlib -n MyApp.Infrastructure`
  - `dotnet new sln && dotnet sln add ...`
- DoD : solution compile (`dotnet build`).

### Phase 2 — Dépendances & configuration initiale

#### 1. **Ajouter packages de base**

- EF Core, provider Postgres/Sqlite, Swashbuckle, FluentValidation, AutoMapper/Mapster, Serilog, JwtBearer, Polly.
- Exemple : `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL`
- DoD : packages ajoutés et projet compile.

#### 2. **Configuration d’environnement**

- `appsettings.Development.json` / `appsettings.Production.json`.
- Variables d’environnement pour secrets (ne pas mettre secret en clair).
- DoD : `IConfiguration` lit la chaîne de connexion via `ASPNETCORE_ENVIRONMENT` correctement.

### Phase 3 — Modélisation du domaine

#### 1. **Définir entités & invariants**

- Créer classes d’entités (Ticket, User…), décider des propriétés, des contraintes (nullable, longueur).
- Penser UTC pour dates.
- DoD : classes entities créées dans `Core/Entities`.

#### 2. **Décider des Value Objects / agrégats**

- Si pertinent : extraire sous-objets (Email, Money) pour invariants.
- DoD : VOs implémentés + tests unitaires simples pour invariants.

#### 3. **Concevoir schéma DB sommaire**

- Diagramme ER ou migration d’essai.
- DoD : modèle logique documenté (PNG / Mermaid / README).

### Phase 4 — Data access & migrations

#### 1. **Créer `AppDbContext`**

- `DbSet<>` pour chaque entité.
- Configs `OnModelCreating` pour clés composées, indexes, RowVersion.
- DoD : DbContext ajouté et enregistré en DI (`AddDbContext`).

#### 2. **Configurer connection string**

- Pour dev : SQLite ou Postgres local via docker-compose.
- Stocker en env var en prod.
- DoD : `dotnet run` connecte sans erreur à la DB.

#### 3. **Ajouter migration initiale & appliquer**

- `dotnet ef migrations add InitialCreate`
- `dotnet ef database update`
- DoD : tables créées dans la base; script de migration validé.

### Phase 5 — Abstraction d’accès (Repository / Ports)

#### 1. **Définir interfaces de repository dans Core**

- Ex : `ITicketRepository` (GetByIdAsync, GetPagedAsync, AddAsync, UpdateAsync).
- DoD : interfaces présentes et couvertes par tests d’interface (si besoin).

#### 2. **Implémenter repositories dans Infrastructure (EF Core)**

- Implémenter méthodes en veillant à `AsNoTracking` où utile.
- DoD : implémentation compile et tests unitaires de base (mock DB ou InMemory).

#### 3. **Décider pattern : UnitOfWork / GenericRepository ?**

- Si simple : méthodes directes sur repo; si transaction complexe : UoW.
- DoD : pattern choisi et documenté.

### Phase 6 — Logique métier (Services / Use Cases)

#### 1. **Créer services (Application layer)**

- `TicketService` qui orchestre validation, règles métier et repository.
- Expose méthodes claires (CreateTicketAsync, CloseTicketAsync, etc).
- DoD : services testés unitaires (mocks pour repo).

#### 2. **Implémenter règles métiers & validations server-side**

- Validation business (ex: pas de création sans titre), gestion erreurs custom (domain exceptions).
- DoD : règles implémentées + tests.

### Phase 7 — Mapping & DTOs

#### 1. **Créer DTOs d’entrée/sortie**

- `TicketCreateDto`, `TicketReadDto`, `TicketUpdateDto`.
- DoD : DTOs définis et référencés dans le contrat OpenAPI.

#### 2. **Configurer mapping (AutoMapper / Mapster)**

- Profil de mapping, tests de mapping (ex : `Ticket` ↔ `TicketReadDto`).
- DoD : mapping couvert par test (map aller/retour si pertinent).

### Phase 8 — Contrôleurs & routing

#### 1. **Créer controllers minimalistes**

- Contrôleur pour Ticket : méthodes REST renvoyant `ActionResult<T>` et codes HTTP appropriés.
- `CreatedAtAction` pour POST, `NoContent` pour DELETE/PUT si besoin.
- DoD : endpoints implémentés et accessibles localement (`dotnet run`).

#### 2. **Pagination, filtrage et tri**

- QueryParameters object (page, pageSize, sortBy, filter).
- DoD : endpoints list supportent paramètres et renvoient metadata (`X-Total-Count` ou body `meta`).

#### 3. **Versioning API**

- Décider versioning (route v1, header, media type).
- DoD : versioning activé et testé.

### Phase 9 — Validation & gestion des erreurs

#### 1. **Intégrer FluentValidation / DataAnnotations**

- Validators pour DTOs, error messages standardisés.
- DoD : validation automatique (400) activée et testée.

#### 2. **Middleware global d’exception**

- Retourne `ProblemDetails` (RFC7807).
- Mapping exceptions → status codes.
- DoD : Exceptions transformées en réponses JSON contrôlées.

### Phase 10 — Authentification & Autorisation

#### 1. **Choisir modèle d’auth**

- JWT stateless standard pour API + refresh si besoin.
- Ou ASP.NET Identity si gestion utilisateurs lourde.
- DoD : choix documenté.

#### 2. **Configurer JWT**

- `AddAuthentication().AddJwtBearer(...)`, config `Issuer`, `Audience`, clé secrète dans secret store.
- Middleware `UseAuthentication()` avant `UseAuthorization()`.
- DoD : login endpoint génère token; endpoint protégé par `[Authorize]` renvoie 401 si non auth.

#### 3. **Rôles & policies**

- Définir policies (ex: `CanEditTicket`) et appliquer via `[Authorize(Policy = "CanEditTicket")]`.
- DoD : policies testées.

### Phase 11 — Observabilité & logging

#### 1. **Configurer logging structuré**

- `ILogger<T>`, Serilog pour fichiers/Seq.
- DoD : logs structurés avec requestId et scopes.

#### 2. **Ajouter metric/trace basique**

- Exposer `/metrics` ou intégrer OpenTelemetry (si prévu).
- DoD : traces/metrics visibles (local/observability target).

#### 3. **Health checks**

- `Microsoft.Extensions.Diagnostics.HealthChecks` avec endpoints `/health`.
- DoD : health check renvoie `Healthy`.

### Phase 12 — Tests & qualité

#### 1. **Écrire tests unitaires**

- Services, validators, mapping.
- Mock repos (Moq/NSubstitute).
- DoD : tests unitaires passent.

#### 2. **Écrire tests d’intégration**

- `WebApplicationFactory<T>`; DB SQLite InMemory or Testcontainers for Postgres.
- Tests sur status, auth, pipeline (middleware).
- DoD : tests d’intégration passent sur CI.

#### 3. **Analyse statique & couverture**

- Ajoute analyzers (.editorconfig, dotnet analyzers).
- DoD : analyse configuree; seuil minimal de couverture/documenté.

### Phase 13 — Documentation & Swagger

#### 1. **Configurer Swagger/OpenAPI**

- Inclure descriptions, exemples, security scheme JWT.
- DoD : Swagger UI accessible et utilitaire pour tester auth.

#### 2. **Rédiger README & contrat**

- How-to run, env vars, tests, endpoints list.
- DoD : README explicite pour dev local

### Phase 14 — Sécurité & hardening

#### 1. **Activer HTTPS & HSTS en prod**

- DoD : redirections en place.

#### 2. **Configurer CORS**

- Domaines autorisés, méthodes autorisées.
- DoD : client JS fonctionne sans erreur CORS.

#### 3. **Sécuriser headers**

- CSP, X-Frame-Options, X-Content-Type-Options (via middleware).
- DoD : headers vérifiés.

#### 4. **Rate limiting / throttling**

- Optionnel : middleware ou API Management.
- DoD : test basique de rate limiting.

### Phase 15 — Containerisation & local infra

#### 1. **Dockerfile multi-stage**

- `dotnet publish` → runtime image.
- DoD : image buildée localement et `docker run` fonctionne.

#### 2. **docker-compose pour dev**

- Services : app, postgres, adminer (optionnel).
- DoD : `docker-compose up` lance app + DB.

### Phase 16 — CI/CD & déploiement

#### 1. **Créer pipeline CI (GitHub Actions)**

- Steps : build, test, publish, build image, push to registry.
- DoD : pipeline déclenche et réussit sur PR.

#### 2. **Déployer staging**

- Déployer sur target (Render, Azure App Service, etc.). (Choix selon toi)
- DoD : endpoint staging disponible et accessible.

#### 3. **Configurer secrets & migrations automatiques**

- Migrations appliquées lors du déploiement (ou via job DB migration séparé).
- DoD : DB migrée automatiquement lors du déploiement.

### Phase 17 — Go-live & post-déploiement

#### 1. **Checklist pré-go live**

- Tests smoke, HTTPS, logging, monitoring.
- DoD : checklist cochée.

#### 2. **Monitoring & alerting**

- Configure alertes (erreurs 5xx, latence, disk).
- DoD : alertes opérationnelles.

#### 3. **Backups & rotation de secrets**

- Plan backup DB et rotation clé JWT.
- DoD : stratégie documentée et testée.

### Phase 18 — Améliorations & maintenance

#### 1. **Observabilité avancée**

- Traces distribuées, dashboards.

#### 2. **Refactor vers Clean architecture (si nécessaire)**

- Extraire `Core`, `Infrastructure` si pas déjà fait.

#### 3. **Optimisations**

- Indices DB, caching (Redis), query tuning.

### Petits conseils pratiques (rapide)

- Commits atomiques ; PRs descriptives.
- Tests avant changement de schema ; migrations versionnées.
- Ne pas exposer entités EF ; passe toujours par DTOs.
- `DbContext` = `Scoped`.
- Eviter `.Result` / `.Wait()`.
- Toujours avoir une `Health check` et un endpoint `/metrics` basique en prod. -->