using FluentValidation;
using Microsoft.OpenApi.Models;
using Server.Core.Extensions;
using Server.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Swagger — development tooling only (explicit user-approved exception to the no-new-packages rule).
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Clinic Management API",
        Version = "v1"
    });

    // JWT Bearer support for testing secured endpoints (used from Step 2 Auth onwards).
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Enter: Bearer {your JWT token}",
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
});

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplicationServices();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

var app = builder.Build();

// Fail fast if the dev-only JWT placeholder is used in Production.
// This repo is public — the development key must never sign production tokens.
if (app.Environment.IsProduction())
{
    var configuredKey = app.Configuration["JwtSettings:SecretKey"] ?? string.Empty;
    if (configuredKey.Contains("DEV_ONLY", StringComparison.Ordinal))
    {
        throw new InvalidOperationException(
            "A production JWT SecretKey must be configured. The development placeholder must never be used in Production.");
    }
}

app.UseHttpsRedirection();

app.UseCors("AllowNextJsClient");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed default roles + SuperAdmin user (no migrations here — user handles them manually).
try
{
    await DatabaseSeeder.SeedAsync(app.Services, app.Configuration);
}
catch (Exception ex)
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "Database seeding failed. Ensure PostgreSQL is running and migrations are applied.");
}

app.Run();
