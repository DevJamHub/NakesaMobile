import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { colors, radius, spacing } from '@/constants/theme';

const POINTS = [
  { icon: 'search' as const, text: 'Cari dokter, bidan, dan praktik di sekitar Anda' },
  { icon: 'calendar' as const, text: 'Pilih layanan dan jadwal yang pas' },
  { icon: 'checkmark-circle' as const, text: 'Pantau dan atur janji temu dari HP' },
];

export default function WelcomeScreen() {
  return (
    <Screen
      contentStyle={styles.content}
      footer={
        <>
          <PrimaryButton title="Daftar" onPress={() => router.push('/register')} />
          <PrimaryButton title="Saya sudah punya akun" variant="secondary" onPress={() => router.push('/login')} />
        </>
      }>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="medkit" size={44} color="#FFFFFF" />
        </View>
        <AppText variant="title" center>
          Nakesa Patient
        </AppText>
        <AppText center color={colors.textMuted} style={styles.tagline}>
          Buat janji temu dengan tenaga kesehatan tanpa antre dan tanpa ribet.
        </AppText>
      </View>

      <View style={styles.points}>
        {POINTS.map((p) => (
          <View key={p.text} style={styles.point}>
            <View style={styles.pointIcon}>
              <Ionicons name={p.icon} size={20} color={colors.primary} />
            </View>
            <AppText style={styles.flex}>{p.text}</AppText>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { justifyContent: 'center', gap: spacing.xxl },
  hero: { alignItems: 'center', gap: spacing.md },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  tagline: { maxWidth: 320 },
  points: {
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  point: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pointIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
