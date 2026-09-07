import { useBudget } from '@/context/budget-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DecisionResultScreen() {
    const router = useRouter();
    const { activeEvaluation, saveDecisionAction } = useBudget();

    //contexteki aktif değerlendirem sonucu(yoksa varsayıla)
    const evaluation = activeEvaluation || {
        id: 'resp-fallback',
        request: {
            title: 'Kablosuz Kulaklık',
            amount: 2700,
            category: 'Elektronik' as const,
            date: 'Bugün',
        },
        verdict: 'APPROVED' as const,
        verdictTitle: 'Alabilirsin!',
        verdictSubtitle: 'Bu alışveriş bütçeni zorlamıyor.',
        riskLevel: 'LOW' as const,
        currentAvailableBudget: 14070,
        projectedAvailableBudget: 11370,
        projectedSavingsGap: 3630,
        expenseRatio: 0.19,
        budgetUsagePercent: 57,
        reasons: [
            'Bütçende bu harcamayı karşılayacak alan var.',
            'Günlük ortalama harcaman planın altında.',
        ],
    };

    const formatCurrency = (val: number) => {
        return '₺' + val.toLocaleString('tr-TR');
    };

    //kullanıcı bir karar aksşitonu seçtiğinde
    const handleAction = (action: 'BOUGHT' | 'POSTPONED') => {
        saveDecisionAction(evaluation, action);
        router.push('/decision/saved' as Href);
    };

    const isApproved = evaluation.verdict === 'APPROVED';
    const isCaution = evaluation.verdict === 'CAUTION';

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>KararOS diyor ki...</Text>
                <View style={styles.placeholder} />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* 1. Hero Karar Kartı */}
                <View
                    style={[
                        styles.heroCard,
                        isApproved && styles.heroCardApproved,
                        isCaution && styles.heroCardCaution,
                        !isApproved && !isCaution && styles.heroCardReject,
                    ]}>
                    <View
                        style={[
                            styles.iconCircle,
                            isApproved && styles.iconCircleApproved,
                            isCaution && styles.iconCircleCaution,
                            !isApproved && !isCaution && styles.iconCircleReject,
                        ]}>
                        <Ionicons
                            name={
                                isApproved
                                    ? 'checkmark'
                                    : isCaution
                                        ? 'warning-outline'
                                        : 'close'
                            }
                            size={32}
                            color="#ffffff"
                        />
                    </View>
                    <Text style={styles.verdictTitle}>{evaluation.verdictTitle}</Text>
                    <Text style={styles.verdictSubtitle}>{evaluation.verdictSubtitle}</Text>
                </View>
                {/* 2. Ay Sonu Tahmini Durum Kartı */}
                <View style={styles.projectionCard}>
                    <Text style={styles.sectionHeader}>Ay sonu tahmini durumun</Text>
                    <View style={styles.projectionRow}>
                        <View style={styles.projectionCol}>
                            <Text style={styles.projLabel}>Kalan Bütçe</Text>
                            <Text style={styles.projValue}>
                                {formatCurrency(evaluation.projectedAvailableBudget)}
                            </Text>
                        </View>
                        <View style={styles.projectionDivider} />
                        <View style={styles.projectionCol}>
                            <Text style={styles.projLabel}>Hedefine Uzaklık</Text>
                            <Text style={styles.projValue}>
                                {formatCurrency(evaluation.projectedSavingsGap)}
                            </Text>
                        </View>
                    </View>
                    {/* Durum Gösterge Çubuğu */}
                    <View style={styles.barContainer}>
                        <View style={styles.barBackground}>
                            <View style={[styles.barFill, { width: '70%' }]} />
                            <View style={[styles.barThumb, { left: '70%' }]} />
                        </View>
                        <View style={styles.barLabels}>
                            <Text style={styles.barText}>0</Text>
                            <Text style={styles.barTextHighlighted}>
                                {formatCurrency(evaluation.projectedAvailableBudget)}
                            </Text>
                            <Text style={styles.barText}>16.000</Text>
                        </View>
                    </View>
                </View>
                {/* 3. Neden Böyle Diyor? Gerekçeler */}
                <View style={styles.reasonsCard}>
                    <Text style={styles.sectionHeader}>Neden böyle diyor?</Text>
                    <View style={styles.reasonsList}>
                        {evaluation.reasons.map((reason, idx) => (
                            <View key={idx} style={styles.reasonRow}>
                                <Ionicons
                                    name="checkmark"
                                    size={18}
                                    color="#059669"
                                    style={styles.reasonCheck}
                                />
                                <Text style={styles.reasonText}>{reason}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                {/* 4. Aksiyon Butonları */}
                <View style={styles.actionContainer}>
                    <TouchableOpacity
                        style={styles.primaryActionButton}
                        onPress={() => handleAction('BOUGHT')}
                        activeOpacity={0.85}>
                        <Text style={styles.primaryActionText}>Alışverişi Yapacağım</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.secondaryActionButton}
                        onPress={() => handleAction('POSTPONED')}
                        activeOpacity={0.7}>
                        <Text style={styles.secondaryActionText}>
                            Vazgeçtim / Ertelemek İstiyorum
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );


}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: -0.3,
    },
    placeholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 32,
    },
    heroCard: {
        borderRadius: 24,
        paddingVertical: 28,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginBottom: 16,
        borderWidth: 1,
    },
    heroCardApproved: {
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    heroCardCaution: {
        backgroundColor: '#fffbeb',
        borderColor: '#fde68a',
    },
    heroCardReject: {
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca',
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    iconCircleApproved: {
        backgroundColor: '#16a34a',
    },
    iconCircleCaution: {
        backgroundColor: '#d97706',
    },
    iconCircleReject: {
        backgroundColor: '#dc2626',
    },
    verdictTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 4,
        letterSpacing: -0.4,
    },
    verdictSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
    },
    projectionCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 16,
        letterSpacing: -0.2,
    },
    projectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 18,
    },
    projectionCol: {
        alignItems: 'center',
        flex: 1,
    },
    projectionDivider: {
        width: 1,
        height: 36,
        backgroundColor: '#e2e8f0',
    },
    projLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748b',
        marginBottom: 4,
    },
    projValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.4,
    },
    barContainer: {
        marginTop: 4,
    },
    barBackground: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#e2e8f0',
        position: 'relative',
        justifyContent: 'center',
    },
    barFill: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ea580c',
    },
    barThumb: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#0f172a',
        marginLeft: -6,
    },
    barLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    barText: {
        fontSize: 11,
        color: '#94a3b8',
        fontWeight: '500',
    },
    barTextHighlighted: {
        fontSize: 11,
        color: '#0f172a',
        fontWeight: '700',
    },
    reasonsCard: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    reasonsList: {
        gap: 12,
    },
    reasonRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    reasonCheck: {
        marginRight: 10,
        marginTop: 2,
    },
    reasonText: {
        flex: 1,
        fontSize: 14,
        color: '#334155',
        lineHeight: 20,
        fontWeight: '500',
    },
    actionContainer: {
        gap: 12,
    },
    primaryActionButton: {
        backgroundColor: '#0f172a',
        borderRadius: 24,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    primaryActionText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    secondaryActionButton: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryActionText: {
        color: '#0f172a',
        fontSize: 15,
        fontWeight: '600',
    },
});
