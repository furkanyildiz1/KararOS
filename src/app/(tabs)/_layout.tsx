import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f172a',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}>
      {/* 1. Sekme: Ana Sayfa */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'grid' : 'grid-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 2. Sekme: Kararlar */}
      <Tabs.Screen
        name="decide"
        options={{
          title: 'Kararlar',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'scale' : 'scale-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 3. Sekme: Geçmiş */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'Geçmiş',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'time' : 'time-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 4. Sekme: Hedefler */}
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Hedefler',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'flag' : 'flag-outline'}
              size={20}
              color={color}
            />
          ),
        }}
      />

      {/* 5. Sekme: Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'options' : 'person-circle'}
              size={20}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopColor: '#f1f5f9',
    borderTopWidth: 1,
    height: 62,
    paddingBottom: 8,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 1,
  },
});
