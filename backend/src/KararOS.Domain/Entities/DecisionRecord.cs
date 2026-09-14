//karar kaydı karar motorunun çıktısı ve sıonrasındaki kullanıcı aldığı aksiyon burada saklanmalı

using System.Diagnostics.Contracts;
using KararOS.Domain.Enums;

namespace KararOS.Domain.Entities;

public class DecisionRecord : BaseEntity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    //harcama detayları
    public string Title { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public ExpenseCategory Category { get; set; }
    public DateOnly PlannedDate { get; set; }

    //karar motoru değerlendirme çıktıları
    public DecisionVerdict Verdict { get; set; }
    public RiskLevel RiskLevel { get; set; }
    public int DecisionScore { get; set; }
    public string RuleVersion { get; set; } = "v1.0.0";

    //karar anındaki bütçe durum fotoğrafı
    public decimal CurrentAvailableBudget { get; set; }
    public decimal ProjectedAvailableBudget { get; set; }
    public decimal ProjectedSavingsGap { get; set; }
    public decimal ExpenseRatio { get; set; }
    public int BudgetUsagePercent { get; set; }

    //gerekçeler
    public List<string> Reasons { get; set; } = new();

    //kullanıcı eylemi, ve takip mekanizması
    public DecisionAction Action { get; set; } = DecisionAction.Pending;
    public DateTimeOffset? ActionDate { get; set; }

    //otuz günlük geri bildirimn ve etki analizi
    public DateTimeOffset? FollowUpAt { get; set; }
    public DateTimeOffset? FollowUpCompletedAt { get; set; }
    public string? FollowUpFeedback { get; set; }
    public decimal? ActualImpact { get; set; }
}