import {
    BudgetProfile,
    DecisionAction,
    DecisionRecord,
    DecisionRequest,
    DecisionResponse,
    DecisionVerdict,
    RiskLevel,
} from '@/types/budget';
import React, { createContext, useContext, useState } from 'react';

// Context'in dışarıya sunacağı özelliklerin tipi
interface BudgetContextType {
    budgetProfile: BudgetProfile;
    updateBudgetProfile: (profile: Partial<BudgetProfile>) => void;
    decisions: DecisionRecord[];
    activeEvaluation: DecisionResponse | null;
    evaluateDecision: (request: DecisionRequest) => DecisionResponse;
    saveDecisionAction: (response: DecisionResponse, action: DecisionAction) => DecisionRecord;
    setActiveEvaluation: (evaluation: DecisionResponse | null) => void;

    // Hesaplanmış yardımcı türev değerler
    availableBudget: number;       // Kalan bütçe (örn: 14.070)
    budgetUsagePercent: number;    // %47
    savingsProgress: {
        target: number;              // 6.000
        gap: number;                 // 2.430
        isBehind: boolean;
    };
}

// Görseldeki varsayılan bütçe değerleri (Mock başlangıç)
const DEFAULT_BUDGET: BudgetProfile = {
    monthlyIncome: 45400,
    fixedExpenses: 18500,
    savingsGoal: 6000,
    currentSpending: 12430,
};

