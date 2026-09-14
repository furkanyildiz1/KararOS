//yasal onay jkayıtrları kvkk falan ,için

using KararOS.Domain.Enums;

namespace KararOS.Domain.Entities;

public class LegalDocumentAcceptance : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public LegalDocumentType DocumentType { get; set; }
    public string DocumentVersion { get; set; } = "v1.0";
    public DateTimeOffset AcceptedAt { get; set; } = DateTimeOffset.UtcNow;
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}
