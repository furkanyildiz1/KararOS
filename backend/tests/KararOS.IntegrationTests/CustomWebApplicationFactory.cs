using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using KararOS.Application.Common.Interfaces;
using KararOS.Infrastructure.Persistence;

namespace KararOS.IntegrationTests;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = Guid.NewGuid().ToString();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var efServices = services.Where(d =>
                d.ServiceType.Namespace != null &&
                (d.ServiceType.Namespace.StartsWith("Npgsql") || d.ServiceType.Namespace.StartsWith("Microsoft.EntityFrameworkCore"))
            ).ToList();

            foreach (var s in efServices)
            {
                services.Remove(s);
            }

            services.RemoveAll<DbContextOptions<KararDbContext>>();
            services.RemoveAll<DbContextOptions>();
            services.RemoveAll<KararDbContext>();
            services.RemoveAll<IKararDbContext>();

            services.AddDbContext<KararDbContext>(options =>
            {
                options.UseInMemoryDatabase(_dbName);
            });

            services.AddScoped<IKararDbContext>(provider => provider.GetRequiredService<KararDbContext>());
        });
    }
}
