import { BudgetProvider } from '@/context/budget-context';
import { NotificationProvider } from '@/context/notification-context';
import { initSentry } from '@/services/sentry-service';
import { StorageService } from '@/services/storage-service';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { DarkTheme, DefaultTheme, Href, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

// Sentry'yi uygulamanın en erken noktasında başlat
initSentry();

const isExpoGoAndroid =
  Platform.OS === 'android' &&
  (Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    Constants.appOwnership === 'expo');

/** Deep link URL'ini parse eder, oturum açılmışsa hedef sayfaya gider
 *  aksi hâlde login ekranına yönlendirir. */
async function navigateWithAuthGuard(url: string, router: ReturnType<typeof useRouter>) {
  let path = url.replace('kararos://', '');
  if (!path.startsWith('/')) path = '/' + path;

  try {
    const { token } = await StorageService.getAuthSession();
    if (token) {
      router.push(path as Href);
    } else {
      // Giriş yoksa login'e yönlendir; login başarılı olursa returnTo ile geri dönülür
      router.replace((`/auth?mode=login&returnTo=${encodeURIComponent(path)}`) as Href);
    }
  } catch {
    router.replace('/auth?mode=login' as Href);
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Kilit ekranı bildirimine tıklanıldığında ilgili sayfaya gitme
  useEffect(() => {
    if (isExpoGoAndroid || Platform.OS === 'web') return;

    let subscription: any;
    try {
      const Notifications = require('expo-notifications');
      if (Notifications && typeof Notifications.addNotificationResponseReceivedListener === 'function') {
        subscription = Notifications.addNotificationResponseReceivedListener((response: any) => {
          const route = response?.notification?.request?.content?.data?.route;
          if (route) {
            router.push(route as Href);
          }
        });
      }
    } catch {
      // Expo Go fallback
    }

    // Uygulama açıkken veya arka plandayken gelen derin bağlantıları (örn: Widget) anında yakala
    const handleDeepLink = (event: { url: string }) => {
      const url = event?.url;
      if (url && url.includes('kararos://')) {
        setTimeout(() => {
          navigateWithAuthGuard(url, router);
        }, 100);
      }
    };

    // Uygulama kapalıyken (cold start) widget ile açıldıysa
    require('react-native').Linking.getInitialURL().then((initUrl: string | null) => {
      if (initUrl && initUrl.includes('kararos://')) {
        setTimeout(() => {
          navigateWithAuthGuard(initUrl, router);
        }, 300);
      }
    });

    const linkSub = require('react-native').Linking.addEventListener('url', handleDeepLink);

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
      if (linkSub && typeof linkSub.remove === 'function') {
        linkSub.remove();
      }
    };
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BudgetProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="index" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="budget-setup" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="decision/result" options={{ presentation: 'card' }} />
            <Stack.Screen name="decision/saved" options={{ presentation: 'card' }} />
          </Stack>
          <StatusBar style="auto" />
        </NotificationProvider>
      </BudgetProvider>
    </ThemeProvider>
  );
}
