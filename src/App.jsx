import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import WorkoutGenerator from './components/WorkoutGenerator.jsx';
import ActiveWorkout from './components/ActiveWorkout.jsx';
import History from './components/History.jsx';
import Settings from './components/Settings.jsx';

const NAV = [
  {
    id: 'dashboard',
    label: 'Home',
    icon: 'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',
  },
  {
    id: 'generator',
    label: 'Generate',
    icon: 'M12 5v14M5 12h14',
  },
  {
    id: 'history',
    label: 'History',
    icon: 'M12 7v5l3 3M3 12a9 9 0 1 0 9-9 9 9 0 0 0-8 5M3 4v4h4',
  },
];

function NavIcon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function App() {
  const [screen, setScreen] = useState('dashboard');
  const [payload, setPayload] = useState(null);
  const [history, setHistory] = useState([]);

  const navigate = (next, data = null) => {
    setHistory((h) => (next === screen ? h : [...h, screen]));
    setPayload(data);
    setScreen(next);
    window.scrollTo({ top: 0 });
  };

  const goBack = () => {
    setHistory((h) => {
      const prev = h.length ? h[h.length - 1] : 'dashboard';
      setScreen(prev);
      return h.slice(0, -1);
    });
    window.scrollTo({ top: 0 });
  };

  const screens = {
    dashboard: <Dashboard navigate={navigate} />,
    generator: <WorkoutGenerator navigate={navigate} />,
    active: <ActiveWorkout navigate={navigate} payload={payload} />,
    history: <History navigate={navigate} />,
    settings: <Settings />,
  };

  const showNav = screen !== 'active';

  return (
    <div className="min-h-screen bg-ink font-sans text-white">
      <div className="mx-auto flex min-h-screen max-w-md flex-col">
        <header className="flex items-center justify-between px-5 pb-2 pt-6">
          <div className="flex items-center gap-2">
            {screen !== 'dashboard' && (
              <button
                type="button"
                onClick={goBack}
                aria-label="Back"
                className="-ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-white transition-colors active:scale-95 hover:border-muted"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('dashboard')}
              className="font-display text-xl font-extrabold tracking-tight text-white"
            >
              Fit<span className="text-lime">Flow</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate('settings')}
            aria-label="Settings"
            className={`rounded-full p-2 transition-colors ${
              screen === 'settings' ? 'text-lime' : 'text-muted hover:text-white'
            }`}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
            </svg>
          </button>
        </header>

        <main key={screen} className="flex-1 animate-fade-up px-5 pb-28 pt-4">
          {screens[screen]}
        </main>

        {showNav && (
          <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-ink/95 backdrop-blur">
            <div className="mx-auto flex max-w-md justify-around px-5 py-2.5">
              {NAV.map((item) => {
                const active = screen === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl px-5 py-1.5 transition-colors ${
                      active ? 'text-lime' : 'text-muted'
                    }`}
                  >
                    <NavIcon d={item.icon} />
                    <span className="text-[11px] font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
