import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, Category, TransactionType } from '@/types/expense';
import { useExpenses } from '@/context/ExpenseContext';
import { categoryIcons, colors } from '@/utils/theme';
import { isValidISODate, todayISO } from '@/utils/storage';

export default function TransactionForm({ type }: { type: TransactionType }) {
  const router = useRouter();
  const { addTransaction } = useExpenses();
  const isExpense = type === 'expense';
  const accent = isExpense ? colors.expense : colors.income;

  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const value = parseFloat(amount.replace(',', '.'));
    if (!value || value <= 0) return Alert.alert('Invalid amount', 'Please enter an amount greater than 0.');
    if (!title.trim()) return Alert.alert('Missing title', 'Please enter a title.');
    if (!isValidISODate(date)) return Alert.alert('Invalid date', 'Use the format YYYY-MM-DD, e.g. 2026-10-05.');
    setSaving(true);
    await addTransaction({
      type,
      amount: Math.round(value * 100) / 100,
      title: title.trim(),
      category: isExpense ? category : undefined,
      date,
      description: description.trim() || undefined,
    });
    setSaving(false);
    router.replace('/transactions');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} hitSlop={10}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
            <Text style={styles.heading}>{isExpense ? 'Add Expense' : 'Add Income'}</Text>
          </View>

          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, styles.amountInput, { color: accent }]}
            value={amount} onChangeText={setAmount} keyboardType="decimal-pad"
            placeholder="0.00" placeholderTextColor={colors.muted}
          />

          <Text style={styles.label}>{isExpense ? 'Expense title' : 'Income title'}</Text>
          <TextInput
            style={styles.input} value={title} onChangeText={setTitle}
            placeholder={isExpense ? 'e.g. Lunch' : 'e.g. Salary'} placeholderTextColor={colors.muted}
          />

          {isExpense && (
            <>
              <Text style={styles.label}>Category</Text>
              <View style={styles.chips}>
                {CATEGORIES.map((c) => {
                  const active = c === category;
                  return (
                    <Pressable key={c} onPress={() => setCategory(c)}
                      style={[styles.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}>
                      <Ionicons name={categoryIcons[c] as keyof typeof Ionicons.glyphMap} size={14}
                        color={active ? '#fff' : colors.muted} />
                      <Text style={[styles.chipText, active && { color: '#fff' }]}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
          <TextInput
            style={styles.input} value={date} onChangeText={setDate}
            placeholder="2026-10-05" placeholderTextColor={colors.muted} maxLength={10}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, { height: 90, textAlignVertical: 'top' }]} value={description}
            onChangeText={setDescription} multiline placeholder="Add a note" placeholderTextColor={colors.muted}
          />

          <Pressable onPress={save} disabled={saving}
            style={({ pressed }) => [styles.saveBtn, { backgroundColor: accent, opacity: pressed || saving ? 0.8 : 1 }]}>
            <Text style={styles.saveText}>{isExpense ? 'Save Expense' : 'Save Income'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text },
  label: { fontSize: 13, fontWeight: '600', color: colors.muted, marginBottom: 6, marginTop: 14 },
  input: {
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: colors.text,
  },
  amountInput: { fontSize: 28, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card,
  },
  chipText: { fontSize: 13, color: colors.text, fontWeight: '500' },
  saveBtn: { marginTop: 28, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
