using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using KararOS.Domain.Entities;

namespace KararOS.Infrastructure.Persistence.Configurations;

public class LegalDocumentAcceptanceConfiguration : IEntityTypeConfiguration<LegalDocumentAcceptance>
{
    public void Configure(EntityTypeBuilder<LegalDocumentAcceptance> builder)
    {
        builder.ToTable("legal_document_acceptances");
        builder.HasKey(l => l.Id);
        builder.Property(l => l.DocumentVersion)
        .IsRequired()
        .HasMaxLength(20);
        builder.Property(l => l.IpAddress)
            .HasMaxLength(45);
        builder.Property(l => l.UserAgent)
            .HasMaxLength(500);

        builder.HasIndex(l => new { l.UserId, l.DocumentType });
    }
}