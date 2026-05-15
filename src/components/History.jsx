import { useWorkoutStore } from '../hooks/useWorkoutStore.js';
import { MUSCLE_GROUPS } from '../data/exercises.js';

const LABELS = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.id, g.label]));
const DAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const RATING_COLOR = { easy: 'text-emerald-400', medium: 'text-lime', hard: 'text-orange-400' };

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function weekCounts(workouts) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const w of workouts) {
    const d = new Date(w.date);
    if (d >= start) counts[d.getDay()] += 1;
  }
  return counts;
}

export default function History({ navigate }) {
  const { workouts, stats } = useWorkoutStore();
  const counts = weekCounts(workouts);
  const max = Math.max(1, ...counts);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-extrabold text-white">History</h1>
        <div className="rounded-full bg-lime px-3 py-1.5 font-sans text-sm font-bold tabular-nums text-ink">
          {stats.streak} day streak
        </div>
      </header>

      <section className="animate-fade-up rounded-3xl border border-line bg-surface p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted">Workouts this week</div>
        <div className="mt-4 flex items-end justify-between gap-2" style={{ height: '96px' }}>
          {counts.map((c, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              {c > 0 && <span className="text-[11px] font-bold text-lime">{c}</span>}
              <div
                className={`w-full rounded-md transition-all ${c > 0 ? 'bg-lime' : 'bg-elevated'}`}
                style={{ height: `${c > 0 ? (c / max) * 70 + 8 : 6}px` }}
              />
              <span className="text-[11px] font-semibold text-muted">{DAY_LETTERS[i]}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-bold text-white">All workouts</h2>
        {workouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-surface/50 p-8 text-center">
            <p className="text-sm text-muted">Nothing logged yet.</p>
            <button
              type="button"
              onClick={() => navigate('generator')}
              className="mt-3 rounded-xl bg-lime px-5 py-2.5 font-display text-sm font-bold text-ink"
            >
              Start your first workout
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((w, i) => (
              <div
                key={w.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-fade-up rounded-2xl border border-line bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{fmtDate(w.date)}</div>
                    <div className="mt-1 text-xs text-muted">
                      {(w.muscleGroups || []).map((m) => LABELS[m] || m).join(' · ') || 'Workout'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-sans text-base font-bold tabular-nums text-white">{w.duration} min</div>
                    {w.difficulty && (
                      <div className={`text-xs font-semibold capitalize ${RATING_COLOR[w.difficulty] || 'text-muted'}`}>
                        {w.difficulty}
                      </div>
                    )}
                  </div>
                </div>
                {w.note && (
                  <p className="mt-3 rounded-xl bg-elevated p-3 text-sm italic text-muted">"{w.note}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
