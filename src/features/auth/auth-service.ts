// Authentication: the only file that calls Supabase Auth.
import * as Linking from 'expo-linking';

import { supabase } from '@/lib/supabase';
import { cleanPhone } from '@/lib/format';

import { parseAuthLink } from './auth-link';

/** Where email links (confirmation, password reset) send the patient back to the app.
 *  Must be allowed in Supabase → Authentication → URL Configuration → Redirect URLs. */
export const authRedirectUrl = () => Linking.createURL('auth/callback');

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

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export type AuthLinkResult =
  | { kind: 'signed_in'; type: string | null }
  | { kind: 'error'; code: string | null; description: string | null }
  | { kind: 'none' };

/** Reads an email link (…/auth/callback#access_token=…&type=recovery) and starts the session. */
export async function sessionFromUrl(url: string): Promise<AuthLinkResult> {
  const link = parseAuthLink(url);
  if (link.kind !== 'session') return link;

  const { error } = await supabase.auth.setSession({ access_token: link.accessToken, refresh_token: link.refreshToken });
  if (error) throw error;
  return { kind: 'signed_in', type: link.type };
}
