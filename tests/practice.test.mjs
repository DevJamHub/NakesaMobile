import assert from 'node:assert/strict';
import { test } from 'node:test';

import { colors } from '../src/constants/theme.ts';
import {
  healthWorkerName,
  isInCity,
  practicePlace,
  practiceSubtitle,
  professionColor,
  professionIcon,
  titledName,
  weekSchedule,
} from '../src/features/practice/profession.ts';

const bidan = { key: 'bidan', label: 'Bidan', title: 'Bidan', icon: '👩‍⚕️', color: '#C2185B' };
const drg = { key: 'dokter_gigi', label: 'Dokter Gigi', title: 'drg.', icon: '🦷', color: '#1D5FB4' };

test('names get the profession title once', () => {
  assert.equal(titledName('Siti Rahmawati', bidan), 'Bidan Siti Rahmawati');
  assert.equal(titledName('drg. Andi Pratama', drg), 'drg. Andi Pratama');
  assert.equal(titledName('DRG. Andi', drg), 'DRG. Andi');
  assert.equal(titledName('  Andi ', null), 'Andi');
  assert.equal(healthWorkerName({ full_name: 'Andi', profession: drg }), 'drg. Andi');
});

test('no name means no title on its own', () => {
  assert.equal(titledName(null, drg), '');
  assert.equal(titledName('   ', bidan), '');
});

test('practice subtitle and place', () => {
  assert.equal(practiceSubtitle({ profession: drg, specialty: null }), 'Dokter Gigi');
  assert.equal(practiceSubtitle({ profession: drg, specialty: 'Ortodonti' }), 'Dokter Gigi · Ortodonti');
  assert.equal(practiceSubtitle({ profession: null, specialty: null }), 'Tenaga kesehatan');
  assert.equal(practicePlace({ address: 'Jl. Melati 12', city: 'Surabaya' }), 'Jl. Melati 12, Surabaya');
  assert.equal(practicePlace({ address: null, city: 'Surabaya' }), 'Surabaya');
  assert.equal(practicePlace({ address: null, city: null }), '');
});

test('a practice is in the patient’s city regardless of case or "Kota"/"Kab."', () => {
  assert.equal(isInCity({ city: 'Surabaya' }, ' surabaya '), true);
  assert.equal(isInCity({ city: 'Kota Surabaya' }, 'Surabaya'), true);
  assert.equal(isInCity({ city: 'Sidoarjo' }, 'Kab. Sidoarjo'), true);
  assert.equal(isInCity({ city: 'Kabupaten Sidoarjo' }, 'kab sidoarjo'), true);
  assert.equal(isInCity({ city: 'Surabaya' }, 'Sidoarjo'), false);
  assert.equal(isInCity({ city: null }, 'Surabaya'), false);
  assert.equal(isInCity({ city: 'Surabaya' }, null), false);
  assert.equal(isInCity({ city: '  ' }, '  '), false);
});

test('a city is not mistaken for a longer name that starts the same', () => {
  assert.equal(isInCity({ city: 'Batubara' }, 'Batu'), false);
  assert.equal(isInCity({ city: 'Kotabaru' }, 'Baru'), false);
  assert.equal(isInCity({ city: 'Jakarta Selatan' }, 'Jakarta'), false);
});

test('practice hours are grouped per day, Monday first', () => {
  const week = weekSchedule([
    { day: 1, opens: '08:00', closes: '12:00' },
    { day: 1, opens: '16:00', closes: '20:00' },
    { day: 0, opens: '08:00', closes: '11:00' },
  ]);
  assert.equal(week.length, 7);
  assert.deepEqual(week[0], { day: 1, label: 'Senin', sessions: ['08.00–12.00', '16.00–20.00'] });
  assert.deepEqual(week[1], { day: 2, label: 'Selasa', sessions: [] });
  assert.deepEqual(week[6], { day: 0, label: 'Minggu', sessions: ['08.00–11.00'] });
});

test('profession colour and icon have a fallback', () => {
  assert.equal(professionColor(drg), '#1D5FB4');
  assert.equal(professionColor(null), colors.primary);
  assert.equal(professionIcon(bidan), '👩‍⚕️');
  assert.equal(professionIcon({ ...bidan, icon: '' }), '🏥');
  assert.equal(professionIcon(undefined), '🏥');
});
