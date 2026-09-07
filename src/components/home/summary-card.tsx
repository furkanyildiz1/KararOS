import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SummaryCardProps {
    totalSpending: number;
    availableBudget: number;
    usagePercent: number;
    dateRange?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
    totalSpending,
    availableBudget,
    usagePercent,
    dateRange = '1-11 Mayıs',
}) => {
    const formatCurrency = (val: number) => {
        return '₺' + val.toLocaleString('tr-TR');
    };

    return (
        <View style={styles.card}>
            {/* Üst Başlık & Tarih Rozeti */}
            <View style={styles.headerRow}>
                <Text style={styles.cardTitle}>Bu Ayın Özeti</Text>
                <View style={styles.dateBadge}>
                    <Text style={styles.dateBadgeText}>{dateRange}</Text>
                </View>
            </View>

            {/* İçerik: Sol Tutar Bilgileri & Sağ Dairesel Gösterge */}
            <View style={styles.contentRow}>
                <View style={styles.leftColumn}>
                    <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Toplam Harcama</Text>
                        <Text style={styles.metricValue}>
                            {formatCurrency(totalSpending)}
                        </Text>
                    </View>

                    <View style={[styles.metricItem, { marginTop: 14 }]}>
                        <Text style={styles.metricLabel}>Kalan Bütçe</Text>
                        <Text style={[styles.metricValue, styles.availableValue]}>
                            {formatCurrency(availableBudget)}
                        </Text>
                    </View>
                </View>

                {/* Sağ: %47 Bütçe Kullanımı Dairesel Göstergesi */}
                <View style={styles.chartWrapper}>
                    <View style={styles.outerCircle}>
                        <View style={styles.innerCircle}>
                            <Text style={styles.percentText}>%{usagePercent}</Text>
                            <Text style={styles.percentSubtext}>Bütçe{'\n'}Kullanımı</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#0a192f',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#0a192f',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 6,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
    },
    cardTitle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.3,
    },
    dateBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    dateBadgeText: {
        color: '#cbd5e1',
        fontSize: 12,
        fontWeight: '500',
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftColumn: {
        flex: 1,
    },
    metricItem: {},
    metricLabel: {
        color: '#94a3b8',
        fontSize: 13,
        fontWeight: '500',
        marginBottom: 4,
    },
    metricValue: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    availableValue: {
        color: '#38bdf8',
    },
    chartWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    outerCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 6,
        borderColor: '#10b981',
        borderTopColor: '#059669',
        borderRightColor: '#34d399',
        borderBottomColor: '#047857',
        borderLeftColor: '#064e3b',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.08)',
    },
    innerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    percentSubtext: {
        color: '#94a3b8',
        fontSize: 9,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 1,
        lineHeight: 11,
    },
});
