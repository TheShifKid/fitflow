import { useState, useEffect, useRef } from 'react';

const R = 52;
const CIRC = 2 * Math.PI * R;

export default function RestTimer({ seconds, onDone }) {
  const [remaining, setRemaining] = useState(seconds);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onDoneRef.current?.();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const progress = seconds > 0 ? remaining / seconds : 0;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r={R} fill="none" stroke="#2a2a2a" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#c8f135"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={CIRC * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-sans text-5xl font-bold tabular-nums text-white">{remaining}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">rest</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setRemaining(0)}
        className="rounded-full border border-line px-5 py-2 text-sm font-semibold text-muted transition-colors hover:border-muted hover:text-white"
      >
        Skip rest
      </button>
    </div>
  );
}
