namespace KararOS.Application.DTOs.Budget;

public record UpsertBudgetProfileDto(
    decimal MonthlyIncome,
    decimal FixedExpenses,
    decimal SavingsGoal,
    decimal CurrentSpending
);

public record BudgetProfileDto(
    decimal MonthlyIncome,
    decimal FixedExpenses,
    decimal SavingsGoal,
    decimal CurrentSpending,
    decimal NetDiscretionary,
    decimal TargetProtectedBudget,
    decimal AvailableBudget,
    DateTimeOffset? UpdatedAt
);