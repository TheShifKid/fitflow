import { useWorkoutStore } from '../hooks/useWorkoutStore.js';
import { MUSCLE_GROUPS } from '../data/exercises.js';

const LABELS = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.id, g.label]));
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning.';
  if (h < 18) return 'Good afternoon.';
  return 'Good evening.';
}

function relDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today.setHours(0, 0, 0, 0) - new Date(d).setHours(0, 0, 0, 0)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function Stat({ value, label }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <div className="font-sans text-3xl font-bold tabular-nums text-white">{value}</div>
      <div className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

export default function Dashboard({ navigate }) {
  const { workouts, stats } = useWorkoutStore();
  const recent = workouts.slice(0, 3);

  return (
    <div className="space-y-6">
      <header className="animate-fade-up">
        <h1 className="font-display text-3xl font-extrabold text-white">{greeting()}</h1>
        <p className="mt-1 text-sm text-muted">Let's keep the streak alive.</p>
      </header>

      <section className="animate-fade-up rounded-3xl border border-line bg-surface p-5" style={{ animationDelay: '40ms' }}>
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Today</div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <div className={`font-display text-5xl font-extrabold ${stats.workedOutToday ? 'text-lime' : 'text-white'}`}>
              {stats.workedOutToday ? 'YES' : 'NO'}
            </div>
            <div className="mt-1 text-sm text-muted">
              {stats.workedOutToday ? 'Trained today — nice work.' : 'No workout logged yet.'}
            </div>
          </div>
          <div className="text-right">
            <div className="font-sans text-3xl font-bold tabular-nums text-white">{stats.streak}</div>
            <div className="text-xs uppercase tracking-wide text-muted">day streak</div>
          </div>
        </div>
      </section>

      <section className="animate-fade-up rounded-3xl border border-line bg-surface p-5" style={{ animationDelay: '80ms' }}>
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-muted">This week</div>
          <div className="text-xs font-semibold text-lime">{stats.weeklyCount}/7 days</div>
        </div>
        <div className="mt-3 flex justify-between gap-2">
          {stats.weekDays.map((done, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <div className={`h-12 w-full rounded-lg ${done ? 'bg-lime' : 'bg-elevated'}`} />
              <span className="text-[11px] font-semibold text-muted">{DAY_LETTERS[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <Stat value={stats.totalSessions} label="Sessions" />
        <Stat value={stats.totalExercises} label="Exercises" />
        <Stat value={stats.streak} label="Streak" />
      </section>

      <button
        type="button"
        onClick={() => navigate('generator')}
        className="w-full rounded-2xl bg-lime py-4 font-display text-lg font-bold text-ink transition-transform active:scale-[0.98]"
      >
        Generate today's workout
      </button>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-white">Recent workouts</h2>
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-6 text-center text-sm text-muted">
            No workouts yet. Generate your first one above.
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => navigate('history')}
                className="flex w-full items-center justify-between rounded-2xl border border-line bg-surface p-4 text-left transition-colors hover:border-muted"
              >
                <div>
                  <div className="font-semibold text-white">{relDate(w.date)}</div>
                  <div className="mt-0.5 text-xs text-muted">
                    {(w.muscleGroups || []).map((m) => LABELS[m] || m).join(' · ') || 'Workout'}
                  </div>
                </div>
                <div className="font-sans text-sm font-bold tabular-nums text-lime">{w.duration} min</div>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
