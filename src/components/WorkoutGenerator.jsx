import { useState } from 'react';
import { useWorkoutStore, generateWorkout } from '../hooks/useWorkoutStore.js';
import BodyPartSelector from './BodyPartSelector.jsx';
import ExerciseCard from './ExerciseCard.jsx';

const DURATIONS = [20, 30, 45, 60];
const INTENSITIES = ['easy', 'medium', 'hard'];

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

export default function WorkoutGenerator({ navigate }) {
  const { settings } = useWorkoutStore();
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState([]);
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState(settings.fitnessLevel === 'beginner' ? 'easy' : 'medium');
  const [noEquipment, setNoEquipment] = useState(false);
  const [result, setResult] = useState(null);

  const toggle = (id) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const runGenerate = () => {
    const r = generateWorkout({
      muscleGroups: selected,
      duration,
      intensity,
      equipment: noEquipment ? 'none' : settings.equipment,
      fitnessLevel: settings.fitnessLevel,
      avoidedParts: settings.avoidedParts,
    });
    setResult(r);
    setStep(3);
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold text-white">Build a workout</h1>
        <StepDots step={step} />
      </header>

      {step === 1 && (
        <div className="space-y-5 animate-fade-up">
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

      {step === 2 && (
        <div className="space-y-6 animate-fade-up">
          <div>
            <div className="mb-2 text-sm font-semibold text-white">Duration</div>
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <Choice key={d} active={duration === d} onClick={() => setDuration(d)}>
                  {d}m
                </Choice>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold text-white">Intensity</div>
            <div className="flex gap-2">
              {INTENSITIES.map((i) => (
                <Choice key={i} active={intensity === i} onClick={() => setIntensity(i)}>
                  {i}
                </Choice>
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
              onClick={runGenerate}
              className="flex-1 rounded-2xl bg-lime py-4 font-display text-lg font-bold text-ink transition-transform active:scale-[0.98]"
            >
              Generate
            </button>
          </div>
        </div>
      )}

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
              <div className="text-sm text-muted">
                {result.exercises.length} exercises · {duration} min · <span className="capitalize">{intensity}</span>
              </div>
              {result.exercises.map((ex, i) => (
                <ExerciseCard key={ex.id} exercise={ex} index={i} />
              ))}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={runGenerate}
                  className="rounded-2xl border border-line px-6 py-4 font-display font-bold text-white transition-colors hover:border-muted"
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  onClick={() => navigate('active', { exercises: result.exercises, muscleGroups: selected, duration })}
                  className="flex-1 rounded-2xl bg-lime py-4 font-display text-lg font-bold text-ink transition-transform active:scale-[0.98]"
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
