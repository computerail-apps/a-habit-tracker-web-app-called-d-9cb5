import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from '@/lib/ui/Nav';
import { Button } from '@/lib/ui/Button';
import { Container } from '@/lib/ui/Container';
import { CenteredSpinner } from '@/lib/ui/Spinner';
import { Flame, LogOut } from 'lucide-react';
import { Dashboard } from '@/pages/Dashboard';
import { HabitDetail } from '@/pages/HabitDetail';
import { AuthPanel } from '@/components/AuthPanel';
import { useSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function App() {
  const { session, loading } = useSession();

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Nav
          brand={
            <span className="inline-flex items-center gap-2">
              <Flame size={18} className="text-primary" />
              DailyStreak
            </span>
          }
          actions={
            session ? (
              <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}>
                <LogOut size={16} />
                Sign out
              </Button>
            ) : undefined
          }
        />
        <main className="py-8">
          {loading ? (
            <Container>
              <CenteredSpinner label="Loading your session" />
            </Container>
          ) : !session ? (
            <AuthPanel />
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/habits/:id" element={<HabitDetail />} />
            </Routes>
          )}
        </main>
      </div>
    </BrowserRouter>
  );
}
