import { StyleSheet, Text, View } from 'react-native';

interface OnboardingHeaderProps {
    title: string;
    description: string;
}

export function OnboardingHeader({ title, description }: OnboardingHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Logo */}
            <View style={styles.logoContainer}>
                <Text style={styles.logoKarar}>Karar</Text>
                <Text style={styles.logoOS}>OS</Text>
            </View>

            {/* Başlık */}
            <Text style={styles.title}>{title}</Text>

            {/* Açıklama */}
            <Text style={styles.description}>{description}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 8,
        marginBottom: 4,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    logoKarar: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0b1a30',
        letterSpacing: -0.5,
    },
    logoOS: {
        fontSize: 24,
        fontWeight: '800',
        color: '#16a34a',
        letterSpacing: -0.5,
    },
    title: {
        fontSize: 21,
        fontWeight: '800',
        color: '#0b1a30',
        textAlign: 'center',
        lineHeight: 26,
        letterSpacing: -0.3,
        marginBottom: 6,
    },
    description: {
        fontSize: 12.5,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 17.5,
        paddingHorizontal: 8,
    },
});
