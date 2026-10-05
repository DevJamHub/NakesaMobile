// Practices, health workers and search. Practice data comes from the patient_* database
// functions, which only return listed practices and only their public information.
import { supabase } from '@/lib/supabase';
import type { HealthWorkerDetail, PracticeDetail, PracticeSummary, Profession } from '@/types/domain';

async function rpc<T>(fn: string, args: Record<string, unknown> = {}): Promise<T> {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw error;
  return data as T;
}

export async function listProfessions(): Promise<Profession[]> {
  const { data, error } = await supabase
    .from('professions')
    .select('key, label, title, icon, color')
    .order('sort_order');
  if (error) throw error;
  return data;
}

export type PracticeSearch = {
  query?: string;
  profession?: string | null;
  /** Practices in this city come first. */
  city?: string | null;
  limit?: number;
  offset?: number;
};

export const searchPractices = ({ query, profession, city, limit = 20, offset = 0 }: PracticeSearch) =>
  rpc<PracticeSummary[]>('patient_search_practices', {
    p_query: query?.trim() || null,
    p_profession: profession || null,
    p_city: city || null,
    p_limit: limit,
    p_offset: offset,
  });

export const getPractice = (id: string) => rpc<PracticeDetail>('patient_get_practice', { p_practice_id: id });

export const getHealthWorker = (id: string) => rpc<HealthWorkerDetail>('patient_get_health_worker', { p_user_id: id });
