using KararOS.Domain.Enums;

namespace KararOS.Application.DTOs.Decision;

public record EvaluateDecisionRequestDto(
    string Title,
    decimal Amount,
    ExpenseCategory Category,
    DateOnly PlannedDate
);

public record DecisionEvaluationResponseDto(
    DecisionVerdict Verdict,
    string VerdictTitle,
    string VerdictSubtitle,
    RiskLevel RiskLevel,
    int DecisionScore,
    string RuleVersion,
    decimal CurrentAvailableBudget,
    decimal ProjectedAvailableBudget,
    decimal ProjectedSavingsGap,
    decimal ExpenseRatio,
    int BudgetUsagePercent,
    IReadOnlyList<string> Reasons
);

public record CreateDecisionRecordRequestDto(
    string Title,
    decimal Amount,
    ExpenseCategory Category,
    DateOnly PlannedDate
);
public record UpdateDecisionActionRequestDto(
    DecisionAction Action,
    string? FollowUpFeedback,
    decimal? ActualImpact
);
public record DecisionRecordResponseDto(
    Guid Id,
    string Title,
    decimal Amount,
    ExpenseCategory Category,
    DateOnly PlannedDate,
    DecisionVerdict Verdict,
    RiskLevel RiskLevel,
    int DecisionScore,
    string RuleVersion,
    decimal CurrentAvailableBudget,
    decimal ProjectedAvailableBudget,
    decimal ProjectedSavingsGap,
    decimal ExpenseRatio,
    int BudgetUsagePercent,
    IReadOnlyList<string> Reasons,
    DecisionAction Action,
    DateTimeOffset? ActionDate,
    DateTimeOffset CreatedAt,
    DateTimeOffset? FollowUpAt,
    string? FollowUpFeedback
);