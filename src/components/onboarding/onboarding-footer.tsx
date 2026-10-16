import { moderateScale, verticalScale } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OnboardingFooterProps {
    currentIndex: number;
    totalSteps: number;
    buttonText: string;
    onNext: () => void;
    onLogin?: () => void;
}

export function OnboardingFooter({
    currentIndex,
    totalSteps,
    buttonText,
    onNext,
    onLogin,
}: OnboardingFooterProps) {
    const isLastSlide = currentIndex === totalSteps - 1;

    return (
        <View style={styles.footerContainer}>
            {/* Sayfalama Noktaları */}
            <View style={styles.paginationDots}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            currentIndex === index ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>

            {/* Sayfa Sayacı */}
            <Text style={styles.stepText}>
                {currentIndex + 1} / {totalSteps}
            </Text>

            {/* Devam / Başlayalım Butonu */}
            <TouchableOpacity
                activeOpacity={0.85}
                onPress={onNext}
                style={styles.primaryButton}>
                <Text style={styles.buttonText}>{buttonText}</Text>
                <Ionicons name="chevron-forward" size={moderateScale(16)} color="#ffffff" />
            </TouchableOpacity>

            {/* Giriş Yap / Boşluk */}
            {isLastSlide ? (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={onLogin}
                    style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                        Zaten hesabın var mı? <Text style={styles.loginBold}>Giriş Yap</Text>
                    </Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.placeholderSpace} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    footerContainer: {
        paddingHorizontal: moderateScale(20),
        paddingTop: verticalScale(6),
        paddingBottom: verticalScale(12),
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    paginationDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: moderateScale(6),
        marginBottom: verticalScale(2),
    },
    dot: {
        width: moderateScale(6),
        height: moderateScale(6),
        borderRadius: moderateScale(3),
    },
    activeDot: {
        backgroundColor: '#0b1a30',
        width: moderateScale(7),
        height: moderateScale(7),
    },
    inactiveDot: {
        backgroundColor: '#cbd5e1',
    },
    stepText: {
        fontSize: moderateScale(11),
        color: '#64748b',
        fontWeight: '600',
        marginBottom: verticalScale(6),
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#0b1a30',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(11),
        borderRadius: moderateScale(12),
        gap: moderateScale(6),
        shadowColor: '#0b1a30',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
        elevation: 2,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: moderateScale(14),
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    loginContainer: {
        marginTop: verticalScale(6),
        paddingVertical: verticalScale(2),
    },
    loginText: {
        fontSize: moderateScale(12),
        color: '#64748b',
    },
    loginBold: {
        fontWeight: '700',
        color: '#0b1a30',
    },
    placeholderSpace: {
        height: verticalScale(18),
    },
});
