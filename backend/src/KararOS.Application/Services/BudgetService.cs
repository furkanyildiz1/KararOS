using Microsoft.EntityFrameworkCore;
using KararOS.Application.Common.Interfaces;
using KararOS.Application.DTOs.Budget;
using KararOS.Application.Services.Interfaces;
using KararOS.Domain.Entities;

namespace KararOS.Application.Services;

public class BudgetService : IBudgetService
{
    private readonly IKararDbContext _dbContext;

    public BudgetService(IKararDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BudgetProfileDto?> GetBudgetProfileAsync(Guid userId, CancellationToken ct = default)
    {
        var profile = await _dbContext.BudgetProfiles
        .AsNoTracking()
        .FirstOrDefaultAsync(b => b.UserId == userId, ct);

        if (profile == null) return null;

        return new BudgetProfileDto(
            MonthlyIncome: profile.MonthlyIncome,
            FixedExpenses: profile.FixedExpenses,
            SavingsGoal: profile.SavingsGoal,
            CurrentSpending: profile.CurrentSpending,
            NetDiscretionary: profile.NetDiscretionary,
            TargetProtectedBudget: profile.TargetProtectedBudget,
            AvailableBudget: profile.AvailableBudget,
            UpdatedAt: profile.UpdatedAt
        );
    }

    public async Task<BudgetProfileDto> UpsertBudgetProfileAsync(Guid userId, UpsertBudgetProfileDto request, CancellationToken ct = default)
    {
        var profile = await _dbContext.BudgetProfiles
        .FirstOrDefaultAsync(b => b.UserId == userId, ct);

        if (profile == null)
        {
            profile = new BudgetProfile
            {
                UserId = userId,
                MonthlyIncome = request.MonthlyIncome,
                FixedExpenses = request.FixedExpenses,
                SavingsGoal = request.SavingsGoal,
                CurrentSpending = request.CurrentSpending
            };

            _dbContext.BudgetProfiles.Add(profile);
        }
        else
        {
            profile.MonthlyIncome = request.MonthlyIncome;
            profile.FixedExpenses = request.FixedExpenses;
            profile.SavingsGoal = request.SavingsGoal;
            profile.CurrentSpending = request.CurrentSpending;
        }
        await _dbContext.SaveChangesAsync(ct);

        return new BudgetProfileDto(
            MonthlyIncome: profile.MonthlyIncome,
            FixedExpenses: profile.FixedExpenses,
            SavingsGoal: profile.SavingsGoal,
            CurrentSpending: profile.CurrentSpending,
            NetDiscretionary: profile.NetDiscretionary,
            TargetProtectedBudget: profile.TargetProtectedBudget,
            AvailableBudget: profile.AvailableBudget,
            UpdatedAt: profile.UpdatedAt
        );
    }
}