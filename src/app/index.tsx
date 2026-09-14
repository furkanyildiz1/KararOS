import { StorageService } from '@/services/storage-service';
import { Href, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function InitialSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    async function checkNavigationTarget() {
      try {
        const hasSeenOnboarding = await StorageService.hasSeenOnboarding();
        const { token, rememberMe } = await StorageService.getAuthSession();

        // 600ms zarif logo hissi vermek için ufak bir bekleme
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (!hasSeenOnboarding) {
          router.replace('/onboarding' as Href);
        } else if (rememberMe && token) {
          router.replace('/(tabs)' as Href);
        } else {
          // Beni hatırla SEÇİLMEMİŞSE oturum tokenı temizlenir, kullanıcı şifresiyle giriş yapmaya zorlanır
          if (!rememberMe) {
            await StorageService.clearAuth();
          }
          router.replace('/auth?mode=login' as Href);
        }
      } catch {
        router.replace('/auth' as Href);
      }
    }

    checkNavigationTarget();
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Image
          source={require('@/../assets/images/kararos-logo.png')}
          style={styles.logo}
          resizeMode="cover"
        />
        <Text style={styles.title}>KararOS</Text>
      </View>
      <ActivityIndicator size="small" color="#059669" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  loader: {
    marginTop: 28,
  },
});
