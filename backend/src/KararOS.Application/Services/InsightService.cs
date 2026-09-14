using Microsoft.EntityFrameworkCore;
using KararOS.Application.Common.Interfaces;
using KararOS.Application.DTOs.Insights;
using KararOS.Application.Services.Interfaces;
using KararOS.Domain.Enums;

namespace KararOS.Application.Services;

public class InsightService : IInsightService
{
    private readonly IKararDbContext _dbContext;

    public InsightService(IKararDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<InsightSummaryDto> GetUserInsightsAsync(Guid userId, CancellationToken ct = default)
    {
        var decisions = await _dbContext.DecisionRecords
            .AsNoTracking()
            .Where(d => d.UserId == userId)
            .ToListAsync(ct);

        var totalDecisions = decisions.Count;
        if (totalDecisions == 0)
        {
            return new InsightSummaryDto(
                TotalDecisions: 0,
                BoughtCount: 0,
                PostponedCount: 0,
                CancelledCount: 0,
                PendingCount: 0,
                PostponeSuccessRate: 0,
                TotalMoneySaved: 0,
                TopRiskCategoryName: null,
                CategoryStats: Array.Empty<CategoryRiskStatDto>(),
                InsightMessages: new List<string>
                {
                    "Henüz bir karar kaydınız bulunmuyor. Yeni bir harcama kararı sorarak finansal içgörülerinizi oluşturmaya başlayabilirsiniz."
                }
            );
        }

        var boughtCount = decisions.Count(d => d.Action == DecisionAction.Bought);
        var postponedCount = decisions.Count(d => d.Action == DecisionAction.Postponed);
        var cancelledCount = decisions.Count(d => d.Action == DecisionAction.Cancelled);
        var pendingCount = decisions.Count(d => d.Action == DecisionAction.Pending);

        // Erteleme veya Vazgeçme ile korunan para tutarı
        var totalMoneySaved = decisions
            .Where(d => d.Action == DecisionAction.Postponed || d.Action == DecisionAction.Cancelled)
            .Sum(d => d.Amount);

        // Karar disiplin başarı oranı
        var evaluatedCount = boughtCount + postponedCount + cancelledCount;
        var postponeSuccessRate = evaluatedCount > 0
            ? (int)Math.Round(((double)(postponedCount + cancelledCount) / evaluatedCount) * 100)
            : 0;

        // Kategori bazlı istatistikler
        var categoryStats = decisions
            .GroupBy(d => d.Category)
            .Select(g => new CategoryRiskStatDto(
                Category: g.Key,
                CategoryName: GetCategoryTurkishName(g.Key),
                TotalDecisions: g.Count(),
                HighRiskCount: g.Count(x => x.RiskLevel == RiskLevel.High || x.Verdict == DecisionVerdict.Reject),
                TotalAmount: g.Sum(x => x.Amount)
            ))
            .OrderByDescending(c => c.HighRiskCount)
            .ThenByDescending(c => c.TotalAmount)
            .ToList();

        var topRiskCategory = categoryStats.FirstOrDefault(c => c.HighRiskCount > 0);

        // Dinamik İçgörü Mesajları Üretimi
        var messages = new List<string>();

        if (totalMoneySaved > 0)
        {
            messages.Add($"Bu ay kararlarını erteleyerek ve vazgeçerek toplam {totalMoneySaved:N0} ₺ bütçeni korudun! 🎉");
        }

        if (postponeSuccessRate >= 50 && evaluatedCount >= 3)
        {
            messages.Add($"Harika bir irade! Kararlarının %{postponeSuccessRate}'inde anlık dürtüsel harcamanın önüne geçtin.");
        }
        else if (boughtCount > 0 && postponeSuccessRate < 30 && evaluatedCount >= 3)
        {
            messages.Add("Son kararlarının çoğunda satın alma eylemi gerçekleşti. Yüksek riskli kararlarda 48 saat kuralını denemek bütçeni rahatlatabilir.");
        }

        if (topRiskCategory != null)
        {
            messages.Add($"En çok risk uyarısı aldığın alan: **{topRiskCategory.CategoryName}** ({topRiskCategory.HighRiskCount} yüksek riskli karar).");
        }

        if (pendingCount > 0)
        {
            messages.Add($"Aksiyon bekleyen {pendingCount} adet kararın var. Geçmiş kararlarından durumlarını güncelleyebilirsin.");
        }

        return new InsightSummaryDto(
            TotalDecisions: totalDecisions,
            BoughtCount: boughtCount,
            PostponedCount: postponedCount,
            CancelledCount: cancelledCount,
            PendingCount: pendingCount,
            PostponeSuccessRate: postponeSuccessRate,
            TotalMoneySaved: totalMoneySaved,
            TopRiskCategoryName: topRiskCategory?.CategoryName,
            CategoryStats: categoryStats.AsReadOnly(),
            InsightMessages: messages.AsReadOnly()
        );
    }

    private static string GetCategoryTurkishName(ExpenseCategory category) => category switch
    {
        ExpenseCategory.Electronics => "Elektronik",
        ExpenseCategory.ClothingAndFashion => "Giyim & Moda",
        ExpenseCategory.FoodAndDining => "Yeme & İçme",
        ExpenseCategory.HealthAndBeauty => "Sağlık & Güzellik",
        ExpenseCategory.HomeAndLiving => "Ev & Yaşam",
        ExpenseCategory.HobbyAndEntertainment => "Hobi & Eğlence",
        ExpenseCategory.Transportation => "Ulaşım",
        ExpenseCategory.Education => "Eğitim",
        _ => "Diğer"
    };
}
