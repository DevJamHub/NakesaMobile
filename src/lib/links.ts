// Opens other apps: WhatsApp, the phone app and maps.
import { Alert, Linking } from 'react-native';

/** Opens a link, and says so when this phone cannot (e.g. no app for "tel:" links). */
export async function openLink(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Tidak bisa dibuka', 'Aplikasi untuk membuka tautan ini tidak tersedia di HP Anda.');
  }
}
