import { BudgetProvider } from '@/context/budget-context';
import { NotificationProvider } from '@/context/notification-context';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { DarkTheme, DefaultTheme, Href, Stack, ThemeProvider, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, useColorScheme } from 'react-native';

const isExpoGoAndroid =
  Platform.OS === 'android' &&
  (Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
    Constants.appOwnership === 'expo');

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

    return () => {
      if (subscription && typeof subscription.remove === 'function') {
        subscription.remove();
      }
    };
  }, [router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BudgetProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
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
