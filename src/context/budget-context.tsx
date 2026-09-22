import {
    BudgetProfile,
    DecisionAction,
    DecisionRecord,
    DecisionRequest,
    DecisionResponse,
    DecisionVerdict,
    RiskLevel,
    SavingsGoalItem,
} from '@/types/budget';
import { DecisionApiService } from '@/services/api/decision-api';
import { BudgetApiService } from '@/services/api/budget-api';
import { StorageService } from '@/services/storage-service';
import {
    ExpenseCategory as ApiExpenseCategory,
    DecisionVerdict as ApiDecisionVerdict,
    RiskLevel as ApiRiskLevel,
    DecisionAction as ApiDecisionAction
} from '@/types/api';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Context'in dışarıya sunacağı özelliklerin tipi
interface BudgetContextType {
    budgetProfile: BudgetProfile;
    updateBudgetProfile: (profile: Partial<BudgetProfile>) => void;
    decisions: DecisionRecord[];
    activeEvaluation: DecisionResponse | null;
    evaluateDecision: (request: DecisionRequest) => DecisionResponse;
    evaluateDecisionAsync?: (request: DecisionRequest) => Promise<DecisionResponse>;
    saveDecisionAction: (response: DecisionResponse, action: DecisionAction) => DecisionRecord;
    saveDecisionActionAsync?: (response: DecisionResponse, action: DecisionAction) => Promise<DecisionRecord>;
    updateDecisionActionAsync?: (decisionId: string, action: DecisionAction) => Promise<void>;
    setActiveEvaluation: (evaluation: DecisionResponse | null) => void;
    isLoading?: boolean;
    refreshData?: () => Promise<void>;

