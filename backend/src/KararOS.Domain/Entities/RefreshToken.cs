//oturum yenilemem mekanizması

namespace KararOS.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public string Token { get; set; } = string.Empty;
    public DateTimeOffset ExpiresAt { get; set; }//sona erme
    public bool IsRevoked { get; set; } = false; //iptal etme
    public string? ReplacedByToken { get; set; }//yerine geçecek token

    public bool IsActive => !IsRevoked && DateTimeOffset.UtcNow < ExpiresAt;

}