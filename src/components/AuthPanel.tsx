import { useState } from 'react';
import { Container } from '@/lib/ui/Container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/lib/ui/Card';
import { Input } from '@/lib/ui/Input';
import { Button } from '@/lib/ui/Button';
import { Alert, AlertTitle, AlertDescription } from '@/lib/ui/Alert';
import { Flame, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Mode = 'sign_in' | 'sign_up';

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === 'sign_in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Account created. Check your email to confirm, or sign in if confirmation is disabled.');
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div className="mx-auto max-w-sm py-16">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Flame size={24} className="text-primary" />
          </div>
          <h1 className="text-h1 text-foreground">DailyStreak</h1>
          <p className="mt-2 text-body text-muted-foreground">
            Build habits, one check-off at a time.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{mode === 'sign_in' ? 'Sign in' : 'Create an account'}</CardTitle>
            <CardDescription>
              {mode === 'sign_in' ? 'Welcome back. Enter your details.' : 'Start tracking your habits today.'}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Authentication failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {message && (
                <Alert>
                  <AlertTitle>Check your inbox</AlertTitle>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <label className="text-small text-muted-foreground">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-small text-muted-foreground">Password</label>
                <Input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={mode === 'sign_in' ? 'current-password' : 'new-password'}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {mode === 'sign_in' ? <LogIn size={16} /> : <UserPlus size={16} />}
                {loading ? 'Please wait…' : mode === 'sign_in' ? 'Sign in' : 'Sign up'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in');
                  setError(null);
                  setMessage(null);
                }}
              >
                {mode === 'sign_in' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </Container>
  );
}
