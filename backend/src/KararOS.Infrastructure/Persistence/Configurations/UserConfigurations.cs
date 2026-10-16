using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using KararOS.Domain.Entities;

namespace KararOS.Infrastructure.Persistence.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Email)
        .IsRequired()
        .HasMaxLength(255);
        builder.HasIndex(u => u.Email).IsUnique();
        builder.Property(u => u.PasswordHash).IsRequired();
        builder.Property(u => u.FullName).IsRequired().HasMaxLength(150);
        builder.Property(u => u.CurrentStreak).HasDefaultValue(0);
        builder.Property(u => u.LongestStreak).HasDefaultValue(0);
        builder.Property(u => u.LastActiveDate).HasMaxLength(20);
        builder.HasOne(u => u.BudgetProfile).WithOne(b => b.User).HasForeignKey<BudgetProfile>(b => b.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.SavingsGoals)
            .WithOne(s => s.User)
            .HasForeignKey(s => s.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.DecisionRecords)
            .WithOne(d => d.User)
            .HasForeignKey(d => d.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.LegalAcceptances)
            .WithOne(l => l.User)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(u => u.RefreshTokens)
            .WithOne(r => r.User)
            .HasForeignKey(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }

}