// Shapes the app works with. Raw database rows are mapped into these in the feature services.

export type Role = 'PATIENT' | 'HEALTH_WORKER' | 'PRACTICE_ADMIN' | 'ADMIN';

export type Gender = 'L' | 'P';

export type PatientAccount = {
  id: string;
  email: string | null;
  fullName: string;
  role: Role;
  phone: string | null;
  birthDate: string | null;
  gender: Gender | null;
  address: string | null;
  city: string | null;
  province: string | null;
  avatarPath: string | null;
  onboardedAt: string | null;
};

export type Profession = {
  key: string;
  label: string;
  title: string;
  icon: string;
  color: string;
};

export type PracticeSummary = {
  id: string;
  name: string;
  specialty: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  is_open: boolean;
  booking_enabled: boolean;
  latitude: number | null;
  longitude: number | null;
  profession: Profession | null;
  practitioner: { id: string; full_name: string | null; avatar_url: string | null };
};

/** day: 0 = Minggu … 6 = Sabtu; opens/closes "HH:MM" */
export type PracticeHour = { day: number; opens: string; closes: string };

/** id is null for a profession default service (the practice has not added its own). */
export type Service = {
  id: string | null;
  name: string;
  description: string | null;
  price: number | null;
  duration_minutes: number;
};

export type HealthWorker = {
  id: string;
  full_name: string;
  avatar_url: string | null;
  profession: Profession | null;
};

export type PracticeDetail = PracticeSummary & {
  description: string | null;
  hours: PracticeHour[];
  services: Service[];
  health_workers: HealthWorker[];
};

export type HealthWorkerDetail = HealthWorker & {
  practices: (PracticeSummary & { hours: PracticeHour[]; services: Service[] })[];
};

export type TimeSlot = { start: string; end: string; available: boolean };

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export type Appointment = {
  id: string;
  status: AppointmentStatus;
  date: string;
  startTime: string | null;
  endTime: string | null;
  service: string | null;
  serviceId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  canCancel: boolean;
  practice: PracticeSummary | null;
  healthWorker: { id: string; full_name: string | null; profession: Profession | null } | null;
};
