import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { ErrorState, LoadingState } from '@/components/ui/States';
import { colors, fontSize } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/features/auth/AuthProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}

function RootNavigator() {
  const { loading, session, account, accountError, reloadAccount, signOut } = useAuth();
  const signedIn = !!account;
  const onboarded = !!account?.onboardedAt;

  return (
    <View style={styles.full}>
      {/* The navigator stays mounted; the guards decide which screens exist. */}
      <Stack
        screenOptions={{
          headerShown: false,
          headerTintColor: colors.primary,
          headerTitleStyle: { color: colors.text, fontSize: fontSize.h3, fontWeight: '600' },
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.background },
        }}>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={signedIn && !onboarded}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>

        <Stack.Protected guard={signedIn && onboarded}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="practice/[id]" options={{ headerShown: true, title: 'Detail Praktik' }} />
          <Stack.Screen name="health-worker/[id]" options={{ headerShown: true, title: 'Tenaga Kesehatan' }} />
          <Stack.Screen name="booking/[practiceId]" options={{ headerShown: true, title: 'Buat Janji Temu' }} />
          <Stack.Screen name="booking/confirm" options={{ headerShown: true, title: 'Konfirmasi' }} />
          <Stack.Screen name="booking/success" options={{ gestureEnabled: false }} />
          <Stack.Screen name="appointment/[id]" options={{ headerShown: true, title: 'Detail Janji Temu' }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: true, title: 'Ubah Profil' }} />
        </Stack.Protected>

        {/* Email links (confirmation, password reset) work signed in or not. */}
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="reset-password" options={{ headerShown: true, title: 'Kata Sandi Baru' }} />
      </Stack>

      {loading ? (
        <View style={styles.overlay}>
          <LoadingState />
        </View>
      ) : session && !account && accountError ? (
        <SafeAreaView style={styles.overlay}>
          <ErrorState message={accountError} onRetry={reloadAccount} />
          <PrimaryButton title="Keluar" variant="ghost" onPress={signOut} style={styles.signOut} />
        </SafeAreaView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: colors.background },
  overlay: { ...StyleSheet.absoluteFill, backgroundColor: colors.background, justifyContent: 'center' },
  signOut: { marginHorizontal: 24, marginBottom: 24 },
});
