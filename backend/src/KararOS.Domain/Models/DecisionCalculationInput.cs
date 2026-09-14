//motorumuza gönderd,ğimiz matematiksel veriler

using KararOS.Domain.Enums;

namespace KararOS.Domain.Models;

public record DecisionCalculationInput(
    decimal MonthlyIncome,
    decimal FixedExpenses,
    decimal SavingsGoal,
    decimal CurrentSpending,
    decimal NewExpenseAmount,
    ExpenseCategory Category,
    DateOnly PlannedDate,
    string? Note = null
);