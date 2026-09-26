import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Flame } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'sign_in' | 'sign_up';

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      setNotice(null);
      if (mode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setNotice('Account created. If email confirmation is required, check your inbox, then sign in.');
      }
    },
  });

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4">
      <Card className="w-full animate-in">
        <CardHeader>
          <div className="mb-2 inline-flex items-center gap-2 text-h3">
            <Flame size={20} className="text-primary" />
            DailyStreak
          </div>
          <CardTitle>{mode === 'sign_in' ? 'Sign in' : 'Create your account'}</CardTitle>
          <CardDescription>
            {mode === 'sign_in'
              ? 'Track your habits and streaks, backed by your own account.'
              : 'Takes a few seconds. Your habits are private to you.'}
          </CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit.mutate();
          }}
        >
          <CardContent className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
            />
            {submit.isError && (
              <Alert variant="destructive">
                <AlertTitle>Couldn't {mode === 'sign_in' ? 'sign in' : 'sign up'}</AlertTitle>
                <AlertDescription>{(submit.error as Error).message}</AlertDescription>
              </Alert>
            )}
            {notice && (
              <Alert>
                <AlertTitle>Almost there</AlertTitle>
                <AlertDescription>{notice}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={submit.isPending}>
              {submit.isPending ? 'Please wait…' : mode === 'sign_in' ? 'Sign in' : 'Sign up'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in');
                setNotice(null);
              }}
            >
              {mode === 'sign_in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
