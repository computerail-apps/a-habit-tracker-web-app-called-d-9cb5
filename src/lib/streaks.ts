import type { HabitLog } from '@/lib/types';

function toDateOnly(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / 86400000);
}

export function todayStr(): string {
  return toDateOnly(new Date());
}

export function isCheckedToday(logs: HabitLog[]): boolean {
  const t = todayStr();
  return logs.some((l) => l.log_date === t);
}

/**
 * Current streak: number of consecutive days ending today (or yesterday if
 * today isn't logged yet) with a check-in.
 */
export function currentStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;
  const dates = Array.from(new Set(logs.map((l) => l.log_date))).sort((a, b) => (a < b ? 1 : -1));
  const t = todayStr();
  let cursor = t;
  let streak = 0;

  // If today isn't logged, allow the streak to still "count" through
  // yesterday (streak isn't broken until a day is fully missed).
  if (dates[0] !== t) {
    const gap = daysBetween(dates[0], t);
    if (gap > 1) return 0;
    cursor = dates[0];
  }

  for (const d of dates) {
    if (d === cursor) {
      streak += 1;
      const prev = new Date(cursor + 'T00:00:00Z');
      prev.setUTCDate(prev.getUTCDate() - 1);
      cursor = toDateOnly(prev);
    } else if (d < cursor) {
      break;
    }
  }
  return streak;
}

export function longestStreak(logs: HabitLog[]): number {
  if (logs.length === 0) return 0;
  const dates = Array.from(new Set(logs.map((l) => l.log_date))).sort();
  let longest = 1;
  let run = 1;
  for (let i = 1; i < dates.length; i++) {
    if (daysBetween(dates[i - 1], dates[i]) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
  }
  return longest;
}
