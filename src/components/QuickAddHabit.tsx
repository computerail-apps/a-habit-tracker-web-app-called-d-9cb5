import { useState } from 'react';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Plus } from 'lucide-react';

export function QuickAddHabit({ onAdd, disabled }: { onAdd: (name: string) => void; disabled?: boolean }) {
  const [name, setName] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setName('');
  }

  return (
    <form onSubmit={submit} className="flex gap-2">
      <Input
        placeholder="Add a new habit, e.g. 'Stretch for 10 minutes'"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={disabled}
        aria-label="New habit name"
      />
      <Button type="submit" disabled={disabled || !name.trim()}>
        <Plus size={16} />
        Add
      </Button>
    </form>
  );
}
