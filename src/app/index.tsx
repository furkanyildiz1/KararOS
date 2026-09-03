import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function HomeScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>KararOS</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Doğru ve hızlı kararlar almak için akıllı asistanınız.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Başlamaya Hazır! 🚀</Text>
          <Text style={[styles.cardDescription, { color: theme.textSecondary }]}>
            Gereksiz şablon dosyaları temizlendi. Ekranlarınızı ve özelliklerinizi geliştirmeye başlayabilirsiniz.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 32,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(150, 150, 150, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.15)',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});
