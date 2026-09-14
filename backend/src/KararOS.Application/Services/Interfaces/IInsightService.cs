using KararOS.Application.DTOs.Insights;

namespace KararOS.Application.Services.Interfaces;

public interface IInsightService
{
    Task<InsightSummaryDto> GetUserInsightsAsync(Guid userId, CancellationToken ct = default);
}
