import { useEffect } from 'react';
import MuscleDiagram from './MuscleDiagram.jsx';
import { MUSCLE_GROUPS } from '../data/exercises.js';

const LABELS   = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.id, g.label]));
const EQUIP    = { none: 'Bodyweight', bands: 'Resistance band', dumbbells: 'Dumbbells' };
const DIFF_COL = { beginner: 'text-emerald-400', intermediate: 'text-lime', advanced: 'text-orange-400' };

function Badge({ label, value, color = 'text-muted' }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-line bg-elevated px-4 py-3">
      <span className={`font-display text-base font-extrabold ${color}`}>{value}</span>
      <span className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
    </div>
  );
}

export default function ExerciseDetailModal({ exercise, onClose }) {
  // Close on backdrop click / ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const ytQuery = encodeURIComponent(`how to do ${exercise.name} exercise proper form`);
  const ytUrl   = `https://www.youtube.com/results?search_query=${ytQuery}`;
  const repsLabel = exercise.reps <= 1
    ? `${exercise.sets} holds`
    : `${exercise.sets} × ${exercise.reps} reps`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="animate-pop-in relative z-10 flex w-full max-w-md flex-col overflow-hidden rounded-t-3xl border-t border-line bg-surface sm:rounded-3xl sm:border">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>

        {/* Header — diagram + title */}
        <div className="flex items-center gap-4 p-5">
          <div className="h-36 w-28 shrink-0 overflow-hidden rounded-2xl border border-line bg-elevated">
            <MuscleDiagram muscle={exercise.muscle} />
          </div>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-extrabold leading-tight text-white">
              {exercise.name}
            </h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-lime px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-ink">
                {LABELS[exercise.muscle] || exercise.muscle}
              </span>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {EQUIP[exercise.equipment] || exercise.equipment}
              </span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 px-5">
          <Badge label="Volume"     value={repsLabel} color="text-white" />
          <Badge
            label="Difficulty"
            value={exercise.difficulty}
            color={DIFF_COL[exercise.difficulty]}
          />
          <Badge label="Equipment"  value={EQUIP[exercise.equipment] || '—'} color="text-muted" />
        </div>

        {/* Description */}
        <div className="mx-5 mt-4 rounded-2xl border border-line bg-elevated p-4">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted">How to do it</div>
          <p className="text-sm leading-relaxed text-white">{exercise.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5">
          <a
            href={ytUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-lime py-3.5 font-display text-base font-bold text-ink transition-transform active:scale-[0.98]"
          >
            {/* YouTube icon */}
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M21.8 8s-.2-1.4-.8-2a2.9 2.9 0 0 0-2-1C17.1 4.8 12 4.8 12 4.8s-5.1 0-7 .2a2.9 2.9 0 0 0-2 1C2.4 6.6 2.2 8 2.2 8S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2a3 3 0 0 0 2 1c1.6.1 6.9.2 6.9.2s5.1 0 7-.2a2.9 2.9 0 0 0 2-1c.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8ZM10 14.4V9.6l5.3 2.4-5.3 2.4Z" />
            </svg>
            Watch demo
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-line px-5 py-3.5 font-display font-bold text-muted transition-colors hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
