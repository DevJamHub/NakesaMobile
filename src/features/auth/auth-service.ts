// Authentication: the only file that calls Supabase Auth.
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

import { supabase } from '@/lib/supabase';
import { cleanPhone } from '@/lib/format';

import { parseAuthLink } from './auth-link';

/** Where email links (confirmation, password reset) send the patient back to the app.
 *  Must be allowed in Supabase → Authentication → URL Configuration → Redirect URLs. */
export const authRedirectUrl = () => Linking.createURL('auth/callback');

/** Where Google sign-in returns to: always the app's own scheme (app.json → expo.scheme). Supabase
 *  accepts nakesapatient://** but refuses Expo Go's exp://<IP>:<port> address, even listed exactly.
 *  On iPhone the browser session catches this link itself, so it works in Expo Go too; on Android
 *  the phone must know the scheme, so Google sign-in needs a development build or the APK there. */
const GOOGLE_REDIRECT_URL = 'nakesapatient://auth/callback';

export type SignUpInput = { fullName: string; email: string; password: string; phone: string };

/** Returns 'signed_in', or 'confirm_email' when the project requires email confirmation. */
export async function signUp({ fullName, email, password, phone }: SignUpInput) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      // app = nakesa_patient makes the database give this account the PATIENT role.
      data: { full_name: fullName.trim(), phone: cleanPhone(phone), app: 'nakesa_patient' },
      emailRedirectTo: authRedirectUrl(),
    },
  });
  if (error) throw error;
  // With email confirmation on, Supabase hides a taken address by returning a user without identities.
  if (data.user && data.user.identities?.length === 0) {
    throw Object.assign(new Error('User already registered'), { code: 'user_already_exists' });
  }
  return data.session ? 'signed_in' : 'confirm_email';
}

export async function resendConfirmation(email: string) {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email.trim(),
    options: { emailRedirectTo: authRedirectUrl() },
  });
  if (error) throw error;
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
}

/**
 * Google sign-in in the phone's browser (Supabase OAuth). Google sends the patient back to
 * …/auth/callback with the session in the link, like the email links. False when the patient
 * closes the browser.
 */
export async function signInWithGoogle(): Promise<boolean> {
  const redirectTo = GOOGLE_REDIRECT_URL;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    // Let the patient pick the account, e.g. on a phone shared with family.
    options: { redirectTo, skipBrowserRedirect: true, queryParams: { prompt: 'select_account' } },
  });
  if (error) throw error;

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') return false;

  const link = await sessionFromUrl(result.url);
  if (link.kind === 'error') {
    throw Object.assign(new Error(link.description ?? 'Google sign-in failed'), { code: link.code ?? undefined });
  }
  if (link.kind === 'none') throw new Error('Google sign-in returned no session');
  return true;
}

let warmUsers = 0;

/** Android: starts the browser in the background so Google sign-in opens faster. Returns the clean-up. */
export function warmUpBrowser(): () => void {
  if (Platform.OS !== 'android') return () => {};
  if (warmUsers++ === 0) WebBrowser.warmUpAsync().catch(() => {});
  return () => {
    if (--warmUsers === 0) WebBrowser.coolDownAsync().catch(() => {});
  };
}

/** Whether the signed-in account was created by Google sign-in rather than with email. */
export async function createdWithGoogle(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  const provider = data.session?.user.app_metadata.provider;
  return !!provider && provider !== 'email';
}

/**
 * Email sign-ups tell the database "nakesa_patient" when the account is made (see signUp); Google
 * sign-ups cannot, so a new Google account asks for the patient role right after. The database
 * decides: it refuses accounts that are not brand new or that are used in Nakesa Pro.
 */
export async function claimPatientRole() {
  const { error } = await supabase.rpc('patient_claim_new_account');
  if (error) throw error;
}

export async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: authRedirectUrl() });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

/** Password change while signed in. The current password is checked first, so someone holding
 *  the unlocked phone cannot take over the account. */
export async function changePassword(email: string, currentPassword: string, newPassword: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: currentPassword });
  if (error) {
    if (error.code === 'invalid_credentials') {
      throw Object.assign(new Error('Wrong current password'), { code: 'wrong_current_password' });
    }
    throw error;
  }
  await updatePassword(newPassword);
}

/** Signs out on this phone only: the same account may also be signed in elsewhere, e.g. in Nakesa Pro. */
export async function signOut() {
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) throw error;
}

export type AuthLinkResult =
  | { kind: 'signed_in'; type: string | null }
  | { kind: 'error'; code: string | null; description: string | null }
  | { kind: 'none' };

/** The link read last. On Android the Google redirect also opens auth/callback with the same link;
 *  both then share one result, so the session is not set up twice. */
let lastLink: { url: string; result: Promise<AuthLinkResult> } | null = null;

/** Reads an email link (…/auth/callback#access_token=…&type=recovery) and starts the session. */
export function sessionFromUrl(url: string): Promise<AuthLinkResult> {
  if (lastLink?.url === url) return lastLink.result;
  const result = startSession(url);
  lastLink = { url, result };
  // A failed attempt (e.g. offline) may be tried again with the same link.
  result.catch(() => {
    if (lastLink?.result === result) lastLink = null;
  });
  return result;
}

async function startSession(url: string): Promise<AuthLinkResult> {
  const link = parseAuthLink(url);
  if (link.kind !== 'session') return link;

  const { error } = await supabase.auth.setSession({ access_token: link.accessToken, refresh_token: link.refreshToken });
  if (error) throw error;
  return { kind: 'signed_in', type: link.type };
}
