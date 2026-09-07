import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InsightItem {
    id: string;
    iconName: keyof typeof Ionicons.glyphMap;
    text: string;
    iconColor?: string;
    iconBgColor?: string;
}

const DEFAULT_INSIGHTS: InsightItem[] = [
    {
        id: 'ins-1',
        iconName: 'restaurant-outline',
        text: 'Geçen aya göre restoran harcaman arttı.',
        iconColor: '#059669',
        iconBgColor: '#ecfdf5',
    },
    {
        id: 'ins-2',
        iconName: 'sparkles-outline',
        text: 'Eğlence harcamalarında %28 düşüş var.',
        iconColor: '#0d9488',
        iconBgColor: '#f0fdfa',
    },
];

export const InsightsSection: React.FC<{ insights?: InsightItem[] }> = ({
    insights = DEFAULT_INSIGHTS,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Kısa İçgörüler</Text>

            <View style={styles.list}>
                {insights.map((item) => (
                    <View key={item.id} style={styles.insightCard}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: item.iconBgColor || '#ecfdf5' },
                            ]}>
                            <Ionicons
                                name={item.iconName}
                                size={18}
                                color={item.iconColor || '#059669'}
                            />
                        </View>
                        <Text style={styles.insightText}>{item.text}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 12,
        letterSpacing: -0.2,
    },
    list: {
        gap: 10,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    insightText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        lineHeight: 20,
    },
});
