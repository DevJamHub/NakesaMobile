// Free times, booking and the patient's appointments. Appointments are rows of the shared
// `bookings` table, so the practice sees them in Nakesa Pro; all rules run in the database.
import { supabase } from '@/lib/supabase';
import type { Appointment, AppointmentStatus, PracticeSummary, Profession, TimeSlot } from '@/types/domain';

/** Database status (Nakesa Pro, Bahasa Indonesia) → app status. */
const STATUS_FROM_DB: Record<string, AppointmentStatus> = {
  baru: 'PENDING',
  dikonfirmasi: 'CONFIRMED',
  selesai: 'COMPLETED',
  batal: 'CANCELLED',
  ditolak: 'REJECTED',
};

type AppointmentRow = {
  id: string;
  status: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  service: string | null;
  service_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  can_cancel: boolean;
  practice: PracticeSummary | null;
  health_worker: { id: string; full_name: string | null; profession: Profession | null } | null;
};

function toAppointment(row: AppointmentRow): Appointment {
  return {
    id: row.id,
    status: STATUS_FROM_DB[row.status] ?? 'PENDING',
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time,
    service: row.service,
    serviceId: row.service_id,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    canCancel: row.can_cancel,
    practice: row.practice,
    healthWorker: row.health_worker,
  };
}

async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw error;
  return data as T;
}

export const getAvailableSlots = (practiceId: string, date: string, serviceId: string | null) =>
  rpc<TimeSlot[]>('patient_available_slots', { p_practice_id: practiceId, p_date: date, p_service_id: serviceId });

export type BookingInput = {
  practiceId: string;
  date: string;
  time: string;
  serviceId: string | null;
  serviceName: string | null;
  healthWorkerId: string | null;
  notes: string | null;
};

/** Returns the new appointment id. */
export const bookAppointment = (input: BookingInput) =>
  rpc<string>('patient_book_appointment', {
    p_practice_id: input.practiceId,
    p_date: input.date,
    p_time: input.time,
    p_service_id: input.serviceId,
    p_service_name: input.serviceId ? null : input.serviceName,
    p_health_worker_id: input.healthWorkerId,
    p_notes: input.notes?.trim() || null,
  });

export async function listAppointments(): Promise<Appointment[]> {
  return (await rpc<AppointmentRow[]>('patient_list_appointments')).map(toAppointment);
}

export async function getAppointment(id: string): Promise<Appointment> {
  return toAppointment(await rpc<AppointmentRow>('patient_get_appointment', { p_booking_id: id }));
}

/** Sets the status to cancelled; the appointment is kept as history. */
export const cancelAppointment = (id: string) => rpc<null>('patient_cancel_appointment', { p_booking_id: id });
