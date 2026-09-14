using Microsoft.EntityFrameworkCore;
using KararOS.Domain.Entities;

namespace KararOS.Application.Common.Interfaces;

public interface IKararDbContext
{
    DbSet<User> Users { get; }
    DbSet<BudgetProfile> BudgetProfiles { get; }
    DbSet<SavingsGoal> SavingsGoals { get; }
    DbSet<DecisionRecord> DecisionRecords { get; }
    DbSet<LegalDocumentAcceptance> LegalAcceptances { get; }
    DbSet<RefreshToken> RefreshTokens { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}