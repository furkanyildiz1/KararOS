import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';

interface OnboardingHeroProps {
    slideIndex: number;
}

const HERO_IMAGES = [
    require('@/assets/images/onboarding/hero-1.png'),
    require('@/assets/images/onboarding/hero-2.png'),
    require('@/assets/images/onboarding/hero-3.png'),
];

export function OnboardingHero({ slideIndex }: OnboardingHeroProps) {
    const { height } = useWindowDimensions();

    // Ekranın yüksekliğine göre resmi maksimum boyutta açıyoruz
    const heroHeight = Math.min(Math.max(height * 0.38, 260), 380);

    return (
        <View style={[styles.container, { height: heroHeight }]}>
            <Image
                source={HERO_IMAGES[slideIndex]}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 6,
        flex: 1, // Kalan tüm alanı doldurur
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
