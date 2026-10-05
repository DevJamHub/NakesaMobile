// Where email links land: account confirmation and password reset.
// The link carries the session in the URL (…/auth/callback#access_token=…&type=…).
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

export default function AuthCallbackScreen() {
  const url = Linking.useLinkingURL();
  const { loading, account } = useAuth();
  const [status, setStatus] = useState<Status>({ kind: 'working' });
  const handled = useRef<string | null>(null);

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

  // Email confirmed: continue once the account is loaded.
  useEffect(() => {
    if (status.kind !== 'done' || loading) return;
    if (!account) router.replace('/login');
    else router.replace(account.onboardedAt ? '/' : '/onboarding');
  }, [status, loading, account]);

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
