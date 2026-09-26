import { useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Container } from '@/lib/ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { Button } from '@/lib/ui/Button';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { EmptyState } from '@/lib/ui/EmptyState';
import { ArrowLeft, Trash2, Flame, Trophy, Check } from 'lucide-react';
import { useAppData } from '@/lib/data';
import { MOCK_HABITS, MOCK_LOGS } from '@/lib/mockData';
import { computeStreaks, todayKey } from '@/lib/streaks';
import { HabitHeatmap } from '@/components/HabitHeatmap';
import type { Habit, HabitLog } from '@/lib/types';

export function HabitDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    data: habits,
    isLoading: habitsLoading,
    error: habitsError,
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
  } = useAppData<HabitLog[]>({
    key: ['habit_logs'],
    mock: MOCK_LOGS,
    fetchLive: async () => {
      throw new Error('not wired yet');
    },
  });

  const isLoading = habitsLoading || logsLoading;
  const error = habitsError || logsError;
  const habit = habits?.find((h) => h.id === id);
  const habitLogs = (logs ?? []).filter((l) => l.habit_id === id);
  const { current, longest, todayDone } = computeStreaks(habitLogs.map((l) => l.log_date));

  function handleCheckOff() {
    if (!id) return;
    const entry: HabitLog = { id: `local-log-${Date.now()}`, habit_id: id, log_date: todayKey() };
    qc.setQueryData<HabitLog[]>(['habit_logs'], (prev) => [...(prev ?? []), entry]);
  }

  function handleDelete() {
    if (!id) return;
    qc.setQueryData<Habit[]>(['habits'], (prev) => (prev ?? []).filter((h) => h.id !== id));
    navigate('/');
  }

  return (
    <Container>
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to habits
      </Button>

      {isLoading ? (
        <div className="py-12">
          <CenteredSpinner label="Loading habit" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Couldn't load this habit</AlertTitle>
          <AlertDescription>{(error as Error).message}</AlertDescription>
        </Alert>
      ) : !habit ? (
        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={<Flame size={20} />}
              title="Habit not found"
              description="It may have been deleted."
              action={<Button onClick={() => navigate('/')}>Back to dashboard</Button>}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-h2">{habit.name}</CardTitle>
                  <CardDescription>Started {new Date(habit.created_at).toLocaleDateString()}</CardDescription>
                </div>
                <Button
                  variant={todayDone ? 'secondary' : 'default'}
                  disabled={todayDone}
                  onClick={handleCheckOff}
                >
                  <Check size={16} />
                  {todayDone ? 'Done today' : 'Check off today'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/15 text-warning">
                    <Flame size={18} />
                  </div>
                  <div>
                    <div className="text-h3 tabular-nums text-foreground">{current}</div>
                    <div className="text-micro text-muted-foreground">current streak</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Trophy size={18} />
                  </div>
                  <div>
                    <div className="text-h3 tabular-nums text-foreground">{longest}</div>
                    <div className="text-micro text-muted-foreground">longest streak</div>
                  </div>
                </div>
                <Badge variant={todayDone ? 'success' : 'default'}>
                  {todayDone ? 'Checked in today' : 'Not checked in today'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Check-in history</CardTitle>
              <CardDescription>Last 12 weeks of activity.</CardDescription>
            </CardHeader>
            <CardContent>
              {habitLogs.length === 0 ? (
                <EmptyState
                  icon={<Flame size={20} />}
                  title="No check-ins yet"
                  description="Check off this habit today to start your streak."
                />
              ) : (
                <HabitHeatmap logDates={habitLogs.map((l) => l.log_date)} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {habitLogs.length === 0 ? (
                <div className="px-6 pb-6">
                  <p className="text-small text-muted-foreground">No entries recorded.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {[...habitLogs]
                    .sort((a, b) => (a.log_date < b.log_date ? 1 : -1))
                    .slice(0, 10)
                    .map((l) => (
                      <li key={l.id} className="flex items-center gap-3 px-6 py-3">
                        <Check size={14} className="text-success" />
                        <span className="text-small text-foreground">
                          {new Date(l.log_date + 'T00:00:00').toLocaleDateString(undefined, {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 size={16} />
                Delete habit
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </Container>
  );
}
