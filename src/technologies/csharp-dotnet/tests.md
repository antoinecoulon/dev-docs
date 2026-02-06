# Tests unitaires en C# avec xUnit et Moq

Synthèse de bonnes pratiques tirées d'un projet réel de calcul de formules

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

## 7. Bonnes pratiques

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

## 9. Checklist avant de commit

- [ ]  Tous les tests passent
- [ ]  Les nouveaux tests suivent la convention de nommage
- [ ]  Chaque test est indépendant et isolé
- [ ]  Les cas limites sont couverts (null, empty, invalid)
- [ ]  Les exceptions attendues sont testées
- [ ]  Les mocks sont vérifiés quand nécessaire
- [ ]  Le code de test est lisible et maintenable
- [ ]  Pas de code commenté ou de tests désactivés sans raison

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
