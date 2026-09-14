using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using KararOS.Domain.Entities;

namespace KararOS.Infrastructure.Persistence.Configurations;

public class DecisionRecordConfiguration : IEntityTypeConfiguration<DecisionRecord>
{
    public void Configure(EntityTypeBuilder<DecisionRecord> builder)
    {
        builder.ToTable("decision_records");
        builder.HasKey(d => d.Id);
        builder.Property(d => d.Title)
        .IsRequired()
        .HasMaxLength(200);
        builder.Property(d => d.Amount)
        .HasPrecision(18, 2)
        .IsRequired();
        builder.Property(d => d.RuleVersion)
        .IsRequired()
        .HasMaxLength(20);

        builder.Property(d => d.CurrentAvailableBudget).HasPrecision(18, 2);
        builder.Property(d => d.ProjectedAvailableBudget).HasPrecision(18, 2);
        builder.Property(d => d.ProjectedSavingsGap).HasPrecision(18, 2);
        builder.Property(d => d.ExpenseRatio).HasPrecision(18, 2);
        builder.Property(d => d.ActualImpact).HasPrecision(18, 2);

        builder.Property(d => d.FollowUpFeedback).HasMaxLength(500);

        //reasons listesini psql jsonb/string array olark saklamak lazım
        builder.Property(d => d.Reasons)
            .HasColumnType("jsonb")
            .HasConversion(
                v => System.Text.Json.JsonSerializer.Serialize(v, (System.Text.Json.JsonSerializerOptions?)null),
                v => string.IsNullOrEmpty(v)
                    ? new List<string>()
                    : System.Text.Json.JsonSerializer.Deserialize<List<string>>(v, (System.Text.Json.JsonSerializerOptions?)null) ?? new List<string>());
        builder.HasIndex(d => new { d.UserId, d.PlannedDate });//arama için kolayluık

    }
}