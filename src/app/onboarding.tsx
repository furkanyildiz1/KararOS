import { FeatureCard } from '@/components/onboarding/feature-card';
import { OnboardingFooter } from '@/components/onboarding/onboarding-footer';
import { OnboardingHeader } from '@/components/onboarding/onboarding-header';
import { OnboardingHero } from '@/components/onboarding/onboarding-hero';
import { ONBOARDING_DATA } from '@/constants/onboarding-data';
import { StorageService } from '@/services/storage-service';
import { Href, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OnboardingScreen() {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);

    const currentSlide = ONBOARDING_DATA[currentIndex];
    const totalSteps = ONBOARDING_DATA.length;

    // İlerle / Başlayalım Butonu
    const handleNext = async () => {
        if (currentIndex < totalSteps - 1) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            await StorageService.setOnboardingCompleted();
            router.replace('/auth' as Href);
        }
    };

    // Zaten hesabım var -> Giriş Yap'a tıklandığında
    const handleLogin = async () => {
        await StorageService.setOnboardingCompleted();
        router.replace({ pathname: '/auth', params: { mode: 'login' } } as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>
                {/* 1. Üst Logo, Başlık ve Açıklama */}
                <OnboardingHeader
                    title={currentSlide.title}
                    description={currentSlide.description}
                />

                {/* 2. Hero İllüstrasyonu (hero-1, hero-2, hero-3) */}
                <OnboardingHero slideIndex={currentIndex} />

                {/* 3. Özellik Kartları */}
                <View style={styles.featuresContainer}>
                    {currentSlide.features.map((feature) => (
                        <FeatureCard key={feature.id} item={feature} />
                    ))}
                </View>
            </ScrollView>

            {/* 4. Alt Sayfalama Noktaları ve Aksiyon Butonları */}
            <OnboardingFooter
                currentIndex={currentIndex}
                totalSteps={totalSteps}
                buttonText={currentSlide.buttonText}
                onNext={handleNext}
                onLogin={handleLogin}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 20,
    },
    featuresContainer: {
        marginTop: 6,
    },
});
