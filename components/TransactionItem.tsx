import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '@/types/expense';
import { categoryIcons, colors } from '@/utils/theme';
import { formatDate } from '@/utils/storage';
import { useExpenses } from '@/context/ExpenseContext';

interface Props {
  item: Transaction;
  showDelete?: boolean;
}

export default function TransactionItem({ item, showDelete }: Props) {
  const { formatMoney, deleteTransaction } = useExpenses();
  const isIncome = item.type === 'income';
  const icon = (isIncome ? 'arrow-down-circle-outline' : categoryIcons[item.category ?? 'Other']) as keyof typeof Ionicons.glyphMap;

  const confirmDelete = () => {
    Alert.alert('Delete transaction', `Delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(item.id) },
    ]);
  };

  return (
    <View style={styles.row}>
      <View style={[styles.icon, { backgroundColor: isIncome ? colors.incomeSoft : colors.expenseSoft }]}>
        <Ionicons name={icon} size={20} color={isIncome ? colors.income : colors.expense} />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {isIncome ? 'Income' : item.category} · {formatDate(item.date)}
        </Text>
        {item.description ? <Text style={styles.desc} numberOfLines={1}>{item.description}</Text> : null}
      </View>
      <Text style={[styles.amount, { color: isIncome ? colors.income : colors.expense }]}>
        {isIncome ? '+' : '-'}{formatMoney(item.amount)}
      </Text>
      {showDelete && (
        <Pressable onPress={confirmDelete} hitSlop={10} style={styles.del} accessibilityLabel="Delete transaction">
          <Ionicons name="trash-outline" size={18} color={colors.muted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    padding: 12, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border,
  },
  icon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600', color: colors.text },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  desc: { fontSize: 12, color: colors.muted, marginTop: 2, fontStyle: 'italic' },
  amount: { fontSize: 15, fontWeight: '700', marginLeft: 8 },
  del: { marginLeft: 10, padding: 4 },
});
