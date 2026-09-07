import { Href, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FeatureCard } from '@/components/onboarding/feature-card';
import { OnboardingFooter } from '@/components/onboarding/onboarding-footer';
import { OnboardingHeader } from '@/components/onboarding/onboarding-header';
import { OnboardingHero } from '@/components/onboarding/onboarding-hero';
import { ONBOARDING_DATA, OnboardingSlide } from '@/constants/onboarding-data';

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const flatListRef = useRef<FlatList<OnboardingSlide>>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / width);
    if (index !== currentIndex && index >= 0 && index < ONBOARDING_DATA.length) {
      setCurrentIndex(index);
    }
  };

  const handleNext = () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push('/budget-setup' as Href);
    }
  };

  const handleLogin = () => {
    router.push('/budget-setup' as Href);
  };

  const renderSlideItem = ({
    item,
    index,
  }: {
    item: OnboardingSlide;
    index: number;
  }) => (
    <View style={[styles.slide, { width }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}>
        {/* 1. Üst Kısım: Logo ve Başlıklar */}
        <OnboardingHeader title={item.title} description={item.description} />

        {/* 2. Orta Kısım: Büyütülmüş ve Net Görseller */}
        <OnboardingHero slideIndex={index} />

        {/* 3. Alt Özellik Kartları */}
        <View style={styles.featuresList}>
          {item.features.map((feature) => (
            <FeatureCard key={feature.id} item={feature} />
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderSlideItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        keyExtractor={(item) => item.id}
        bounces={false}
        style={styles.flatList}
      />

      <OnboardingFooter
        currentIndex={currentIndex}
        totalSteps={ONBOARDING_DATA.length}
        buttonText={ONBOARDING_DATA[currentIndex].buttonText}
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
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
  },
  featuresList: {
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
  },
});
