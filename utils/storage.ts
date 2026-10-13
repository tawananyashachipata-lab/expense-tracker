import AsyncStorage from '@react-native-async-storage/async-storage';
import { CurrencyCode, Transaction } from '@/types/expense';

const TX_KEY = '@expense_tracker/transactions';
const CURRENCY_KEY = '@expense_tracker/currency';

export async function loadTransactions(): Promise<Transaction[]> {
  try {
    const raw = await AsyncStorage.getItem(TX_KEY);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch (e) {
    console.warn('Failed to load transactions', e);
    return [];
  }
}

export async function saveTransactions(list: Transaction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TX_KEY, JSON.stringify(list));
  } catch (e) {
    console.warn('Failed to save transactions', e);
  }
}

export async function loadCurrency(): Promise<CurrencyCode> {
  try {
    const c = await AsyncStorage.getItem(CURRENCY_KEY);
    return (c as CurrencyCode) || 'USD';
  } catch {
    return 'USD';
  }
}

export async function saveCurrency(code: CurrencyCode): Promise<void> {
  try {
    await AsyncStorage.setItem(CURRENCY_KEY, code);
  } catch (e) {
    console.warn('Failed to save currency', e);
  }
}

export async function clearTransactions(): Promise<void> {
  await AsyncStorage.removeItem(TX_KEY);
}

export function todayISO(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isValidISODate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}
