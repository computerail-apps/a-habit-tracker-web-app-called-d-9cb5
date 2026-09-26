import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/lib/ui/Card';
import { Badge } from '@/lib/ui/Badge';
import { Button } from '@/lib/ui/Button';
import { Flame, Check, ChevronRight } from 'lucide-react';
import { computeStreaks } from '@/lib/streaks';
import type { Habit, HabitLog } from '@/lib/types';
import { cn } from '@/lib/cn';

interface Props {
  habit: Habit;
  logs: HabitLog[];
  onCheckOff: (habitId: string) => void;
}

export function HabitCard({ habit, logs, onCheckOff }: Props) {
  const navigate = useNavigate();
  const { current, longest, todayDone } = computeStreaks(logs.map((l) => l.log_date));

  const badgeVariant = todayDone ? 'success' : current > 0 ? 'warning' : 'default';
  const badgeLabel = current > 0 ? `${current} day${current === 1 ? '' : 's'}` : 'No streak yet';

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/habits/${habit.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate(`/habits/${habit.id}`);
      }}
      className="cursor-pointer transition-all duration-150 ease-out hover:shadow-elev-2 hover:border-muted-foreground/30"
    >
      <CardContent className="flex items-center gap-4 py-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
              todayDone ? 'bg-success/15 text-success' : current > 0 ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'
            )}
          >
            <Flame size={16} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-body font-medium text-foreground">{habit.name}</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant={badgeVariant}>{badgeLabel}</Badge>
              {longest > current && (
                <span className="text-micro text-muted-foreground">best {longest}</span>
              )}
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant={todayDone ? 'secondary' : 'default'}
          disabled={todayDone}
          onClick={(e) => {
            e.stopPropagation();
            if (!todayDone) onCheckOff(habit.id);
          }}
        >
          <Check size={16} />
          {todayDone ? 'Done today' : 'Check off'}
        </Button>
        <ChevronRight size={16} className="hidden shrink-0 text-muted-foreground md:block" />
      </CardContent>
    </Card>
  );
}
