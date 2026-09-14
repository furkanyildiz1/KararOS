namespace KararOS.Domain.Entities;

public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public bool IsMarketingConsentAccepted { get; set; } = false;

    //navigaiton properties(ilişkiler)
    public BudgetProfile? BudgetProfile { get; set; }
    public ICollection<SavingsGoal> SavingsGoals { get; set; } = new List<SavingsGoal>();
    public ICollection<DecisionRecord> DecisionRecords { get; set; } = new List<DecisionRecord>();
    public ICollection<LegalDocumentAcceptance> LegalAcceptances { get; set; } = new List<LegalDocumentAcceptance>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

}