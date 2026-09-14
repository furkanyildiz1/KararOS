//matematiksel karar motoru(veri tabanına veya dış kütüphaneye bağlıd eğil)
using KararOS.Domain.Models;
using KararOS.Domain.Enums;

namespace KararOS.Domain.Services;

public static class DecisionEngine
{
    public const string CurrentRuleVersion = "v1.0.0";

    public static DecisionCalculationResult Evaluate(DecisionCalculationInput input, DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var expense = Math.Max(0, input.NewExpenseAmount);

        //birinci olark bütçe havuzları hesaplama
        var netDiscretionary = Math.Max(0, input.MonthlyIncome - input.FixedExpenses);
        var targetProtectedBudget = Math.Max(0, netDiscretionary - input.SavingsGoal);

        // Ham kalan bütçe (negatife düşebilir, böylece önceki aşımı koruruz)
        var rawAvailable = targetProtectedBudget - input.CurrentSpending;
        var availableBudget = Math.Max(0, rawAvailable);
        var projectedRemaining = rawAvailable - expense;
        var reasons = new List<string>();
        var riskScore = 0;

        //faktör bir oalrak harcama oran puanı(s_harcama)

        var ratio = availableBudget > 0 ? expense / availableBudget : 1.0m;
        if (ratio <= 0.20m)
        {
            riskScore += 0;
            reasons.Add("Bu harcama kalan serbest bütçenin güvenli dilimi (%20 ve altı) içinde kalıyor.");
        }
        else if (ratio <= 0.40m)
        {
            riskScore += 1;
            reasons.Add("Harcama kalan bütçenin %20-%40'ını kullanıyor, yönetilebilir seviyede.");
        }
        else if (ratio <= 0.70m)
        {
            riskScore += 2;
            reasons.Add("Bu harcama kalan serbest bütçenin %40-%70'i gibi ciddi bir kısmını tüketiyor.");
        }
        else
        {
            riskScore += 4;
            reasons.Add("Harcama tutarı kalan güvenli bütçenin %70'inden fazlasını kaplıyor!");
        }

        //faktör iki olarak tasarruftan sapma puanı (s_tasarruf)

        decimal projectedSavingsGap;
        if (projectedRemaining >= 0)
        {
            riskScore += 0;
            projectedSavingsGap = 0;
            reasons.Add("Aylık tasarruf hedefin tamamen korunuyor (+0 TL sapma).");
        }
        else
        {
            var deficit = Math.Abs(projectedRemaining);
            projectedSavingsGap = deficit;

            var savingsDepletionRatio = input.SavingsGoal > 0 ? deficit / input.SavingsGoal : 1.0m;
            if (savingsDepletionRatio <= 0.25m)
            {
                riskScore += 2;
                reasons.Add($"Bu harcama tasarruf hedefinden ~{deficit:N0} TL sapmaya yol açıyor (%25 altı aşım).");
            }
            else
            {
                riskScore += 4;
                reasons.Add($"Bu harcama tasarruf hedefinin %25'inden fazlasını eritiyor!");
            }
        }

        //faktör üç oalrak ayın kalan günleri zamanlama puanı(s_zaman)

        var dayOfMonth = today.Day;
        var daysInMonth = DateTime.DaysInMonth(today.Year, today.Month);
        var remainingDays = Math.Max(1, daysInMonth - dayOfMonth);

        if (dayOfMonth <= 10 && ratio > 0.40m)
        {
            riskScore += 2;
            reasons.Add($"Ayın henüz {dayOfMonth}. günündeyiz; ayın başındaki yüksek harcamalar ay sonunu riske sokabilir.");
        }
        else if (remainingDays <= 5 && projectedRemaining >= 0)
        {
            riskScore += 0;
            reasons.Add("Ay sonuna az kaldı ve bütçen bu harcamayı rahatlıkla karşılıyor.");
        }
        else if (ratio > 0.50m)
        {
            riskScore += 1;
            reasons.Add($"Ayın bitmesine {remainingDays} gün varken bütçe payının yarısından fazlasını tek kalemde harcamak dikkat gerektirir.");
        }

        //faktör dört oalrak bütçe kullanım puanı(s_kullanım)

        var totalBudgetUsedWithExpense = input.CurrentSpending + expense;
        var budgetUsagePercent = netDiscretionary > 0 ? (int)Math.Min(100, Math.Round((totalBudgetUsedWithExpense / netDiscretionary) * 100)) : 100;
        if (budgetUsagePercent >= 80)
        {
            riskScore += 1;
            reasons.Add($"Bu harcamayla birlikte aylık serbest bütçenin %{budgetUsagePercent}'i kullanılmış olacak.");
        }

        //nihai karar ve skoe eşleştirmesi

        DecisionVerdict verdict;
        string verdictTitle;
        string verdictSubtitle;
        RiskLevel riskLevel;

        if (riskScore <= 2)
        {
            verdict = DecisionVerdict.Approved;
            verdictTitle = "Alabilirsin!";
            verdictSubtitle = "Bu alışveriş tasarruf hedefini ve bütçe dengeni bozmuyor.";
            riskLevel = RiskLevel.Low;
        }
        else if (riskScore <= 5)
        {
            verdict = DecisionVerdict.Caution;
            verdictTitle = "Dikkatli Ol!";
            verdictSubtitle = "Bu harcama bütçeni sınıra yaklaştırıyor, ertelemeyi düşünebilirsin.";
            riskLevel = RiskLevel.Medium;
        }
        else
        {
            verdict = DecisionVerdict.Reject;
            verdictTitle = "Ertelemeni Öneririz!";
            verdictSubtitle = "Bu harcama tasarruf hedefini ve bütçe sınırlarını ciddi şekilde aşıyor.";
            riskLevel = RiskLevel.High;
        }

        return new DecisionCalculationResult
        {
            Verdict = verdict,
            VerdictTitle = verdictTitle,
            VerdictSubtitle = verdictSubtitle,
            RiskLevel = riskLevel,
            DecisionScore = Math.Min(10, riskScore),
            RuleVersion = CurrentRuleVersion,
            CurrentAvailableBudget = availableBudget,
            ProjectedAvailableBudget = Math.Max(0, projectedRemaining),
            ProjectedSavingsGap = projectedSavingsGap,
            ExpenseRatio = Math.Round(ratio, 2),
            BudgetUsagePercent = budgetUsagePercent,
            Reasons = reasons.AsReadOnly()
        };

    }
}

