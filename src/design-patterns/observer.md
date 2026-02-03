# Observer

## Définition et Contexte

Le pattern Observer est un **pattern comportemental** qui établit une relation de dépendance un-à-plusieurs entre objets. Lorsqu'un objet change d'état, tous ses dépendants sont automatiquement notifiés et mis à jour.

## Analogie Métier

Imaginons un système d'alertes météo :

- **Le sujet** : la station météorologique qui mesure la température
- **Les observateurs** : les applications mobiles des utilisateurs abonnés
- **Le mécanisme** : quand la température change, tous les abonnés reçoivent automatiquement la mise à jour

Sans Observer, chaque application devrait interroger constamment la station (polling). Avec Observer, la station notifie activement ses abonnés uniquement lors de changements.

## Problème Résolu

**Situation sans Observer :**

```csharp
// Mauvaise approche : couplage fort
public class SystemeAlarme
{
    public void DeclenecherAlarme()
    {
        // Couplage direct avec toutes les dépendances
        var sms = new ServiceSMS();
        sms.EnvoyerAlerte();

        var email = new ServiceEmail();
        email.EnvoyerAlerte();

        var sirene = new Sirene();
        sirene.Activer();

        // Impossible d'ajouter de nouveaux comportements sans modifier cette classe
    }
}

```

**Problèmes identifiés :**

1. Couplage fort entre le sujet et ses dépendances
2. Violation du principe Ouvert/Fermé
3. Difficile de tester unitairement
4. Impossible d'ajouter dynamiquement des observateurs

## Structure du Pattern

```
┌─────────────┐         ┌──────────────┐
│   Subject   │◇───────>│  IObserver   │
├─────────────┤         ├──────────────┤
│ +Attach()   │         │ +Update()    │
│ +Detach()   │         └──────────────┘
│ +Notify()   │                △
└─────────────┘                │
       △                       │
       │                       │
       │              ┌────────┴─────────┐
       │              │                  │
┌──────┴────────┐  ┌──────────┐  ┌──────────┐
│ConcreteSubject│  │ObserverA │  │ObserverB │
└───────────────┘  └──────────┘  └──────────┘

```

## Implémentation en C#

### Version 1 : Implémentation Manuelle

```csharp
// Interface pour les observateurs
public interface IObservateur
{
    void MettreAJour(string donnee);
}

// Classe abstraite pour le sujet observable
public abstract class SujetObservable
{
    private readonly List<IObservateur> _observateurs = new();

    // Abonner un observateur
    public void Abonner(IObservateur observateur)
    {
        if (!_observateurs.Contains(observateur))
        {
            _observateurs.Add(observateur);
            Console.WriteLine($"Observateur abonné. Total : {_observateurs.Count}");
        }
    }

    // Désabonner un observateur
    public void Desabonner(IObservateur observateur)
    {
        if (_observateurs.Remove(observateur))
        {
            Console.WriteLine($"Observateur désabonné. Total : {_observateurs.Count}");
        }
    }

    // Notifier tous les observateurs
    protected void Notifier(string donnee)
    {
        Console.WriteLine($"\n>>> Notification de {_observateurs.Count} observateur(s)...");

        foreach (var observateur in _observateurs)
        {
            observateur.MettreAJour(donnee);
        }
    }
}

// Sujet concret : Capteur de température
public class CapteurTemperature : SujetObservable
{
    private double _temperature;

    public double Temperature
    {
        get => _temperature;
        set
        {
            if (Math.Abs(_temperature - value) > 0.01) // Éviter les notifications inutiles
            {
                _temperature = value;
                Console.WriteLine($"\n[CAPTEUR] Nouvelle température : {_temperature}°C");
                Notifier($"Température : {_temperature}°C");
            }
        }
    }
}

// Observateur concret 1 : Affichage écran
public class AffichageEcran : IObservateur
{
    private readonly string _nom;

    public AffichageEcran(string nom)
    {
        _nom = nom;
    }

    public void MettreAJour(string donnee)
    {
        Console.WriteLine($"[ÉCRAN {_nom}] Mise à jour affichage : {donnee}");
    }
}

// Observateur concret 2 : Système d'alerte
public class SystemeAlerte : IObservateur
{
    private readonly double _seuilAlerte;

    public SystemeAlerte(double seuilAlerte)
    {
        _seuilAlerte = seuilAlerte;
    }

    public void MettreAJour(string donnee)
    {
        // Extraction de la température du message
        var temp = ExtraireTemperature(donnee);

        if (temp > _seuilAlerte)
        {
            Console.WriteLine($"[ALERTE] ⚠️  TEMPÉRATURE CRITIQUE : {temp}°C (seuil: {_seuilAlerte}°C)");
        }
        else
        {
            Console.WriteLine($"[ALERTE] Température normale : {temp}°C");
        }
    }

    private double ExtraireTemperature(string donnee)
    {
        var parts = donnee.Split(':');
        if (parts.Length == 2 && double.TryParse(parts[1].Replace("°C", "").Trim(), out var temp))
        {
            return temp;
        }
        return 0;
    }
}

// Observateur concret 3 : Logger
public class LoggerTemperature : IObservateur
{
    private readonly List<string> _historique = new();

    public void MettreAJour(string donnee)
    {
        var timestamp = DateTime.Now.ToString("HH:mm:ss");
        var entree = $"[{timestamp}] {donnee}";
        _historique.Add(entree);
        Console.WriteLine($"[LOGGER] Enregistré : {entree}");
    }

    public void AfficherHistorique()
    {
        Console.WriteLine("\n=== HISTORIQUE ===");
        foreach (var entree in _historique)
        {
            Console.WriteLine(entree);
        }
    }
}

```

