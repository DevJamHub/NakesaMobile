// Optional app lock with Face ID / fingerprint (Profil → "Kunci dengan …"). The patient stays signed
// in, but the app asks to be unlocked when it is opened again: at start, and after a minute in the
// background. The phone's PIN/passcode is the fallback, and "Keluar" always works. No password is
// stored; the on/off choice is kept per account on this phone only.
import 'expo-sqlite/localStorage/install';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { LocalAuthenticationError, LocalAuthenticationResult } from 'expo-local-authentication';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState, BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { NoticeBox } from '@/components/ui/States';
import { colors, spacing } from '@/constants/theme';

import { shouldLockAgain, unlockErrorMessage } from './app-lock';
import { useAuth } from './AuthProvider';
import { confirmWithBiometrics, getBiometricSupport, type BiometricSupport } from './biometrics';

type AppLockValue = {
  /** Face ID / fingerprint on this phone; null while checking. */
  support: BiometricSupport | null;
  /** The lock is on for the signed-in account. */
  enabled: boolean;
  /** Turns the lock on or off after a Face ID / fingerprint check. */
  setEnabled: (on: boolean) => Promise<{ changed: boolean; message: string | null }>;
};

const AppLockContext = createContext<AppLockValue | null>(null);

const FALLBACK_LABEL = 'biometrik';
const storageKey = (userId: string) => `nakesa.app-lock.${userId}`;

function lockEnabledFor(userId: string | null): boolean {
  if (!userId) return false;
  try {
    return localStorage.getItem(storageKey(userId)) === '1';
  } catch {
    return false;
  }
}

export function AppLockProvider({ children }: { children: ReactNode }) {
  const { loading, session, signOut } = useAuth();
  const userId = session?.user.id ?? null;
  const [support, setSupport] = useState<BiometricSupport | null>(null);
  const label = support?.label ?? FALLBACK_LABEL;

  // The setting of the signed-in account, read again when another account signs in.
  const [setting, setSetting] = useState(() => ({ userId, enabled: lockEnabledFor(userId) }));
  if (setting.userId !== userId) setSetting({ userId, enabled: lockEnabledFor(userId) });
  const enabled = setting.userId === userId && setting.enabled;

  // Locked for this account. Opening the app with a saved session locks it; signing in does not.
  const [lockedFor, setLockedFor] = useState<string | null>(null);
  const [startChecked, setStartChecked] = useState(false);
  if (!startChecked && !loading) {
    setStartChecked(true);
    if (lockEnabledFor(userId)) setLockedFor(userId);
  }
  if (lockedFor && !userId) setLockedFor(null); // signed out from the lock screen
  const locked = !!userId && lockedFor === userId;

  const [failure, setFailure] = useState<LocalAuthenticationError | null>(null);
  // True while the system prompt is open: on Android it can briefly send the app to the background.
  const prompting = useRef(false);

  /** The system unlock prompt; null when one is already open. */
  const askToUnlock = useCallback(async (): Promise<LocalAuthenticationResult | null> => {
    if (prompting.current) return null;
    prompting.current = true;
    try {
      return await confirmWithBiometrics('Buka Nakesa Patient');
    } catch {
      return { success: false, error: 'unknown' };
    } finally {
      prompting.current = false;
    }
  }, []);

  const applyUnlock = useCallback((result: LocalAuthenticationResult | null) => {
    if (!result) return;
    setFailure(result.success ? null : result.error);
    if (result.success) setLockedFor(null);
  }, []);

  const unlock = () => askToUnlock().then(applyUnlock);

  const setEnabled = useCallback(
    async (on: boolean) => {
      if (!userId) return { changed: false, message: null };
      prompting.current = true;
      try {
        const result = await confirmWithBiometrics(on ? 'Aktifkan kunci aplikasi' : 'Matikan kunci aplikasi');
        if (!result.success) return { changed: false, message: unlockErrorMessage(result.error, label) };
        if (on) localStorage.setItem(storageKey(userId), '1');
        else localStorage.removeItem(storageKey(userId));
        setSetting({ userId, enabled: on });
        return { changed: true, message: null };
      } catch {
        return { changed: false, message: 'Pengaturan kunci belum bisa disimpan. Coba lagi.' };
      } finally {
        prompting.current = false;
      }
    },
    [userId, label],
  );

  // What the phone offers, checked again when the patient returns (they may have set it up meanwhile).
  useEffect(() => {
    let current = true;
    const check = () =>
      getBiometricSupport()
        .then((next) => current && setSupport(next))
        .catch(() => current && setSupport({ available: false, label: FALLBACK_LABEL, kind: null }));
    check();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => {
      current = false;
      subscription.remove();
    };
  }, []);

  // Lock again after a while in the background.
  useEffect(() => {
    if (!enabled || !userId) return;
    let backgroundSince: number | null = null;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' && !prompting.current) {
        backgroundSince ??= Date.now();
      } else if (state === 'active') {
        if (shouldLockAgain(backgroundSince, Date.now())) setLockedFor(userId);
        backgroundSince = null;
      }
    });
    return () => subscription.remove();
  }, [enabled, userId]);

  // Ask right away when the lock screen appears; its button is there to try again.
  useEffect(() => {
    if (!locked) return;
    let current = true;
    askToUnlock().then((result) => current && applyUnlock(result));
    return () => {
      current = false;
    };
  }, [locked, askToUnlock, applyUnlock]);

  // Android back on the lock screen leaves the app instead of showing the screen behind it.
  useEffect(() => {
    if (!locked) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
    return () => subscription.remove();
  }, [locked]);

  const value = useMemo<AppLockValue>(() => ({ support, enabled, setEnabled }), [support, enabled, setEnabled]);
  const failureMessage = failure ? unlockErrorMessage(failure, label) : null;

  return (
    <AppLockContext.Provider value={value}>
      <View style={styles.flex}>
        <View
          style={styles.flex}
          accessibilityElementsHidden={locked}
          importantForAccessibility={locked ? 'no-hide-descendants' : 'auto'}>
          {children}
        </View>
        {locked ? (
          <SafeAreaView style={styles.overlay} accessibilityViewIsModal>
            <View style={styles.center}>
              <View style={styles.badge}>
                <Ionicons name="lock-closed" size={36} color="#FFFFFF" />
              </View>
              <AppText variant="title" center>
                Nakesa Patient terkunci
              </AppText>
              <AppText center color={colors.textMuted}>
                Buka dengan {label} untuk melanjutkan.
              </AppText>
              {failureMessage ? <NoticeBox message={failureMessage} /> : null}
            </View>
            <View style={styles.actions}>
              <PrimaryButton
                title={`Buka dengan ${label}`}
                icon={support?.kind === 'face' ? 'scan-outline' : 'finger-print'}
                onPress={unlock}
              />
              <PrimaryButton title="Keluar dan masuk lagi" variant="ghost" onPress={signOut} />
            </View>
          </SafeAreaView>
        ) : null}
      </View>
    </AppLockContext.Provider>
  );
}

export function useAppLock() {
  const value = useContext(AppLockContext);
  if (!value) throw new Error('useAppLock must be used inside <AppLockProvider>');
  return value;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'stretch', gap: spacing.md },
  badge: {
    width: 84,
    height: 84,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.sm,
  },
  actions: { gap: spacing.sm },
});
