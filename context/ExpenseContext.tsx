import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { CATEGORIES, Category, CURRENCIES, CurrencyCode, Transaction } from '@/types/expense';
import {
  clearTransactions, loadCurrency, loadTransactions, saveCurrency, saveTransactions,
} from '@/utils/storage';

type NewTransaction = Omit<Transaction, 'id' | 'createdAt'>;

interface ExpenseContextValue {
  transactions: Transaction[];
  loading: boolean;
  currency: CurrencyCode;
  addTransaction: (t: NewTransaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  setCurrency: (c: CurrencyCode) => Promise<void>;
  formatMoney: (n: number) => string;
  totals: { income: number; expenses: number; balance: number; monthSpending: number };
  categoryTotals: { category: Category; total: number }[];
}

const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [list, cur] = await Promise.all([loadTransactions(), loadCurrency()]);
      setTransactions(list);
      setCurrencyState(cur);
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (list: Transaction[]) => {
    setTransactions(list);
    await saveTransactions(list);
  }, []);

  const addTransaction = useCallback(async (t: NewTransaction) => {
    const tx: Transaction = {
      ...t,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    await persist([tx, ...transactions]);
  }, [transactions, persist]);

  const deleteTransaction = useCallback(async (id: string) => {
    await persist(transactions.filter((t) => t.id !== id));
  }, [transactions, persist]);

  const clearAll = useCallback(async () => {
    setTransactions([]);
    await clearTransactions();
  }, []);

  const setCurrency = useCallback(async (c: CurrencyCode) => {
    setCurrencyState(c);
    await saveCurrency(c);
  }, []);

  const formatMoney = useCallback((n: number) => {
    const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? '$';
    const sign = n < 0 ? '-' : '';
    return `${sign}${symbol}${Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }, [currency]);

  const totals = useMemo(() => {
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    let income = 0, expenses = 0, monthSpending = 0;
    for (const t of transactions) {
      if (t.type === 'income') income += t.amount;
      else {
        expenses += t.amount;
        if (t.date.startsWith(monthPrefix)) monthSpending += t.amount;
      }
    }
    return { income, expenses, balance: income - expenses, monthSpending };
  }, [transactions]);

  const categoryTotals = useMemo(() =>
    CATEGORIES.map((category) => ({
      category,
      total: transactions
        .filter((t) => t.type === 'expense' && t.category === category)
        .reduce((s, t) => s + t.amount, 0),
    })).sort((a, b) => b.total - a.total),
  [transactions]);

  const sorted = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt),
    [transactions],
  );

  return (
    <ExpenseContext.Provider value={{
      transactions: sorted, loading, currency, addTransaction, deleteTransaction,
      clearAll, setCurrency, formatMoney, totals, categoryTotals,
    }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used inside ExpenseProvider');
  return ctx;
}
