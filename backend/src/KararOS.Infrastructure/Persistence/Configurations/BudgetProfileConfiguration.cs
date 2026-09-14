using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using KararOS.Domain.Entities;

namespace KararOS.Infrastructure.Persistence.Configurations;

public class BudgetProfileConfiguration : IEntityTypeConfiguration<BudgetProfile>
{
    public void Configure(EntityTypeBuilder<BudgetProfile> builder)
    {
        builder.ToTable("budget_profile");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.MonthlyIncome)
        .HasPrecision(18, 2)//decimal için hasssaiyeti belirtir.
        .IsRequired();
        builder.Property(b => b.FixedExpenses)
        .HasPrecision(18, 2)
        .IsRequired();
        builder.Property(b => b.SavingsGoal)
        .HasPrecision(18, 2)
        .IsRequired();
        builder.Property(b => b.CurrentSpending)
        .HasPrecision(18, 2)
        .IsRequired();

        //hesaplanmış yardımcı propertyler db ye kolon olarak yazılmasın
        builder.Ignore(b => b.NetDiscretionary);
        builder.Ignore(b => b.TargetProtectedBudget);
        builder.Ignore(b => b.AvailableBudget);

    }
}