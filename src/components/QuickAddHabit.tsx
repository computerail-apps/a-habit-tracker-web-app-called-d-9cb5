import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Plus } from 'lucide-react';
import { createHabit } from '@/lib/habits';

export function QuickAddHabit() {
  const [name, setName] = useState('');
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: (n: string) => createHabit(n),
    onSuccess: () => {
      setName('');
      qc.invalidateQueries({ queryKey: ['habits'] });
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed) create.mutate(trimmed);
      }}
      className="flex gap-2"
    >
      <Input
        placeholder="Add a new habit, e.g. Read 20 minutes"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={create.isPending}
      />
      <Button type="submit" disabled={create.isPending || !name.trim()}>
        <Plus size={16} />
        Add
      </Button>
    </form>
  );
}
