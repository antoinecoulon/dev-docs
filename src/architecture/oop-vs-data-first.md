# OOP vs. Data-First

## Les Deux Philosophies en Une Phrase

**OOP (Object-First)** : Les données et le comportement sont ensemble dans des objets "intelligents"

**Data-First** : Les données sont séparées du comportement. Données = structures simples, Logique = fonctions/services

## Comparaison Visuelle Rapide

### OOP Classique

```csharp
public class Compte
{
public decimal Solde { get; private set; }

    public void Deposer(decimal montant)
    {
        Solde += montant;
    }

    public bool Retirer(decimal montant)
    {
        if (Solde >= montant)
        {
            Solde -= montant;
            return true;
        }
        return false;
    }
}

// Utilisation
var compte = new Compte();
compte.Deposer(100);
compte.Retirer(30);`
```

**Caractéristiques :**

- Données + logique = un objet
- L'objet "sait" ce qu'il peut faire
- État interne caché (encapsulation)

### Data-First

```csharp
// 1. Données pures
public record CompteData(int Id, decimal Solde);

// 2. Stockage
public class CompteStore
{
private Dictionary<int, CompteData> _comptes = new();

    public CompteData Obtenir(int id) => _comptes[id];
    public void MettreAJour(CompteData compte) => _comptes[compte.Id] = compte;
}

// 3. Logique séparée
public static class CompteService
{
    public static CompteData Deposer(CompteData compte, decimal montant)
    {
        return compte with { Solde = compte.Solde + montant };
    }

    public static (bool success, CompteData compte) Retirer(
        CompteData compte,
        decimal montant)
    {
        if (compte.Solde >= montant)
        {
            return (true, compte with { Solde = compte.Solde - montant });
        }
        return (false, compte);
    }
}

// Utilisation
var store = new CompteStore();
var compte = new CompteData(1, 0);

compte = CompteService.Deposer(compte, 100);
var (success, compteApres) = CompteService.Retirer(compte, 30);
if (success) store.MettreAJour(compteApres);`
```

**Caractéristiques :**

- Données = simples structures (record)
- Logique = fonctions séparées
- État explicite, pas caché

## Les 4 Problèmes Majeurs de l'OOP

### 1. Le Graphe de Références Circulaires

**Problème :**

```csharp
public class Client
{
    public List<Commande> Commandes { get; set; }
}

public class Commande
{
    public Client Client { get; set; } // ← Référence inverse
    public List<Produit> Produits { get; set; }
}

public class Produit
{
    public List<Commande> Commandes { get; set; } // ← Encore des références
}

// Tu veux UN client, tu obtiens :// Client → Commandes → Produits → Commandes → Clients → ...
```

**Solution Data-First :**

```csharp
public record ClientData(int Id, string Nom);
public record CommandeData(int Id, int ClientId, List<int> ProduitIds);
public record ProduitData(int Id, string Nom, decimal Prix);

// Pas de références circulaires, juste des IDs
```

### 2. Les "Cross-Cutting Concerns"

**Problème :** Où mettre la logique qui concerne plusieurs objets ?

```csharp
// Combat entre Player et Monster
public class Player
{
    public void Hit(Monster monster)
    {
        // Calcul des dégâts : qui est responsable ?
        // Gain d'XP : ici ou dans Monster ?
        // Arme : paramètre ? propriété ?
    }
}

public class Monster
{
    public void TakeDamage(int damage)
    {
        // Défense appliquée ici ?
        // Mort du monstre : qui donne l'XP au joueur ?
    }
}
```

**Solution Data-First :**

```csharp
public record Entity(int Id, int HP, int Attack, int Defense);

public static class CombatSystem
{
    // TOUTE la logique au même endroit_
    public static CombatResult ResoudreCombat(
        Entity attaquant,
        Entity defenseur,
        int bonusArme)
    {
        var degats = Math.Max(1, attaquant.Attack + bonusArme - defenseur.Defense);
        var nouveauHP = defenseur.HP - degats;
        var mort = nouveauHP <= 0;
        var xpGagne = mort ? defenseur.Defense * 10 : 0;

        return new CombatResult(degats, mort, xpGagne);
    }
}
```

### 3. L'Encapsulation Schizophrène

**Problème :** Protection inutile au niveau de chaque objet

```csharp
public class Utilisateur
{
    private string _email; // Privé !

    public string GetEmail() => _email;  // Getter
    public void SetEmail(string value)    // Setter
    {
        if (!value.Contains("@"))
            throw new ArgumentException();
        _email = value;
    }
}
```

C'est comme mettre un cadenas sur ta poche gauche pour protéger de ta main droite.

**Solution Data-First :** Encapsulation au niveau module/service

