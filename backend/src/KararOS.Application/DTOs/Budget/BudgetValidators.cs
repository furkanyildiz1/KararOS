using FluentValidation;

namespace KararOS.Application.DTOs.Budget;

public class UpsertBudgetProfileValidator : AbstractValidator<UpsertBudgetProfileDto>
{
    public UpsertBudgetProfileValidator()
    {
        RuleFor(x => x.MonthlyIncome)
        .GreaterThanOrEqualTo(0).WithMessage("Aylık gelir 0 dan küçük olamaz.");

        RuleFor(x => x.FixedExpenses)
        .GreaterThanOrEqualTo(0).WithMessage("Sabit giderler negatif olamaz.");

        RuleFor(x => x.SavingsGoal)
        .GreaterThanOrEqualTo(0).WithMessage("Tasarruf hedefi negatif olamaz.");

        RuleFor(x => x.CurrentSpending)
        .GreaterThanOrEqualTo(0).WithMessage("Mevcut harcama negatif olamaz.");
    }
}