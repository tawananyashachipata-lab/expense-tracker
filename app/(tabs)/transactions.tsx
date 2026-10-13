import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useExpenses } from '@/context/ExpenseContext';
import TransactionItem from '@/components/TransactionItem';
import { colors } from '@/utils/theme';

type Filter = 'all' | 'expense' | 'income';

export default function Transactions() {
  const { transactions } = useExpenses();
  const [filter, setFilter] = useState<Filter>('all');

  const data = useMemo(
    () => (filter === 'all' ? transactions : transactions.filter((t) => t.type === filter)),
    [transactions, filter],
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.filters}>
          {(['all', 'expense', 'income'] as Filter[]).map((f) => (
            <Pressable key={f} onPress={() => setFilter(f)} style={[styles.filter, filter === f && styles.filterActive]}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'expense' ? 'Expenses' : 'Income'}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      <FlatList
        data={data}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => <TransactionItem item={item} showDelete />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={40} color={colors.muted} />
            <Text style={styles.emptyText}>No transactions to show.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 20 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filter: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  filterActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.text, fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { alignItems: 'center', padding: 40 },
  emptyText: { color: colors.muted, marginTop: 8 },
});