    // Hedefler
    goals: SavingsGoalItem[];
    addGoal: (goal: Omit<SavingsGoalItem, 'id'>) => Promise<void>;
    deleteGoal: (id: string) => Promise<void>;

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

// Tarih Dönüştürücüler
function parseDateToIso(dateStr?: string): string {
    if (!dateStr || dateStr === 'Bugün') {
        return new Date().toISOString().split('T')[0];
    }
    const dotParts = dateStr.split('.');
    if (dotParts.length === 3) {
        const day = dotParts[0].padStart(2, '0');
        const month = dotParts[1].padStart(2, '0');
        const year = dotParts[2];
        return `${year}-${month}-${day}`;
    }
    if (dateStr.includes('-')) {
        return dateStr.split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
}

function formatDisplayDate(dateStr?: string): string {
    if (!dateStr || dateStr === 'Bugün') {
        return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    const dotParts = dateStr.split('.');
    if (dotParts.length === 3) {
        const d = new Date(parseInt(dotParts[2], 10), parseInt(dotParts[1], 10) - 1, parseInt(dotParts[0], 10));
        if (!isNaN(d.getTime())) {
            return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
        }
    }
    return dateStr;
}

// Kategori Enum Dönüştürücü Helper
function mapCategoryToBackend(cat: string): ApiExpenseCategory {
    if (cat.includes('Elektronik')) return ApiExpenseCategory.Electronics;
    if (cat.includes('Giyim')) return ApiExpenseCategory.ClothingAndFashion;
    if (cat.includes('Yeme') || cat.includes('Sosyal')) return ApiExpenseCategory.FoodAndDining;
    if (cat.includes('Sağlık')) return ApiExpenseCategory.HealthAndBeauty;
    if (cat.includes('Ev')) return ApiExpenseCategory.HomeAndLiving;
    if (cat.includes('Hobi') || cat.includes('Eğlence')) return ApiExpenseCategory.HobbyAndEntertainment;
    if (cat.includes('Ulaşım') || cat.includes('Seyahat')) return ApiExpenseCategory.Transportation;
    if (cat.includes('Eğitim')) return ApiExpenseCategory.Education;
    return ApiExpenseCategory.Other;
}

function mapVerdictFromBackend(v: ApiDecisionVerdict): DecisionVerdict {
    switch (v) {
        case ApiDecisionVerdict.Approved: return 'APPROVED';
        case ApiDecisionVerdict.Caution: return 'CAUTION';
        case ApiDecisionVerdict.Reject: return 'REJECT';
        default: return 'APPROVED';
    }
}

function mapRiskFromBackend(r: ApiRiskLevel): RiskLevel {
    switch (r) {
        case ApiRiskLevel.Low: return 'LOW';
        case ApiRiskLevel.Medium: return 'MEDIUM';
        case ApiRiskLevel.High: return 'HIGH';
        default: return 'LOW';
    }
}

function mapActionToBackend(a: DecisionAction): ApiDecisionAction {
    switch (a) {
        case 'BOUGHT': return ApiDecisionAction.Bought;
        case 'POSTPONED': return ApiDecisionAction.Postponed;
        case 'CANCELLED': return ApiDecisionAction.Cancelled;
        default: return ApiDecisionAction.Pending;
    }
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider = ({ children }: { children: ReactNode }) => {
    const [budgetProfile, setBudgetProfile] = useState<BudgetProfile>(DEFAULT_BUDGET);
    const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
    const [goals, setGoals] = useState<SavingsGoalItem[]>([]);
    const [activeEvaluation, setActiveEvaluation] = useState<DecisionResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Serbest Bütçe Havuzu (Gelir - Sabit Gider)
    const totalDiscretionary = Math.max(0, budgetProfile.monthlyIncome - budgetProfile.fixedExpenses);
    // 2. Kalan Kullanılabilir Bütçe
    const targetProtected = Math.max(0, totalDiscretionary - budgetProfile.savingsGoal);
    const availableBudget = Math.max(0, targetProtected - budgetProfile.currentSpending);
    // 3. Bütçe Kullanım Yüzdesi (%47 gibi)
    const budgetUsagePercent = totalDiscretionary > 0
        ? Math.min(100, Math.round((budgetProfile.currentSpending / totalDiscretionary) * 100))
        : 0;

    // Tasarruf Durumu
    const savingsProgress = {
        target: budgetProfile.savingsGoal,
        gap: Math.max(0, budgetProfile.savingsGoal - (totalDiscretionary - budgetProfile.currentSpending)),
        isBehind: (totalDiscretionary - budgetProfile.currentSpending) < budgetProfile.savingsGoal,
    };

    const addGoal = async (goalData: Omit<SavingsGoalItem, 'id'>) => {
        const session = await StorageService.getAuthSession();
        const userEmail = session.email?.trim().toLowerCase();
        const newGoal: SavingsGoalItem = {
            ...goalData,
            id: `goal-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        const updated = [newGoal, ...goals];
        setGoals(updated);
        await StorageService.saveSavingsGoals(updated, userEmail);
    };

    const deleteGoal = async (id: string) => {
        const session = await StorageService.getAuthSession();
        const userEmail = session.email?.trim().toLowerCase();
        const updated = goals.filter((g) => g.id !== id);
        setGoals(updated);
        await StorageService.saveSavingsGoals(updated, userEmail);
    };

    const refreshData = async () => {
        try {
            const session = await StorageService.getAuthSession();
            const email = session.email?.trim().toLowerCase();
            const token = session.token;

            if (!token || !email) {
                setDecisions([]);
                setGoals([]);
                setBudgetProfile(DEFAULT_BUDGET);
                return;
            }

            // Aktif kullanıcının hedeflerini getir
            const storedGoals = await StorageService.getSavingsGoals(email);
            setGoals(storedGoals || []);

            setIsLoading(true);
            const [budgetData, decisionsData] = await Promise.all([
                BudgetApiService.getBudget().catch(() => null),
                DecisionApiService.getAll().catch(() => null),
            ]);

            if (budgetData) {
                setBudgetProfile({
                    monthlyIncome: budgetData.monthlyIncome,
                    fixedExpenses: budgetData.fixedExpenses,
                    savingsGoal: budgetData.savingsGoal,
                    currentSpending: budgetData.currentSpending,
                });
            } else {
                setBudgetProfile(DEFAULT_BUDGET);
            }

            if (decisionsData && Array.isArray(decisionsData)) {
                const mappedRecords: DecisionRecord[] = decisionsData.map((d) => ({
                    id: d.id,
                    request: {
                        title: d.title,
                        amount: d.amount,
                        category: 'Elektronik',
                        date: d.plannedDate ? formatDisplayDate(d.plannedDate) : 'Bugün',
                    },
                    response: {
                        id: `resp-${d.id}`,
                        request: {
                            title: d.title,
                            amount: d.amount,
                            category: 'Elektronik',
                            date: d.plannedDate ? formatDisplayDate(d.plannedDate) : 'Bugün',
                        },
                        verdict: mapVerdictFromBackend(d.verdict),
                        verdictTitle: d.verdict === ApiDecisionVerdict.Approved ? 'Alabilirsin!' : (d.verdict === ApiDecisionVerdict.Caution ? 'Dikkatli Ol!' : 'Ertelemeni Öneririz!'),
                        verdictSubtitle: 'Bütçe analizi tamamlandı.',
                        riskLevel: mapRiskFromBackend(d.riskLevel),
                        currentAvailableBudget: d.currentAvailableBudget,
                        projectedAvailableBudget: d.projectedAvailableBudget,
                        projectedSavingsGap: d.projectedSavingsGap,
                        expenseRatio: d.expenseRatio,
                        budgetUsagePercent: d.budgetUsagePercent,
                        reasons: d.reasons || [],
                    },
                    action: d.action === ApiDecisionAction.Bought ? 'BOUGHT' : (d.action === ApiDecisionAction.Postponed ? 'POSTPONED' : (d.action === ApiDecisionAction.Cancelled ? 'CANCELLED' : 'PENDING')),
                    actionDate: d.actionDate ? formatDisplayDate(d.actionDate) : formatDisplayDate(d.plannedDate),
                    impactStatus: d.action === ApiDecisionAction.Bought ? 'Satın Alındı' : 'Ertelendi',
                }));
                setDecisions(mappedRecords);
            } else {
                setDecisions([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const updateBudgetProfile = (profile: Partial<BudgetProfile>) => {
        const updated = { ...budgetProfile, ...profile };
        setBudgetProfile(updated);
        BudgetApiService.upsertBudget({
            monthlyIncome: updated.monthlyIncome,
            fixedExpenses: updated.fixedExpenses,
            savingsGoal: updated.savingsGoal,
            currentSpending: updated.currentSpending,
        }).catch(() => {});
    };

    // Dinamik Karar Değerlendirme Motoru (Async API Destekli)
    const evaluateDecisionAsync = async (request: DecisionRequest): Promise<DecisionResponse> => {
        setIsLoading(true);
        try {
            const dateIso = parseDateToIso(request.date);
            const categoryEnum = mapCategoryToBackend(request.category);

            const apiResult = await DecisionApiService.evaluate({
                title: request.title,
                amount: request.amount,
                category: categoryEnum,
                plannedDate: dateIso,
            });

            const response: DecisionResponse = {
                id: `resp-${Date.now()}`,
                request,
                verdict: mapVerdictFromBackend(apiResult.verdict),
                verdictTitle: apiResult.verdictTitle,
                verdictSubtitle: apiResult.verdictSubtitle,
                riskLevel: mapRiskFromBackend(apiResult.riskLevel),
                currentAvailableBudget: apiResult.currentAvailableBudget,
                projectedAvailableBudget: apiResult.projectedAvailableBudget,
                projectedSavingsGap: apiResult.projectedSavingsGap,
                expenseRatio: apiResult.expenseRatio,
                budgetUsagePercent: apiResult.budgetUsagePercent,
                reasons: apiResult.reasons || [],
            };

            setActiveEvaluation(response);
            return response;
        } catch {
            return evaluateDecision(request);
        } finally {
            setIsLoading(false);
        }
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
            projectedSavingsGap: projectedRemaining < 0 ? Math.abs(projectedRemaining) : 0,
            expenseRatio: Number(ratio.toFixed(2)),
            budgetUsagePercent: totalDiscretionary > 0 ? Math.min(100, Math.round(((budgetProfile.currentSpending + amount) / totalDiscretionary) * 100)) : 100,
            reasons,
        };

        setActiveEvaluation(response);
        return response;
    };

    const saveDecisionActionAsync = async (
        response: DecisionResponse,
        action: DecisionAction
    ): Promise<DecisionRecord> => {
        const dateIso = parseDateToIso(response.request.date);
        const categoryEnum = mapCategoryToBackend(response.request.category);
        const backendAction = mapActionToBackend(action);

        let savedId = `dec-${Date.now()}`;

        try {
            const created = await DecisionApiService.create({
                title: response.request.title,
                amount: response.request.amount,
                category: categoryEnum,
                plannedDate: dateIso,
            });

            savedId = created.id;

            await DecisionApiService.updateAction(created.id, {
                action: backendAction,
            });
        } catch {
            // Backend çevrimdışıysa yerel kayıt devam eder
        }

        const newRecord: DecisionRecord = {
            id: savedId,
            request: response.request,
            response,
            action,
            actionDate: formatDisplayDate(response.request.date),
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

    const saveDecisionAction = (
        response: DecisionResponse,
        action: DecisionAction
    ): DecisionRecord => {
        // Asenkron kaydı arka planda tetikle
        saveDecisionActionAsync(response, action).catch(() => {});

        const newRecord: DecisionRecord = {
            id: `dec-${Date.now()}`,
            request: response.request,
            response,
            action,
            actionDate: formatDisplayDate(response.request.date),
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

    const updateDecisionActionAsync = async (
        decisionId: string,
        action: DecisionAction
    ): Promise<void> => {
        const backendAction = mapActionToBackend(action);
        try {
            await DecisionApiService.updateAction(decisionId, {
                action: backendAction,
            });
        } catch {
            // Çevrimdışıysa yerel güncelleme yapılır
        }

        setDecisions((prev) =>
            prev.map((item) => {
                if (item.id === decisionId) {
                    // Eğer ertelenenden satın alındıya geçiyorsa harcamayı bütçeye ekle
                    if (item.action !== 'BOUGHT' && action === 'BOUGHT') {
                        setBudgetProfile((b) => ({
                            ...b,
                            currentSpending: b.currentSpending + item.request.amount,
                        }));
                    }
                    // Eğer satın alındıdan vazgeçildiyse bütçeden düş
                    else if (item.action === 'BOUGHT' && action === 'CANCELLED') {
                        setBudgetProfile((b) => ({
                            ...b,
                            currentSpending: Math.max(0, b.currentSpending - item.request.amount),
                        }));
                    }

                    return {
                        ...item,
                        action,
                        impactStatus: action === 'BOUGHT' ? 'Satın Alındı' : (action === 'CANCELLED' ? 'Tasarruf Edildi 🎉' : 'Ertelendi'),
                    };
                }
                return item;
            })
        );
    };

    return (
        <BudgetContext.Provider
            value={{
                budgetProfile,
                updateBudgetProfile,
                decisions,
                activeEvaluation,
                evaluateDecision,
                evaluateDecisionAsync,
                saveDecisionAction,
                saveDecisionActionAsync,
                updateDecisionActionAsync,
                setActiveEvaluation,
                isLoading,
                refreshData,
                goals,
                addGoal,
                deleteGoal,
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
