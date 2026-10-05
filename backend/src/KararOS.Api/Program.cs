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
    "https://www.kararos.com"
};

builder.Services.AddCors(options =>
{
    // Geliştirme ortamı için genel politika
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });

    // Production politikası – sadece whitelist
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

    // --- LoginPolicy: Login/Register/ForgotPassword gibi hassas endpoint'ler ---
    // Token Bucket: Kova 20 token ile dolar, her dakika yeniden dolar.
    // Bu, kısa süreli patlamalara izin verirken sürekli brute-force'u engeller.
    options.AddPolicy("LoginPolicy", context =>
        RateLimitPartition.GetTokenBucketLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new TokenBucketRateLimiterOptions
            {
                TokenLimit = 20,               // Kovada maksimum 20 token
                TokensPerPeriod = 20,          // Her periyotta 20 token eklenir
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
var isDevelopment = app.Environment.IsDevelopment();
app.UseCors(isDevelopment ? "AllowAll" : "KararOS");

// 5. Kimlik Doğrulama ve Yetkilendirme
app.UseAuthentication();
app.UseAuthorization();

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exceptionHandlerPathFeature = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
        var traceId = Guid.NewGuid().ToString();

        var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
        {
            Status = StatusCodes.Status500InternalServerError,
            Title = "Sunucu hatası oluştu",
            Detail = app.Environment.IsDevelopment()
                     ? exceptionHandlerPathFeature?.Error.Message
                     : "Beklenmeyen bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.",
            Instance = context.Request.Path,
            Type = "https://kararos.com/errors/internal"
        };
        problem.Extensions["traceId"] = traceId;
        // Log (maskeleri göz önünde tutarak)
        // logger.LogError(exception, "TraceId:{TraceId} Path:{Path}", traceId, context.Request.Path);
        context.Response.StatusCode = problem.Status ?? 500;
        context.Response.ContentType = "application/problem+json";
        await context.Response.WriteAsJsonAsync(problem);
    });
});

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
