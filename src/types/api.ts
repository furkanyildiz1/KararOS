// Backend Domain Enums ile Birebir Uyumlu
export enum DecisionVerdict {
    Approved = 1,
    Caution = 2,
    Reject = 3
}

export enum RiskLevel {
    Low = 1,
    Medium = 2,
    High = 3
}

export enum DecisionAction {
    Pending = 0,
    Bought = 1,
    Postponed = 2,
    Cancelled = 3
}

export enum ExpenseCategory {
    Electronics = 1,
    ClothingAndFashion = 2,
    FoodAndDining = 3,
    HealthAndBeauty = 4,
    HomeAndLiving = 5,
    HobbyAndEntertainment = 6,
    Transportation = 7,
    Education = 8,
    Other = 9
}

// Auth DTO'ları
export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    isMarketingConsentAccepted: boolean;
    isTermsAccepted: boolean;
    isKvkkAccepted: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    user: {
        id: string;
        email: string;
        fullName: string;
        hasBudgetProfile: boolean;
    };
}

// Bütçe DTO'ları
export interface BudgetProfileDto {
    monthlyIncome: number;
    fixedExpenses: number;
    savingsGoal: number;
    currentSpending: number;
    netDiscretionary: number;
    targetProtectedBudget: number;
    availableBudget: number;
    updatedAt?: string;
}

export interface UpsertBudgetProfileRequest {
    monthlyIncome: number;
    fixedExpenses: number;
    savingsGoal: number;
    currentSpending: number;
}

// Karar DTO'ları
export interface EvaluateDecisionRequest {
    title: string;
    amount: number;
    category: ExpenseCategory;
    plannedDate: string; // YYYY-MM-DD
}

export interface DecisionEvaluationResponse {
    verdict: DecisionVerdict;
    verdictTitle: string;
    verdictSubtitle: string;
    riskLevel: RiskLevel;
    decisionScore: number;
    ruleVersion: string;
    currentAvailableBudget: number;
    projectedAvailableBudget: number;
    projectedSavingsGap: number;
    expenseRatio: number;
    budgetUsagePercent: number;
    reasons: string[];
}

export interface CreateDecisionRequest {
    title: string;
    amount: number;
    category: ExpenseCategory;
    plannedDate: string; // YYYY-MM-DD
}

export interface DecisionRecordResponse {
    id: string;
    title: string;
    amount: number;
    category: ExpenseCategory;
    plannedDate: string;
    verdict: DecisionVerdict;
    riskLevel: RiskLevel;
    decisionScore: number;
    ruleVersion: string;
    currentAvailableBudget: number;
    projectedAvailableBudget: number;
    projectedSavingsGap: number;
    expenseRatio: number;
    budgetUsagePercent: number;
    reasons: string[];
    action: DecisionAction;
    actionDate?: string;
    createdAt: string;
    followUpAt?: string;
    followUpFeedback?: string;
}

export interface UpdateDecisionActionRequest {
    action: DecisionAction;
    followUpFeedback?: string;
    actualImpact?: number;
}
