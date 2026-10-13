import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExpenseProvider } from '@/context/ExpenseContext';
import { SideMenuProvider } from '@/components/SideMenu';
import { AuthProvider } from '@/context/AuthContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
      <ExpenseProvider>
        <SideMenuProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-expense" />
            <Stack.Screen name="add-income" />
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
          </Stack>
        </SideMenuProvider>
      </ExpenseProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
