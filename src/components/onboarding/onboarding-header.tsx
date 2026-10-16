import { moderateScale, verticalScale } from '@/utils/responsive';
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
            <Text style={styles.title} numberOfLines={2} adjustsFontSizeToFit>
                {title}
            </Text>

            {/* Açıklama */}
            <Text style={styles.description} numberOfLines={3} adjustsFontSizeToFit>
                {description}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: moderateScale(10),
        marginBottom: verticalScale(4),
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    logoKarar: {
        fontSize: moderateScale(22),
        fontWeight: '800',
        color: '#0b1a30',
        letterSpacing: -0.5,
    },
    logoOS: {
        fontSize: moderateScale(22),
        fontWeight: '800',
        color: '#16a34a',
        letterSpacing: -0.5,
    },
    title: {
        fontSize: moderateScale(19),
        fontWeight: '800',
        color: '#0b1a30',
        textAlign: 'center',
        lineHeight: moderateScale(24),
        letterSpacing: -0.3,
        marginBottom: verticalScale(4),
    },
    description: {
        fontSize: moderateScale(12),
        color: '#64748b',
        textAlign: 'center',
        lineHeight: moderateScale(16),
        paddingHorizontal: moderateScale(6),
    },
});
