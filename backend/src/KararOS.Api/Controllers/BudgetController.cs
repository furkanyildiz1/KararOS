using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KararOS.Application.DTOs.Budget;
using KararOS.Application.Services.Interfaces;
namespace KararOS.Api.Controllers;

[Authorize]
public class BudgetController : BaseApiController
{
    private readonly IBudgetService _budgetService;
    private readonly IValidator<UpsertBudgetProfileDto> _validator;

    public BudgetController(IBudgetService budgetService, IValidator<UpsertBudgetProfileDto> validator)
    {
        _budgetService = budgetService;
        _validator = validator;
    }

    [HttpGet]
    public async Task<ActionResult<BudgetProfileDto>> GetBudget(CancellationToken ct)
    {
        var profile = await _budgetService.GetBudgetProfileAsync(CurrentUserId, ct);
        if (profile == null)
        {
            return NotFound(new { message = "Kullanıcıya ait bütçe profili henüz oluşturulmamış" });
        }
        return Ok(profile);
    }

    [HttpPut]
    public async Task<ActionResult<BudgetProfileDto>> UpsertBudget([FromBody] UpsertBudgetProfileDto request, CancellationToken ct)
    {
        var validationResult = await _validator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }
        var updated = await _budgetService.UpsertBudgetProfileAsync(CurrentUserId, request, ct);
        return Ok(updated);
    }
}
