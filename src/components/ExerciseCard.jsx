import { useState } from 'react';
import { MUSCLE_GROUPS } from '../data/exercises.js';
import ExerciseDetailModal from './ExerciseDetailModal.jsx';

const LABELS = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.id, g.label]));

function repLabel(ex) {
  return ex.reps <= 1 ? `${ex.sets} holds` : `${ex.sets} × ${ex.reps}`;
}

export default function ExerciseCard({ exercise, index = 0, footer, dim = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
        style={{ animationDelay: `${index * 50}ms` }}
        className={[
          'animate-fade-up cursor-pointer rounded-2xl border border-line bg-surface p-4 transition-all hover:border-muted active:scale-[0.99]',
          dim ? 'opacity-50' : '',
        ].join(' ')}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-bold leading-tight text-white">{exercise.name}</h3>
              {/* Tap hint */}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <span className="mt-1 inline-block rounded-full bg-elevated px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {LABELS[exercise.muscle] || exercise.muscle}
            </span>
          </div>
          <div className="shrink-0 rounded-xl bg-lime px-3 py-1.5 text-center font-sans text-sm font-bold tabular-nums text-ink">
            {repLabel(exercise)}
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-2">{exercise.description}</p>
        {footer}
      </div>

      {open && <ExerciseDetailModal exercise={exercise} onClose={() => setOpen(false)} />}
    </>
  );
}
