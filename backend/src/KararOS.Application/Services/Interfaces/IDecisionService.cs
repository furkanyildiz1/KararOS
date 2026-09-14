using KararOS.Application.DTOs.Decision;

namespace KararOS.Application.Services.Interfaces;

public interface IDecisionService
{
    Task<DecisionEvaluationResponseDto> EvaluateDecisionAsync(Guid userId, EvaluateDecisionRequestDto request, CancellationToken ct = default);
    Task<DecisionRecordResponseDto> CreateDecisionAsync(Guid userId, CreateDecisionRecordRequestDto request, CancellationToken ct = default);
    Task<DecisionRecordResponseDto> UpdateDecisionActionAsync(Guid userId, Guid decisionId, UpdateDecisionActionRequestDto request, CancellationToken ct = default);
    Task<IReadOnlyList<DecisionRecordResponseDto>> GetDecisionsAsync(Guid userId, CancellationToken ct = default);
    Task<DecisionRecordResponseDto?> GetDecisionByIdAsync(Guid userId, Guid decisionId, CancellationToken ct = default);
}
