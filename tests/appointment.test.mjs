import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, mock, test } from 'node:test';

import { isPassed, isUpcoming, STATUS_INFO, statusDisplay } from '../src/features/appointment/status.ts';
import { appointmentWhatsApp } from '../src/features/appointment/whatsapp.ts';

const TODAY = '2026-10-05';
const YESTERDAY = '2026-10-04';
const TOMORROW = '2026-10-06';

// Freeze the clock at 5 Oct 2026, 10.00 WIB.
beforeEach(() => mock.timers.enable({ apis: ['Date'], now: Date.UTC(2026, 9, 5, 3) }));
afterEach(() => mock.timers.reset());

function appointment(status, date, extra = {}) {
  return {
    id: 'a1',
    status,
    date,
    startTime: '17:00:00',
    endTime: '17:30:00',
    service: null,
    serviceId: null,
    notes: null,
    createdAt: '2026-10-01T00:00:00Z',
    updatedAt: '2026-10-01T00:00:00Z',
    canCancel: false,
    practice: null,
    healthWorker: null,
    ...extra,
  };
}

describe('upcoming and history', () => {
  test('waiting or confirmed appointments from today on are upcoming', () => {
    assert.equal(isUpcoming(appointment('PENDING', TODAY)), true);
    assert.equal(isUpcoming(appointment('CONFIRMED', TOMORROW)), true);
    assert.equal(isUpcoming(appointment('PENDING', YESTERDAY)), false);
  });

  test('closed appointments are history, whatever the date', () => {
    for (const status of ['COMPLETED', 'CANCELLED', 'REJECTED']) {
      assert.equal(isUpcoming(appointment(status, TOMORROW)), false, status);
      assert.equal(isPassed(appointment(status, YESTERDAY)), false, status);
    }
  });

  test('an open appointment whose day has passed shows "Sudah lewat"', () => {
    const passed = appointment('CONFIRMED', YESTERDAY);
    assert.equal(isPassed(passed), true);
    assert.equal(statusDisplay(passed).label, 'Sudah lewat');
  });

  test('otherwise the status itself is shown', () => {
    assert.deepEqual(statusDisplay(appointment('CONFIRMED', TOMORROW)), STATUS_INFO.CONFIRMED);
    assert.deepEqual(statusDisplay(appointment('REJECTED', YESTERDAY)), STATUS_INFO.REJECTED);
  });

  test('every status has a label and an explanation', () => {
    for (const status of ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED']) {
      assert.ok(STATUS_INFO[status].label, status);
      assert.ok(STATUS_INFO[status].explanation, status);
    }
  });
});

describe('WhatsApp message to the practice', () => {
  const practice = { id: 'p1', name: 'Klinik Gigi Senyum', phone: '0812-0000-0002' };

  test('carries the appointment details', () => {
    const link = appointmentWhatsApp(
      appointment('PENDING', TOMORROW, { practice, service: 'Scaling' }),
      'Budi Santoso',
      'saya ingin menanyakan janji temu saya:',
    );
    const [base, query] = link.split('?text=');
    assert.equal(base, 'https://wa.me/6281200000002');
    assert.equal(
      decodeURIComponent(query),
      [
        'Halo Klinik Gigi Senyum, saya ingin menanyakan janji temu saya:',
        'Nama: Budi Santoso',
        'Layanan: Scaling',
        'Jadwal: Selasa, 6 Oktober 2026, jam 17.00',
        'Terima kasih 🙏',
      ].join('\n'),
    );
  });

  test('leaves out what is unknown', () => {
    const link = appointmentWhatsApp(appointment('PENDING', TOMORROW, { practice, startTime: null }), 'Budi', 'halo:');
    const text = decodeURIComponent(link.split('?text=')[1]);
    assert.equal(text.includes('Layanan:'), false);
    assert.equal(text.includes('Jadwal: Selasa, 6 Oktober 2026\n'), true);
  });

  test('no link when the practice has no phone number', () => {
    assert.equal(appointmentWhatsApp(appointment('PENDING', TOMORROW, { practice: { ...practice, phone: null } }), 'Budi', 'halo'), null);
    assert.equal(appointmentWhatsApp(appointment('PENDING', TOMORROW), 'Budi', 'halo'), null);
  });
});
