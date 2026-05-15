import { useState } from 'react';
import { useWorkoutStore } from '../hooks/useWorkoutStore.js';
import { MUSCLE_GROUPS } from '../data/exercises.js';

const EQUIPMENT = [
  { id: 'none', label: 'None', desc: 'Bodyweight only' },
  { id: 'bands', label: 'Resistance bands', desc: 'Bands available' },
  { id: 'dumbbells', label: 'Dumbbells', desc: 'Dumbbells available' },
];
const LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'Simple moves, lower reps' },
  { id: 'intermediate', label: 'Intermediate', desc: 'More variety and volume' },
  { id: 'advanced', label: 'Advanced', desc: 'Full exercise library' },
];

function Row({ active, onClick, label, desc }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all active:scale-[0.99]',
        active ? 'border-lime bg-lime/10' : 'border-line bg-surface',
      ].join(' ')}
    >
      <div>
        <div className={`text-sm font-semibold ${active ? 'text-lime' : 'text-white'}`}>{label}</div>
        <div className="text-xs text-muted">{desc}</div>
      </div>
      <div className={`h-5 w-5 rounded-full border-2 ${active ? 'border-lime bg-lime' : 'border-line'}`} />
    </button>
  );
}

export default function Settings() {
  const { settings, updateSettings, resetAll } = useWorkoutStore();
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleAvoided = (id) => {
    const next = settings.avoidedParts.includes(id)
      ? settings.avoidedParts.filter((x) => x !== id)
      : [...settings.avoidedParts, id];
    updateSettings({ avoidedParts: next });
  };

  return (
    <div className="space-y-7">
      <h1 className="font-display text-3xl font-extrabold text-white">Settings</h1>

      <section>
        <h2 className="mb-1 font-display text-lg font-bold text-white">Avoided body parts</h2>
        <p className="mb-3 text-xs text-muted">
          These are permanently locked in the workout generator — useful for injuries.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MUSCLE_GROUPS.map((g) => {
            const on = settings.avoidedParts.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleAvoided(g.id)}
                className={[
                  'rounded-xl border py-3 text-xs font-semibold transition-all active:scale-95',
                  on ? 'border-orange-400 bg-orange-400/15 text-orange-300' : 'border-line bg-surface text-muted',
                ].join(' ')}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="mb-1 font-display text-lg font-bold text-white">Equipment</h2>
        {EQUIPMENT.map((e) => (
          <Row
            key={e.id}
            active={settings.equipment === e.id}
            onClick={() => updateSettings({ equipment: e.id })}
            label={e.label}
            desc={e.desc}
          />
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="mb-1 font-display text-lg font-bold text-white">Fitness level</h2>
        {LEVELS.map((l) => (
          <Row
            key={l.id}
            active={settings.fitnessLevel === l.id}
            onClick={() => updateSettings({ fitnessLevel: l.id })}
            label={l.label}
            desc={l.desc}
          />
        ))}
      </section>

      <section>
        <h2 className="mb-1 font-display text-lg font-bold text-white">Danger zone</h2>
        <p className="mb-3 text-xs text-muted">Clears all workouts and settings. Cannot be undone.</p>
        {confirmReset ? (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
              className="flex-1 rounded-2xl bg-orange-500 py-3.5 font-display font-bold text-white"
            >
              Yes, reset everything
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-2xl border border-line px-6 py-3.5 font-display font-bold text-muted"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="w-full rounded-2xl border border-orange-500/40 py-3.5 font-display font-bold text-orange-400"
          >
            Reset all data
          </button>
        )}
      </section>
    </div>
  );
}
