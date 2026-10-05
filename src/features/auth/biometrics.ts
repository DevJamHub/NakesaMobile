// The phone's Face ID / Touch ID / fingerprint, used by the app lock.
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';

import { biometricLabel, type BiometricKind } from './app-lock';

export type BiometricSupport = {
  /** A face or fingerprint is set up on this phone. */
  available: boolean;
  /** "Face ID", "sidik jari", … */
  label: string;
  /** For the icon: what the phone mainly uses. */
  kind: BiometricKind | null;
};

const KINDS: Partial<Record<LocalAuthentication.AuthenticationType, BiometricKind>> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: 'fingerprint',
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: 'face',
  [LocalAuthentication.AuthenticationType.IRIS]: 'iris',
};

export async function getBiometricSupport(): Promise<BiometricSupport> {
  const [hardware, enrolled, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.isEnrolledAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);
  const kinds = types.flatMap((type) => KINDS[type] ?? []);
  return {
    available: hardware && enrolled,
    label: biometricLabel(kinds, Platform.OS),
    kind: kinds.includes('fingerprint') ? 'fingerprint' : kinds.includes('face') ? 'face' : (kinds[0] ?? null),
  };
}

/** Shows the Face ID / fingerprint prompt; the phone's PIN or passcode is offered as fallback. */
export function confirmWithBiometrics(promptMessage: string) {
  return LocalAuthentication.authenticateAsync({
    promptMessage,
    cancelLabel: 'Batal',
    fallbackLabel: 'Pakai kode HP',
  });
}
