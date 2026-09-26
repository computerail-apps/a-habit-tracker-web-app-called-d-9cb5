import { supabase } from '@/lib/supabase';
import type { Habit, HabitLog } from '@/lib/types';
import { todayStr } from '@/lib/streaks';

const HABITS_TABLE = 'a_habit_tracker_web__habits';
const LOGS_TABLE = 'a_habit_tracker_web__habit_logs';

export async function getUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not signed in');
  return data.user.id;
}

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from(HABITS_TABLE)
    .select('id,user_id,name,archived,created_at')
    .eq('archived', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Habit[];
}

export async function fetchHabit(id: string): Promise<Habit | null> {
  const { data, error } = await supabase
    .from(HABITS_TABLE)
    .select('id,user_id,name,archived,created_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return (data as Habit | null) ?? null;
}

export async function fetchAllLogs(): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from(LOGS_TABLE)
    .select('id,user_id,habit_id,log_date,created_at')
    .order('log_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as HabitLog[];
}

export async function fetchLogsForHabit(habitId: string): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from(LOGS_TABLE)
    .select('id,user_id,habit_id,log_date,created_at')
    .eq('habit_id', habitId)
    .order('log_date', { ascending: true });
  if (error) throw error;
  return (data ?? []) as HabitLog[];
}

export async function createHabit(name: string): Promise<void> {
  const user_id = await getUserId();
  const { error } = await supabase.from(HABITS_TABLE).insert({ name, archived: false, user_id });
  if (error) throw error;
}

export async function deleteHabit(id: string): Promise<void> {
  const { error: logErr } = await supabase.from(LOGS_TABLE).delete().eq('habit_id', id);
  if (logErr) throw logErr;
  const { error } = await supabase.from(HABITS_TABLE).delete().eq('id', id);
  if (error) throw error;
}

export async function checkOffToday(habitId: string): Promise<void> {
  const user_id = await getUserId();
  const { error } = await supabase
    .from(LOGS_TABLE)
    .insert({ habit_id: habitId, log_date: todayStr(), user_id });
  if (error) throw error;
}
