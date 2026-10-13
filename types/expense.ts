export type TransactionType = 'expense' | 'income';

export const CATEGORIES = [
  'Food', 'Transport', 'Shopping', 'Bills',
  'Entertainment', 'Health', 'Education', 'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  category?: Category; // only for expenses
  date: string; // YYYY-MM-DD
  description?: string;
  createdAt: number;
}

export const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'ZAR', symbol: 'R' },
  { code: 'ZWG', symbol: 'ZiG' },
  { code: 'INR', symbol: '₹' },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]['code'];
