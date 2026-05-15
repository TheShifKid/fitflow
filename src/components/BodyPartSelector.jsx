import { MUSCLE_GROUPS } from '../data/exercises.js';

// Minimal geometric glyphs — one per muscle group.
const ICONS = {
  chest: 'M5 7h14v5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V7Z',
  back: 'M12 3v18M7 6l5-3 5 3M7 18l5 3 5-3',
  shoulders: 'M4 14a8 8 0 0 1 16 0M9 14a3 3 0 0 1 6 0',
  biceps: 'M7 5v6a5 5 0 0 0 10 0M9 14a3 3 0 0 0 6 0v5H9z',
  triceps: 'M8 4v8a4 4 0 0 0 8 0V4M10 16h4v4h-4z',
  legs: 'M9 3h6l-1 9-1 9M15 12h-6M10 3l-1 18',
  glutes: 'M12 4a5 5 0 0 0-5 5c0 4 2 6 5 6s5-2 5-6a5 5 0 0 0-5-5ZM9 19h6',
  calves: 'M12 3c3 0 4 4 4 8s-2 6-4 6-4-2-4-6 1-8 4-8ZM10 21h4',
  core: 'M6 5h12v14H6zM6 10h12M6 14h12M12 5v14',
};

function MuscleIcon({ muscle, className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={ICONS[muscle] || ICONS.core} />
    </svg>
  );
}

export default function BodyPartSelector({ selected, avoided, onToggle }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MUSCLE_GROUPS.map((group, i) => {
        const isAvoided = avoided.includes(group.id);
        const isOn = selected.includes(group.id);
        return (
          <button
            key={group.id}
            type="button"
            disabled={isAvoided}
            onClick={() => onToggle(group.id)}
            style={{ animationDelay: `${i * 35}ms` }}
            className={[
              'animate-fade-up relative flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border p-2 transition-all duration-200 active:scale-95',
              isAvoided
                ? 'cursor-not-allowed border-line/60 bg-surface/40 text-muted/40'
                : isOn
                  ? 'border-lime bg-lime text-ink shadow-[0_0_0_3px_rgba(200,241,53,0.15)]'
                  : 'border-line bg-surface text-muted hover:border-muted hover:text-white',
            ].join(' ')}
          >
            {isAvoided && (
              <span className="absolute right-2 top-2 text-muted/60" aria-hidden>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </span>
            )}
            <MuscleIcon muscle={group.id} className="h-8 w-8" />
            <span className="text-center text-xs font-semibold leading-tight">{group.label}</span>
          </button>
        );
      })}
    </div>
  );
}