```csharp
// Structure publique
public record UtilisateurData(int Id, string Email);

// Service avec validation
public class UtilisateurService
{
    private Dictionary<int, UtilisateurData> users = new();

    public void ModifierEmail(int id, string nouvelEmail)
    {
        // Validation centralisée
        if (!nouvelEmail.Contains("@"))
            throw new ArgumentException();

        var user = _users[id];
        _users[id] = user with { Email = nouvelEmail };
    }
}
```

### 4. Performance Médiocre

**Problème OOP :** Objets éparpillés en mémoire

```csharp
var objets = new List<GameObject>();
for (int i = 0; i < 1_000_000; i++)
{
    objets.Add(new GameObject()); // Chacun à un endroit différent
}

// Mise à jour : cache misses partout
foreach (var obj in objets)
{
    obj.Update(); // Saute dans toute la mémoire
}
```

**Solution Data-First :** Données contigües

```csharp
public class GameWorld
{
    private float[] _positionsX = new float[1 000 000];
    private float[] _positionsY = new float[1 000 000];
    private float[] _velocitiesX = new float[1 000000];

    public void Update(float dt)
    {
        // Excellent pour le cache CPU
        for (int i = 0; i < _positionsX.Length; i++)
        {
            _positionsX[i] += _velocitiesX[i] * dt;
        }
    }
}

// Résultat : 10-100x plus rapide
```

## Quand Utiliser Chaque Approche

### Utilise OOP quand

```text
Button, Window, TextBox - Peu d'objets, beaucoup de comportement - Workflow avec états (commande annulable)

Framework l'impose - ASP.NET MVC Models, WPF ViewModels Plugins/Extensions - Architecture à base d'interfaces
```

**Exemple typique :**

```csharp
// UI : OOP convient parfaitement
public class LoginViewModel : INotifyPropertyChanged
{
    public string Username { get; set; }
    public string Password { get; set; }
    public ICommand LoginCommand { get; }

    public LoginViewModel(IAuthService authService)
    {
        LoginCommand = new RelayCommand(
            async () => await authService.LoginAsync(Username, Password)
        );
    }
}
```

### Utilise Data-First quand

```text
Beaucoup de données (>1000 enregistrements) - Base de données, catalogues
Calculs/Recherches fréquents - Analytics, rapports
Performance critique - Jeux vidéo, trading haute fréquence
Données avec multiples représentations - Export CSV/JSON/XML
Logique transversale dominante - Systèmes de règles métier
```

**Exemple typique :**

```csharp
// Système d'analytics : Data-First idéal
public record VenteData(int Id, DateTime Date, decimal Montant, int ProduitId);

public class VenteStore
{
    private List<VenteData> _ventes = new();

    public void Ajouter(VenteData vente) => _ventes.Add(vente);
    public IEnumerable<VenteData> ObtenirPeriode(DateTime debut, DateTime fin)
        => _ventes.Where(v => v.Date >= debut && v.Date <= fin);
}

public static class AnalyticsService
{
    public static decimal ChiffreAffaires(VenteStore store, DateTime debut, DateTime fin)
        => store.ObtenirPeriode(debut, fin).Sum(v => v.Montant);

    public static Dictionary<int, decimal> VentesParProduit(VenteStore store)
        => store.ObtenirPeriode(DateTime.MinValue, DateTime.MaxValue)
                .GroupBy(v => v.ProduitId)
                .ToDictionary(g => g.Key, g => g.Sum(v => v.Montant));
}
```

## L'Approche Hybride (La Plus Réaliste)

En pratique, tu combines les deux :

```csharp
// ===== COUCHE DONNÉES : Data-First =====
public record UtilisateurData(int Id, string Email, string Nom);
public record CommandeData(int Id, int UtilisateurId, decimal Total);

public class DataStore
{
    private Dictionary<int, UtilisateurData> _utilisateurs = new();
    private Dictionary<int, CommandeData> _commandes = new();
    private Dictionary<int, List<int>> _commandesParUtilisateur = new();

    public UtilisateurData ObtenirUtilisateur(int id) => _utilisateurs[id];
    public IEnumerable<CommandeData> ObtenirCommandesUtilisateur(int userId)
        => _commandesParUtilisateur[userId].Select(id => _commandes[id]);
}

// ===== COUCHE MÉTIER : OOP (logique complexe) =====
public interface ICommandeService
{
    Task<int> CreerCommande(int userId, List<int> produitIds);
    Task<bool> AnnulerCommande(int commandeId);
}

public class CommandeService : ICommandeService
{
    private readonly DataStore _store;
    private readonly IEmailService _emailService;
    private readonly IPaiementService _paiementService;

    public CommandeService(
        DataStore store,
        IEmailService emailService,
        IPaiementService paiementService)
    {
        _store = store;
        _emailService = emailService;
        _paiementService = paiementService;
    }

    public async Task<int> CreerCommande(int userId, List<int> produitIds)
    {
        // Logique métier complexe avec plusieurs dépendances
        // OOP convient bien ici
        var utilisateur = _store.ObtenirUtilisateur(userId);

        // ... calculs, validations ...

        await _paiementService.Traiter(userId, total);
        await _emailService.EnvoyerConfirmation(utilisateur.Email);

        return commandeId;
    }

    public async Task<bool> AnnulerCommande(int commandeId)
    {
        // Orchestration complexe
        // ...
        return true;
    }
}

// ===== COUCHE PRÉSENTATION : OOP (framework) =====
public class CommandeController : Controller
{
private readonly ICommandeService _service;

    public CommandeController(ICommandeService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Creer(CreerCommandeViewModel model)
    {
        var commandeId = await _service.CreerCommande(
            model.UserId,
            model.ProduitIds
        );

        return Ok(new { commandeId });
    }
}
```

