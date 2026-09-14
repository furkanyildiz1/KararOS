using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using KararOS.Application.DTOs.Decision;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Api.Controllers;

[Authorize]
[Route("api/decisions")]
public class DecisionsController : BaseApiController
{
    private readonly IDecisionService _decisionService;
    private readonly IValidator<EvaluateDecisionRequestDto> _evaluateValidator;
    private readonly IValidator<CreateDecisionRecordRequestDto> _createValidator;
    private readonly IValidator<UpdateDecisionActionRequestDto> _actionValidator;

    public DecisionsController(IDecisionService decisionService, IValidator<EvaluateDecisionRequestDto> evaluateValidator, IValidator<CreateDecisionRecordRequestDto> createValidator, IValidator<UpdateDecisionActionRequestDto> actionValidator)
    {
        _decisionService = decisionService;
        _evaluateValidator = evaluateValidator;
        _createValidator = createValidator;
        _actionValidator = actionValidator;
    }

    [HttpPost("evaluate")]
    public async Task<ActionResult<DecisionEvaluationResponseDto>> Evaluate([FromBody] EvaluateDecisionRequestDto request, CancellationToken ct)
    {
        var validatonResult = await _evaluateValidator.ValidateAsync(request, ct);
        if (!validatonResult.IsValid)
        {
            throw new ValidationException(validatonResult.Errors);
        }
        var result = await _decisionService.EvaluateDecisionAsync(CurrentUserId, request, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<DecisionRecordResponseDto>> Create([FromBody] CreateDecisionRecordRequestDto request, CancellationToken ct)
    {
        var validationResult = await _createValidator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }
        var result = await _decisionService.CreateDecisionAsync(CurrentUserId, request, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);

    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<DecisionRecordResponseDto>>> GetAll(CancellationToken ct)
    {
        var list = await _decisionService.GetDecisionsAsync(CurrentUserId, ct);
        return Ok(list);
    }
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DecisionRecordResponseDto>> GetById(Guid id, CancellationToken ct)
    {
        var item = await _decisionService.GetDecisionByIdAsync(CurrentUserId, id, ct);
        if (item == null) return NotFound(new { message = "Karar kaydı bulunamadı." });
        return Ok(item);
    }
    [HttpPatch("{id:guid}/action")]
    public async Task<ActionResult<DecisionRecordResponseDto>> UpdateAction(Guid id, [FromBody] UpdateDecisionActionRequestDto request, CancellationToken ct)
    {
        var validationResult = await _actionValidator.ValidateAsync(request, ct);
        if (!validationResult.IsValid)
        {
            throw new ValidationException(validationResult.Errors);
        }
        var updated = await _decisionService.UpdateDecisionActionAsync(CurrentUserId, id, request, ct);
        return Ok(updated);
    }






}