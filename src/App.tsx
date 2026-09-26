import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Nav } from '@/lib/ui/Nav';
import { Flame } from 'lucide-react';
import { Dashboard } from '@/pages/Dashboard';
import { HabitDetail } from '@/pages/HabitDetail';

export default function App() {
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
        />
        <main className="py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits/:id" element={<HabitDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
