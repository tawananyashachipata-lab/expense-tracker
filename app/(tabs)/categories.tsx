import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useExpenses } from '@/context/ExpenseContext';
import CategoryCard from '@/components/CategoryCard';
import { colors } from '@/utils/theme';

export default function Categories() {
  const { categoryTotals, totals, formatMoney } = useExpenses();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total spent</Text>
          <Text style={styles.totalValue}>{formatMoney(totals.expenses)}</Text>
        </View>
        {categoryTotals.map(({ category, total }) => (
          <CategoryCard
            key={category}
            category={category}
            amount={formatMoney(total)}
            percent={totals.expenses > 0 ? (total / totals.expenses) * 100 : 0}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  totalCard: { backgroundColor: colors.expenseSoft, borderRadius: 16, padding: 16, marginBottom: 16 },
  totalLabel: { color: colors.expense, fontSize: 13, fontWeight: '600' },
  totalValue: { color: colors.expense, fontSize: 26, fontWeight: '800', marginTop: 4 },
});
