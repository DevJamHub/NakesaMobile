// Keeps the Supabase session and the patient's account for the whole app.
// The session is persisted on the device, so the patient stays signed in after restarting.
import type { Session } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { friendlyError, isNetworkError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import { fetchAccount } from '@/features/profile/profile-service';
import type { PatientAccount } from '@/types/domain';

import { claimPatientRole, createdWithGoogle, signOut as authSignOut } from './auth-service';

const NOT_A_PATIENT =
  'Akun ini terdaftar sebagai tenaga kesehatan di Nakesa Pro. Untuk Nakesa Patient, daftar dengan email lain.';
const GOOGLE_NOT_READY =
  'Akun Google ini belum bisa dipakai di Nakesa Patient. Daftar dengan email dulu, atau coba lagi nanti.';

type AuthContextValue = {
  /** True until the stored session and the account have been loaded. */
  loading: boolean;
  session: Session | null;
  account: PatientAccount | null;
  /** Loading the account failed (e.g. no internet). */
  accountError: string | null;
  /** Message for the welcome / login / register screens, e.g. when a health worker account tried to sign in. */
  notice: string | null;
  clearNotice: () => void;
  reloadAccount: () => Promise<void>;
  setAccount: (account: PatientAccount) => void;
  signOut: () => Promise<void>;
};

/** Result of loading the account of one user; ignored once another user is signed in. */
type Loaded = { userId: string; account: PatientAccount | null; error: string | null };
/** Not a patient account: signed out again, with this message as the notice. */
type Refused = { refused: string };

const AuthContext = createContext<AuthContextValue | null>(null);

async function resolveAccount(userId: string): Promise<Loaded | Refused> {
  try {
    let account = await fetchAccount(userId);
    if (!account) throw new Error('Profil tidak ditemukan.');
    if (account.role !== 'PATIENT' && (await createdWithGoogle())) {
      // A new Google account has no role choice at sign-up; the database decides now.
      try {
        await claimPatientRole();
      } catch (error) {
        if (isNetworkError(error)) throw error; // offline: let the patient try again
        return { refused: friendlyError(error, GOOGLE_NOT_READY) };
      }
      account = (await fetchAccount(userId, 1)) ?? account;
    }
    // The database refuses patient features to other roles anyway; this only explains why.
    if (account.role !== 'PATIENT') return { refused: NOT_A_PATIENT };
    return { userId, account, error: null };
  } catch (error) {
    return { userId, account: null, error: friendlyError(error, 'Data akun belum bisa dimuat. Coba lagi.') };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessionReady, setSessionReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const userId = session?.user.id ?? null;
  const current = loaded && loaded.userId === userId ? loaded : null;
  const account = current?.account ?? null;
  const accountError = current?.error ?? null;

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSession(data.session))
      // A stored session that cannot be read: start signed out instead of loading forever.
      .catch(() => setSession(null))
      .finally(() => setSessionReady(true));
    // Only store the session here: Supabase must not be called inside this callback.
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  // Loads the account; a health worker account is signed out with a notice instead.
  const loadAccount = useCallback(
    (id: string) =>
      resolveAccount(id).then(async (result) => {
        if ('refused' in result) {
          setNotice(result.refused);
          await authSignOut().catch(() => supabase.auth.signOut({ scope: 'local' }));
        } else {
          setLoaded(result);
        }
      }),
    [],
  );

  useEffect(() => {
    if (userId) loadAccount(userId);
  }, [userId, loadAccount]);

  const value = useMemo<AuthContextValue>(
    () => ({
      loading: !sessionReady || (userId !== null && current === null),
      session,
      account,
      accountError,
      notice,
      clearNotice: () => setNotice(null),
      reloadAccount: async () => {
        if (!userId) return;
        setLoaded(null);
        await loadAccount(userId);
      },
      setAccount: (next) => setLoaded({ userId: next.id, account: next, error: null }),
      signOut: async () => {
        try {
          await authSignOut();
        } catch {
          // Offline: forget the session on this phone anyway.
          await supabase.auth.signOut({ scope: 'local' });
        }
      },
    }),
    [sessionReady, userId, current, session, account, accountError, notice, loadAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}

/**
 * The signed-in patient's account. Only use on screens behind the signed-in guard.
 * Keeps returning the last account while signing out, until the screen is removed.
 */
export function useAccount(): PatientAccount {
  const { account } = useAuth();
  const [last, setLast] = useState(account);
  if (account && account !== last) setLast(account);
  const shown = account ?? last;
  if (!shown) throw new Error('useAccount used without a signed-in patient');
  return shown;
}
