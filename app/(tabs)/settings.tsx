import React from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useExpenses } from '@/context/ExpenseContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { CURRENCIES } from '@/types/expense';
import { colors } from '@/utils/theme';

export default function Settings() {
  const { currency, setCurrency, clearAll, transactions } = useExpenses();
  const { user, signOut } = useAuth();
  const router = useRouter();

  const confirmSignOut = () =>
    Alert.alert('Sign out', 'Do you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: async () => { await signOut(); router.replace('/sign-in'); } },
    ]);

  const confirmClear = () => {
    if (transactions.length === 0) return Alert.alert('Nothing to clear', 'You have no transactions.');
    Alert.alert('Clear all transactions', 'This permanently deletes all your expenses and income. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear all', style: 'destructive', onPress: () => clearAll() },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>Account</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.divider]}>
            <Text style={styles.rowText}>{user?.name}</Text>
            <Text style={styles.muted}>{user?.email}</Text>
          </View>
          <Pressable style={styles.row} onPress={confirmSignOut}>
            <Text style={[styles.rowText, { color: colors.expense }]}>Sign out</Text>
            <Ionicons name="log-out-outline" size={20} color={colors.expense} />
          </Pressable>
        </View>

        <Text style={styles.section}>Currency</Text>
        <View style={styles.card}>
          {CURRENCIES.map((c, i) => (
            <Pressable key={c.code} onPress={() => setCurrency(c.code)}
              style={[styles.row, i < CURRENCIES.length - 1 && styles.divider]}>
              <Text style={styles.rowText}>{c.code} ({c.symbol})</Text>
              {currency === c.code && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
            </Pressable>
          ))}
        </View>

        <Text style={styles.section}>Data</Text>
        <Pressable style={[styles.card, styles.row]} onPress={confirmClear}>
          <Text style={[styles.rowText, { color: colors.expense }]}>Clear all transactions</Text>
          <Ionicons name="trash-outline" size={20} color={colors.expense} />
        </Pressable>

        <Text style={styles.section}>About</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.divider]}>
            <Text style={styles.rowText}>App</Text><Text style={styles.muted}>Expense Tracker</Text>
          </View>
          <View style={[styles.row, styles.divider]}>
            <Text style={styles.rowText}>Version</Text>
            <Text style={styles.muted}>{Constants.expoConfig?.version ?? '1.0.0'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowText}>Storage</Text><Text style={styles.muted}>Offline, on this phone</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  section: { fontSize: 13, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', marginTop: 20, marginBottom: 8 },
  card: { backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { fontSize: 15, color: colors.text, fontWeight: '500' },
  muted: { fontSize: 14, color: colors.muted },
});
