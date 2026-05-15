import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import MuscleDiagram from './MuscleDiagram.jsx';
import { MUSCLE_GROUPS } from '../data/exercises.js';

const LABELS   = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.id, g.label]));
const EQUIP    = { none: 'Bodyweight', bands: 'Resistance bands', dumbbells: 'Dumbbells' };
const DIFF_DOT = { beginner: '#34d399', intermediate: '#c8f135', advanced: '#fb923c' };

export default function ExerciseDetailModal({ exercise, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const repsLabel = exercise.reps <= 1
    ? `${exercise.sets} holds`
    : `${exercise.sets} × ${exercise.reps}`;

  const ytUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `how to ${exercise.name} exercise tutorial`,
  )}`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="animate-pop-in relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-y-auto rounded-t-3xl border-t border-line bg-[#141414] sm:rounded-3xl sm:border">

        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>

        {/* ── Top section: diagram + name ── */}
        <div className="flex gap-4 px-5 pt-4 pb-5">
          {/* Diagram */}
          <div className="h-44 w-32 shrink-0 rounded-2xl bg-[#1a1a1a] p-3">
            <MuscleDiagram muscle={exercise.muscle} />
          </div>

          {/* Name + meta */}
          <div className="flex flex-col justify-between py-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                {LABELS[exercise.muscle] || exercise.muscle}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-white">
                {exercise.name}
              </h2>
            </div>

            {/* Pills */}
            <div className="mt-3 flex flex-col gap-2">
              {/* Volume */}
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-lime px-3 py-1 font-sans text-sm font-bold tabular-nums text-ink">
                  {repsLabel}
                </span>
              </div>
              {/* Difficulty */}
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: DIFF_DOT[exercise.difficulty] }}
                />
                <span className="text-sm font-semibold capitalize text-white">
                  {exercise.difficulty}
                </span>
              </div>
              {/* Equipment */}
              <div className="flex items-center gap-2">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 5h2v14H6zM16 5h2v14h-2zM2 9h4M18 9h4M2 15h4M18 15h4" />
                </svg>
                <span className="text-sm text-muted">{EQUIP[exercise.equipment] || exercise.equipment}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-line mx-5" />

        {/* ── How to do it ── */}
        <div className="px-5 py-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">How to do it</p>
          <p className="text-sm leading-relaxed text-white">{exercise.description}</p>
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3 px-5 pb-6 pt-1">
          <a
            href={ytUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-lime py-3.5 font-display text-base font-bold text-ink transition-transform active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M21.8 8s-.2-1.4-.8-2a2.9 2.9 0 0 0-2-1C17.1 4.8 12 4.8 12 4.8s-5.1 0-7 .2a2.9 2.9 0 0 0-2 1C2.4 6.6 2.2 8 2.2 8S2 9.6 2 11.2v1.5c0 1.6.2 3.2.2 3.2s.2 1.4.8 2a3 3 0 0 0 2 1c1.6.1 6.9.2 6.9.2s5.1 0 7-.2a2.9 2.9 0 0 0 2-1c.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22 9.6 21.8 8 21.8 8ZM10 14.4V9.6l5.3 2.4-5.3 2.4Z" />
            </svg>
            Watch demo
          </a>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-line bg-elevated px-5 py-3.5 font-display font-bold text-muted transition-colors hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
