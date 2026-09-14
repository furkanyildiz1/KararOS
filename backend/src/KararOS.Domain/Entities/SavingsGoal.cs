//kullanıcnın birikim hedefleri (acil durum fonu tatril telefon vb)
using System.Diagnostics.Contracts;
using KararOS.Domain.Enums;
namespace KararOS.Domain.Entities;

public class SavingsGoal : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Title { get; set; } = string.Empty;
    public decimal TargetAmount { get; set; }
    public decimal CurrentAmount { get; set; }
    public int TargetMonths { get; set; }
    public ExpenseCategory? Category { get; set; }
    public bool AutoTransfer { get; set; } = false;
    public bool IsCompleted => CurrentAmount >= TargetAmount;

}