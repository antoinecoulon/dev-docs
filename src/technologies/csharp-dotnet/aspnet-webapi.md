# ASP.NET Core (WebApi)

## 1. Mise en place du projet (Linux)

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

#### Commandes CLI de base

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

#### Structure typique des dossiers

```text
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

```text
Présentation (API Controllers)
    ↓
Application (Services/Use Cases)
    ↓
Domaine (Business Logic/Entities)
    ↓
Infrastructure (Repositories/Database)
```

- **Séparation claire des responsabilités** : chaque couche a un rôle défini
- **Facilité de maintenance** : modifications localisées par couche
- **Testabilité** : possibilité de mocker chaque couche
- **Compréhension intuitive** : structure familière pour la plupart des développeurs

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

1. **Indépendance des frameworks** : le cœur métier ne dépend d'aucun framework
2. **Testabilité** : les règles métier peuvent être testées sans UI, DB ou web
3. **Indépendance de l'UI** : changement d'interface sans impact sur le métier
4. **Indépendance de la base de données** : Oracle, SQL Server, MongoDB... peu importe
5. **Règle de dépendance** : les couches internes ne dépendent jamais des couches externes

```text
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

- **Systèmes complexes** avec besoins de lecture/écriture très différents
- **Scalabilité** nécessaire (lecture et écriture séparées)
- **Domaines métier complexes** avec de nombreuses règles de validation
- **Event Sourcing** en complément

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

```text
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

### Concepts avancés - Minimal APIs vs Contrôleurs

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

### Concepts avancés - Injection de dépendances avancée

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

### Concepts avancés - Configuration robuste

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

### Concepts avancés - Entity Framework Core optimisé

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

### Concepts avancés - Gestion des erreurs centralisée

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

Authentification JWT

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

Autorisation basée sur les rôles

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

Configuration CORS pour production

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

### Principe de responsabilité unique (SRP)

```csharp
// Mauvais : classe avec trop de responsabilités
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

// Bon : responsabilités séparées
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
// Bonnes pratiques de nommage
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
// Anti-pattern : God Object
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

// Solution : Utiliser le pattern Mediator ou diviser en plusieurs contrôleurs
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

// Anti-pattern : Anemic Domain Model
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    // Aucune logique métier
}

// Rich Domain Model
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
// Bonnes pratiques async/await
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

Tests unitaires avec xUnit et Moq

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

Tests d'intégration avec TestServer

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

Configuration de test

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

```dockerfile
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

```conf
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

- **ASP.NET Core** : <https://docs.microsoft.com/aspnet/core/>
- **Entity Framework Core** : <https://docs.microsoft.com/ef/core/>
- **Authentication & Authorization** : <https://docs.microsoft.com/aspnet/core/security/>
- **Configuration** : <https://docs.microsoft.com/aspnet/core/fundamentals/configuration/>
- **Logging** : <https://docs.microsoft.com/aspnet/core/fundamentals/logging/>
- **Testing** : <https://docs.microsoft.com/aspnet/core/test/>

### Projets GitHub exemplaires

- **CleanArchitecture** : <https://github.com/jasontaylordev/CleanArchitecture>
- **CleanArchitecture.NET** : <https://github.com/ardalis/CleanArchitecture>

- **CQRS Sample** : <https://github.com/ddd-by-examples/library>
- **EventStore Sample** : <https://github.com/EventStore/EventStore>

- **eShopOnContainers** : <https://github.com/dotnet-architecture/eShopOnContainers>
- **Sample Microservices** : <https://github.com/dotnet-architecture/microservices-sample>

### Outils recommandés

#### Développement

- **Postman** : Test d'API - <https://www.postman.com/>
- **Insomnia** : Alternative à Postman - <https://insomnia.rest/>
- **JetBrains Rider** : IDE complet pour .NET - <https://www.jetbrains.com/rider/>
- **VS Code** avec extensions C#

#### Base de données

- **pgAdmin** : Interface PostgreSQL - <https://www.pgadmin.org/>
- **Redis Commander** : Interface Redis - <https://github.com/joeferner/redis-commander>
- **DBeaver** : Client universel - <https://dbeaver.io/>

#### Déploiement et monitoring

- **Docker Desktop** : <https://www.docker.com/products/docker-desktop>
- **Portainer** : Management Docker UI - <https://www.portainer.io/>
- **Grafana** : Monitoring et alertes - <https://grafana.com/>
- **Seq** : Logging centralisé - <https://datalust.co/seq>

#### CLI Tools

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

- **Microsoft .NET Blog** : <https://devblogs.microsoft.com/dotnet/>
- **Code Maze** : <https://code-maze.com/>
- **Andrew Lock's Blog** : <https://andrewlock.net/>
- **Steve Gordon's Blog** : <https://www.stevejgordon.co.uk/>

### Checklist finale pour la mise en production

- [ ]  HTTPS configuré avec certificats SSL valides
- [ ]  Authentication JWT avec des secrets sécurisés
- [ ]  Authorization configurée pour toutes les endpoints sensibles
- [ ]  CORS configuré de manière restrictive
- [ ]  Rate limiting activé
- [ ]  Headers de sécurité configurés
- [ ]  Validation des inputs côté serveur
- [ ]  Protection contre les injections SQL (paramètres)

- [ ]  Caching activé (mémoire + distribué)
- [ ]  Pagination implémentée
- [ ]  Requêtes EF Core optimisées (AsNoTracking, Include limité)
- [ ]  Compression des réponses HTTP
- [ ]  Connection pooling configuré
- [ ]  Async/await utilisé correctement

- [ ]  Logging structuré configuré (Serilog)
- [ ]  Health checks implémentés
- [ ]  Métriques applicatives configurées
- [ ]  Alertes configurées pour les erreurs critiques
- [ ]  Traces distribuées pour le debugging

- [ ]  Tests unitaires > 80% de couverture
- [ ]  Tests d'intégration pour les endpoints critiques
- [ ]  Code review process en place
- [ ]  Documentation API à jour (Swagger)
- [ ]  Gestion des erreurs centralisée

- [ ]  Base de données sauvegardée automatiquement
- [ ]  Environnements séparés (dev/staging/prod)
- [ ]  CI/CD pipeline configuré
- [ ]  Rollback strategy définie
- [ ]  Scaling horizontal possible
