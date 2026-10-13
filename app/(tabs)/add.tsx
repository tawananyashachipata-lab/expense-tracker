import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/utils/theme';

export default function Add() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.subtitle}>What would you like to record?</Text>

        <Pressable style={[styles.option, { borderColor: colors.expense }]} onPress={() => router.push('/add-expense')}>
          <View style={[styles.icon, { backgroundColor: colors.expenseSoft }]}>
            <Ionicons name="arrow-up-circle-outline" size={28} color={colors.expense} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optTitle}>Add Expense</Text>
            <Text style={styles.optDesc}>Money you spent</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>

        <Pressable style={[styles.option, { borderColor: colors.income }]} onPress={() => router.push('/add-income')}>
          <View style={[styles.icon, { backgroundColor: colors.incomeSoft }]}>
            <Ionicons name="arrow-down-circle-outline" size={28} color={colors.income} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.optTitle}>Add Income</Text>
            <Text style={styles.optDesc}>Money you received</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 24 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.card,
    padding: 18, borderRadius: 18, borderWidth: 1.5, marginBottom: 14,
  },
  icon: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  optDesc: { fontSize: 13, color: colors.muted, marginTop: 2 },
});
