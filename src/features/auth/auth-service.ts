// Authentication: the only file that calls Supabase Auth.
import * as Linking from 'expo-linking';

import { supabase } from '@/lib/supabase';
import { cleanPhone } from '@/lib/format';

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
  const [beforeHash, hash = ''] = url.split('#');
  const query = beforeHash.includes('?') ? beforeHash.slice(beforeHash.indexOf('?') + 1) : '';
  const params = new URLSearchParams(`${query}&${hash}`);

  const errorCode = params.get('error_code');
  const errorDescription = params.get('error_description') ?? params.get('error');
  if (errorCode || errorDescription) return { kind: 'error', code: errorCode, description: errorDescription };

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (!accessToken || !refreshToken) return { kind: 'none' };

  const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  if (error) throw error;
  return { kind: 'signed_in', type: params.get('type') };
}
