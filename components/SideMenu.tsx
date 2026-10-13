import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Href, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/utils/theme';
import { useAuth } from '@/context/AuthContext';

type IconName = keyof typeof Ionicons.glyphMap;
const WIDTH = 300;

const drawerItems: { label: string; href: Href; icon: IconName }[] = [
  { label: 'Dashboard', href: '/', icon: 'home-outline' },
  { label: 'Transactions', href: '/transactions', icon: 'list-outline' },
  { label: 'Add transaction', href: '/add', icon: 'add-circle-outline' },
  { label: 'Categories', href: '/categories', icon: 'pie-chart-outline' },
  { label: 'Settings', href: '/settings', icon: 'settings-outline' },
];

const MenuContext = createContext<{ open: () => void; close: () => void }>({ open: () => {}, close: () => {} });
export const useSideMenu = () => useContext(MenuContext);

export function SideMenuProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const slide = useRef(new Animated.Value(-WIDTH)).current;
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (visible) Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [visible, slide]);

  const open = () => { slide.setValue(-WIDTH); setVisible(true); };
  const close = (after?: () => void) => {
    Animated.timing(slide, { toValue: -WIDTH, duration: 180, useNativeDriver: true }).start(() => {
      setVisible(false);
      after?.();
    });
  };

  return (
    <MenuContext.Provider value={{ open, close: () => close() }}>
      {children}
      <Modal visible={visible} transparent animationType="none" onRequestClose={() => close()} statusBarTranslucent>
        <View style={styles.modalRoot}>
          <Pressable style={styles.overlay} onPress={() => close()} accessibilityLabel="Close menu" />
          <Animated.View style={[styles.panel, { transform: [{ translateX: slide }] }]}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
              <ScrollView contentContainerStyle={styles.drawerScroll}>
                <View style={styles.drawerBrand}>
                  <View style={styles.drawerLogo}>
                    <Ionicons name="wallet-outline" size={25} color={colors.card} />
                  </View>
                  <View>
                    <Text style={styles.drawerTitle}>Expense Tracker</Text>
                    <Text style={styles.drawerSubtitle}>{user ? user.email : 'Manage your money'}</Text>
                  </View>
                </View>
                <View style={styles.drawerMenu}>
                  {drawerItems.map((item) => {
                    const dest = typeof item.href === 'string' ? item.href : '/';
                    const active = pathname === dest;
                    return (
                      <Pressable
                        key={item.label}
                        accessibilityRole="button"
                        onPress={() => close(() => router.navigate(item.href))}
                        style={({ pressed }) => [styles.drawerItem, active && styles.drawerItemActive, pressed && styles.drawerItemPressed]}
                      >
                        <Ionicons name={item.icon} size={22} color={active ? colors.primary : colors.muted} />
                        <Text style={[styles.drawerLabel, active && styles.drawerLabelActive]}>{item.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                {user && (
                  <Pressable style={[styles.drawerItem, { marginHorizontal: 12 }]} onPress={() => close(async () => { await signOut(); router.replace('/sign-in'); })}>
                    <Ionicons name="log-out-outline" size={22} color={colors.expense} />
                    <Text style={[styles.drawerLabel, { color: colors.expense }]}>Sign out</Text>
                  </Pressable>
                )}
                <View style={styles.drawerFooter}>
                  <Ionicons name="phone-portrait-outline" size={16} color={colors.muted} />
                  <Text style={styles.drawerFooterText}>Your data stays on this phone</Text>
                </View>
              </ScrollView>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </MenuContext.Provider>
  );
}

const styles = StyleSheet.create({
  modalRoot: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(17, 24, 39, 0.38)' },
  panel: { position: 'absolute', top: 0, bottom: 0, left: 0, width: WIDTH, backgroundColor: colors.card },
  drawerScroll: { flexGrow: 1, paddingTop: 8 },
  drawerBrand: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20,
    paddingTop: 18, paddingBottom: 22, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  drawerLogo: {
    width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  drawerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  drawerSubtitle: { fontSize: 12, color: colors.muted, marginTop: 2 },
  drawerMenu: { paddingHorizontal: 12, paddingTop: 16, flex: 1 },
  drawerItem: {
    minHeight: 50, flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 14, borderRadius: 12, marginBottom: 5,
  },
  drawerItemActive: { backgroundColor: colors.primarySoft },
  drawerItemPressed: { opacity: 0.7 },
  drawerLabel: { fontSize: 15, fontWeight: '600', color: colors.text },
  drawerLabelActive: { color: colors.primary, fontWeight: '700' },
  drawerFooter: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20,
    paddingVertical: 18, borderTopWidth: 1, borderTopColor: colors.border,
  },
  drawerFooterText: { flex: 1, fontSize: 12, color: colors.muted },
});
