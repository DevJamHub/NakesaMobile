import assert from 'node:assert/strict';
import { test } from 'node:test';

import { formFromAccount, validatePatientForm } from '../src/features/profile/patient-form.ts';

const account = {
  id: 'u1',
  email: 'budi@example.com',
  fullName: 'Budi Santoso',
  role: 'PATIENT',
  phone: '081234567890',
  birthDate: '1990-05-17',
  gender: 'L',
  address: null,
  city: 'Surabaya',
  province: 'Jawa Timur',
  avatarPath: null,
  onboardedAt: '2026-10-01T00:00:00Z',
};

test('the form starts from the account', () => {
  assert.deepEqual(formFromAccount(account), {
    fullName: 'Budi Santoso',
    phone: '081234567890',
    birthDate: '17/05/1990',
    gender: 'L',
    address: '',
    city: 'Surabaya',
    province: 'Jawa Timur',
  });
});

test('a valid form becomes the changes to save', () => {
  const { errors, changes } = validatePatientForm(formFromAccount(account), true);
  assert.deepEqual(errors, {});
  assert.deepEqual(changes, {
    birthDate: '1990-05-17',
    gender: 'L',
    address: null,
    city: 'Surabaya',
    province: 'Jawa Timur',
    fullName: 'Budi Santoso',
    phone: '081234567890',
  });
});

test('name and phone are required on "Ubah Profil"', () => {
  const { errors, changes } = validatePatientForm({ ...formFromAccount(account), fullName: '  ', phone: '0812' }, true);
  assert.equal(changes, null);
  assert.equal(errors.fullName, 'Nama lengkap wajib diisi.');
  assert.match(errors.phone, /Nomor HP belum benar/);
});

test('onboarding neither checks nor sends name and phone', () => {
  const { errors, changes } = validatePatientForm({ ...formFromAccount(account), fullName: '', phone: '' }, false);
  assert.deepEqual(errors, {});
  assert.equal('fullName' in changes, false);
  assert.equal('phone' in changes, false);
});

test('the birth date must be a real date in the past', () => {
  const check = (birthDate) => validatePatientForm({ ...formFromAccount(account), birthDate }, true).errors.birthDate;
  assert.equal(check('31/02/1990'), 'Tanggal belum benar. Contoh: 17/08/1990');
  assert.equal(check('1990'), 'Tanggal belum benar. Contoh: 17/08/1990');
  assert.equal(check('01/01/2999'), 'Tanggal lahir belum benar.');
  assert.equal(check('31/12/1899'), 'Tanggal lahir belum benar.');
  assert.equal(check('17/08/1945'), undefined);
});

test('an empty birth date is allowed and saved as empty', () => {
  const { errors, changes } = validatePatientForm({ ...formFromAccount(account), birthDate: ' ' }, true);
  assert.deepEqual(errors, {});
  assert.equal(changes.birthDate, null);
});

test('text is trimmed, empty text is saved as empty, the phone is cleaned', () => {
  const { changes } = validatePatientForm(
    { ...formFromAccount(account), fullName: ' Budi ', address: '   ', city: ' Sidoarjo ', phone: '0812-3456-7890' },
    true,
  );
  assert.equal(changes.fullName, 'Budi');
  assert.equal(changes.address, null);
  assert.equal(changes.city, 'Sidoarjo');
  assert.equal(changes.phone, '081234567890');
});
