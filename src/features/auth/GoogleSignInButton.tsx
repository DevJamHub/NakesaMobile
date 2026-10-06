// "Lanjutkan dengan Google" on the welcome, login and register screens.
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { NoticeBox } from '@/components/ui/States';
import { spacing } from '@/constants/theme';
import { friendlyError } from '@/lib/errors';

import { signInWithGoogle, warmUpBrowser } from './auth-service';
import { useAuth } from './AuthProvider';

export function GoogleSignInButton() {
  const { clearNotice } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(warmUpBrowser, []);

  const start = async () => {
    clearNotice();
    setError(null);
    setBusy(true);
    try {
      // Signed in: the navigator moves on by itself once the account is loaded.
      await signInWithGoogle();
    } catch (e) {
      setError(friendlyError(e, 'Masuk dengan Google belum berhasil. Coba lagi.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.wrap}>
      {error ? <NoticeBox message={error} /> : null}
      <PrimaryButton title="Lanjutkan dengan Google" icon="logo-google" variant="google" onPress={start} loading={busy} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
});
