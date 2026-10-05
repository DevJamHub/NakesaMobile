import type { Tone } from '@/constants/theme';
import { todayWIB } from '@/lib/format';
import type { Appointment, AppointmentStatus } from '@/types/domain';

export const STATUS_INFO: Record<AppointmentStatus, { label: string; tone: Tone; explanation: string }> = {
  PENDING: {
    label: 'Menunggu konfirmasi',
    tone: 'warning',
    explanation: 'Praktik akan mengonfirmasi janji temu ini, biasanya lewat WhatsApp.',
  },
  CONFIRMED: {
    label: 'Dikonfirmasi',
    tone: 'success',
    explanation: 'Janji temu sudah dikonfirmasi. Datang sesuai jadwal ya.',
  },
  COMPLETED: { label: 'Selesai', tone: 'info', explanation: 'Janji temu ini sudah selesai.' },
  CANCELLED: { label: 'Dibatalkan', tone: 'neutral', explanation: 'Janji temu ini sudah dibatalkan.' },
  REJECTED: {
    label: 'Ditolak',
    tone: 'danger',
    explanation: 'Praktik tidak bisa menerima janji temu ini. Silakan pilih jadwal lain.',
  },
};

const ACTIVE: AppointmentStatus[] = ['PENDING', 'CONFIRMED'];

/** Still waiting or confirmed, and not on a past day. */
export const isUpcoming = (a: Appointment) => ACTIVE.includes(a.status) && a.date >= todayWIB();

/** Waiting/confirmed appointments whose day has passed without being closed by the practice. */
export const isPassed = (a: Appointment) => ACTIVE.includes(a.status) && a.date < todayWIB();

export function statusDisplay(a: Appointment) {
  if (isPassed(a)) {
    return { label: 'Sudah lewat', tone: 'neutral' as Tone, explanation: 'Tanggal janji temu ini sudah lewat.' };
  }
  return STATUS_INFO[a.status];
}
