using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KararOS.Application.DTOs.Streak;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Api.Controllers;

[Authorize]
public class StreakController : BaseApiController
{
    private readonly IStreakService _streakService;

    public StreakController(IStreakService streakService)
    {
        _streakService = streakService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(StreakDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<StreakDto>> GetStreak(CancellationToken cancellationToken)
    {
        var result = await _streakService.GetStreakAsync(CurrentUserId, cancellationToken);
        return Ok(result);
    }

    [HttpPost("record")]
    [ProducesResponseType(typeof(StreakDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<StreakDto>> RecordActivity(CancellationToken cancellationToken)
    {
        var result = await _streakService.RecordActivityAsync(CurrentUserId, cancellationToken);
        return Ok(result);
    }
}