### Utilisation

```csharp
public class Program
{
    public static void Main()
    {
        // Création du sujet observable
        var capteur = new CapteurTemperature();

        // Création des observateurs
        var ecranSalon = new AffichageEcran("Salon");
        var ecranChambre = new AffichageEcran("Chambre");
        var alerte = new SystemeAlerte(30.0);
        var logger = new LoggerTemperature();

        // Abonnement des observateurs
        Console.WriteLine("=== PHASE D'ABONNEMENT ===");
        capteur.Abonner(ecranSalon);
        capteur.Abonner(ecranChambre);
        capteur.Abonner(alerte);
        capteur.Abonner(logger);

        // Simulation de changements de température
        Console.WriteLine("\n=== SIMULATION ===");
        capteur.Temperature = 22.5;

        Thread.Sleep(1000);
        capteur.Temperature = 25.0;

        Thread.Sleep(1000);
        capteur.Temperature = 32.5; // Déclenchera l'alerte

        // Désabonnement d'un observateur
        Console.WriteLine("\n=== DÉSABONNEMENT ===");
        capteur.Desabonner(ecranChambre);

        Thread.Sleep(1000);
        capteur.Temperature = 20.0;

        // Affichage de l'historique
        logger.AfficherHistorique();
    }
}

```

### Version 2 : Avec IObservable/IObserver de .NET

C# fournit des interfaces natives pour implémenter le pattern Observer de manière plus idiomatique :

```csharp
using System;
using System.Collections.Generic;

// Sujet observable utilisant IObservable<T>
public class CapteurTemperatureReactif : IObservable<double>
{
    private readonly List<IObserver<double>> _observateurs = new();
    private double _temperature;

    public double Temperature
    {
        get => _temperature;
        set
        {
            if (Math.Abs(_temperature - value) > 0.01)
            {
                _temperature = value;
                NotifierObservateurs(_temperature);
            }
        }
    }

    public IDisposable Subscribe(IObserver<double> observer)
    {
        if (!_observateurs.Contains(observer))
        {
            _observateurs.Add(observer);
        }

        // Retourne un objet permettant le désabonnement
        return new Desabonnement(_observateurs, observer);
    }

    private void NotifierObservateurs(double temperature)
    {
        foreach (var observer in _observateurs)
        {
            observer.OnNext(temperature);
        }
    }

    // Classe interne pour gérer le désabonnement
    private class Desabonnement : IDisposable
    {
        private readonly List<IObserver<double>> _observateurs;
        private readonly IObserver<double> _observateur;

        public Desabonnement(List<IObserver<double>> observateurs, IObserver<double> observateur)
        {
            _observateurs = observateurs;
            _observateur = observateur;
        }

        public void Dispose()
        {
            if (_observateur != null && _observateurs.Contains(_observateur))
            {
                _observateurs.Remove(_observateur);
            }
        }
    }
}

// Observateur utilisant IObserver<T>
public class AffichageReactif : IObserver<double>
{
    private readonly string _nom;
    private IDisposable? _abonnement;

    public AffichageReactif(string nom)
    {
        _nom = nom;
    }

    public void Abonner(IObservable<double> provider)
    {
        _abonnement = provider.Subscribe(this);
    }

    public void Desabonner()
    {
        _abonnement?.Dispose();
    }

    public void OnNext(double temperature)
    {
        Console.WriteLine($"[{_nom}] Température reçue : {temperature}°C");
    }

    public void OnError(Exception error)
    {
        Console.WriteLine($"[{_nom}] Erreur : {error.Message}");
    }

    public void OnCompleted()
    {
        Console.WriteLine($"[{_nom}] Fin des mesures");
    }
}

// Utilisation
public class ProgrammeReactif
{
    public static void Main()
    {
        var capteur = new CapteurTemperatureReactif();

        var affichage = new AffichageReactif("Principal");
        affichage.Abonner(capteur);

        capteur.Temperature = 22.5;
        capteur.Temperature = 25.0;

        // Désabonnement automatique avec using
        using (var affichageTemp = new AffichageReactif("Temporaire"))
        {
            affichageTemp.Abonner(capteur);
            capteur.Temperature = 28.0;
        } // Désabonnement automatique ici

        capteur.Temperature = 30.0; // affichageTemp ne sera plus notifié
    }
}

```

