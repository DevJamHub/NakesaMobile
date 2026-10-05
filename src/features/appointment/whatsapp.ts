import { formatDate, shortTime, waLink } from '@/lib/format';
import type { Appointment } from '@/types/domain';

/** WhatsApp link to the practice with the appointment details filled in (like Nakesa's booking page). */
export function appointmentWhatsApp(appointment: Appointment, patientName: string, intro: string): string | null {
  const practice = appointment.practice;
  if (!practice?.phone) return null;
  const when = `${formatDate(appointment.date)}${appointment.startTime ? `, jam ${shortTime(appointment.startTime)}` : ''}`;
  const message = [
    `Halo ${practice.name}, ${intro}`,
    `Nama: ${patientName}`,
    appointment.service ? `Layanan: ${appointment.service}` : '',
    `Jadwal: ${when}`,
    'Terima kasih 🙏',
  ]
    .filter(Boolean)
    .join('\n');
  return waLink(practice.phone, message);
}
