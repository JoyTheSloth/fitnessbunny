import { supabase } from './supabaseClient';
import type { Biometrics, Macros, MealEntry, ExerciseEntry, WeightLog, WaterLog, UserProfile } from '../context/UserContext';

export interface UserPersistencePayload {
  name: string;
  biometrics: Biometrics;
  macros: Macros;
  goal: string;
  meals: MealEntry[];
  exercises: ExerciseEntry[];
  weight_logs: WeightLog[];
  water_logs: WaterLog[];
}

export type UserPersistenceRow = UserPersistencePayload & {
  email: string;
};

export async function loadUserData(email: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('name,email,biometrics,macros,goal,meals,exercises,weight_logs,water_logs')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('Supabase loadUserData error', error);
    return null;
  }

  return data;
}

export async function saveUserData(email: string, payload: UserPersistencePayload) {
  const row: UserPersistenceRow = {
    email,
    ...payload
  };

  const { error } = await supabase
    .from('user_profiles')
    .upsert(row, { onConflict: 'email' });

  if (error) {
    console.error('Supabase saveUserData error', error);
  }
}
