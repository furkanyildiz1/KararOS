using KararOS.Domain.Enums;

namespace KararOS.Domain.Models;

public record DecisionCalculationResult
{

    public required DecisionVerdict Verdict { get; init; }
    public required string VerdictTitle { get; init; }
    public required string VerdictSubtitle { get; init; }
    public required RiskLevel RiskLevel { get; init; }
    public required int DecisionScore { get; init; } //0-10 sklalası
    public required string RuleVersion { get; init; } //örenk v1.0.0
    public required decimal CurrentAvailableBudget { get; init; }
    public required decimal ProjectedAvailableBudget { get; set; }
    public required decimal ProjectedSavingsGap { get; init; }
    public required decimal ExpenseRatio { get; init; }
    public required int BudgetUsagePercent { get; init; }
    public required IReadOnlyList<string> Reasons { get; init; }
}