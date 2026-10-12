import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';

import { useColorScheme } from '@/components/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#2f95dc',
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Produtos',
          tabBarIcon: ({ color }) => <SymbolView name="cart" fallback="P" tintColor={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color }) => <SymbolView name="person" fallback="C" tintColor={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
