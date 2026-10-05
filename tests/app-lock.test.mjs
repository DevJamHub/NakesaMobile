import assert from 'node:assert/strict';
import { test } from 'node:test';

import { APP_LOCK_AFTER_MS } from '../src/constants/config.ts';
import { biometricLabel, shouldLockAgain, unlockErrorMessage } from '../src/features/auth/app-lock.ts';

test('the unlock method is named the way the phone names it', () => {
  assert.equal(biometricLabel(['face'], 'ios'), 'Face ID');
  assert.equal(biometricLabel(['fingerprint'], 'ios'), 'Touch ID');
  assert.equal(biometricLabel([], 'ios'), 'kode HP');
  assert.equal(biometricLabel(['fingerprint'], 'android'), 'sidik jari');
  assert.equal(biometricLabel(['face'], 'android'), 'pengenalan wajah');
  assert.equal(biometricLabel(['fingerprint', 'face'], 'android'), 'sidik jari atau wajah');
  assert.equal(biometricLabel(['iris'], 'android'), 'iris mata');
  assert.equal(biometricLabel([], 'android'), 'kunci layar');
});

test('the app locks again only after being away long enough', () => {
  const now = 10 * 60 * 1000;
  assert.equal(shouldLockAgain(null, now), false);
  assert.equal(shouldLockAgain(now - 5000, now), false);
  assert.equal(shouldLockAgain(now - APP_LOCK_AFTER_MS + 1, now), false);
  assert.equal(shouldLockAgain(now - APP_LOCK_AFTER_MS, now), true);
  assert.equal(shouldLockAgain(0, now), true);
  assert.equal(shouldLockAgain(now - 30000, now, 20000), true);
});

test('cancelling the prompt is not an error', () => {
  for (const error of ['user_cancel', 'system_cancel', 'app_cancel', 'user_fallback']) {
    assert.equal(unlockErrorMessage(error, 'Face ID'), null, error);
  }
});

test('a failed check says what to do', () => {
  assert.match(unlockErrorMessage('lockout', 'Face ID'), /Terlalu banyak percobaan/);
  assert.equal(
    unlockErrorMessage('not_enrolled', 'sidik jari'),
    'Belum ada sidik jari yang terdaftar di HP ini. Atur dulu di Pengaturan HP.',
  );
  assert.equal(unlockErrorMessage('not_available', 'sidik jari'), 'Sidik jari tidak tersedia di HP ini.');
  assert.equal(unlockErrorMessage('not_available', 'Face ID'), 'Face ID tidak tersedia di HP ini.');
  assert.match(unlockErrorMessage('passcode_not_set', 'Face ID'), /kunci layar HP/);
  assert.equal(unlockErrorMessage('authentication_failed', 'Face ID'), 'Verifikasi gagal. Coba lagi.');
});
