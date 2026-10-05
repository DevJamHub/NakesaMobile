import assert from 'node:assert/strict';
import { test } from 'node:test';

import { friendlyError, GENERIC_ERROR, isNetworkError, messageForCode, NETWORK_ERROR } from '../src/lib/errors.ts';

test('network failures get the connection message', () => {
  assert.equal(friendlyError(new TypeError('Network request failed')), NETWORK_ERROR);
  assert.equal(friendlyError({ name: 'AuthRetryableFetchError', message: '' }), NETWORK_ERROR);
  // supabase-js wraps fetch failures of database calls like this
  assert.equal(friendlyError({ message: 'TypeError: Failed to fetch', code: '' }), NETWORK_ERROR);
  assert.equal(isNetworkError(new Error('boom')), false);
});

test('known Supabase Auth codes get their own message', () => {
  assert.equal(friendlyError({ code: 'invalid_credentials', message: 'Invalid login credentials' }), 'Email atau kata sandi salah.');
  assert.equal(friendlyError({ code: 'wrong_current_password' }), 'Kata sandi saat ini salah.');
  assert.equal(messageForCode('otp_expired'), 'Link sudah kedaluwarsa. Silakan minta link baru.');
  assert.equal(messageForCode('something_new'), null);
  assert.equal(messageForCode(undefined), null);
});

test('messages raised by the patient_* database functions are shown as they are', () => {
  assert.equal(friendlyError({ code: 'P0001', message: 'Jam ini sudah tidak tersedia.' }), 'Jam ini sudah tidak tersedia.');
  assert.equal(friendlyError({ code: 'P0001' }, 'Fallback'), 'Fallback');
});

test('anything else falls back to a general message', () => {
  assert.equal(friendlyError(new Error('relation "x" does not exist')), GENERIC_ERROR);
  assert.equal(friendlyError({ code: '42501', message: 'permission denied' }, 'Tidak bisa.'), 'Tidak bisa.');
  assert.equal(friendlyError(null), GENERIC_ERROR);
  assert.equal(friendlyError(undefined, 'X'), 'X');
});
