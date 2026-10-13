import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '@/context/ExpenseContext';
import SummaryCard from '@/components/SummaryCard';
import TransactionItem from '@/components/TransactionItem';
import { colors } from '@/utils/theme';

export default function Dashboard() {
  const router = useRouter();
  const { totals, transactions, formatMoney, loading } = useExpenses();

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Your money at a glance</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total balance</Text>
          <Text style={styles.balanceValue} numberOfLines={1} adjustsFontSizeToFit>
            {formatMoney(totals.balance)}
          </Text>
          <Text style={styles.monthText}>This month's spending: {formatMoney(totals.monthSpending)}</Text>
        </View>

        <View style={styles.row}>
          <SummaryCard label="Total income" value={formatMoney(totals.income)} icon="trending-up"
            color={colors.income} bg={colors.incomeSoft} />
          <SummaryCard label="Total expenses" value={formatMoney(totals.expenses)} icon="trending-down"
            color={colors.expense} bg={colors.expenseSoft} />
        </View>

        <View style={styles.row}>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.expense }]} onPress={() => router.push('/add-expense')}>
            <Ionicons name="remove-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Add Expense</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.income }]} onPress={() => router.push('/add-income')}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.actionText}>Add Income</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent transactions</Text>
          <Link href="/transactions" style={styles.seeAll}>See all</Link>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="wallet-outline" size={40} color={colors.muted} />
            <Text style={styles.emptyText}>No transactions yet. Add your first one!</Text>
          </View>
        ) : (
          transactions.slice(0, 5).map((t) => <TransactionItem key={t.id} item={t} />)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 18 },
  balanceCard: { backgroundColor: colors.primary, borderRadius: 20, padding: 20, marginBottom: 14 },
  balanceLabel: { color: '#CCFBF1', fontSize: 14 },
  balanceValue: { color: '#fff', fontSize: 36, fontWeight: '800', marginVertical: 6 },
  monthText: { color: '#CCFBF1', fontSize: 13 },
  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14 },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  seeAll: { color: colors.primary, fontWeight: '600' },
  empty: { alignItems: 'center', padding: 30, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  emptyText: { color: colors.muted, marginTop: 8, textAlign: 'center' },
});
