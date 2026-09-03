import { FeatureItem } from '@/constants/onboarding-data';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface FeatureCardProps {
    item: FeatureItem;
}

export function FeatureCard({ item }: FeatureCardProps) {
    const renderIcon = () => {
        const iconColor = '#16a34a';
        const iconSize = 19;

        switch (item.iconFamily) {
            case 'material':
                return <MaterialCommunityIcons name={item.iconName as any} size={iconSize} color={iconColor} />;
            case 'feather':
                return <Feather name={item.iconName as any} size={iconSize} color={iconColor} />;
            case 'ionicons':
            default:
                return <Ionicons name={item.iconName as any} size={iconSize} color={iconColor} />;
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>{renderIcon()}</View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 6,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 3,
        elevation: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#eaf8f1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 13,
        fontWeight: '700',
        color: '#0b1a30',
        marginBottom: 1,
        letterSpacing: -0.2,
    },
    description: {
        fontSize: 11,
        color: '#64748b',
        lineHeight: 14.5,
    },
});
