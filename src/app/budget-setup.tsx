import { BudgetSliderCard } from '@/components/budget/budget-slider-card';
import { useBudget } from '@/context/budget-context';
import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function BudgetSetupScreen() {
    const router = useRouter();
    const { budgetProfile, updateBudgetProfile } = useBudget();

    //başlangıç cdeğeri contexxt içinden alıncak

    const [income, setIncome] = useState(budgetProfile.monthlyIncome || 45400);
    const [fixedExpenses, setFixedExpenses] = useState(budgetProfile.fixedExpenses || 18500);
    const [savingsGoal, setSavingsGoal] = useState(budgetProfile.savingsGoal || 6000);

    //devam eet butonuna basılığında
    const handleContinue = () => {
        //contexten hafızasını gğncelle
        updateBudgetProfile({
            monthlyIncome: income,
            fixedExpenses: fixedExpenses,
            savingsGoal: savingsGoal,
        });

        //ana sekemlere yönlendir

        router.replace('/(tabs)' as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Üst Bar / Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Bütçeni Tanıyalım</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>
            {/* Kaydırılabilir İçerik Alanı */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* 1. Soru: Aylık Net Gelir */}
                <BudgetSliderCard
                    label="Aylık net gelirin nedir?"
                    value={income}
                    min={10000}
                    max={150000}
                    step={500}
                    minLabel="₺10.000"
                    maxLabel="₺150.000"
                    onChange={setIncome}
                />
                {/* 2. Soru: Aylık Sabit Giderler */}
                <BudgetSliderCard
                    label="Aylık sabit giderlerin toplamı?"
                    value={fixedExpenses}
                    min={5000}
                    max={80000}
                    step={500}
                    minLabel="₺5.000"
                    maxLabel="₺80.000"
                    onChange={setFixedExpenses}
                />
                {/* 3. Soru: Aylık Tasarruf Hedefi */}
                <BudgetSliderCard
                    label="Aylık tasarruf hedefin?"
                    value={savingsGoal}
                    min={1000}
                    max={50000}
                    step={500}
                    minLabel="₺1.000"
                    maxLabel="₺50.000"
                    onChange={setSavingsGoal}
                />
            </ScrollView>
            {/* Alt Sabit Buton */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleContinue}
                    activeOpacity={0.85}>
                    <Text style={styles.continueButtonText}>Devam Et</Text>
                </TouchableOpacity>
            </View>
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
        paddingVertical: 14,
        backgroundColor: '#f8fafc',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        letterSpacing: -0.4,
    },
    headerRightPlaceholder: {
        width: 40,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 24,
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    continueButton: {
        backgroundColor: '#0f172a',
        borderRadius: 28,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 4,
    },
    continueButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
});