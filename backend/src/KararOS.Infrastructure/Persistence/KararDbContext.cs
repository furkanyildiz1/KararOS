using System.Reflection;//program çalışırken keni yapı ve sınıflarını inceler müdahele eder
using Microsoft.EntityFrameworkCore;
using KararOS.Application.Common.Interfaces;
using KararOS.Domain.Entities;

namespace KararOS.Infrastructure.Persistence;

public class KararDbContext : DbContext, IKararDbContext
{
    public KararDbContext(DbContextOptions<KararDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<BudgetProfile> BudgetProfiles => Set<BudgetProfile>();
    public DbSet<SavingsGoal> SavingsGoals => Set<SavingsGoal>();
    public DbSet<DecisionRecord> DecisionRecords => Set<DecisionRecord>();
    public DbSet<LegalDocumentAcceptance> LegalAcceptances => Set<LegalDocumentAcceptance>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //bu assembly icindekielri otomatik olarak ıentityconfigure uygulayacak
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        //createdaAt ve updatedat otomatik güncelleme mekazniması
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTimeOffset.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTimeOffset.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }


}

