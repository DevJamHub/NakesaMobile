// Rules of the optional app lock (Face ID / fingerprint), without React Native imports.
import { APP_LOCK_AFTER_MS } from '@/constants/config';

export type BiometricKind = 'face' | 'fingerprint' | 'iris';

/** How patients know the unlock method of their phone: "Face ID", "sidik jari", … */
export function biometricLabel(kinds: BiometricKind[], os: string): string {
  const face = kinds.includes('face');
  const fingerprint = kinds.includes('fingerprint');
  if (os === 'ios') return face ? 'Face ID' : fingerprint ? 'Touch ID' : 'kode HP';
  if (fingerprint && face) return 'sidik jari atau wajah';
  if (fingerprint) return 'sidik jari';
  if (face) return 'pengenalan wajah';
  return kinds.includes('iris') ? 'iris mata' : 'kunci layar';
}

/** Whether the app was away long enough to ask for unlocking again. */
export function shouldLockAgain(backgroundSince: number | null, now: number, after = APP_LOCK_AFTER_MS): boolean {
  return backgroundSince !== null && now - backgroundSince >= after;
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Message for a failed Face ID / fingerprint check; null when the patient simply cancelled. */
export function unlockErrorMessage(error: string, label: string): string | null {
  switch (error) {
    case 'user_cancel':
    case 'system_cancel':
    case 'app_cancel':
    case 'user_fallback':
      return null;
    case 'lockout':
      return 'Terlalu banyak percobaan. Kunci layar HP sebentar, buka lagi, lalu coba lagi.';
    case 'not_enrolled':
      return `Belum ada ${label} yang terdaftar di HP ini. Atur dulu di Pengaturan HP.`;
    case 'passcode_not_set':
      return 'Atur kunci layar HP (PIN, pola, atau kode) dulu.';
    case 'not_available':
      return `${capitalize(label)} tidak tersedia di HP ini.`;
    default:
      return 'Verifikasi gagal. Coba lagi.';
  }
}
