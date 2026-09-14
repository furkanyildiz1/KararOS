//tüm tablolarımızda olucak olan ıd,createdat ve updateat alanalrı barıdnrıcaz ve soyut temel sınıfımız

namespace KararOS.Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? UpdatedAt { get; set; }
}