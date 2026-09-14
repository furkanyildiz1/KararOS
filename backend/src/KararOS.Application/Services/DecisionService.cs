using Microsoft.EntityFrameworkCore;
using KararOS.Application.Common.Interfaces;
using KararOS.Application.DTOs.Decision;
using KararOS.Application.Services.Interfaces;
using KararOS.Domain.Entities;
using KararOS.Domain.Enums;
using KararOS.Domain.Models;
using KararOS.Domain.Services;

namespace KararOS.Application.Services;

public class DecisionService : IDecisionService
{
    private readonly IKararDbContext _dbContext;

    public DecisionService(IKararDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DecisionEvaluationResponseDto> EvaluateDecisionAsync(Guid userId, EvaluateDecisionRequestDto request, CancellationToken ct = default)
    {
        var profile = await _dbContext.BudgetProfiles
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.UserId == userId, ct);

        if (profile == null)
        {
            throw new InvalidOperationException("Karar simülasyonu yapabilmek için önce bütçe profilinizi tamamlamalısınız.");
        }

        var input = new DecisionCalculationInput
        (
            MonthlyIncome: profile.MonthlyIncome,
            FixedExpenses: profile.FixedExpenses,
            SavingsGoal: profile.SavingsGoal,
            CurrentSpending: profile.CurrentSpending,
            NewExpenseAmount: request.Amount,
            Category: request.Category,
            PlannedDate: request.PlannedDate
        );

        var result = DecisionEngine.Evaluate(input, request.PlannedDate);

        return new DecisionEvaluationResponseDto(
            Verdict: result.Verdict,
            VerdictTitle: result.VerdictTitle,
            VerdictSubtitle: result.VerdictSubtitle,
            RiskLevel: result.RiskLevel,
            DecisionScore: result.DecisionScore,
            RuleVersion: result.RuleVersion,
            CurrentAvailableBudget: result.CurrentAvailableBudget,
            ProjectedAvailableBudget: result.ProjectedAvailableBudget,
            ProjectedSavingsGap: result.ProjectedSavingsGap,
            ExpenseRatio: result.ExpenseRatio,
            BudgetUsagePercent: result.BudgetUsagePercent,
            Reasons: result.Reasons
        );
    }

    public async Task<DecisionRecordResponseDto> CreateDecisionAsync(Guid userId, CreateDecisionRecordRequestDto request, CancellationToken ct = default)
    {
        var profile = await _dbContext.BudgetProfiles
            .FirstOrDefaultAsync(b => b.UserId == userId, ct);

        if (profile == null)
        {
            throw new InvalidOperationException("Karar kaydedebilmek için bütçe profili gereklidir.");
        }

        var input = new DecisionCalculationInput
        (
            MonthlyIncome: profile.MonthlyIncome,
            FixedExpenses: profile.FixedExpenses,
            SavingsGoal: profile.SavingsGoal,
            CurrentSpending: profile.CurrentSpending,
            NewExpenseAmount: request.Amount,
            Category: request.Category,
            PlannedDate: request.PlannedDate

        );

        var calculation = DecisionEngine.Evaluate(input, request.PlannedDate);

        var decision = new DecisionRecord
        {
            UserId = userId,
            Title = request.Title.Trim(),
            Amount = request.Amount,
            Category = request.Category,
            PlannedDate = request.PlannedDate,
            Verdict = calculation.Verdict,
            RiskLevel = calculation.RiskLevel,
            DecisionScore = calculation.DecisionScore,
            RuleVersion = calculation.RuleVersion,
            CurrentAvailableBudget = calculation.CurrentAvailableBudget,
            ProjectedAvailableBudget = calculation.ProjectedAvailableBudget,
            ProjectedSavingsGap = calculation.ProjectedSavingsGap,
            ExpenseRatio = calculation.ExpenseRatio,
            BudgetUsagePercent = calculation.BudgetUsagePercent,
            Reasons = calculation.Reasons.ToList(),
            Action = DecisionAction.Pending,
            FollowUpAt = DateTimeOffset.UtcNow.AddDays(30) // 30 gün sonra geri bildirim takibi
        };

        _dbContext.DecisionRecords.Add(decision);
        await _dbContext.SaveChangesAsync(ct);

        return MapToDto(decision);
    }

