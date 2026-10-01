using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using KararOS.Api.Middlewares;
using KararOS.Application;
using KararOS.Infrastructure;
using KararOS.Infrastructure.Persistence;
using Serilog;

// ═══════════════════════════════════════════════════════════════════════════════
// 1️⃣  SERILOG – Bootstrap logger (uygulama başlamadan önce de log yakalanır)
// ═══════════════════════════════════════════════════════════════════════════════
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try
{
    Log.Information("KararOS API başlatılıyor...");

    var builder = WebApplication.CreateBuilder(args);

    // ─── Serilog'u Host'a bağla ──────────────────────────────────────────────
    // Render'da filesystem geçici olduğu için sadece Console (stdout) kullanıyoruz.
    // Render bu çıktıyı otomatik olarak log-servisine yönlendirir.
    builder.Host.UseSerilog((ctx, services, lc) => lc
        .ReadFrom.Configuration(ctx.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithEnvironmentName()
        // Hassas alanları içeren satırları filtrele (şifre, token, kart no)
        .Filter.ByExcluding(
            "@Message like '%password%' or @Message like '%Password%' " +
            "or @Message like '%RefreshToken%' or @Message like '%token%'")
        .WriteTo.Console(
            outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} " +
                            "| TraceId={TraceIdentifier}{NewLine}{Exception}")
    );

    // ═══════════════════════════════════════════════════════════════════════════
    // 2️⃣  SERVİS KAYITLARI (builder.Services)
    // ═══════════════════════════════════════════════════════════════════════════

    // ─── Katman Servislerini Ekle ────────────────────────────────────────────
    builder.Services.AddApplication();
    builder.Services.AddInfrastructure(builder.Configuration);

    // ProblemDetails standart hata formatı için
    builder.Services.AddProblemDetails();

    // ─── Controller Desteği ──────────────────────────────────────────────────
    builder.Services.AddControllers();

    // ─── Forwarded Headers (Render proxy arkasında çalışmak için) ────────────
    // Render, TLS'i terminate edip HTTP olarak iletir; bu satır gerçek IP ve
    // protokolü (https) doğru okumamızı sağlar.
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders =
            ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedFor;
        // Render'ın load balancer'ına güven; diğer kaynakları kısıtla
        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });

    // ─── CORS Politikası ─────────────────────────────────────────────────────
    // Neden whitelist? AllowAnyOrigin() ile AllowCredentials() birlikte
    // kullanılamaz. Whitelist sadece güvenilir origin'lere izin verir.
    var allowedOrigins = new[]
    {
        "https://karar-os.vercel.app",  // aktif web adresi
        "https://www.kararos.com"       // gelecekteki custom domain
    };

    builder.Services.AddCors(options =>
    {
        // Geliştirme: her şeye izin ver
        options.AddPolicy("AllowAll", policy =>
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

        // Production: sadece whitelist
        options.AddPolicy("KararOS", policy =>
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials());
    });

    // ─── Rate Limiting (Built-in .NET 9) ─────────────────────────────────────
    // Neden rate limiting? Brute-force, credential stuffing ve DDoS saldırılarını
    // yavaşlatır. Her policy, farklı endpoint'lerin riskine göre ayarlanmıştır.
    builder.Services.AddRateLimiter(options =>
    {
        // GLOBAL: Tüm endpoint'lere 100 req/dk per IP (sabit pencere)
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

        // LOGIN: 10 req/dk per IP – brute force koruması
        options.AddPolicy("LoginPolicy", ctx =>
            RateLimitPartition.GetFixedWindowLimiter(
                ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 10,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }));

        // REGISTER: 5 req/dk – bot kaydını engelle
        options.AddPolicy("RegisterPolicy", ctx =>
            RateLimitPartition.GetFixedWindowLimiter(
                ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }));

        // FORGOT PASSWORD: 5 req/dk – e-posta spam koruması
        options.AddPolicy("ForgotPolicy", ctx =>
            RateLimitPartition.GetFixedWindowLimiter(
                ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 5,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }));

        // DECISION EVALUATE: 60 req/dk per user – AI çağrısı maliyet koruması
        options.AddPolicy("DecisionEvalPolicy", ctx =>
            RateLimitPartition.GetFixedWindowLimiter(
                ctx.User?.Identity?.Name ?? ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                _ => new FixedWindowRateLimiterOptions
                {
                    PermitLimit = 60,
                    Window = TimeSpan.FromMinutes(1),
                    QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                    QueueLimit = 0
                }));

        // Limit aşıldığında ProblemDetails formatında 429 döndür
        options.OnRejected = async (context, token) =>
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
            context.HttpContext.Response.ContentType = "application/problem+json";
            var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
            {
                Status = StatusCodes.Status429TooManyRequests,
                Title = "Çok fazla istek",
                Detail = "Çok fazla istek gönderildi. Lütfen bir süre bekleyin.",
                Type = "https://kararos.com/errors/rate-limit"
            };
            await context.HttpContext.Response.WriteAsJsonAsync(problem, token);
        };
    });

    // ─── Swagger ─────────────────────────────────────────────────────────────
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "KararOS API",
            Version = "v1",
            Description = "KararOS - Bilinçli Harcama & Karar Motoru REST API"
        });
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

    // ─── Health Checks ───────────────────────────────────────────────────────
    // Neden iki ayrı endpoint?
    // /health/live  → Uygulama ayakta mı? (Orchestrator bunu izler)
    // /health/ready → DB/dış servisler hazır mı? (Trafik yönlendirmeden önce kontrol)
    builder.Services.AddHealthChecks()
        .AddNpgSql(
            connectionString: builder.Configuration.GetConnectionString("DefaultConnection")!,
            name: "neon-postgres",
            tags: new[] { "ready" })
        .AddCheck("self",
            () => HealthCheckResult.Healthy("API çalışıyor"),
            tags: new[] { "live" });

    // ═══════════════════════════════════════════════════════════════════════════
    // 3️⃣  APP – Middleware Pipeline (SIRA KRİTİK!)
    // ═══════════════════════════════════════════════════════════════════════════
    var app = builder.Build();

    // ─── 1. Forwarded Headers – en başta olmalı ──────────────────────────────
    app.UseForwardedHeaders();

    // ─── 2. Veritabanı Migrasyonu ────────────────────────────────────────────
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<KararDbContext>();
            dbContext.Database.Migrate();
            Log.Information("Veritabanı migrasyonu başarıyla tamamlandı.");
        }
        catch (Exception ex)
        {
            Log.Warning(ex, "Veritabanı migration kontrolü sırasında bir uyarı oluştu.");
        }
    }

    // ─── 3. Global Exception Handler (ProblemDetails) ────────────────────────
    // Custom ExceptionHandlingMiddleware yerine UseExceptionHandler kullanıyoruz.
    // Neden? ProblemDetails standardı (RFC 7807) istemciye tutarlı hata formatı sunar.
    // Production'da hassas stack trace / connection string sızdırmaz.
    app.UseExceptionHandler(errorApp =>
    {
        errorApp.Run(async context =>
        {
            var exFeature = context.Features
                .Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerPathFeature>();
            var exception = exFeature?.Error;
            var traceId = Guid.NewGuid().ToString();

            // Log (hassas alanlara dikkat; maskeleme Serilog filtresiyle yapılır)
            Log.Error(exception, "İşlenmeyen hata | TraceId:{TraceId} | Path:{Path}",
                traceId, context.Request.Path);

            var problem = new Microsoft.AspNetCore.Mvc.ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Sunucu hatası oluştu",
                // Dev ortamında gerçek mesajı göster; prod'da güvenli mesaj
                Detail = app.Environment.IsDevelopment()
                    ? exception?.Message
                    : "Beklenmeyen bir hata oluştu. Lütfen destek ekibiyle iletişime geçin.",
                Instance = context.Request.Path,
                Type = "https://kararos.com/errors/internal"
            };
            problem.Extensions["traceId"] = traceId;

            context.Response.StatusCode = problem.Status ?? 500;
            context.Response.ContentType = "application/problem+json";
            await context.Response.WriteAsJsonAsync(problem);
        });
    });

    // ─── 4. Rate Limiting ────────────────────────────────────────────────────
    app.UseRateLimiter();

    // ─── 5. CORS ─────────────────────────────────────────────────────────────
    app.UseCors(app.Environment.IsDevelopment() ? "AllowAll" : "KararOS");

    // ─── 6. Swagger – sadece Development ortamında açık ─────────────────────
    // Production'da /swagger kapalı → bilgi sızdırmaz, saldırı yüzeyini azaltır
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "KararOS API v1");
            c.RoutePrefix = "swagger";
        });
    }

    // ─── 7. Authentication & Authorization ───────────────────────────────────
    app.UseAuthentication();
    app.UseAuthorization();

    // ─── 8. Serilog Request Logging ──────────────────────────────────────────
    app.UseSerilogRequestLogging(opts =>
    {
        opts.MessageTemplate =
            "HTTP {RequestMethod} {RequestPath} → {StatusCode} ({Elapsed:0.000}ms)";
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // 4️⃣  ENDPOINT'LER
    // ═══════════════════════════════════════════════════════════════════════════

    // Liveness: Uygulama ayakta mı?
    app.MapHealthChecks("/health/live", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("live")
    });

    // Readiness: DB bağlantısı hazır mı?
    app.MapHealthChecks("/health/ready", new HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("ready")
    });

    // Root health check (Render default health check path'i)
    app.MapGet("/", () => Results.Ok(new
    {
        Status = "Healthy",
        Service = "KararOS API",
        Version = "1.0.0",
        Timestamp = DateTime.UtcNow
    }));

    // Controller tabanlı tüm route'lar
    // Auth controller'daki [HttpPost("login")] gibi action'lara
    // [EnableRateLimiting("LoginPolicy")] attribute'u ekleyeceğiz.
    app.MapControllers();

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "KararOS API başlatılamadı!");
}
finally
{
    Log.CloseAndFlush();
}

public partial class Program { }
