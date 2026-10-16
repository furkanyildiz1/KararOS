using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace KararOS.Infrastructure.Persistence;

public class KararDbContextFactory : IDesignTimeDbContextFactory<KararDbContext>
{
    public KararDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<KararDbContext>();
        
        // Design-time migration için dummy Npgsql bağlantı dizesi
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection") 
            ?? "Host=localhost;Database=kararos_db;Username=postgres;Password=postgres";

        optionsBuilder.UseNpgsql(connectionString, b =>
        {
            b.MigrationsAssembly(typeof(KararDbContext).Assembly.FullName);
        });

        return new KararDbContext(optionsBuilder.Options);
    }
}
