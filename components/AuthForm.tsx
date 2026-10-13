import React, { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/utils/theme';

export default function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const isSignUp = mode === 'sign-up';
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    if (isSignUp && password !== confirm) return setError('Passwords do not match.');
    setBusy(true);
    const err = isSignUp ? await signUp(name, email, password) : await signIn(email, password);
    setBusy(false);
    if (err) return setError(err);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}>
            <Ionicons name="wallet-outline" size={34} color={colors.card} />
          </View>
          <Text style={styles.title}>{isSignUp ? 'Create account' : 'Welcome back'}</Text>
          <Text style={styles.subtitle}>
            {isSignUp ? 'Sign up to start tracking your money.' : 'Sign in to your Expense Tracker.'}
          </Text>

          <View style={styles.card}>
            {isSignUp && (
              <Field label="Full name" icon="person-outline" value={name} onChangeText={setName} placeholder="Jane Doe" />
            )}
            <Field label="Email" icon="mail-outline" value={email} onChangeText={setEmail}
              placeholder="you@example.com" keyboardType="email-address" />
            <Field label="Password" icon="lock-closed-outline" value={password} onChangeText={setPassword}
              placeholder="At least 6 characters" secure={!showPw} onToggle={() => setShowPw((s) => !s)} shown={showPw} />
            {isSignUp && (
              <Field label="Confirm password" icon="lock-closed-outline" value={confirm} onChangeText={setConfirm}
                placeholder="Repeat password" secure={!showPw} />
            )}

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={({ pressed }) => [styles.button, (pressed || busy) && { opacity: 0.8 }]} onPress={submit} disabled={busy}>
              {busy ? <ActivityIndicator color={colors.card} /> :
                <Text style={styles.buttonText}>{isSignUp ? 'Sign up' : 'Sign in'}</Text>}
            </Pressable>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.muted}>{isSignUp ? 'Already have an account?' : "Don't have an account?"}</Text>
            <Pressable onPress={() => router.replace(isSignUp ? '/sign-in' : '/sign-up')} hitSlop={8}>
              <Text style={styles.link}>{isSignUp ? 'Sign in' : 'Create account'}</Text>
            </Pressable>
          </View>
          <Text style={styles.note}>Your account is saved only on this phone.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string; icon: keyof typeof Ionicons.glyphMap; value: string; onChangeText: (t: string) => void;
  placeholder: string; keyboardType?: 'email-address'; secure?: boolean; onToggle?: () => void; shown?: boolean;
};

function Field({ label, icon, value, onChangeText, placeholder, keyboardType, secure, onToggle, shown }: FieldProps) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Ionicons name={icon} size={20} color={colors.muted} />
        <TextInput style={styles.input} value={value} onChangeText={onChangeText} placeholder={placeholder}
          placeholderTextColor={colors.muted} keyboardType={keyboardType}
          autoCapitalize={keyboardType || secure !== undefined ? 'none' : 'words'}
          autoCorrect={false} secureTextEntry={secure} />
        {onToggle && (
          <Pressable onPress={onToggle} hitSlop={10} accessibilityLabel={shown ? 'Hide password' : 'Show password'}>
            <Ionicons name={shown ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 24, paddingTop: 40, flexGrow: 1 },
  logo: { width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 18 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.muted, textAlign: 'center', marginTop: 6, marginBottom: 24 },
  card: { backgroundColor: colors.card, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 12, backgroundColor: colors.bg },
  input: { flex: 1, paddingVertical: 12, fontSize: 15, color: colors.text },
  error: { color: colors.expense, backgroundColor: colors.expenseSoft, padding: 10, borderRadius: 10, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: colors.card, fontSize: 16, fontWeight: '700' },
  switchRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 20 },
  muted: { color: colors.muted, fontSize: 14 },
  link: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  note: { textAlign: 'center', color: colors.muted, fontSize: 12, marginTop: 14 },
});
