import { lastNDays } from '@/lib/streaks';
import { cn } from '@/lib/cn';

export function HabitHeatmap({ logDates }: { logDates: string[] }) {
  const days = lastNDays(84);
  const done = new Set(logDates);

  return (
    <div className="overflow-x-auto">
      <div className="grid w-fit grid-flow-col grid-rows-7 gap-1">
        {days.map((date) => (
          <div
            key={date}
            title={`${date}${done.has(date) ? ' · checked in' : ''}`}
            className={cn(
              'h-3 w-3 rounded-sm',
              done.has(date) ? 'bg-primary' : 'bg-muted'
            )}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-micro text-muted-foreground">
        <span>12 weeks ago</span>
        <div className="h-px flex-1 bg-border" />
        <span>today</span>
      </div>
    </div>
  );
}