// Görsel 7'deki geçmiş kararlar mock listesi
const INITIAL_DECISIONS: DecisionRecord[] = [
    {
        id: 'dec-1',
        request: {
            title: 'Kablosuz Kulaklık',
            amount: 2700,
            category: 'Elektronik',
            date: '11 Mayıs 2024',
            note: 'Kendim için alacağım.',
        },
        response: {
            id: 'resp-1',
            request: {
                title: 'Kablosuz Kulaklık',
                amount: 2700,
                category: 'Elektronik',
                date: '11 Mayıs 2024',
            },
            verdict: 'APPROVED',
            verdictTitle: 'Alabilirsin!',
            verdictSubtitle: 'Bu alışveriş bütçeni zorlamıyor.',
            riskLevel: 'LOW',
            currentAvailableBudget: 14070,
            projectedAvailableBudget: 11370,
            projectedSavingsGap: 3630,
            expenseRatio: 0.19,
            budgetUsagePercent: 57,
            reasons: [
                'Bütçende bu harcamayı karşılayacak alan var.',
                'Günlük ortalama harcaman planın altında.',
            ],
        },
        action: 'BOUGHT',
        actionDate: '11 Mayıs 2024',
        impactStatus: 'Bekleniyor',
    },
    {
        id: 'dec-2',
        request: {
            title: 'Hafta Sonu Kaçamağı',
            amount: 3200,
            category: 'Hobi & Eğlence',
            date: '5 Mayıs 2024',
        },
        response: {
            id: 'resp-2',
            request: {
                title: 'Hafta Sonu Kaçamağı',
                amount: 3200,
                category: 'Hobi & Eğlence',
                date: '5 Mayıs 2024',
            },
            verdict: 'APPROVED',
            verdictTitle: 'Alabilirsin!',
            verdictSubtitle: 'Haftalık eğlence kotana uygun.',
            riskLevel: 'LOW',
            currentAvailableBudget: 17270,
            projectedAvailableBudget: 14070,
            projectedSavingsGap: 2430,
            expenseRatio: 0.18,
            budgetUsagePercent: 47,
            reasons: [
                'Sosyal bütçe havuzun bu harcamayı karşılıyor.',
                'Aylık tasarruf hedefini tehlikeye atmıyor.',
            ],
        },
        action: 'BOUGHT',
        actionDate: '5 Mayıs 2024',
        impactStatus: 'Bütçeni zorlamadı',
    },
    {
        id: 'dec-3',
        request: {
            title: 'Spor Ayakkabı',
            amount: 2400,
            category: 'Giyim & Moda',
            date: '28 Nisan 2024',
        },
        response: {
            id: 'resp-3',
            request: {
                title: 'Spor Ayakkabı',
                amount: 2400,
                category: 'Giyim & Moda',
                date: '28 Nisan 2024',
            },
            verdict: 'CAUTION',
            verdictTitle: 'Ertelemeni Öneririz',
            verdictSubtitle: 'Giyim kotan bu ay sınırda.',
            riskLevel: 'MEDIUM',
            currentAvailableBudget: 4200,
            projectedAvailableBudget: 1800,
            projectedSavingsGap: 4600,
            expenseRatio: 0.57,
            budgetUsagePercent: 88,
            reasons: [
                'Giyim harcamaların bu ay hedefin %20 üzerinde.',
                'Önümüzdeki ayın ilk haftasında alman daha güvenli.',
            ],
        },
        action: 'POSTPONED',
        actionDate: '28 Nisan 2024',
        impactStatus: 'Yeni plan: Haziran',
    },
];

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>(DEFAULT_BUDGET);
    const [decisions, setDecisions] = useState<DecisionRecord[]>(INITIAL_DECISIONS);
    const [activeEvaluation, setActiveEvaluation] = useState<DecisionResponse | null>(null);

    // 1. Serbest Bütçe Havuzu (Gelir - Sabit Gider)
    const totalDiscretionary = budgetProfile.monthlyIncome - budgetProfile.fixedExpenses;
    // 2. Kalan Kullanılabilir Bütçe
    const availableBudget = Math.max(0, totalDiscretionary - budgetProfile.currentSpending);
    // 3. Bütçe Kullanım Yüzdesi (%47 gibi)
    const budgetUsagePercent = totalDiscretionary > 0
        ? Math.min(100, Math.round((budgetProfile.currentSpending / totalDiscretionary) * 100))
        : 0;

    // Tasarruf Durumu
    const savingsProgress = {
        target: budgetProfile.savingsGoal,
        gap: 2430,
        isBehind: true,
    };

    const updateBudgetProfile = (profile: Partial<BudgetProfile>) => {
        setBudgetProfile((prev) => ({ ...prev, ...profile }));
    };

    // Dinamik Karar Değerlendirme Motoru
    const evaluateDecision = (request: DecisionRequest): DecisionResponse => {
        const amount = Number(request.amount) || 0;
        const projectedRemaining = availableBudget - amount;
        const ratio = availableBudget > 0 ? amount / availableBudget : 1;

        let verdict: DecisionVerdict = 'APPROVED';
        let verdictTitle = 'Alabilirsin!';
        let verdictSubtitle = 'Bu alışveriş bütçeni zorlamıyor.';
        let riskLevel: RiskLevel = 'LOW';
        const reasons: string[] = [];

        if (projectedRemaining < 0 || ratio > 0.6) {
            verdict = 'REJECT';
            verdictTitle = 'Ertelemeni Öneririz!';
            verdictSubtitle = 'Bu harcama bütçe sınırlarını aşıyor.';
            riskLevel = 'HIGH';
            reasons.push('Bu harcama kalan bütçenin %60’ından fazlasını tüketiyor.');
            reasons.push('Aylık tasarruf hedefini riske sokabilir.');
        } else if (ratio > 0.3 || projectedRemaining < budgetProfile.savingsGoal) {
            verdict = 'CAUTION';
            verdictTitle = 'Dikkatli Ol!';
            verdictSubtitle = 'Bütçeni sınırda bırakabilir.';
            riskLevel = 'MEDIUM';
            reasons.push('Bu harcama bütçende daralmaya yol açabilir.');
            reasons.push('Ay sonuna kadar diğer harcamalarını kısman gerekebilir.');
        } else {
            verdict = 'APPROVED';
            verdictTitle = 'Alabilirsin!';
            verdictSubtitle = 'Bu alışveriş bütçeni zorlamıyor.';
            riskLevel = 'LOW';
            reasons.push('Bütçende bu harcamayı karşılayacak alan var.');
            reasons.push('Günlük ortalama harcaman planın altında.');
        }

        const response: DecisionResponse = {
            id: `resp-${Date.now()}`,
            request,
            verdict,
            verdictTitle,
            verdictSubtitle,
            riskLevel,
            currentAvailableBudget: availableBudget,
            projectedAvailableBudget: Math.max(0, projectedRemaining),
            projectedSavingsGap: 3630,
            expenseRatio: Number(ratio.toFixed(2)),
            budgetUsagePercent: Math.min(100, Math.round(((budgetProfile.currentSpending + amount) / totalDiscretionary) * 100)),
            reasons,
        };

        setActiveEvaluation(response);
        return response;
    };

    const saveDecisionAction = (
        response: DecisionResponse,
        action: DecisionAction
    ): DecisionRecord => {
        const newRecord: DecisionRecord = {
            id: `dec-${Date.now()}`,
            request: response.request,
            response,
            action,
            actionDate: new Date().toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            impactStatus: action === 'BOUGHT' ? 'Bekleniyor' : 'Yeni plan: Ertelendi',
        };

        setDecisions((prev) => [newRecord, ...prev]);

        // Eğer satın alındıysa harcamayı güncelle
        if (action === 'BOUGHT') {
            setBudgetProfile((prev) => ({
                ...prev,
                currentSpending: prev.currentSpending + response.request.amount,
            }));
        }

        return newRecord;
    };

    return (
        <BudgetContext.Provider
            value={{
                budgetProfile,
                updateBudgetProfile,
                decisions,
                activeEvaluation,
                evaluateDecision,
                saveDecisionAction,
                setActiveEvaluation,
                availableBudget,
                budgetUsagePercent,
                savingsProgress,
            }}>
            {children}
        </BudgetContext.Provider>
    );
};

// Kolay kullanım için custom hook
export const useBudget = (): BudgetContextType => {
    const context = useContext(BudgetContext);
    if (!context) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
