import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useWorkoutStore } from '../hooks/useWorkoutStore.js';
import RestTimer from './RestTimer.jsx';
import ExerciseDetailModal from './ExerciseDetailModal.jsx';

const REST_OPTIONS = [30, 60, 90];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function ActiveWorkout({ navigate, payload }) {
  const { addWorkout } = useWorkoutStore();
  const exercises = payload?.exercises || [];

  const startedAt = useRef(Date.now());
  const [done, setDone] = useState(() =>
    Object.fromEntries(exercises.map((ex) => [ex.id, Array(ex.sets).fill(false)])),
  );
  const [rest, setRest] = useState({ open: false, seconds: 60 });
  const [detailEx, setDetailEx] = useState(null);
  const [phase, setPhase] = useState('workout');
  const [rating, setRating] = useState('medium');
  const [note, setNote] = useState('');

  if (exercises.length === 0) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-muted">No active workout. Generate one first.</p>
        <button
          type="button"
          onClick={() => navigate('generator')}
          className="rounded-2xl bg-lime px-6 py-3 font-display font-bold text-ink"
        >
          Go to generator
        </button>
      </div>
    );
  }

  const totalSets = exercises.reduce((s, ex) => s + ex.sets, 0);
  const completedSets = Object.values(done).flat().filter(Boolean).length;
  const allDone = completedSets === totalSets;

  const toggleSet = (exId, idx) => {
    const turningOn = !done[exId][idx];
    setDone((d) => {
      const next = { ...d, [exId]: [...d[exId]] };
      next[exId][idx] = !next[exId][idx];
      return next;
    });
    if (turningOn) setRest((r) => ({ ...r, open: true }));
  };

  const elapsedMinutes = () => Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));

  const save = () => {
    addWorkout({
      muscleGroups: payload.muscleGroups || [...new Set(exercises.map((e) => e.muscle))],
      duration: elapsedMinutes(),
      plannedDuration: payload.duration,
      difficulty: rating,
      note: note.trim(),
      exerciseCount: exercises.length,
      exercises: exercises.map((e) => ({ id: e.id, name: e.name })),
    });
    navigate('history');
  };

  if (phase === 'summary') {
    return (
      <div className="space-y-6 animate-fade-up">
        <header>
          <button
            type="button"
            onClick={() => setPhase('workout')}
            className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to workout
          </button>
          <h1 className="font-display text-3xl font-extrabold text-white">Workout complete</h1>
          <p className="mt-1 text-sm text-muted">Nice session. Log the details.</p>
        </header>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="font-sans text-3xl font-bold tabular-nums text-lime">{exercises.length}</div>
            <div className="text-xs uppercase tracking-wide text-muted">Exercises</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="font-sans text-3xl font-bold tabular-nums text-lime">{completedSets}</div>
            <div className="text-xs uppercase tracking-wide text-muted">Sets done</div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-4">
            <div className="font-sans text-3xl font-bold tabular-nums text-lime">{elapsedMinutes()}</div>
            <div className="text-xs uppercase tracking-wide text-muted">Minutes</div>
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-white">How did it feel?</div>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setRating(d)}
                className={[
                  'flex-1 rounded-xl border py-3 text-sm font-semibold capitalize transition-all active:scale-95',
                  rating === d ? 'border-lime bg-lime text-ink' : 'border-line bg-surface text-muted',
                ].join(' ')}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-white">Note (optional)</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="How was the session?"
            className="w-full resize-none rounded-2xl border border-line bg-surface p-4 text-sm text-white placeholder:text-muted focus:border-muted focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={save}
          className="w-full rounded-2xl bg-lime py-4 font-display text-lg font-bold text-ink transition-transform active:scale-[0.98]"
        >
          Save workout
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <header className="animate-fade-up">
        <h1 className="font-display text-2xl font-extrabold text-white">Active workout</h1>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-lime transition-all duration-300"
              style={{ width: `${(completedSets / totalSets) * 100}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-muted">
            {completedSets}/{totalSets}
          </span>
        </div>
      </header>

      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const exDone = done[ex.id];
          const exComplete = exDone.every(Boolean);
          return (
            <div
              key={ex.id}
              style={{ animationDelay: `${i * 50}ms` }}
              className={`animate-fade-up rounded-2xl border bg-surface p-4 transition-colors ${
                exComplete ? 'border-lime/50' : 'border-line'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <button type="button" onClick={() => setDetailEx(ex)} className="flex items-center gap-1.5 text-left">
                    <h3 className="font-display text-lg font-bold leading-tight text-white">{ex.name}</h3>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                  </button>
                  <p className="mt-1 text-xs text-muted">
                    {ex.reps <= 1 ? 'Hold each set' : `${ex.reps} reps per set`}
                  </p>
                </div>
                {exComplete && (
                  <span className="text-lime" aria-label="complete">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{ex.description}</p>
              <div className="mt-3 flex gap-2">
                {exDone.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleSet(ex.id, idx)}
                    className={[
                      'flex h-12 flex-1 items-center justify-center rounded-xl border text-sm font-bold transition-all active:scale-95',
                      d ? 'border-lime bg-lime text-ink' : 'border-line bg-elevated text-muted',
                    ].join(' ')}
                  >
                    {d ? '✓' : `Set ${idx + 1}`}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setPhase('summary')}
        className={[
          'w-full rounded-2xl py-4 font-display text-lg font-bold transition-transform active:scale-[0.98]',
          allDone ? 'bg-lime text-ink' : 'border border-line text-white',
        ].join(' ')}
      >
        {allDone ? 'Finish workout' : 'End workout early'}
      </button>

      {detailEx && <ExerciseDetailModal exercise={detailEx} onClose={() => setDetailEx(null)} />}

      {rest.open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md animate-pop-in rounded-3xl border border-line bg-surface p-6">
            <div className="mb-5 flex justify-center gap-2">
              {REST_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRest((r) => ({ ...r, seconds: s }))}
                  className={[
                    'rounded-full border px-4 py-1.5 text-sm font-semibold transition-all',
                    rest.seconds === s ? 'border-lime bg-lime text-ink' : 'border-line text-muted',
                  ].join(' ')}
                >
                  {s}s
                </button>
              ))}
            </div>
            <RestTimer seconds={rest.seconds} onDone={() => setRest((r) => ({ ...r, open: false }))} />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
