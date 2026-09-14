using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using KararOS.Application.Common.Interfaces;
using KararOS.Application.Services.Interfaces;
using KararOS.Infrastructure.Persistence;
using KararOS.Infrastructure.Services;

namespace KararOS.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found");

        var dataSourceBuilder = new Npgsql.NpgsqlDataSourceBuilder(connectionString);
        dataSourceBuilder.EnableDynamicJson();
        var dataSource = dataSourceBuilder.Build();

        services.AddDbContext<KararDbContext>(options =>
        options.UseNpgsql(dataSource, npgsqlOptions =>
        {
            npgsqlOptions.MigrationsAssembly(typeof(KararDbContext).Assembly.FullName);//veri tabanı göçlerinin nerede tutulcağını ifade eder
            npgsqlOptions.EnableRetryOnFailure(maxRetryCount: 3);//geçici hataklarda otomatik oalrak deneme yapılıp yapılmayacağına belirler
        }));

        services.AddScoped<IKararDbContext>(provider => provider.GetRequiredService<KararDbContext>());//servisin her istekte yeni bir örneğinin oluşması

        //güvenlik servisleri
        services.AddHttpContextAccessor();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IEmailService, SmtpEmailService>();

        //jwt authentication yapılandırması
        var jwtSecret = configuration["JwtSettings:Secret"] ?? "KararOS_Super_Secret_Jwt_Security_Key_2026_MustBeLongEnough!";
        var jwtIssuer = configuration["JwtSettings:Issuer"] ?? "KararOS.Api";
        var jwtAudience = configuration["JwtSettings:Audience"] ?? "KararOS.Client";
        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;//doğrulamadaki aksiyon
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;//yetkilendirmedeki aksiyon
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ClockSkew = TimeSpan.Zero
            };
        });

        return services;
    }
}