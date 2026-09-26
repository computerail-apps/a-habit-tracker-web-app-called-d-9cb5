import { format, subDays } from 'date-fns';
import type { Habit, HabitLog } from '@/lib/types';

function d(n: number): string {
  return format(subDays(new Date(), n), 'yyyy-MM-dd');
}

export const MOCK_HABITS: Habit[] = [
  { id: 'h1', name: 'Morning meditation', archived: false, created_at: d(40) },
  { id: 'h2', name: 'Read 20 minutes', archived: false, created_at: d(30) },
  { id: 'h3', name: 'Drink 2L water', archived: false, created_at: d(25) },
  { id: 'h4', name: 'Evening walk', archived: false, created_at: d(2) },
  { id: 'h5', name: 'No phone after 10pm', archived: false, created_at: d(20) },
];

function logsFor(habitId: string, daysAgo: number[]): HabitLog[] {
  return daysAgo.map((n, i) => ({ id: `${habitId}-l${i}`, habit_id: habitId, log_date: d(n) }));
}

export const MOCK_LOGS: HabitLog[] = [
  // h1: 12-day run ending yesterday (today not yet checked off)
  ...logsFor('h1', Array.from({ length: 12 }, (_, i) => i + 1)),
  // h2: 5-day run including today
  ...logsFor('h2', [0, 1, 2, 3, 4]),
  // h3: broken streak - a 7 day run (2-8) plus today, gap at day 1
  ...logsFor('h3', [0, 2, 3, 4, 5, 6, 7, 8]),
  // h4: brand new habit, no logs yet
  ...logsFor('h4', []),
  // h5: current 2-day run, older 6-day run for longest
  ...logsFor('h5', [0, 1, 10, 11, 12, 13, 14, 15]),
];
