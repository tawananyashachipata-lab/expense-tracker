import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Pressable } from 'react-native';
import { useSideMenu } from '@/components/SideMenu';
import { Ionicons } from '@expo/vector-icons';
import type { ColorValue } from 'react-native';
import { colors } from '@/utils/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const tabIcon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) => (
  <Ionicons name={name} size={size} color={color} />
);

export default function TabLayout() {
  const menu = useSideMenu();
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Redirect href="/sign-in" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.bg },
        headerShadowVisible: false,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerLeft: () => (
          <Pressable onPress={menu.open} accessibilityLabel="Open navigation menu" hitSlop={10} style={{ marginLeft: 16 }}>
            <Ionicons name="menu" size={26} color={colors.text} />
          </Pressable>
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: tabIcon('home-outline') }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions', tabBarIcon: tabIcon('list-outline') }} />
      <Tabs.Screen name="add" options={{ title: 'Add', tabBarIcon: tabIcon('add-circle-outline') }} />
      <Tabs.Screen name="categories" options={{ title: 'Categories', tabBarIcon: tabIcon('pie-chart-outline') }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: tabIcon('settings-outline') }} />
    </Tabs>
  );
}