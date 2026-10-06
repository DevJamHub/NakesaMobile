// Where email links land: account confirmation and password reset.
// The link carries the session in the URL (…/auth/callback#access_token=…&type=…).
// On Android the Google sign-in redirect lands here too; it shares the result of the Google button.
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { sessionFromUrl } from '@/features/auth/auth-service';
import { useAuth } from '@/features/auth/AuthProvider';
import { friendlyError, messageForCode } from '@/lib/errors';

type Status = { kind: 'working' } | { kind: 'done' } | { kind: 'failed'; message: string };

/** How long to wait for the link before giving up, instead of loading forever. */
const LINK_WAIT_MS = 10_000;

export default function AuthCallbackScreen() {
  const url = Linking.useLinkingURL();
  const { loading, session, account } = useAuth();
  const [status, setStatus] = useState<Status>({ kind: 'working' });
  const handled = useRef<string | null>(null);
  // Signed in although no link reached this screen, e.g. by the Google button itself.
  const done = status.kind === 'done' || (status.kind === 'working' && !url && !!session);

  useEffect(() => {
    if (!url || handled.current === url) return;
    handled.current = url;
    sessionFromUrl(url)
      .then((result) => {
        if (result.kind === 'error') {
          setStatus({
            kind: 'failed',
            message: messageForCode(result.code) ?? 'Link tidak valid atau sudah kedaluwarsa. Silakan minta link baru.',
          });
        } else if (result.kind === 'none') {
          setStatus({ kind: 'failed', message: 'Link tidak lengkap. Buka lagi link dari email Anda.' });
        } else if (result.type === 'recovery') {
          router.replace('/reset-password');
        } else {
          setStatus({ kind: 'done' });
        }
      })
      .catch((e) => setStatus({ kind: 'failed', message: friendlyError(e) }));
  }, [url]);

  // No link and not signed in: stop waiting after a while.
  useEffect(() => {
    if (url || session || status.kind !== 'working') return;
    const timer = setTimeout(
      () => setStatus({ kind: 'failed', message: 'Link tidak terbaca. Silakan coba masuk lagi.' }),
      LINK_WAIT_MS,
    );
    return () => clearTimeout(timer);
  }, [url, session, status.kind]);

  // Signed in: continue once the account is loaded.
  useEffect(() => {
    if (!done || loading) return;
    if (!account) router.replace('/login');
    else router.replace(account.onboardedAt ? '/' : '/onboarding');
  }, [done, loading, account]);

  if (status.kind === 'failed') {
    return (
      <Screen footer={<PrimaryButton title="Ke halaman awal" onPress={() => router.replace('/')} />}>
        <ErrorState message={status.message} />
      </Screen>
    );
  }
  return (
    <Screen scroll={false}>
      <LoadingState message="Memproses link…" />
    </Screen>
  );
}
