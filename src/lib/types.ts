export interface Habit {
  id: string;
  name: string;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  log_date: string; // yyyy-MM-dd
}
