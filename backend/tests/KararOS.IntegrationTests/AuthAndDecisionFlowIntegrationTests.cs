using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Xunit;
using KararOS.Application.DTOs.Auth;
using KararOS.Application.DTOs.Budget;
using KararOS.Application.DTOs.Decision;
using KararOS.Application.DTOs.Insights;
using KararOS.Domain.Enums;

namespace KararOS.IntegrationTests;

public class AuthAndDecisionFlowIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthAndDecisionFlowIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task FullUserLifecycle_RegisterToBoughtDecision_ShouldIncrementBudgetSpending()
    {
        var uniqueEmail = $"user_{Guid.NewGuid():N}@kararos.app";

        // 1. ADIM: Kayıt Ol (Register)
        var registerRequest = new RegisterRequestDto(
            Email: uniqueEmail,
            Password: "SecurePassword123!",
            FullName: "Selin Yılmaz",
            IsMarketingConsentAccepted: true,
            IsTermsAccepted: true,
            IsKvkkAccepted: true
        );

        var regResponse = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);
        var regContent = await regResponse.Content.ReadAsStringAsync();
        regResponse.StatusCode.Should().Be(HttpStatusCode.OK, because: regContent);

        var authResult = await regResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        authResult.Should().NotBeNull();
        authResult!.AccessToken.Should().NotBeNullOrWhiteSpace();
        authResult.RefreshToken.Should().NotBeNullOrWhiteSpace();
        authResult.User.Email.Should().Be(uniqueEmail);

        var token = authResult.AccessToken;
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 2. ADIM: Bütçe Profili Oluştur (Gelir: 50.000, Sabit: 20.000, Tasarruf: 6.000, Harcama: 10.000)
        var upsertBudget = new UpsertBudgetProfileDto(
            MonthlyIncome: 50_000m,
            FixedExpenses: 20_000m,
            SavingsGoal: 6_000m,
            CurrentSpending: 10_000m
        );

        var budgetResponse = await _client.PutAsJsonAsync("/api/budget", upsertBudget);
        budgetResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var budgetResult = await budgetResponse.Content.ReadFromJsonAsync<BudgetProfileDto>();
        budgetResult.Should().NotBeNull();
        budgetResult!.AvailableBudget.Should().Be(14_000m); // Net serbest: 30k, hedef-korunmuş: 24k, mevcut: 10k -> kalan: 14k

        // 3. ADIM: Karar Motoru Önizlemesi Yap (Evaluate - 2.700 TL Harcama)
        var evaluateRequest = new EvaluateDecisionRequestDto(
            Title: "Kablosuz Kulaklık",
            Amount: 2_700m,
            Category: ExpenseCategory.Electronics,
            PlannedDate: DateOnly.FromDateTime(DateTime.UtcNow)
        );

        var evalResponse = await _client.PostAsJsonAsync("/api/decisions/evaluate", evaluateRequest);
        evalResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var evalResult = await evalResponse.Content.ReadFromJsonAsync<DecisionEvaluationResponseDto>();
        evalResult.Should().NotBeNull();
        evalResult!.Verdict.Should().Be(DecisionVerdict.Approved);
        evalResult.ProjectedAvailableBudget.Should().Be(11_300m);

        // 4. ADIM: Kararı Veritabanına Kaydet (Create Decision)
        var createRequest = new CreateDecisionRecordRequestDto(
            Title: "Kablosuz Kulaklık",
            Amount: 2_700m,
            Category: ExpenseCategory.Electronics,
            PlannedDate: DateOnly.FromDateTime(DateTime.UtcNow)
        );

        var createResponse = await _client.PostAsJsonAsync("/api/decisions", createRequest);
        createResponse.StatusCode.Should().Be(HttpStatusCode.Created);

        var createdResult = await createResponse.Content.ReadFromJsonAsync<DecisionRecordResponseDto>();
        createdResult.Should().NotBeNull();
        createdResult!.Action.Should().Be(DecisionAction.Pending);

        // 5. ADIM: Karara "Satın Aldım" (Bought) Aksiyonu Ver
        var actionRequest = new UpdateDecisionActionRequestDto(
            Action: DecisionAction.Bought,
            FollowUpFeedback: "İndirimde yakalayıp aldım.",
            ActualImpact: null
        );

        var actionResponse = await _client.PatchAsJsonAsync($"/api/decisions/{createdResult.Id}/action", actionRequest);
        actionResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var updatedResult = await actionResponse.Content.ReadFromJsonAsync<DecisionRecordResponseDto>();
        updatedResult!.Action.Should().Be(DecisionAction.Bought);

        // 6. ADIM: Bütçenin Atomik Olarak Güncellendiğini Doğrula (CurrentSpending 10.000 + 2.700 = 12.700 TL olmalı)
        var finalBudgetResponse = await _client.GetAsync("/api/budget");
        finalBudgetResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var finalBudget = await finalBudgetResponse.Content.ReadFromJsonAsync<BudgetProfileDto>();
        finalBudget.Should().NotBeNull();
        finalBudget!.CurrentSpending.Should().Be(12_700m);
        finalBudget.AvailableBudget.Should().Be(11_300m);

        // 7. ADIM: İçgörü Servisini Kontrol Et (Insights Summary)
        var insightsResponse = await _client.GetAsync("/api/insights/summary");
        insightsResponse.StatusCode.Should().Be(HttpStatusCode.OK);

        var insights = await insightsResponse.Content.ReadFromJsonAsync<InsightSummaryDto>();
        insights.Should().NotBeNull();
        insights!.TotalDecisions.Should().Be(1);
        insights.BoughtCount.Should().Be(1);
    }

    [Fact]
    public async Task PostponedDecision_ShouldNotIncreaseSpending_AndShouldTrackSavedMoney()
    {
        var uniqueEmail = $"postpone_user_{Guid.NewGuid():N}@kararos.app";

        // Kayıt ve Token Al
        var regResponse = await _client.PostAsJsonAsync("/api/auth/register", new RegisterRequestDto(
            Email: uniqueEmail,
            Password: "SecurePassword123!",
            FullName: "Caner Demir",
            IsMarketingConsentAccepted: false,
            IsTermsAccepted: true,
            IsKvkkAccepted: true
        ));
        var auth = await regResponse.Content.ReadFromJsonAsync<AuthResponseDto>();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", auth!.AccessToken);

        // Bütçe: Harcama 5.000 TL
        await _client.PutAsJsonAsync("/api/budget", new UpsertBudgetProfileDto(
            MonthlyIncome: 40_000m,
            FixedExpenses: 15_000m,
            SavingsGoal: 5_000m,
            CurrentSpending: 5_000m
        ));

        // Yüksek riskli harcama oluştur (15.000 TL)
        var createResponse = await _client.PostAsJsonAsync("/api/decisions", new CreateDecisionRecordRequestDto(
            Title: "Lüks Saat",
            Amount: 15_000m,
            Category: ExpenseCategory.ClothingAndFashion,
            PlannedDate: DateOnly.FromDateTime(DateTime.UtcNow)
        ));
        var decision = await createResponse.Content.ReadFromJsonAsync<DecisionRecordResponseDto>();

        // Kararı "Erteledim" (Postponed) yap
        await _client.PatchAsJsonAsync($"/api/decisions/{decision!.Id}/action", new UpdateDecisionActionRequestDto(
            Action: DecisionAction.Postponed,
            FollowUpFeedback: "Gelecek aya bıraktım.",
            ActualImpact: null
        ));

        // Bütçede CurrentSpending 5.000 TL olarak kalmalı
        var budgetResponse = await _client.GetAsync("/api/budget");
        var budget = await budgetResponse.Content.ReadFromJsonAsync<BudgetProfileDto>();
        budget!.CurrentSpending.Should().Be(5_000m);

        // İçgörüde korunan bütçe 15.000 TL olarak gözükmeli
        var insightsResponse = await _client.GetAsync("/api/insights/summary");
        var insights = await insightsResponse.Content.ReadFromJsonAsync<InsightSummaryDto>();
        insights!.PostponedCount.Should().Be(1);
        insights.TotalMoneySaved.Should().Be(15_000m);
    }

    [Fact]
    public async Task UnauthorizedEndpoint_WithoutToken_ShouldReturn401()
    {
        var clientWithoutToken = new CustomWebApplicationFactory().CreateClient();
        var response = await clientWithoutToken.GetAsync("/api/budget");
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
}
