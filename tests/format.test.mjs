import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  age,
  cleanPhone,
  dateWIB,
  dayOfWeek,
  displayDateToIso,
  durationLabel,
  firstName,
  formatDate,
  friendlyDate,
  greeting,
  initials,
  isoToDisplayDate,
  isValidEmail,
  isValidPhone,
  mapsLink,
  priceLabel,
  rupiah,
  shortTime,
  telLink,
  todayWIB,
  waLink,
  waNumber,
} from '../src/lib/format.ts';

// 6 Oct 2026, 00:30 in Jakarta — still 5 Oct in UTC.
const JUST_AFTER_MIDNIGHT_WIB = Date.UTC(2026, 9, 5, 17, 30);

describe('dates in WIB', () => {
  test('today follows Jakarta time, not UTC', (t) => {
    t.mock.timers.enable({ apis: ['Date'], now: JUST_AFTER_MIDNIGHT_WIB });
    assert.equal(todayWIB(), '2026-10-06');
    assert.equal(todayWIB(1), '2026-10-07');
    assert.equal(todayWIB(-6), '2026-09-30');
  });

  test('timestamps are turned into their Jakarta date', () => {
    assert.equal(dateWIB('2026-10-05T17:30:00Z'), '2026-10-06');
    assert.equal(dateWIB('2026-10-05T16:59:59Z'), '2026-10-05');
  });

  test('dates are written out in Indonesian', () => {
    assert.equal(formatDate('2026-10-06'), 'Selasa, 6 Oktober 2026');
    assert.equal(formatDate('2026-10-06', false), 'Selasa, 6 Oktober');
    assert.equal(dayOfWeek('2026-10-04'), 0); // Minggu
  });

  test('today and tomorrow get a friendly name', (t) => {
    t.mock.timers.enable({ apis: ['Date'], now: JUST_AFTER_MIDNIGHT_WIB });
    assert.equal(friendlyDate('2026-10-06'), 'Hari ini');
    assert.equal(friendlyDate('2026-10-07'), 'Besok');
    assert.equal(friendlyDate('2026-10-08'), 'Kamis, 8 Oktober 2026');
  });

  test('typed dates (DD/MM/YYYY) are checked', () => {
    assert.equal(isoToDisplayDate('1990-05-17'), '17/05/1990');
    assert.equal(isoToDisplayDate(null), '');
    assert.equal(displayDateToIso('17/5/1990'), '1990-05-17');
    assert.equal(displayDateToIso(' 01/01/2000 '), '2000-01-01');
    assert.equal(displayDateToIso('29/02/2024'), '2024-02-29');
    assert.equal(displayDateToIso('31/02/2024'), null);
    assert.equal(displayDateToIso('1990-05-17'), null);
    assert.equal(displayDateToIso(''), null);
  });

  test('age counts whole years', (t) => {
    t.mock.timers.enable({ apis: ['Date'], now: Date.UTC(2026, 9, 5, 3) }); // 5 Oct 2026, 10.00 WIB
    assert.equal(age('1990-10-05'), 36);
    assert.equal(age('1990-10-06'), 35);
    assert.equal(age(null), null);
  });
});

describe('times and money', () => {
  test('times use a dot, like Indonesian clocks', () => {
    assert.equal(shortTime('08:30:00'), '08.30');
    assert.equal(shortTime('17:05'), '17.05');
    assert.equal(shortTime(null), '');
  });

  test('rupiah has dots between thousands', () => {
    assert.equal(rupiah(150000), 'Rp 150.000');
    assert.equal(rupiah(1250000.4), 'Rp 1.250.000');
    assert.equal(rupiah(500), 'Rp 500');
  });

  test('a missing price is never guessed', () => {
    assert.equal(priceLabel(null), 'Tanya harga ke praktik');
    assert.equal(priceLabel(0), 'Gratis');
    assert.equal(priceLabel(100000), 'Rp 100.000');
  });

  test('durations', () => {
    assert.equal(durationLabel(30), '30 menit');
    assert.equal(durationLabel(60), '1 jam');
    assert.equal(durationLabel(90), '1 jam 30 menit');
    assert.equal(durationLabel(120), '2 jam');
  });
});

describe('phone, WhatsApp and map links', () => {
  test('phone numbers keep digits and a leading +', () => {
    assert.equal(cleanPhone(' 0812-3456 789 '), '08123456789');
    assert.equal(cleanPhone('+62 812-3456'), '+628123456');
    assert.equal(isValidPhone('0812345678'), true);
    assert.equal(isValidPhone('0812-34'), false);
  });

  test('WhatsApp numbers start with 62', () => {
    assert.equal(waNumber('0812-3456-789'), '628123456789');
    assert.equal(waNumber('+62 812 3456'), '628123456');
    assert.equal(waNumber('8123456'), '628123456');
    assert.equal(waLink('0812', 'Halo & terima kasih'), 'https://wa.me/62812?text=Halo%20%26%20terima%20kasih');
    assert.equal(waLink('0812'), 'https://wa.me/62812');
  });

  test('phone links open the phone app', () => {
    assert.equal(telLink('0812-3456 789'), 'tel:08123456789');
  });

  test('maps use the exact pin when there is one', () => {
    assert.equal(
      mapsLink({ address: 'Jl. Kenanga 5', latitude: -7.25, longitude: 112.75 }),
      'https://www.google.com/maps/search/?api=1&query=-7.25%2C112.75',
    );
    assert.equal(mapsLink({ latitude: 0, longitude: 0 }), 'https://www.google.com/maps/search/?api=1&query=0%2C0');
  });

  test('maps search the address otherwise', () => {
    assert.equal(
      mapsLink({ address: 'Jl. Kenanga 5, Gubeng', city: 'Surabaya', province: 'Jawa Timur' }),
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Jl. Kenanga 5, Gubeng, Surabaya, Jawa Timur')}`,
    );
    assert.equal(
      mapsLink({ address: null, city: 'Sidoarjo', province: null }),
      'https://www.google.com/maps/search/?api=1&query=Sidoarjo',
    );
  });

  test('no map link without an address or a pin', () => {
    assert.equal(mapsLink({ address: null, city: null, province: 'Jawa Timur' }), null);
    assert.equal(mapsLink({ address: '', city: null, latitude: -7.25, longitude: null }), null);
  });
});

describe('text', () => {
  test('email format', () => {
    assert.equal(isValidEmail(' budi@example.com '), true);
    assert.equal(isValidEmail('budi@example'), false);
    assert.equal(isValidEmail('budi example.com'), false);
  });

  test('first name and initials', () => {
    assert.equal(firstName('  Budi   Santoso '), 'Budi');
    assert.equal(firstName(''), '');
    assert.equal(firstName(null), '');
    assert.equal(initials('Budi Santoso Wijaya'), 'BS');
    assert.equal(initials('budi'), 'B');
    assert.equal(initials(''), '?');
  });

  test('greeting follows the time on the phone', () => {
    assert.equal(greeting(new Date(2026, 9, 5, 7)), 'Selamat pagi');
    assert.equal(greeting(new Date(2026, 9, 5, 12)), 'Selamat siang');
    assert.equal(greeting(new Date(2026, 9, 5, 16)), 'Selamat sore');
    assert.equal(greeting(new Date(2026, 9, 5, 20)), 'Selamat malam');
  });
});
