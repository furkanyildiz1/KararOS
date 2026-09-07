import { BudgetProvider } from '@/context/budget-context';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <BudgetProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="budget-setup" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="decision/result" options={{ presentation: 'card' }} />
          <Stack.Screen name="decision/saved" options={{ presentation: 'card' }} />
        </Stack>
        <StatusBar style="auto" />
      </BudgetProvider>
    </ThemeProvider>
  );
}
