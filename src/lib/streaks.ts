import type { HabitLog } from '@/lib/types';

export function todayStr(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const yy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

export interface StreakInfo {
  current: number;
  longest: number;
  loggedToday: boolean;
}

/** Computes current + longest streak from a sorted-or-unsorted array of habit logs for one habit. */
export function computeStreaks(logs: HabitLog[]): StreakInfo {
  const dates = Array.from(new Set(logs.map((l) => l.log_date))).sort();
  if (dates.length === 0) {
    return { current: 0, longest: 0, loggedToday: false };
  }

  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    if (addDays(dates[i - 1], 1) === dates[i]) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
  }

  const today = todayStr();
  const yesterday = addDays(today, -1);
  const dateSet = new Set(dates);
  const loggedToday = dateSet.has(today);

  let current = 0;
  let cursor: string | null = null;
  if (loggedToday) cursor = today;
  else if (dateSet.has(yesterday)) cursor = yesterday;

  if (cursor) {
    current = 1;
    let prev = addDays(cursor, -1);
    while (dateSet.has(prev)) {
      current += 1;
      prev = addDays(prev, -1);
    }
  }

  return { current, longest, loggedToday };
}
