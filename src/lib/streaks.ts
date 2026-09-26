import { format, parseISO, differenceInCalendarDays, subDays } from 'date-fns';

export interface StreakInfo {
  current: number;
  longest: number;
  todayDone: boolean;
}

export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function computeStreaks(logDates: string[]): StreakInfo {
  const unique = Array.from(new Set(logDates)).sort();
  if (unique.length === 0) return { current: 0, longest: 0, todayDone: false };

  const dateSet = new Set(unique);
  const todayStr = todayKey();
  const todayDone = dateSet.has(todayStr);

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of unique) {
    if (prev !== null && differenceInCalendarDays(parseISO(d), parseISO(prev)) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = d;
  }

  let current = 0;
  let cursor = todayDone ? new Date() : subDays(new Date(), 1);
  while (dateSet.has(format(cursor, 'yyyy-MM-dd'))) {
    current += 1;
    cursor = subDays(cursor, 1);
  }

  return { current, longest, todayDone };
}

export function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => format(subDays(new Date(), n - 1 - i), 'yyyy-MM-dd'));
}
