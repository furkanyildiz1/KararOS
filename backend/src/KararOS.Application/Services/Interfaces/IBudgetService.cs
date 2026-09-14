using KararOS.Application.DTOs.Budget;

namespace KararOS.Application.Services.Interfaces;

public interface IBudgetService
{
    Task<BudgetProfileDto?> GetBudgetProfileAsync(Guid userId, CancellationToken ct = default);
    Task<BudgetProfileDto> UpsertBudgetProfileAsync(Guid userId, UpsertBudgetProfileDto request, CancellationToken ct = default);
}