## Analyse Critique

### ✅ Avantages

1. **Couplage faible** : Le sujet ne connaît pas les détails de ses observateurs
2. **Principe Ouvert/Fermé** : Ajout d'observateurs sans modifier le sujet
3. **Communication dynamique** : Abonnement/désabonnement à l'exécution
4. **Réutilisabilité** : Les observateurs sont indépendants et réutilisables

### ⚠️ Inconvénients et Pièges

1. **Ordre de notification non garanti** : Les observateurs sont notifiés dans l'ordre d'ajout, mais sans garantie contractuelle
2. **Fuites mémoire** : Oublier de désabonner un observateur empêche sa collecte par le GC
3. **Performance** : Avec beaucoup d'observateurs, les notifications peuvent être coûteuses
4. **Cascades de notifications** : Un observateur qui modifie le sujet peut créer des boucles infinies

### Solution aux problèmes courants

```csharp
// Prévenir les fuites mémoire avec WeakReference
public class SujetAvecWeakReferences : SujetObservable
{
    private readonly List<WeakReference<IObservateur>> _observateurs = new();

    public new void Abonner(IObservateur observateur)
    {
        _observateurs.Add(new WeakReference<IObservateur>(observateur));
        NettoyerReferencesInvalides();
    }

    private void NettoyerReferencesInvalides()
    {
        _observateurs.RemoveAll(wr => !wr.TryGetTarget(out _));
    }

    protected new void Notifier(string donnee)
    {
        NettoyerReferencesInvalides();

        foreach (var weakRef in _observateurs)
        {
            if (weakRef.TryGetTarget(out var observateur))
            {
                observateur.MettreAJour(donnee);
            }
        }
    }
}

// Prévenir les boucles infinies
public class SujetAvecProtection : SujetObservable
{
    private bool _enCoursDeNotification = false;

    protected new void Notifier(string donnee)
    {
        if (_enCoursDeNotification)
        {
            Console.WriteLine("⚠️  Notification récursive détectée et bloquée");
            return;
        }

        try
        {
            _enCoursDeNotification = true;
            base.Notifier(donnee);
        }
        finally
        {
            _enCoursDeNotification = false;
        }
    }
}

```

## Cas d'Usage Pratiques

1. **Interfaces graphiques** : MVC/MVVM où la vue observe le modèle
2. **Systèmes événementiels** : Architecture event-driven
3. **Monitoring** : Surveillance de métriques système
4. **Synchronisation de données** : Mise à jour de caches multiples
5. **Notifications push** : Systèmes d'alertes temps réel

## Lien avec votre Référentiel

Dans le contexte de votre certification (C4 - Conception de l'architecture logicielle), le pattern Observer illustre :

- **Anticipation de la maintenance** : Facilite l'ajout de nouveaux comportements sans modification du code existant
- **Évolutions technologiques** : Permet l'intégration de nouveaux systèmes de notification sans impacter l'existant
- **Modélisation adaptée aux besoins** : Répond aux besoins d'architecture réactive et découplée

Le pattern Observer est **fondamental** dans les architectures modernes, notamment dans les frameworks comme React (avec les hooks), Angular (avec RxJS), ou ASP.NET Core (avec SignalR). Sa maîtrise est donc essentielle pour votre progression vers l'expertise en architecture logicielle.