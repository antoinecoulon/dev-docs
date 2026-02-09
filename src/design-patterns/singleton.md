# Singleton

## Définition et Contexte

Le pattern Singleton est un **pattern de création** qui garantit qu'une classe ne possède qu'une seule instance dans l'application et fournit un point d'accès global à cette instance.

**⚠️ Avertissement préliminaire** : Le Singleton est probablement le pattern le plus controversé. Souvent considéré comme un **anti-pattern**, il doit être utilisé avec parcimonie et compréhension de ses implications.

## Analogie Métier

Imaginons le **Président de la République** :

- **Instance unique** : Il ne peut y avoir qu'un seul président en fonction à la fois
- **Accès global** : Tous les citoyens et institutions savent comment contacter le président (via l'Élysée)
- **Responsabilité centralisée** : Certaines décisions ne peuvent être prises que par cette instance unique
- **Point de coordination** : Il coordonne les actions nationales

Autre analogie : le **gestionnaire d'impression** de votre ordinateur. Il n'existe qu'une seule file d'attente d'impression pour éviter les conflits entre applications qui impriment simultanément.

## Problème Résolu

**Situation sans Singleton :**

```csharp
// Mauvaise approche : instances multiples possibles
public class ConfigurationApp
{
    public string ChaineCo { get; set; }
    public int TimeoutSeconde { get; set; }
}

// Problème : création d'instances différentes
var config1 = new ConfigurationApp { ChaineCo = "Server1", TimeoutSeconde = 30 };
var config2 = new ConfigurationApp { ChaineCo = "Server2", TimeoutSeconde = 60 };
// Quelle configuration est la "vraie" ? Incohérence garantie !
```

**Problèmes identifiés :**

1. Impossibilité de garantir une configuration unique pour toute l'application
2. Risque d'incohérence entre différentes parties du code
3. Gaspillage de ressources (multiples connexions DB, fichiers ouverts, etc.)
4. Difficultés de synchronisation

## Structure du Pattern

```text
┌───────────────────────────┐
│      Singleton            │
├───────────────────────────┤
│ - instance: Singleton     │ ← Stockage de l'instance unique
│                           │
├───────────────────────────┤
│ - Singleton()             │ ← Constructeur privé
│ + getInstance(): Singleton│ ← Point d'accès global
│ + operation()             │
└───────────────────────────┘
```

## Implémentations en `C#`

### ❌ Version 1 : Implémentation Naïve (À NE PAS UTILISER)

```csharp
// ATTENTION : Cette implémentation est NON thread-safe
public class SingletonNaif
{
    private static SingletonNaif? _instance;

    // Constructeur privé empêche l'instanciation directe
    private SingletonNaif()
    {
        Console.WriteLine("Instance créée");
    }

    public static SingletonNaif Instance
    {
        get
        {
            // ⚠️ PROBLÈME : Race condition en environnement multi-thread
            if (_instance == null)
            {
                _instance = new SingletonNaif();
            }
            return _instance;
        }
    }

    public void FaireQuelqueChose()
    {
        Console.WriteLine("Opération effectuée");
    }
}

// Démonstration du problème
public class DemoProblemeThreading
{
    public static void Main()
    {
        var tasks = new List<Task>();

        for (int i = 0; i < 10; i++)
        {
            tasks.Add(Task.Run(() =>
            {
                var instance = SingletonNaif.Instance;
                Console.WriteLine($"Thread {Task.CurrentId}: {instance.GetHashCode()}");
            }));
        }

        Task.WaitAll(tasks.ToArray());
        // Vous pourriez voir plusieurs messages "Instance créée" !
    }
}
```

### ✅ Version 2 : Thread-Safe avec Lock (Double-Check Locking)

```csharp
public sealed class SingletonThreadSafe
{
    private static SingletonThreadSafe? _instance;
    private static readonly object _lock = new object();

    // Constructeur privé
    private SingletonThreadSafe()
    {
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss.fff}] Instance créée par thread {Thread.CurrentThread.ManagedThreadId}");
    }

    public static SingletonThreadSafe Instance
    {
        get
        {
            // Premier check (sans lock pour la performance)
            if (_instance == null)
            {
                lock (_lock)
                {
                    // Second check (avec lock pour la sécurité)
                    if (_instance == null)
                    {
                        _instance = new SingletonThreadSafe();
                    }
                }
            }
            return _instance;
        }
    }

    public void ExecuterOperation(string operation)
    {
        Console.WriteLine($"[Thread {Thread.CurrentThread.ManagedThreadId}] Opération : {operation}");
    }
}

// Test de thread-safety
public class TestThreadSafety
{
    public static void Main()
    {
        Console.WriteLine("=== TEST THREAD-SAFETY ===\n");

        var tasks = new Task[20];

        for (int i = 0; i < 20; i++)
        {
            int index = i;
            tasks[i] = Task.Run(() =>
            {
                var instance = SingletonThreadSafe.Instance;
                Console.WriteLine($"Task {index}: HashCode = {instance.GetHashCode()}");
                instance.ExecuterOperation($"Tâche #{index}");
            });
        }

        Task.WaitAll(tasks);

        Console.WriteLine("\n✅ Une seule instance créée malgré 20 threads concurrents");
    }
}
```

### ✅ Version 3 : Lazy Initialization (Recommandée en C#)

```csharp
public sealed class SingletonLazy
{
    // Le CLR garantit la thread-safety de l'initialisation de Lazy<T>
    private static readonly Lazy<SingletonLazy> _lazy =
        new Lazy<SingletonLazy>(() => new SingletonLazy());

    public static SingletonLazy Instance => _lazy.Value;

    private SingletonLazy()
    {
        Console.WriteLine("Instance Lazy créée");
    }

    public void ExecuterOperation()
    {
        Console.WriteLine("Opération Lazy exécutée");
    }
}
```

### ✅ Version 4 : Eager Initialization (Initialisation Anticipée)

```csharp
public sealed class SingletonEager
{
    // L'instance est créée dès le chargement de la classe
    private static readonly SingletonEager _instance = new SingletonEager();

    // Constructeur statique explicite pour forcer l'initialisation anticipée
    static SingletonEager()
    {
        Console.WriteLine("Classe chargée, instance créée immédiatement");
    }

    private SingletonEager()
    {
        Console.WriteLine("Constructeur privé appelé");
    }

    public static SingletonEager Instance => _instance;

    public void ExecuterOperation()
    {
        Console.WriteLine("Opération Eager exécutée");
    }
}
```

## Cas d'Usage Concret : Gestionnaire de Configuration

```csharp
using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

public sealed class GestionnaireConfiguration
{
    private static readonly Lazy<GestionnaireConfiguration> _lazy =
        new Lazy<GestionnaireConfiguration>(() => new GestionnaireConfiguration());

    public static GestionnaireConfiguration Instance => _lazy.Value;

    private Dictionary<string, string> _configuration;
    private readonly string _cheminFichier;
    private DateTime _derniereModification;

    private GestionnaireConfiguration()
    {
        _cheminFichier = "appsettings.json";
        ChargerConfiguration();
        Console.WriteLine("✅ Gestionnaire de configuration initialisé");
    }

    private void ChargerConfiguration()
    {
        try
        {
            if (File.Exists(_cheminFichier))
            {
                var json = File.ReadAllText(_cheminFichier);
                _configuration = JsonSerializer.Deserialize<Dictionary<string, string>>(json)
                    ?? new Dictionary<string, string>();
                _derniereModification = File.GetLastWriteTime(_cheminFichier);
                Console.WriteLine($"Configuration chargée : {_configuration.Count} paramètres");
            }
            else
            {
                _configuration = new Dictionary<string, string>
                {
                    { "Environment", "Development" },
                    { "DatabaseConnection", "Server=localhost;Database=Test" },
                    { "LogLevel", "Information" },
                    { "MaxRetries", "3" }
                };
                SauvegarderConfiguration();
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Erreur lors du chargement : {ex.Message}");
            _configuration = new Dictionary<string, string>();
        }
    }

    public string ObtenirValeur(string cle, string valeurParDefaut = "")
    {
        VerifierRecharger();
        return _configuration.TryGetValue(cle, out var valeur) ? valeur : valeurParDefaut;
    }

    public void DefinirValeur(string cle, string valeur)
    {
        _configuration[cle] = valeur;
        SauvegarderConfiguration();
        Console.WriteLine($"Configuration mise à jour : {cle} = {valeur}");
    }

    private void VerifierRecharger()
    {
        if (File.Exists(_cheminFichier))
        {
            var derniereModif = File.GetLastWriteTime(_cheminFichier);
            if (derniereModif > _derniereModification)
            {
                Console.WriteLine("⟳ Rechargement de la configuration détectée");
                ChargerConfiguration();
            }
        }
    }

    private void SauvegarderConfiguration()
    {
        try
        {
            var json = JsonSerializer.Serialize(_configuration, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            File.WriteAllText(_cheminFichier, json);
            _derniereModification = File.GetLastWriteTime(_cheminFichier);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Erreur lors de la sauvegarde : {ex.Message}");
        }
    }

    public void AfficherConfiguration()
    {
        Console.WriteLine("\n=== CONFIGURATION ACTUELLE ===");
        foreach (var kvp in _configuration)
        {
            Console.WriteLine($"{kvp.Key} = {kvp.Value}");
        }
        Console.WriteLine("==============================\n");
    }
}

// Utilisation
public class ProgrammeConfiguration
{
    public static void Main()
    {
        Console.WriteLine("=== DEMO GESTIONNAIRE CONFIGURATION ===\n");

        // Premier accès : création de l'instance
        var config = GestionnaireConfiguration.Instance;
        config.AfficherConfiguration();

        // Utilisation dans différentes parties de l'application
        var env = config.ObtenirValeur("Environment");
        Console.WriteLine($"Environnement : {env}");

        var dbConnection = config.ObtenirValeur("DatabaseConnection");
        Console.WriteLine($"Connexion DB : {dbConnection}");

        // Modification
        config.DefinirValeur("LastAccess", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));

        // Vérification que c'est bien la même instance
        var config2 = GestionnaireConfiguration.Instance;
        Console.WriteLine($"\nMême instance ? {ReferenceEquals(config, config2)}");
        Console.WriteLine($"HashCode config1: {config.GetHashCode()}");
        Console.WriteLine($"HashCode config2: {config2.GetHashCode()}");

        config2.AfficherConfiguration();
    }
}
```

## Cas d'Usage : Pool de Connexions

```csharp
using System;
using System.Collections.Concurrent;
using System.Threading;

public sealed class PoolConnexions
{
    private static readonly Lazy<PoolConnexions> _instance =
        new Lazy<PoolConnexions>(() => new PoolConnexions());

    public static PoolConnexions Instance => _instance.Value;

    private readonly ConcurrentBag<ConnexionBD> _connexionsDisponibles;
    private readonly int _tailleMax;
    private int _nombreConnexionsCreees;

    private PoolConnexions()
    {
        _tailleMax = 10;
        _connexionsDisponibles = new ConcurrentBag<ConnexionBD>();
        _nombreConnexionsCreees = 0;
        Console.WriteLine($"✅ Pool de connexions créé (taille max: {_tailleMax})");
    }

    public ConnexionBD ObtenirConnexion()
    {
        if (_connexionsDisponibles.TryTake(out var connexion))
        {
            Console.WriteLine($"♻️  Connexion réutilisée (disponibles: {_connexionsDisponibles.Count})");
            return connexion;
        }

        if (_nombreConnexionsCreees < _tailleMax)
        {
            Interlocked.Increment(ref _nombreConnexionsCreees);
            connexion = new ConnexionBD(_nombreConnexionsCreees);
            Console.WriteLine($"➕ Nouvelle connexion créée #{_nombreConnexionsCreees}");
            return connexion;
        }

        // Attente qu'une connexion se libère
        Console.WriteLine("⏳ Pool saturé, attente...");
        SpinWait.SpinUntil(() => _connexionsDisponibles.TryTake(out connexion));
        return connexion!;
    }

    public void LibererConnexion(ConnexionBD connexion)
    {
        if (connexion != null)
        {
            _connexionsDisponibles.Add(connexion);
            Console.WriteLine($"↩️  Connexion libérée (disponibles: {_connexionsDisponibles.Count})");
        }
    }

    public void AfficherStatistiques()
    {
        Console.WriteLine($"\n📊 Statistiques du pool:");
        Console.WriteLine($"   Connexions créées: {_nombreConnexionsCreees}/{_tailleMax}");
        Console.WriteLine($"   Connexions disponibles: {_connexionsDisponibles.Count}");
    }
}

public class ConnexionBD
{
    public int Id { get; }

    public ConnexionBD(int id)
    {
        Id = id;
    }

    public void ExecuterRequete(string sql)
    {
        Console.WriteLine($"[Connexion #{Id}] Exécution: {sql}");
        Thread.Sleep(100); // Simulation
    }
}

// Démonstration
public class DemoPool
{
    public static void Main()
    {
        Console.WriteLine("=== DEMO POOL DE CONNEXIONS ===\n");

        var pool = PoolConnexions.Instance;

        // Simulation de requêtes concurrentes
        var tasks = new Task[15];

        for (int i = 0; i < 15; i++)
        {
            int index = i;
            tasks[i] = Task.Run(() =>
            {
                var connexion = pool.ObtenirConnexion();
                try
                {
                    connexion.ExecuterRequete($"SELECT * FROM Users WHERE Id={index}");
                }
                finally
                {
                    pool.LibererConnexion(connexion);
                }
            });
        }

        Task.WaitAll(tasks);

        pool.AfficherStatistiques();
    }
}
```

## Analyse Critique Approfondie

### ✅ Avantages (Rares et Spécifiques)

1. **Instance unique garantie** : Utile pour ressources partagées (pool de connexions, cache)
2. **Point d'accès global** : Facilite l'accès depuis n'importe où
3. **Initialisation contrôlée** : Lazy loading possible
4. **Économie de ressources** : Évite les instanciations multiples de ressources coûteuses

### ❌ Inconvénients Majeurs (Pourquoi c'est un Anti-Pattern)

### 1. **État Global Caché**

```csharp
// ❌ Dépendance cachée difficile à détecter
public class ServiceUtilisateur
{
    public void CreerUtilisateur(string nom)
    {
        // Dépendance invisible au Singleton
        var config = GestionnaireConfiguration.Instance;
        var timeout = config.ObtenirValeur("Timeout");

        // Si GestionnaireConfiguration change, ce code casse silencieusement
    }
}
```

**Problème** : Les dépendances ne sont pas explicites, rendant le code difficile à comprendre et à maintenir.

### 2. **Violation du Principe de Responsabilité Unique**

Le Singleton a deux responsabilités :

- Gérer son cycle de vie (garantir l'unicité)
- Fournir sa fonctionnalité métier

```csharp
// La classe fait trop de choses
public class ServiceLogger
{
    private static readonly Lazy<ServiceLogger> _instance = ...;
    public static ServiceLogger Instance => _instance.Value; // Responsabilité 1

    public void Log(string message) { ... } // Responsabilité 2
}
```

### 3. **Tests Unitaires Impossibles ou Difficiles**

```csharp
// ❌ Impossible de mocker le Singleton
public class CalculateurPrix
{
    public decimal CalculerPrix(string produit)
    {
        var taux = GestionnaireConfiguration.Instance.ObtenirValeur("TauxTVA");
        // Comment tester avec un taux différent ?
        return 100 * decimal.Parse(taux);
    }
}

// ❌ Tests couplés entre eux
[TestClass]
public class TestsCalculateur
{
    [TestMethod]
    public void Test1()
    {
        GestionnaireConfiguration.Instance.DefinirValeur("TauxTVA", "0.20");
        // Si Test2 s'exécute avant, il peut modifier la valeur !
    }

    [TestMethod]
    public void Test2()
    {
        GestionnaireConfiguration.Instance.DefinirValeur("TauxTVA", "0.10");
        // État partagé = tests interdépendants
    }
}
```

### 4. **Couplage Fort**

```csharp
// Toute l'application dépend directement du Singleton
public class ServiceA
{
    public void Methode() => MonSingleton.Instance.Operation();
}

public class ServiceB
{
    public void Methode() => MonSingleton.Instance.Operation();
}

// Impossible de remplacer MonSingleton sans modifier toutes les classes
```

### 5. **Problèmes de Concurrence**

```csharp
public sealed class CompteurGlobal
{
    private static readonly Lazy<CompteurGlobal> _instance = ...;
    private int _compteur = 0;

    public void Incrementer()
    {
        // ❌ Race condition !
        _compteur++;
    }
}

// Même si le Singleton est thread-safe, son ÉTAT peut ne pas l'être !
```

## Solutions Modernes : Alternatives au Singleton

### ✅ Solution 1 : Injection de Dépendances (Recommandée)

```csharp
using Microsoft.Extensions.DependencyInjection;

// Interface claire
public interface IConfiguration
{
    string ObtenirValeur(string cle);
    void DefinirValeur(string cle, string valeur);
}

// Implémentation (plus besoin de Singleton !)
public class ServiceConfiguration : IConfiguration
{
    private readonly Dictionary<string, string> _parametres = new();

    public ServiceConfiguration()
    {
        // Initialisation
        _parametres["Environment"] = "Production";
    }

    public string ObtenirValeur(string cle)
    {
        return _parametres.TryGetValue(cle, out var valeur) ? valeur : "";
    }

    public void DefinirValeur(string cle, string valeur)
    {
        _parametres[cle] = valeur;
    }
}

// Utilisation avec injection
public class ServiceUtilisateur
{
    private readonly IConfiguration _configuration;

    // Dépendance EXPLICITE via le constructeur
    public ServiceUtilisateur(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public void CreerUtilisateur(string nom)
    {
        var timeout = _configuration.ObtenirValeur("Timeout");
        Console.WriteLine($"Création utilisateur {nom} avec timeout {timeout}");
    }
}

// Configuration du conteneur DI
public class Program
{
    public static void Main()
    {
        var services = new ServiceCollection();

        // Enregistrement en tant que Singleton via le conteneur DI
        // Le conteneur gère le cycle de vie, pas la classe elle-même !
        services.AddSingleton<IConfiguration, ServiceConfiguration>();
        services.AddTransient<ServiceUtilisateur>();

        var provider = services.BuildServiceProvider();

        // Obtention via DI
        var service = provider.GetRequiredService<ServiceUtilisateur>();
        service.CreerUtilisateur("Alice");

        // Avantages :
        // ✅ Testable (on peut injecter un mock)
        // ✅ Dépendances explicites
        // ✅ Pas de couplage fort
        // ✅ Respect des principes SOLID
    }
}
```

### ✅ Solution 2 : Tests avec Injection de Dépendances

```csharp
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

[TestClass]
public class TestsServiceUtilisateur
{
    [TestMethod]
    public void CreerUtilisateur_UtiliseTimeoutConfiguration()
    {
        // Arrange : création d'un mock de configuration
        var mockConfig = new Mock<IConfiguration>();
        mockConfig.Setup(c => c.ObtenirValeur("Timeout")).Returns("5000");

        var service = new ServiceUtilisateur(mockConfig.Object);

        // Act
        service.CreerUtilisateur("Bob");

        // Assert
        mockConfig.Verify(c => c.ObtenirValeur("Timeout"), Times.Once);

        // ✅ Test complètement isolé
        // ✅ Pas d'état partagé
        // ✅ Mock facile à créer
    }
}
```

### ✅ Solution 3 : Pattern Strategy + Factory

```csharp
// Au lieu d'un Singleton pour les logs
public interface ILogger
{
    void Log(string message);
}

public class FileLogger : ILogger
{
    public void Log(string message) => File.AppendAllText("log.txt", message);
}

public class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine(message);
}

// Factory pour créer le bon logger
public class LoggerFactory
{
    public static ILogger CreerLogger(string type)
    {
        return type switch
        {
            "File" => new FileLogger(),
            "Console" => new ConsoleLogger(),
            _ => throw new ArgumentException("Type inconnu")
        };
    }
}

// Utilisation flexible
public class ServiceMetier
{
    private readonly ILogger _logger;

    public ServiceMetier(ILogger logger)
    {
        _logger = logger;
    }

    public void TraiterCommande()
    {
        _logger.Log("Commande traitée");
    }
}
```

## Quand Utiliser le Singleton (Cas Légitimes)

### ✅ Cas d'usage acceptables

1. **Pool de ressources partagées**
    - Pool de connexions DB
    - Pool de threads
    - Cache applicatif
2. **Coordonnateurs centraux**
    - Gestionnaire de files d'attente
    - Event aggregator
    - Message bus
3. **Ressources système uniques**
    - Accès au matériel (imprimante, caméra)
    - Gestionnaire de licences
    - Générateur d'ID unique

### ❌ Cas où NE PAS utiliser le Singleton

1. **Configuration** → Utilisez `IOptions<T>` ou IConfiguration de ASP.NET Core
2. **Logging** → Utilisez ILogger de Microsoft.Extensions.Logging
3. **Services métier** → Utilisez l'injection de dépendances
4. **Caches simples** → Utilisez IMemoryCache
5. **État d'application** → Utilisez un State Manager avec DI

## Recommandations Professionnelles

### ✅ Si vous DEVEZ utiliser un Singleton

```csharp
public sealed class SingletonCorrect
{
    // 1. Utilisez Lazy<T> pour la thread-safety
    private static readonly Lazy<SingletonCorrect> _instance =
        new Lazy<SingletonCorrect>(() => new SingletonCorrect());

    public static SingletonCorrect Instance => _instance.Value;

    // 2. Rendez le constructeur privé
    private SingletonCorrect()
    {
        // Initialisation
    }

    // 3. Rendez la classe sealed pour éviter l'héritage
    // 4. Utilisez des méthodes thread-safe pour l'état mutable
    private readonly object _lock = new object();
    private int _compteur;

    public void Incrementer()
    {
        lock (_lock)
        {
            _compteur++;
        }
    }

    // 5. Fournissez une méthode de reset pour les tests (optionnel)
    internal void Reset()
    {
        lock (_lock)
        {
            _compteur = 0;
        }
    }
}
```

### ✅ Préférez toujours l'Injection de Dépendances

```csharp
// ASP.NET Core
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // Le conteneur DI gère le cycle de vie
        services.AddSingleton<IMonService, MonService>();

        // Avantages :
        // - Testable
        // - Pas de couplage fort
        // - Respect de SOLID
        // - Gestion automatique du cycle de vie
    }
}
```

## Lien avec votre Référentiel de Certification

Dans le contexte de votre certification "Expert en Architecture et Développement Logiciel" :

### C4 - Conception de l'architecture logicielle

- **Anticiper la maintenance** : Le Singleton crée une dette technique difficile à maintenir
- **Évolutivité** : L'injection de dépendances permet une évolution plus flexible
- **Testabilité** : Les alternatives au Singleton facilitent les tests (C8)

### C19 - Optimisation et Clean Code

- Le Singleton viole souvent les principes SOLID
- Les alternatives modernes respectent mieux les bonnes pratiques

### Recommandation pour votre progression

**N'utilisez le Singleton que si** :

1. Vous avez une raison technique impérieuse
2. Vous avez évalué toutes les alternatives
3. Vous documentez explicitement pourquoi ce choix

**Dans 90% des cas, préférez l'injection de dépendances avec un cycle de vie Singleton géré par le conteneur DI.**

Le pattern Singleton est un outil dans votre boîte à outils, mais comme un marteau-piqueur : puissant mais à utiliser avec précaution et uniquement quand c'est vraiment nécessaire.
