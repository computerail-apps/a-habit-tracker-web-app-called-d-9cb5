import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Card, CardContent } from '@/lib/ui/Card';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { Button } from '@/lib/ui/Button';
import { Flame, RefreshCw } from 'lucide-react';
import { useAppData } from '@/lib/data';
import { QuickAddHabit } from '@/components/QuickAddHabit';
import { HabitCard } from '@/components/HabitCard';
import { MOCK_HABITS, MOCK_LOGS } from '@/lib/mockData';
import { todayKey } from '@/lib/streaks';
import type { Habit, HabitLog } from '@/lib/types';

export function Dashboard() {
  const qc = useQueryClient();
  const [pending, setPending] = useState(false);

  const {
    data: habits,
    isLoading: habitsLoading,
    error: habitsError,
    refetch: refetchHabits,
  } = useAppData<Habit[]>({
    key: ['habits'],
    mock: MOCK_HABITS,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const {
    data: logs,
    isLoading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useAppData<HabitLog[]>({
    key: ['habit_logs'],
    mock: MOCK_LOGS,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const logsByHabit = useMemo(() => {
    const map = new Map<string, HabitLog[]>();
    (logs ?? []).forEach((l) => {
      const arr = map.get(l.habit_id) ?? [];
      arr.push(l);
      map.set(l.habit_id, arr);
    });
    return map;
  }, [logs]);

  async function handleAdd(name: string) {
    setPending(true);
    const optimistic: Habit = {
      id: `local-${Date.now()}`,
      name,
      archived: false,
      created_at: new Date().toISOString(),
    };
    qc.setQueryData<Habit[]>(['habits'], (prev) => [optimistic, ...(prev ?? [])]);
    setPending(false);
  }

  async function handleCheckOff(habitId: string) {
    const entry: HabitLog = { id: `local-log-${Date.now()}`, habit_id: habitId, log_date: todayKey() };
    qc.setQueryData<HabitLog[]>(['habit_logs'], (prev) => [...(prev ?? []), entry]);
  }

  const isLoading = habitsLoading || logsLoading;
  const error = habitsError || logsError;

  return (
    <Container>
      <div className="mb-8 space-y-2">
        <h1 className="text-display text-foreground">Your habits</h1>
        <p className="text-body text-muted-foreground">
          Check in once a day. Streaks are computed from your real check-in history.
        </p>
      </div>

      <div className="space-y-6">
        <QuickAddHabit onAdd={handleAdd} disabled={pending} />

        {isLoading ? (
          <div className="py-12">
            <CenteredSpinner label="Loading habits" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Couldn't load your habits</AlertTitle>
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>{(error as Error).message}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  refetchHabits();
                  refetchLogs();
                }}
              >
                <RefreshCw size={14} />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : !habits || habits.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={<Flame size={20} />}
                title="No habits yet"
                description="Add your first habit above to start building a streak."
              />
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {habits
              .filter((h) => !h.archived)
              .map((h) => (
                <HabitCard key={h.id} habit={h} logs={logsByHabit.get(h.id) ?? []} onCheckOff={handleCheckOff} />
              ))}
          </div>
        )}
      </div>
    </Container>
  );
}