    public async Task<DecisionRecordResponseDto> UpdateDecisionActionAsync(Guid userId, Guid decisionId, UpdateDecisionActionRequestDto request, CancellationToken ct = default)
    {
        var decision = await _dbContext.DecisionRecords
            .FirstOrDefaultAsync(d => d.Id == decisionId && d.UserId == userId, ct);

        if (decision == null)
        {
            throw new KeyNotFoundException("Karar kaydı bulunamadı.");
        }

        var previousAction = decision.Action;
        decision.Action = request.Action;
        decision.ActionDate = DateTimeOffset.UtcNow;

        if (!string.IsNullOrWhiteSpace(request.FollowUpFeedback))
        {
            decision.FollowUpFeedback = request.FollowUpFeedback;
            decision.FollowUpCompletedAt = DateTimeOffset.UtcNow;
        }

        if (request.ActualImpact.HasValue)
        {
            decision.ActualImpact = request.ActualImpact.Value;
        }

        // Eğer kullanıcı "Bought" (Satın Aldım) seçtiyse ve daha önce eklenmediyse, bütçe harcamasını atomik olarak güncelle
        if (request.Action == DecisionAction.Bought && previousAction != DecisionAction.Bought)
        {
            var profile = await _dbContext.BudgetProfiles.FirstOrDefaultAsync(b => b.UserId == userId, ct);
            if (profile != null)
            {
                profile.CurrentSpending += decision.Amount;
            }
        }
        // Eğer kullanıcı daha önce "Bought" demişti ama şimdi "Cancelled" veya "Postponed" yaptıysa harcamadan düş
        else if (previousAction == DecisionAction.Bought && request.Action != DecisionAction.Bought)
        {
            var profile = await _dbContext.BudgetProfiles.FirstOrDefaultAsync(b => b.UserId == userId, ct);
            if (profile != null)
            {
                profile.CurrentSpending = Math.Max(0, profile.CurrentSpending - decision.Amount);
            }
        }

        await _dbContext.SaveChangesAsync(ct);

        return MapToDto(decision);
    }

    public async Task<IReadOnlyList<DecisionRecordResponseDto>> GetDecisionsAsync(Guid userId, CancellationToken ct = default)
    {
        var decisions = await _dbContext.DecisionRecords
            .AsNoTracking()
            .Where(d => d.UserId == userId)
            .OrderByDescending(d => d.CreatedAt)
            .ToListAsync(ct);

        return decisions.Select(MapToDto).ToList().AsReadOnly();
    }

    public async Task<DecisionRecordResponseDto?> GetDecisionByIdAsync(Guid userId, Guid decisionId, CancellationToken ct = default)
    {
        var decision = await _dbContext.DecisionRecords
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == decisionId && d.UserId == userId, ct);

        return decision != null ? MapToDto(decision) : null;
    }

    private static DecisionRecordResponseDto MapToDto(DecisionRecord d)
    {
        return new DecisionRecordResponseDto(
            Id: d.Id,
            Title: d.Title,
            Amount: d.Amount,
            Category: d.Category,
            PlannedDate: d.PlannedDate,
            Verdict: d.Verdict,
            RiskLevel: d.RiskLevel,
            DecisionScore: d.DecisionScore,
            RuleVersion: d.RuleVersion,
            CurrentAvailableBudget: d.CurrentAvailableBudget,
            ProjectedAvailableBudget: d.ProjectedAvailableBudget,
            ProjectedSavingsGap: d.ProjectedSavingsGap,
            ExpenseRatio: d.ExpenseRatio,
            BudgetUsagePercent: d.BudgetUsagePercent,
            Reasons: d.Reasons.AsReadOnly(),
            Action: d.Action,
            ActionDate: d.ActionDate,
            CreatedAt: d.CreatedAt,
            FollowUpAt: d.FollowUpAt,
            FollowUpFeedback: d.FollowUpFeedback
        );
    }
}
