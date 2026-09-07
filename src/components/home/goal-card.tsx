import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


interface GoalCardProps {
    target: number;
    gap: number;
    isBehind?: boolean;
}

export const GoalCard: React.FC<GoalCardProps> = ({
    target,
    gap,
    isBehind = true,
}) => {
    const formatCurrency = (val: number) => {
        return '₺' + val.toLocaleString('tr-TR');
    };

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.topRow}>
                    <Text style={styles.title}>Hedefine Uzaklık</Text>
                    <Ionicons name="trending-up" size={18} color="#d97706" />
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.gapText}>
                        {formatCurrency(gap)}{' '}
                        <Text style={styles.statusText}>
                            {isBehind ? 'geridesin' : 'öndesin'}
                        </Text>
                    </Text>
                    <Text style={styles.targetText}>
                        (hedef: {formatCurrency(target)})
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fffbeb',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#fef08a',
    },
    content: {},
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#92400e',
        letterSpacing: -0.2,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 6,
    },
    gapText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#78350f',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#b45309',
    },
    targetText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#a16207',
    },
});
