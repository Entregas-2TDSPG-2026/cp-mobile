import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#6d5dfc',
        headerShown: true,
        tabBarStyle: { height: 72, paddingBottom: 10, paddingTop: 8, borderTopWidth: 0, backgroundColor: colorScheme === 'dark' ? '#1b192b' : '#fff', elevation: 12 },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        headerStyle: { backgroundColor: colorScheme === 'dark' ? '#121020' : '#f6f5fb' },
        headerShadowVisible: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Descobrir',
          tabBarIcon: ({ color }) => <SymbolView name="cart" fallback="P" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Minha conta',
          tabBarIcon: ({ color }) => <SymbolView name="person" fallback="C" tintColor={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
