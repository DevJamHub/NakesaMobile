import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { InfoRow } from '@/components/ui/InfoRow';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { NoticeBox } from '@/components/ui/States';
import { GENDERS } from '@/constants/config';
import { colors, spacing } from '@/constants/theme';
import { useAccount, useAuth } from '@/features/auth/AuthProvider';
import { avatarUrl, removeAvatarFile, updateAccount, uploadAvatar } from '@/features/profile/profile-service';
import { useAsync } from '@/hooks/useAsync';
import { friendlyError } from '@/lib/errors';
import { age, formatDate } from '@/lib/format';

const EMPTY = 'Belum diisi';

export default function ProfileScreen() {
  const account = useAccount();
  const { setAccount, signOut } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; tone: 'success' | 'danger' } | null>(null);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const avatarPath = account.avatarPath;
  const photo = useAsync(() => (avatarPath ? avatarUrl(avatarPath) : Promise.resolve(null)), avatarPath ?? '');

  const changePhoto = async () => {
    setMessage(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    setUploading(true);
    try {
      const oldPath = account.avatarPath;
      const path = await uploadAvatar(account.id, result.assets[0].uri);
      setAccount(await updateAccount(account.id, { avatarPath: path }));
      if (oldPath) removeAvatarFile(oldPath).catch(() => {});
      setMessage({ text: 'Foto profil diperbarui.', tone: 'success' });
    } catch (e) {
      setMessage({ text: friendlyError(e, 'Foto belum bisa disimpan. Coba lagi.'), tone: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  const doSignOut = async () => {
    setSigningOut(true);
    await signOut();
  };

  const years = age(account.birthDate);
  const gender = GENDERS.find((g) => g.value === account.gender)?.label;

  return (
    <Screen edges={['top']}>
      <AppText variant="title">Profil</AppText>

      <View style={styles.head}>
        <Pressable
          onPress={changePhoto}
          disabled={uploading}
          accessibilityRole="button"
          accessibilityLabel="Ganti foto profil"
          style={styles.photo}>
          <Avatar name={account.fullName} uri={photo.data} size={96} />
          <View style={styles.camera}>
            {uploading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Ionicons name="camera" size={16} color="#FFFFFF" />}
          </View>
        </Pressable>
        <AppText variant="h2" center>
          {account.fullName}
        </AppText>
        <AppText variant="small" center>
          {account.email}
        </AppText>
      </View>

      {message ? <NoticeBox message={message.text} tone={message.tone} /> : null}

      <Card style={styles.card}>
        <InfoRow icon="call-outline" label="Nomor HP">
          {account.phone ?? EMPTY}
        </InfoRow>
        <InfoRow icon="calendar-outline" label="Tanggal lahir">
          {account.birthDate ? `${formatDate(account.birthDate)}${years !== null ? ` (${years} tahun)` : ''}` : EMPTY}
        </InfoRow>
        <InfoRow icon="person-outline" label="Jenis kelamin">
          {gender ?? EMPTY}
        </InfoRow>
        <InfoRow icon="home-outline" label="Alamat">
          {account.address ?? EMPTY}
        </InfoRow>
        <InfoRow icon="location-outline" label="Kota/Kabupaten, Provinsi">
          {[account.city, account.province].filter(Boolean).join(', ') || EMPTY}
        </InfoRow>
      </Card>

      <View style={styles.actions}>
        <PrimaryButton title="Ubah profil" icon="create-outline" variant="secondary" onPress={() => router.push('/profile/edit')} />
        <PrimaryButton title="Ubah kata sandi" icon="key-outline" variant="ghost" onPress={() => router.push('/profile/password')} />
      </View>

      <Card style={styles.privacy}>
        <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
        <AppText variant="small" style={styles.flex}>
          Data Anda hanya bisa dilihat oleh Anda. Praktik hanya menerima nama dan nomor HP Anda saat Anda membuat janji
          temu.
        </AppText>
      </Card>

      <PrimaryButton title="Keluar" icon="log-out-outline" variant="danger" onPress={() => setConfirmSignOut(true)} />

      <ConfirmDialog
        visible={confirmSignOut}
        title="Keluar dari akun?"
        message="Anda perlu masuk lagi dengan email dan kata sandi untuk membuka janji temu Anda."
        confirmLabel="Ya, keluar"
        destructive
        loading={signingOut}
        onConfirm={doSignOut}
        onCancel={() => setConfirmSignOut(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { alignItems: 'center', gap: spacing.xs },
  photo: { marginBottom: spacing.sm },
  camera: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  card: { gap: spacing.lg },
  actions: { gap: spacing.sm },
  privacy: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  flex: { flex: 1 },
});
