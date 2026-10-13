import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type User = { name: string; email: string };
type StoredUser = User & { passwordHash: string };

const USERS_KEY = '@expense_tracker/users';
const SESSION_KEY = '@expense_tracker/session';

// Simple on-device hash so passwords are not stored as plain text.
// Accounts live only on this phone; this is not server-grade security.
export function hashPassword(password: string): string {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < password.length; i++) {
    const c = password.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h2 >>> 0).toString(16) + (h1 >>> 0).toString(16);
}

type AuthValue = {
  user: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {
        // ignore broken session data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startSession = async (u: User) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const signUp: AuthValue['signUp'] = async (name, email, password) => {
    const e = email.trim().toLowerCase();
    if (!name.trim()) return 'Please enter your name.';
    if (!/^\S+@\S+\.\S+$/.test(e)) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    const users = await readUsers();
    if (users.some((u) => u.email === e)) return 'An account with this email already exists.';
    const newUser: StoredUser = { name: name.trim(), email: e, passwordHash: hashPassword(password) };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    await startSession({ name: newUser.name, email: e });
    return null;
  };

  const signIn: AuthValue['signIn'] = async (email, password) => {
    const e = email.trim().toLowerCase();
    if (!e || !password) return 'Please enter your email and password.';
    const found = (await readUsers()).find((u) => u.email === e);
    if (!found || found.passwordHash !== hashPassword(password)) return 'Wrong email or password.';
    await startSession({ name: found.name, email: found.email });
    return null;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
