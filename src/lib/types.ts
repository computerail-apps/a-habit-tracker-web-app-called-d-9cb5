export interface Habit {
  id: string;
  user_id: string;
  name: string;
  archived: boolean;
  created_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  log_date: string; // yyyy-MM-dd
  created_at: string;
}
