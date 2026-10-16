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

    // Ekranın yüksekliğine göre oranlı hesaplama:
    // Çok küçük ekranlarda (örn: 640px altı) 130-150px
    // Normal telefonlarda (640-780px) 160-180px
    // Büyük ekranlarda (780px+) maksimum 220px
    const heroHeight = height < 640 
        ? Math.round(height * 0.20) 
        : height < 750 
        ? Math.round(height * 0.22) 
        : Math.min(220, Math.round(height * 0.25));

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
