import { useState } from 'react';
import { useWorkoutStore, generateWorkout } from '../hooks/useWorkoutStore.js';
import BodyPartSelector from './BodyPartSelector.jsx';
import ExerciseCard from './ExerciseCard.jsx';
import { MUSCLE_GROUPS } from '../data/exercises.js';

const DURATIONS   = [20, 30, 45, 60];
const INTENSITIES = ['easy', 'medium', 'hard'];
const MG_LABELS   = Object.fromEntries(MUSCLE_GROUPS.map((g) => [g.id, g.label]));

function StepDots({ step }) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3].map((n) => (
        <div key={n} className={`h-1.5 rounded-full transition-all ${n === step ? 'w-8 bg-lime' : 'w-1.5 bg-line'}`} />
      ))}
    </div>
  );
}

function Choice({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex-1 rounded-xl border py-3 text-sm font-semibold capitalize transition-all active:scale-95',
        active ? 'border-lime bg-lime text-ink' : 'border-line bg-surface text-muted hover:text-white',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function SavedTemplates({ templates, onStart, onDelete }) {
  if (templates.length === 0) return null;
  return (
    <div className="mb-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted">Saved workouts</p>
      <div className="space-y-2">
        {templates.map((t) => (
          <div key={t.id} className="flex items-center gap-2 rounded-2xl border border-line bg-surface p-3">
            <button
              type="button"
              onClick={() => onStart(t)}
              className="flex-1 text-left"
            >
              <div className="font-semibold text-white">{t.name}</div>
              <div className="mt-0.5 text-xs text-muted">
                {(t.muscleGroups || []).map((m) => MG_LABELS[m] || m).join(' · ')} · {t.duration}m · <span className="capitalize">{t.intensity}</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => onDelete(t.id)}
              className="p-1.5 text-muted hover:text-white"
              aria-label="Delete"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <div className="my-5 h-px bg-line" />
    </div>
  );
}

export default function WorkoutGenerator({ navigate }) {
  const { settings, savedTemplates, saveTemplate, deleteTemplate } = useWorkoutStore();
  const [step,        setStep]        = useState(1);
  const [selected,    setSelected]    = useState([]);
  const [duration,    setDuration]    = useState(30);
  const [intensity,   setIntensity]   = useState(settings.fitnessLevel === 'beginner' ? 'easy' : 'medium');
  const [noEquipment, setNoEquipment] = useState(false);
  const [result,      setResult]      = useState(null);
  const [saveName,    setSaveName]    = useState('');
  const [showSave,    setShowSave]    = useState(false);
  const [saved,       setSaved]       = useState(false);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const currentConfig = { muscleGroups: selected, duration, intensity, noEquipment };

  const runGenerate = (config = currentConfig) => {
    const r = generateWorkout({
      muscleGroups: config.muscleGroups,
      duration:     config.duration,
      intensity:    config.intensity,
      equipment:    config.noEquipment ? 'none' : settings.equipment,
      fitnessLevel: settings.fitnessLevel,
      avoidedParts: settings.avoidedParts,
    });
    setResult(r);
    setStep(3);
    setShowSave(false);
    setSaved(false);
    setSaveName('');
  };

  const handleTemplateStart = (t) => {
    setSelected(t.muscleGroups);
    setDuration(t.duration);
    setIntensity(t.intensity);
    setNoEquipment(t.noEquipment || false);
    runGenerate(t);
  };

  const handleSave = () => {
    if (!saveName.trim()) return;
    saveTemplate(saveName.trim(), currentConfig);
    setSaved(true);
    setShowSave(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-white">Build a workout</h1>
        {step < 3 && <StepDots step={step} />}
      </header>

      {/* ── Step 1: muscle groups ── */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-up">
          <SavedTemplates
            templates={savedTemplates}
            onStart={handleTemplateStart}
            onDelete={deleteTemplate}
          />
          <p className="text-sm text-muted">Tap the muscle groups you want to train today.</p>
          <BodyPartSelector selected={selected} avoided={settings.avoidedParts} onToggle={toggle} />
          {settings.avoidedParts.length > 0 && (
            <p className="text-xs text-muted">Locked groups are avoided in your settings.</p>
          )}
          <button
            type="button"
            disabled={selected.length === 0}
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-lime py-4 font-display text-lg font-bold text-ink transition-transform active:scale-[0.98] disabled:opacity-30"
          >
            Continue
          </button>
        </div>
      )}

      {/* ── Step 2: preferences ── */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-up">
          <div>
            <div className="mb-2 text-sm font-semibold text-white">Duration</div>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <Choice key={d} active={duration === d} onClick={() => setDuration(d)}>{d}m</Choice>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold text-white">Intensity</div>
            <div className="flex gap-2">
              {INTENSITIES.map((i) => (
                <Choice key={i} active={intensity === i} onClick={() => setIntensity(i)}>{i}</Choice>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setNoEquipment((v) => !v)}
            className="flex w-full items-center justify-between rounded-2xl border border-line bg-surface p-4"
          >
            <div className="text-left">
              <div className="text-sm font-semibold text-white">No equipment at all</div>
              <div className="text-xs text-muted">Bodyweight only, ignore gear settings</div>
            </div>
            <div className={`h-6 w-11 rounded-full p-0.5 transition-colors ${noEquipment ? 'bg-lime' : 'bg-elevated'}`}>
              <div className={`h-5 w-5 rounded-full bg-white transition-transform ${noEquipment ? 'translate-x-5' : ''}`} />
            </div>
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-2xl border border-line px-6 py-4 font-display font-bold text-muted"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => runGenerate()}
              className="flex-1 rounded-2xl bg-lime py-4 font-display text-lg font-bold text-ink transition-transform active:scale-[0.98]"
            >
              Generate
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: results ── */}
      {step === 3 && result && (
        <div className="space-y-4 animate-fade-up">
          {result.message && (
            <div className="rounded-2xl border border-lime/40 bg-lime/10 p-4 text-sm text-lime">
              {result.message}
            </div>
          )}

          {result.exercises.length === 0 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full rounded-2xl border border-line py-4 font-display font-bold text-white"
            >
              Adjust selection
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">
                  {result.exercises.length} exercises · {duration} min · <span className="capitalize">{intensity}</span>
                </span>
                {/* Save button */}
                {!saved && (
                  <button
                    type="button"
                    onClick={() => setShowSave((v) => !v)}
                    className="flex items-center gap-1.5 rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:text-white"
                  >
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
                      <path d="M17 21v-8H7v8M7 3v5h8" />
                    </svg>
                    Save workout
                  </button>
                )}
                {saved && (
                  <span className="text-xs font-semibold text-lime">✓ Saved!</span>
                )}
              </div>

              {/* Save name input */}
              {showSave && (
                <div className="flex gap-2 animate-fade-up">
                  <input
                    type="text"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    placeholder="Workout name (e.g. Push day)"
                    className="flex-1 rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-lime focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    className="rounded-xl bg-lime px-4 py-2.5 font-display text-sm font-bold text-ink disabled:opacity-40"
                  >
                    Save
                  </button>
                </div>
              )}

              {result.exercises.map((ex, i) => (
                <ExerciseCard key={ex.id} exercise={ex} index={i} />
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setStep(1); setSaved(false); setShowSave(false); }}
                  className="rounded-2xl border border-line px-5 py-4 font-display font-bold text-white transition-colors hover:border-muted"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => runGenerate()}
                  className="rounded-2xl border border-line px-5 py-4 font-display font-bold text-white transition-colors hover:border-muted"
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => navigate('active', { exercises: result.exercises, muscleGroups: selected, duration })}
                  className="flex-1 rounded-2xl bg-lime py-4 font-display text-base font-bold text-ink transition-transform active:scale-[0.98]"
                >
                  Start workout
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
