import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { categoryIcons, colors } from '@/utils/theme';

interface Props {
  category: string;
  amount: string;
  percent: number; // 0-100
}

export default function CategoryCard({ category, amount, percent }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.icon}>
          <Ionicons name={categoryIcons[category] as keyof typeof Ionicons.glyphMap} size={20} color={colors.primary} />
        </View>
        <Text style={styles.name}>{category}</Text>
        <Text style={styles.amount}>{amount}</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(100, percent)}%` }]} />
      </View>
      <Text style={styles.pct}>{percent.toFixed(0)}% of spending</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.border },
  top: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  amount: { fontSize: 15, fontWeight: '700', color: colors.text },
  track: { height: 6, backgroundColor: colors.bg, borderRadius: 3, marginTop: 12, overflow: 'hidden' },
  fill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  pct: { fontSize: 11, color: colors.muted, marginTop: 6 },
});
