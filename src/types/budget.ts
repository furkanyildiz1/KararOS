export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type DecisionVerdict = 'APPROVED' | 'CAUTION' | 'REJECT';

export type DecisionAction = 'BOUGHT' | 'POSTPONED' | 'CANCELLED';

export type ExpenseCategory =
    | 'Elektronik'
    | 'Giyim & Moda'
    | 'Yeme & İçme'
    | 'Sağlık & Güzellik'
    | 'Ev & Yaşam'
    | 'Hobi & Eğlence'
    | 'Ulaşım'
    | 'Eğitim'
    | 'Diğer';

//Kullanııcı bütçe profili
export interface BudgetProfile {
    monthlyIncome: number;//aylık gelir
    fixedExpenses: number;//sabit giderler
    savingsGoal: number;//tasarruf hedefi
    currentSpending: number;//mevcut harcamalar
}

//karar sorma isteği
export interface DecisionRequest {
    title: string;
    amount: number;
    category: ExpenseCategory;
    date: string;
    note?: string;
}

//karar motoru yanıtı
export interface DecisionResponse {
    id: string;
    request: DecisionRequest;
    verdict: DecisionVerdict;
    verdictTitle: string;//alabilirsin gibi ibareler
    verdictSubtitle: string;//bu alışveriş bütçen zorlamıcak gibi alt başlıklar 
    riskLevel: RiskLevel;

    currentAvailableBudget: number;//harcama öncesi kalan bütçemiz
    projectedAvailableBudget: number;//harcama sonrası kalan bütçe
    projectedSavingsGap: number;//hedefe kalan uzaklık
    expenseRatio: number;//harcama bütçemiz
    budgetUsagePercent: number;//toplam kullanım yüzdesi
    reasons: string[];//karar gerekçelerimiz
}

//geçmiş karar kaydı

export interface DecisionRecord {
    id: string;
    request: DecisionRequest;
    response: DecisionResponse;
    action: DecisionAction;
    actionDate: string;
    impactStatus: string;//gerçekleşen etki
}