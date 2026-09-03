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
                <Ionicons name="chevron-forward" size={18} color="#ffffff" />
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
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 16,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    paginationDots: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    activeDot: {
        backgroundColor: '#0b1a30',
        width: 8,
        height: 8,
    },
    inactiveDot: {
        backgroundColor: '#cbd5e1',
    },
    stepText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '600',
        marginBottom: 10,
    },
    primaryButton: {
        width: '100%',
        backgroundColor: '#0b1a30',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 6,
        shadowColor: '#0b1a30',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 15.5,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    loginContainer: {
        marginTop: 8,
        paddingVertical: 2,
    },
    loginText: {
        fontSize: 12.5,
        color: '#64748b',
    },
    loginBold: {
        fontWeight: '700',
        color: '#0b1a30',
    },
    placeholderSpace: {
        height: 24,
    },
});
