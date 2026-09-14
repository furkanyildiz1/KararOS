//kullanıcnın aylık finansal tabanı ve kullanıcı ile 1-1 ilişki
namespace KararOS.Domain.Entities;

public class BudgetProfile : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public decimal MonthlyIncome { get; set; }
    public decimal FixedExpenses { get; set; }
    public decimal SavingsGoal { get; set; }
    public decimal CurrentSpending { get; set; }

    //yardımcı olucak hesaplama özellikleri(db de kolon oıuşturmıcaz ef core ile yönetecez)

    public decimal NetDiscretionary => Math.Max(0, MonthlyIncome - FixedExpenses);
    public decimal TargetProtectedBudget => Math.Max(0, NetDiscretionary - SavingsGoal);
    public decimal AvailableBudget => Math.Max(0, TargetProtectedBudget - CurrentSpending);
}