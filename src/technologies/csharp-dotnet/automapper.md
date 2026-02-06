# AutoMapper - Guide de référence

## Vue d'ensemble

AutoMapper est une bibliothèque de mapping objet-objet pour .NET qui permet de transformer automatiquement un objet d'un type vers un autre type, en évitant d'écrire manuellement du code de mapping répétitif.

**Cas d'usage typique** : Transformer des entités de domaine (modèles) en DTOs (Data Transfer Objects) pour les APIs ou l'UI.

## Pourquoi utiliser AutoMapper ?

### Avantages

- **Moins de code boilerplate** : Évite d'écrire des mappings manuels propriété par propriété
- **Maintenabilité** : Centralise la logique de mapping
- **Testabilité** : Les configurations de mapping peuvent être testées indépendamment
- **Performance** : Optimisé pour des transformations rapides

### Inconvénients

- **Courbe d'apprentissage** : Configuration initiale peut sembler complexe
- **Magie noire** : Les mappings implicites peuvent masquer des bugs
- **Debugging** : Plus difficile de tracer les erreurs de mapping

## Installation

```bash
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
```

## Configuration de base

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

## Patterns de mapping courants

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

## Pattern Service de Mapping (meilleure pratique)

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

## Tester AutoMapper

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

## Pièges courants et solutions

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
// Lent - charge tout en mémoire puis mappe
var dtos = _mapper.Map<List<ProduitDto>>(await context.Produits.ToListAsync());

// Rapide - projette directement en SQL
var dtos = await context.Produits
    .ProjectTo<ProduitDto>(_mapper.ConfigurationProvider)
    .ToListAsync();
```

## Comparaison AutoMapper vs Mapping manuel

| Critère | AutoMapper | Mapping manuel |
| --- | --- | --- |
| **Verbosité** | ⭐⭐⭐⭐⭐ Minimal | ⭐⭐ Répétitif |
| **Performance** | ⭐⭐⭐⭐ Très bon | ⭐⭐⭐⭐⭐ Optimal |
| **Maintenabilité** | ⭐⭐⭐⭐ Centralisé | ⭐⭐⭐ Dispersé |
| **Debugging** | ⭐⭐⭐ Moyen | ⭐⭐⭐⭐⭐ Facile |
| **Contrôle** | ⭐⭐⭐ Conventions | ⭐⭐⭐⭐⭐ Total |

**Recommandation** : Utiliser AutoMapper pour les mappings simples et répétitifs. Pour les transformations complexes avec beaucoup de logique métier, envisager du mapping manuel ou hybride (AutoMapper + post-traitement).

## 🔗 Ressources

- **Documentation officielle** : <https://docs.automapper.org/>
- **GitHub** : <https://github.com/AutoMapper/AutoMapper>
- **NuGet** : <https://www.nuget.org/packages/AutoMapper>

## 📝 Checklist d'implémentation

- [ ]  Installer les packages AutoMapper
- [ ]  Créer un ou plusieurs profils de mapping
- [ ]  Enregistrer AutoMapper dans le DI
- [ ]  Tester la configuration avec `AssertConfigurationIsValid()`
- [ ]  Créer un service de mapping dédié si logique complexe
- [ ]  Mettre à jour les tests (ajouter les mocks)
- [ ]  Documenter les mappings non-conventionnels
