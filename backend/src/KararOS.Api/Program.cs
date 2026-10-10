using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using KararOS.Api.Middlewares;
using KararOS.Application;
using KararOS.Infrastructure;
using KararOS.Infrastructure.Persistence;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// ─── 1. Katman Servislerini Ekle ─────────────────────────────────────────────
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddProblemDetails();

// ─── 2. Controller Desteği ───────────────────────────────────────────────────
builder.Services.AddControllers();

// ─── 3. CORS Politikası ──────────────────────────────────────────────────────
// Production: sadece whitelist'teki originler
var allowedOrigins = new[]
{
    "https://karar-os.vercel.app",
    "https://www.kararos.com",
    "https://kararos.com"
};

builder.Services.AddCors(options =>
{
    // AllowAll: Geliştirme + Mobile APK için (Android APK'dan gelen istekler Origin header göndermez)
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    // KararOS: Web origin kısıtlamalı politika (sadece web sitesi için gerekirse kullanılır)
    options.AddPolicy("KararOS", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// ─── 4. Rate Limiting (Yerleşik .NET 9 Middleware) ───────────────────────────
// Konsept: Rate limiting, bir IP adresinin belirli bir süre içinde
// kaç istek gönderebileceğini sınırlar. Bu sayede brute-force,
// credential stuffing ve DDoS gibi saldırıları yavaşlatırız.
builder.Services.AddRateLimiter(options =>
{
    // --- Global Limiter: Tüm endpoint'lere uygulanan varsayılan limit ---
    // Sabit pencere (Fixed Window): Her 1 dakikada en fazla 100 istek.
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        });
    });

    // --- LoginPolicy: Login/SocialLogin endpoint'leri ---
    options.AddPolicy("LoginPolicy", context =>
        RateLimitPartition.GetTokenBucketLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new TokenBucketRateLimiterOptions
            {
                TokenLimit = 20,
                TokensPerPeriod = 20,
                ReplenishmentPeriod = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // --- RegisterPolicy: Kayıt ve Kod Gönderme endpoint'leri ---
    options.AddPolicy("RegisterPolicy", context =>
        RateLimitPartition.GetTokenBucketLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new TokenBucketRateLimiterOptions
            {
                TokenLimit = 10,
                TokensPerPeriod = 10,
                ReplenishmentPeriod = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // --- ForgotPolicy: Şifremi Unuttum ve Kod Gönderme endpoint'leri ---
    options.AddPolicy("ForgotPolicy", context =>
        RateLimitPartition.GetTokenBucketLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new TokenBucketRateLimiterOptions
            {
                TokenLimit = 10,
                TokensPerPeriod = 10,
                ReplenishmentPeriod = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));

    // Limit aşıldığında 429 Too Many Requests döndür
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsync(
            "Çok fazla istek gönderildi. Lütfen bir süre bekleyin.", token);
    };
});

// ─── 5. Swagger ile JWT Bearer Desteği ──────────────────────────────────────
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

// ─── App İnşası ──────────────────────────────────────────────────────────────
var app = builder.Build();

// Render proxy başlıklarını doğru oku (HTTPS tespiti için)
app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedFor
});

// ─── Veritabanı Migrasyonunu Otomatik Uygula ─────────────────────────────────
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

// ─── Middleware Pipeline (sıra önemli!) ──────────────────────────────────────

// 1. Global Hata Yakalama – en dışta olmalı ki her hatayı yakalsın
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 2. Swagger UI
app.MapOpenApi();
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "KararOS API v1");
    c.RoutePrefix = "swagger";
});

// 3. Rate Limiting – kimlik doğrulamadan önce gelir
app.UseRateLimiter();

// 4. CORS
// Mobile APK (Android/iOS) Origin header göndermez, bu yüzden her ortamda AllowAll kullanıyoruz.
// Web güvenliği frontend (Vercel/kararos.com) tarafında HTTPS ile sağlanıyor.
app.UseCors("AllowAll");

// 5. Kimlik Doğrulama ve Yetkilendirme
app.UseAuthentication();
app.UseAuthorization();

// Not: Global hata yakalama ExceptionHandlingMiddleware tarafından yapılıyor (pipeline'ın başında).
// UseExceptionHandler burada kasıtlı olarak kullanılmıyor - çift hata yakalama çakışmasını önler.

// ─── Endpoint'ler ────────────────────────────────────────────────────────────

// Temel health check
app.MapGet("/", () => Results.Ok(new
{
    Status = "Healthy",
    Service = "KararOS API",
    Version = "1.0.0",
    Timestamp = DateTime.UtcNow
}));

// Controller route'larını kaydet
app.MapControllers();

app.Run();

public partial class Program { }
