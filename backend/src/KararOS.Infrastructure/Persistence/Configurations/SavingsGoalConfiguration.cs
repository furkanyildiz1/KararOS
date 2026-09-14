using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using KararOS.Domain.Entities;

namespace KararOS.Infrastructure.Persistence.Configurations;

public class SavingsGoalConfiguration : IEntityTypeConfiguration<SavingsGoal>
{
    public void Configure(EntityTypeBuilder<SavingsGoal> builder)
    {
        builder.ToTable("savings_goals");
        builder.HasKey(b => b.Id);
        builder.Property(s => s.Title)
        .IsRequired()
        .HasMaxLength(150);
        builder.Property(s => s.TargetAmount)
        .IsRequired()
        .HasPrecision(18, 2);
        builder.Property(s => s.CurrentAmount)
        .HasPrecision(18, 2)
        .IsRequired();

        builder.Ignore(s => s.IsCompleted);
    }
}