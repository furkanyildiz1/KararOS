import { GoalCard } from '@/components/home/goal-card';
import { InsightsSection } from '@/components/home/insights-section';
import { SummaryCard } from '@/components/home/summary-card';
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

export default function HomeScreen() {
    const router = useRouter();
    const {
        budgetProfile,
        availableBudget,
        budgetUsagePercent,
        savingsProgress,
    } = useBudget();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {/* Üst Karşılama Başlığı */}
                <View style={styles.header}>
                    <Text style={styles.greetingTitle}>Merhaba, 👋</Text>
                </View>

                {/* 1. Bu Ayın Özeti Kartı */}
                <SummaryCard
                    totalSpending={budgetProfile.currentSpending}
                    availableBudget={availableBudget}
                    usagePercent={budgetUsagePercent}
                    dateRange="1-11 Mayıs"
                />

                {/* 2. Hedefine Uzaklık Kartı */}
                <GoalCard
                    target={savingsProgress.target}
                    gap={savingsProgress.gap}
                    isBehind={savingsProgress.isBehind}
                />

                {/* 3. Kısa İçgörüler */}
                <InsightsSection />

                {/* 4. En Görünür Aksiyon: + Yeni Karar Sor */}
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push('/(tabs)/decide' as Href)}
                    activeOpacity={0.85}>
                    <Ionicons name="add" size={22} color="#ffffff" style={styles.buttonIcon} />
                    <Text style={styles.actionButtonText}>Yeni Karar Sor</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 28,
    },
    header: {
        marginBottom: 16,
    },
    greetingTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    actionButton: {
        backgroundColor: '#059669',
        borderRadius: 24,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#059669',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
        marginTop: 4,
    },
    buttonIcon: {
        marginRight: 6,
    },
    actionButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
});