## Règles de Décision Rapides

### Volume de Données

```text
< 100 objets → OOP OK
100 - 10,000 → OOP OK, considère Data-First si beaucoup de calculs

> 10,000 → Data-First fortement recommandé
> 100,000 → Data-First obligatoire
```

### Type d'Opérations

```text
CRUD simple → OOP (Entity Framework)
Recherches complexes → Data-First (index, filtres)
Calculs statistiques → Data-First
Workflow avec états → OOP
Temps réel / Performance → Data-First
```

### Complexité de la Logique

```text
Logique par entité → OOP peut convenir
Logique transversale (calculs) → Data-First
Mix des deux → Hybride
```

## Pattern de Migration

Si tu as déjà du code OOP et tu veux passer à Data-First :

### Étape 1 : Extraire les Données

```csharp
// Avant
public class Produit
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public decimal Prix { get; set; }

    public decimal CalculerPrixTTC() => Prix * 1.20m;
}

// Après
public record ProduitData(int Id, string Nom, decimal Prix);

public static class ProduitService
{
    public static decimal CalculerPrixTTC(ProduitData produit) => produit.Prix \* 1.20m;
}
```

### Étape 2 : Remplacer les Références par des IDs

```csharp
// Avant
public class Commande
{
    public Client Client { get; set; }
    public List<Produit> Produits { get; set; }
}

// Après
public record CommandeData(
    int Id,
    int ClientId, // ID au lieu de référence
    List<int> ProduitIds // IDs au lieu d'objets
);
```

### Étape 3 : Créer un Store Centralisé

```csharp
public class ApplicationStore
{
    private Dictionary<int, ClientData> _clients = new();
    private Dictionary<int, CommandeData> _commandes = new();
    private Dictionary<int, ProduitData> _produits = new();

    // Index pour requêtes rapides
    private Dictionary<int, List<int>> _commandesParClient = new();

    public CommandeData ObtenirCommande(int id) => _commandes[id];

    public CommandeDetailsDto ObtenirDetailsCommande(int commandeId)
    {
        var commande = _commandes[commandeId];
        var client = _clients[commande.ClientId];
        var produits = commande.ProduitIds
            .Select(id => _produits[id])
            .ToList();

        return new CommandeDetailsDto(commande, client, produits);
    }
}
```

## Checklist de Décision

Avant de commencer un projet, demande-toi :

**Questions Data-First :**

- [ ] J'ai plus de 1000 enregistrements ?
- [ ] Je vais faire beaucoup de recherches/filtres ?
- [ ] Je vais calculer des statistiques/agrégations ?
- [ ] La performance est critique ?
- [ ] Les données ont plusieurs représentations (export, affichage) ?

**Questions OOP :**

- [ ] Peu de données, beaucoup de comportement ?
- [ ] Le framework impose une structure OOP ?
- [ ] C'est une interface utilisateur ?
- [ ] J'ai besoin de polymorphisme (plugins) ?

## Résumé en 3 Phrases

1. **OOP** = Données + Comportement ensemble → Bon pour peu d'objets avec logique complexe par objet
2. **Data-First** = Données séparées de la logique → Bon pour beaucoup de données avec calculs transversaux
3. **En pratique** = Souvent hybride : Données en Data-First, Services métier en OOP

## Le Piège à Éviter

**Ne fais pas :**

```csharp
// OOP par habitude sans réflexion
public class VenteJournaliere
{
    public DateTime Date { get; set; }
    public decimal Montant { get; set; }

    // Méthodes vides ou triviales
    public void Afficher()
    {
        Console.WriteLine($"{Date}: {Montant}€");
    }
}
```

**Fais plutôt :**

```csharp
// Data-First : structure simple
public record VenteJournaliere(DateTime Date, decimal Montant);

// Logique séparée et réutilisable
public static class VenteFormatter
{
    public static string Afficher(VenteJournaliere vente)
        => $"{vente.Date:dd/MM/yyyy}: {vente.Montant:C}";

    public static string AfficherJSON(VenteJournaliere vente)
        => JsonSerializer.Serialize(vente);
}
```

**En résumé :** Réfléchis à tes **données** d'abord (volume, structure, opérations), puis choisis l'approche adaptée. Ne fais pas de l'OOP par défaut !
