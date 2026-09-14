using FluentAssertions;
using Xunit;
using KararOS.Domain.Enums;
using KararOS.Domain.Models;
using KararOS.Domain.Services;

namespace KararOS.UnitTests.Services;

public class DecisionEngineTests
{
    // -------------------------------------------------------------
    // TEMEL SENARYOLAR (Baseline)
    // -------------------------------------------------------------

    [Fact]
    public void Evaluate_WhenExpenseIsSmallAndBudgetIsSafe_ShouldReturnApproved()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 6_000m,
            CurrentSpending: 10_000m,
            NewExpenseAmount: 2_000m, // Kalan 14.000 TL'nin %14'ü
            Category: ExpenseCategory.Electronics,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.Verdict.Should().Be(DecisionVerdict.Approved);
        result.RiskLevel.Should().Be(RiskLevel.Low);
        result.DecisionScore.Should().BeInRange(0, 2);
        result.ProjectedSavingsGap.Should().Be(0);
        result.CurrentAvailableBudget.Should().Be(14_000m);
        result.ProjectedAvailableBudget.Should().Be(12_000m);
        result.RuleVersion.Should().Be(DecisionEngine.CurrentRuleVersion);
        result.Reasons.Should().NotBeEmpty();
    }

    [Fact]
    public void Evaluate_WhenExpenseTakesSignificantPortionOfAvailableBudget_ShouldReturnCaution()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 45_000m,
            FixedExpenses: 18_000m,
            SavingsGoal: 6_000m,
            CurrentSpending: 15_000m,
            NewExpenseAmount: 3_500m, // Kalan 6.000 TL'nin %58'i
            Category: ExpenseCategory.ClothingAndFashion,
            PlannedDate: new DateOnly(2026, 9, 20)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 20));

        result.Verdict.Should().Be(DecisionVerdict.Caution);
        result.RiskLevel.Should().Be(RiskLevel.Medium);
        result.DecisionScore.Should().BeInRange(3, 5);
        result.Reasons.Should().Contain(r => r.Contains("%40-%70"));
    }

    [Fact]
    public void Evaluate_WhenExpenseExceedsAvailableBudgetAndDepletesSavings_ShouldReturnReject()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 40_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 5_000m,
            CurrentSpending: 14_000m,
            NewExpenseAmount: 4_000m, // Kalan 1.000 TL'yi aşıp 3.000 TL tasarruftan yiyor
            Category: ExpenseCategory.HobbyAndEntertainment,
            PlannedDate: new DateOnly(2026, 9, 10)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 10));

        result.Verdict.Should().Be(DecisionVerdict.Reject);
        result.RiskLevel.Should().Be(RiskLevel.High);
        result.DecisionScore.Should().BeGreaterThanOrEqualTo(6);
        result.ProjectedSavingsGap.Should().Be(3_000m);
        result.ProjectedAvailableBudget.Should().Be(0);
        result.Reasons.Should().Contain(r => r.Contains("tasarruf hedefinin %25'inden fazlasını eritiyor"));
    }

    // -------------------------------------------------------------
    // ZAMANLAMA FAKTÖRÜ TESTLERİ (Timing Factor)
    // -------------------------------------------------------------

    [Fact]
    public void Evaluate_SameExpense_ShouldHaveHigherRiskAtStartOfMonthThanEndOfMonth()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 6_000m,
            CurrentSpending: 14_000m,
            NewExpenseAmount: 5_000m, // Kalan 10.000 TL'nin %50'si
            Category: ExpenseCategory.Electronics,
            PlannedDate: new DateOnly(2026, 9, 2)
        );

        var earlyMonthResult = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 2));
        var lateMonthResult = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 28));

        earlyMonthResult.DecisionScore.Should().BeGreaterThan(lateMonthResult.DecisionScore);
        earlyMonthResult.Reasons.Should().Contain(r => r.Contains("ayın başındaki yüksek harcamalar"));
    }

    [Fact]
    public void Evaluate_AtEndOfMonth_WhenBudgetSafe_ShouldProvidePositiveTimingFeedback()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 60_000m,
            FixedExpenses: 25_000m,
            SavingsGoal: 10_000m,
            CurrentSpending: 15_000m,
            NewExpenseAmount: 2_000m,
            Category: ExpenseCategory.FoodAndDining,
            PlannedDate: new DateOnly(2026, 9, 28) // Ayın bitmesine 2 gün var
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 28));

        result.Verdict.Should().Be(DecisionVerdict.Approved);
        result.Reasons.Should().Contain(r => r.Contains("Ay sonuna az kaldı ve bütçen bu harcamayı rahatlıkla karşılıyor"));
    }

    // -------------------------------------------------------------
    // KULLANICI PROFİLİ VE SINIR SENARYOLARI (User Profiles & Edge Cases)
    // -------------------------------------------------------------

    [Fact]
    public void Evaluate_LowIncomeUser_WhenExpenseTakesMajorityOfSmallBudget_ShouldReturnCaution()
    {
        // Asgari ücret / Düşük bütçeli profil
        var input = new DecisionCalculationInput(
            MonthlyIncome: 22_000m,
            FixedExpenses: 15_000m,
            SavingsGoal: 2_000m,
            CurrentSpending: 3_000m, // Kalan serbest bütçe: 2.000 TL
            NewExpenseAmount: 1_200m, // Kalanın %60'ı
            Category: ExpenseCategory.ClothingAndFashion,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.Verdict.Should().Be(DecisionVerdict.Caution);
        result.ProjectedSavingsGap.Should().Be(0); // Tasarruf hedefi henüz bozulmadı ama serbest bütçe daraldı
        result.ProjectedAvailableBudget.Should().Be(800m);
    }

    [Fact]
    public void Evaluate_HighIncomeUser_WithLargeBudget_ShouldEasilyApproveModerateExpense()
    {
        // Yüksek gelirli profil
        var input = new DecisionCalculationInput(
            MonthlyIncome: 180_000m,
            FixedExpenses: 45_000m,
            SavingsGoal: 50_000m,
            CurrentSpending: 20_000m, // Kalan güvenli bütçe: 65.000 TL
            NewExpenseAmount: 8_000m, // Kalanın %12'si
            Category: ExpenseCategory.Electronics,
            PlannedDate: new DateOnly(2026, 9, 10)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 10));

        result.Verdict.Should().Be(DecisionVerdict.Approved);
        result.RiskLevel.Should().Be(RiskLevel.Low);
        result.DecisionScore.Should().Be(0);
        result.ProjectedSavingsGap.Should().Be(0);
    }

    [Fact]
    public void Evaluate_ZeroSavingsGoal_ShouldOnlyEvaluateAgainstDiscretionaryBudget()
    {
        // Tasarruf hedefi olmayan kullanıcı
        var input = new DecisionCalculationInput(
            MonthlyIncome: 40_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 0m,
            CurrentSpending: 10_000m, // Kalan bütçe: 10.000 TL
            NewExpenseAmount: 1_500m, // %15
            Category: ExpenseCategory.HomeAndLiving,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.Verdict.Should().Be(DecisionVerdict.Approved);
        result.ProjectedSavingsGap.Should().Be(0);
        result.CurrentAvailableBudget.Should().Be(10_000m);
        result.ProjectedAvailableBudget.Should().Be(8_500m);
    }

    [Fact]
    public void Evaluate_DeficitBudget_IncomeLessThanFixedExpenses_ShouldReturnReject()
    {
        // Sabit gideri gelirinden fazla olan (Bütçe Açığı) kullanıcı
        var input = new DecisionCalculationInput(
            MonthlyIncome: 25_000m,
            FixedExpenses: 28_000m, // Gelir yetersiz
            SavingsGoal: 0m,
            CurrentSpending: 0m,
            NewExpenseAmount: 500m,
            Category: ExpenseCategory.Other,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.Verdict.Should().Be(DecisionVerdict.Reject);
        result.CurrentAvailableBudget.Should().Be(0);
        result.ProjectedAvailableBudget.Should().Be(0);
    }

    [Fact]
    public void Evaluate_WhenCurrentSpendingAlreadyExceedsBudget_ShouldReturnReject()
    {
        // Ay ortasında bütçesini çoktan tüketmiş kullanıcı
        var input = new DecisionCalculationInput(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 10_000m, // Güvenli Harcama Tavanı: 20.000 TL
            CurrentSpending: 23_000m, // Bütçe şimdiden 3.000 TL aşılmış
            NewExpenseAmount: 1_000m,
            Category: ExpenseCategory.FoodAndDining,
            PlannedDate: new DateOnly(2026, 9, 20)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 20));

        result.Verdict.Should().Be(DecisionVerdict.Reject);
        result.CurrentAvailableBudget.Should().Be(0);
        result.ProjectedAvailableBudget.Should().Be(0);
        result.ProjectedSavingsGap.Should().Be(4_000m); // 3k önceki aşım + 1k yeni harcama
    }

    [Fact]
    public void Evaluate_CatastrophicExpense_DepletingEntireSavings_ShouldReturnMaximumRiskScore()
    {
        // Tasarrufun tamamını yok eden aşırı büyük harcama
        var input = new DecisionCalculationInput(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 10_000m,
            CurrentSpending: 19_000m, // Kalan güvenli bütçe: 1.000 TL
            NewExpenseAmount: 15_000m, // 14.000 TL açık -> 10.000 TL'lik tasarrufun tamamını (%140) eritiyor
            Category: ExpenseCategory.Electronics,
            PlannedDate: new DateOnly(2026, 9, 10)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 10));

        result.Verdict.Should().Be(DecisionVerdict.Reject);
        result.RiskLevel.Should().Be(RiskLevel.High);
        result.DecisionScore.Should().BeGreaterThanOrEqualTo(7);
        result.ProjectedSavingsGap.Should().Be(14_000m);
    }

    [Fact]
    public void Evaluate_WhenBudgetUsageHitsEightyPercentThreshold_ShouldIncludeUsageWarning()
    {
        // Harcama ile toplam bütçe kullanım oranı %80'i aşıyor
        var input = new DecisionCalculationInput(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m, // Net serbest: 30.000 TL
            SavingsGoal: 5_000m,
            CurrentSpending: 20_000m,
            NewExpenseAmount: 5_000m, // Toplam: 25.000 / 30.000 = %83
            Category: ExpenseCategory.Transportation,
            PlannedDate: new DateOnly(2026, 9, 18)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 18));

        result.BudgetUsagePercent.Should().BeGreaterThanOrEqualTo(80);
        result.Reasons.Should().Contain(r => r.Contains("aylık serbest bütçenin %"));
    }

    [Fact]
    public void Evaluate_WhenZeroExpense_ShouldReturnApprovedWithZeroScore()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 40_000m,
            FixedExpenses: 15_000m,
            SavingsGoal: 5_000m,
            CurrentSpending: 5_000m,
            NewExpenseAmount: 0m,
            Category: ExpenseCategory.Other,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.Verdict.Should().Be(DecisionVerdict.Approved);
        result.ExpenseRatio.Should().Be(0);
        result.DecisionScore.Should().Be(0);
        result.ProjectedSavingsGap.Should().Be(0);
    }

    [Fact]
    public void Evaluate_WhenNegativeExpense_ShouldHandleGracefullyAsZero()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 5_000m,
            CurrentSpending: 5_000m,
            NewExpenseAmount: -500m, // Negatif girdi
            Category: ExpenseCategory.Other,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.Verdict.Should().Be(DecisionVerdict.Approved);
        result.ProjectedAvailableBudget.Should().Be(result.CurrentAvailableBudget);
    }

    [Fact]
    public void Evaluate_ShouldAlwaysProvideConsistentVerdictTitlesAndReasons()
    {
        var input = new DecisionCalculationInput(
            MonthlyIncome: 30_000m,
            FixedExpenses: 10_000m,
            SavingsGoal: 5_000m,
            CurrentSpending: 5_000m,
            NewExpenseAmount: 1_000m,
            Category: ExpenseCategory.Education,
            PlannedDate: new DateOnly(2026, 9, 15)
        );

        var result = DecisionEngine.Evaluate(input, referenceDate: new DateOnly(2026, 9, 15));

        result.VerdictTitle.Should().NotBeNullOrWhiteSpace();
        result.VerdictSubtitle.Should().NotBeNullOrWhiteSpace();
        result.Reasons.Should().NotBeEmpty();
        result.RuleVersion.Should().Be("v1.0.0");
    }
}
