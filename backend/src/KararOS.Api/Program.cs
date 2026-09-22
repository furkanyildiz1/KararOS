using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using KararOS.Api.Middlewares;
using KararOS.Application;
using KararOS.Infrastructure;
using KararOS.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);

// 1. Katman Servislerini Ekle
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// 2. Controller Desteği
builder.Services.AddControllers();

// 3. CORS Politikası (Mobil ve Web Client'lar için)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// 4. Swagger ile JWT Bearer Desteği
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "KararOS API",
        Version = "v1",
        Description = "KararOS - Bilinçli Harcama & Karar Motoru REST API"
    });
    // Swagger'a JWT Authorize Butonu Ekleyelim
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization başlığı. Format: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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

var app = builder.Build();

// Veritabanı şemasını otomatik olarak senkronize et
using (var scope = app.Services.CreateScope())
{
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<KararDbContext>();
        dbContext.Database.Migrate();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Veritabanı migration kontrolü sırasında bir uyarı oluştu.");
    }
}

// 5. Global Hata Yakalama
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Configure Swagger and API Explorer
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "KararOS API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");

// Health check endpoint
app.MapGet("/", () => Results.Ok(new
{
    Status = "Healthy",
    Service = "KararOS API",
    Version = "1.0.0",
    Timestamp = DateTime.UtcNow
}));

// 6. Kimlik Doğrulama (Authentication) ve Yetkilendirme (Authorization)
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

public partial class Program { }
