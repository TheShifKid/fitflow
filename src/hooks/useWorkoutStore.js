import { createContext, useContext, useState, useEffect, useCallback, useMemo, createElement } from 'react';
import { exercises } from '../data/exercises.js';

const STORAGE_KEY = 'fitflow-data-v1';

const DEFAULT_DATA = {
  workouts: [],
  settings: {
    avoidedParts: [],
    equipment: 'none', // 'none' | 'bands' | 'dumbbells'
    fitnessLevel: 'beginner', // 'beginner' | 'intermediate' | 'advanced'
  },
};

const DIFFICULTY_RANK = { beginner: 1, intermediate: 2, advanced: 3 };
const INTENSITY_FACTOR = { easy: 0.85, medium: 1, hard: 1.2 };
const EXERCISE_COUNT = { 20: 4, 30: 5, 45: 6, 60: 8 };

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw);
    return {
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
      settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
    };
  } catch {
    return DEFAULT_DATA;
  }
}

// ---- date helpers ----
export function dayKey(d) {
  const date = new Date(d);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function startOfWeek(d = new Date()) {
  const date = new Date(d);
  const day = date.getDay(); // 0 = Sunday
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}

// ---- workout generator (pure) ----
export function generateWorkout({ muscleGroups, duration, intensity, equipment, fitnessLevel, avoidedParts }) {
  const avoided = new Set(avoidedParts || []);
  const levelCeiling = DIFFICULTY_RANK[fitnessLevel] || 1;
  const targets = (muscleGroups || []).filter((m) => !avoided.has(m));

  const pool = exercises.filter((ex) => {
    if (!targets.includes(ex.muscle)) return false;
    if (DIFFICULTY_RANK[ex.difficulty] > levelCeiling) return false;
    if (ex.equipment !== 'none' && ex.equipment !== equipment) return false;
    if (ex.avoid_if.some((a) => avoided.has(a))) return false;
    return true;
  });

  if (pool.length === 0) {
    return { exercises: [], message: 'No exercises match these settings. Try adding equipment, raising your fitness level, or picking different muscle groups.' };
  }

  const wanted = EXERCISE_COUNT[duration] || 5;
  const factor = INTENSITY_FACTOR[intensity] || 1;

  // Bucket by muscle so the workout covers each selected group.
  const byMuscle = {};
  for (const ex of pool) {
    (byMuscle[ex.muscle] ||= []).push(ex);
  }
  Object.values(byMuscle).forEach(shuffle);

  const picked = [];
  const usedIds = new Set();

  // Round-robin: one exercise per muscle group until we hit the target count.
  let added = true;
  while (picked.length < wanted && added) {
    added = false;
    for (const muscle of targets) {
      if (picked.length >= wanted) break;
      const bucket = byMuscle[muscle];
      if (!bucket) continue;
      const next = bucket.find((ex) => !usedIds.has(ex.id));
      if (next) {
        usedIds.add(next.id);
        picked.push(next);
        added = true;
      }
    }
  }

  const tuned = picked.map((ex) => ({
    ...ex,
    reps: ex.reps <= 1 ? 1 : Math.max(4, Math.round(ex.reps * factor)),
  }));

  const message =
    tuned.length < wanted
      ? `Only ${tuned.length} matching exercise${tuned.length === 1 ? '' : 's'} found — add equipment or muscle groups for a fuller session.`
      : null;

  return { exercises: tuned, message };
}

// ---- context ----
const StoreContext = createContext(null);

export function WorkoutProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addWorkout = useCallback((workout) => {
    setData((d) => ({
      ...d,
      workouts: [{ id: `w-${Date.now()}`, date: new Date().toISOString(), ...workout }, ...d.workouts],
    }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setData((d) => ({ ...d, settings: { ...d.settings, ...patch } }));
  }, []);

  const resetAll = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setData(DEFAULT_DATA);
  }, []);

  const stats = useMemo(() => computeStats(data.workouts), [data.workouts]);

  const value = useMemo(
    () => ({ ...data, addWorkout, updateSettings, resetAll, stats }),
    [data, addWorkout, updateSettings, resetAll, stats],
  );

  return createElement(StoreContext.Provider, { value }, children);
}

export function useWorkoutStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useWorkoutStore must be used within WorkoutProvider');
  return ctx;
}

// ---- stats ----
function computeStats(workouts) {
  const dayKeys = new Set(workouts.map((w) => dayKey(w.date)));
  const workedOutToday = dayKeys.has(dayKey(new Date()));

  // current streak: consecutive days ending today or yesterday
  let streak = 0;
  const cursor = new Date();
  if (!dayKeys.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dayKeys.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  // this week
  const weekStart = startOfWeek();
  const weekDays = [false, false, false, false, false, false, false];
  for (const w of workouts) {
    const d = new Date(w.date);
    if (d >= weekStart) weekDays[d.getDay()] = true;
  }
  const weeklyCount = weekDays.filter(Boolean).length;

  const totalExercises = workouts.reduce((sum, w) => sum + (w.exerciseCount || 0), 0);

  return {
    workedOutToday,
    streak,
    weekDays,
    weeklyCount,
    totalSessions: workouts.length,
    totalExercises,
  };
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
