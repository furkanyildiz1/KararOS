using KararOS.Domain.Enums;

namespace KararOS.Application.DTOs.Insights;

public record CategoryRiskStatDto(
    ExpenseCategory Category,
    string CategoryName,
    int TotalDecisions,
    int HighRiskCount,
    decimal TotalAmount
);

public record InsightSummaryDto(
    int TotalDecisions,
    int BoughtCount,
    int PostponedCount,
    int CancelledCount,
    int PendingCount,
    int PostponeSuccessRate, // Örn: %60
    decimal TotalMoneySaved,  // Korunan bütçe (Postponed + Cancelled toplamı)
    string? TopRiskCategoryName,
    IReadOnlyList<CategoryRiskStatDto> CategoryStats,
    IReadOnlyList<string> InsightMessages
);
