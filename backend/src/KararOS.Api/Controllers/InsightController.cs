using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KararOS.Application.DTOs.Insights;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Api.Controllers;

[Authorize]
[Route("api/insights")]
public class InsightsController : BaseApiController
{
    private readonly IInsightService _insightService;

    public InsightsController(IInsightService insightService)
    {
        _insightService = insightService;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<InsightSummaryDto>> GetSummary(CancellationToken ct)
    {
        var result = await _insightService.GetUserInsightsAsync(CurrentUserId, ct);
        return Ok(result);
    }
}
