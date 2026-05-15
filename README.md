# 💪 FitFlow — Personal Workout Tracker

A sleek, mobile-first workout tracker and AI workout generator. No backend, no account, no fees — everything runs in your browser and saves locally.

---

## ✨ Features

- **Workout Generator** — pick muscle groups, duration, and intensity. FitFlow builds a custom session from a database of 58+ exercises
- **Active Workout** — check off sets in real time, rest timer between sets (30 / 60 / 90s countdown ring)
- **Exercise Detail** — tap any exercise to see a muscle diagram, full instructions, and a YouTube demo link
- **History & Streaks** — weekly bar chart, current streak, total sessions and exercises logged
- **Settings** — lock out injury-prone muscle groups permanently, set equipment availability and fitness level
- **Works offline** — PWA with service worker, installable to home screen
- **All data stays on your device** — localStorage only, nothing sent anywhere

---

## 🖥️ Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Data | localStorage (no backend) |
| PWA | vite-plugin-pwa + Workbox |
| Android | Capacitor |
| Deploy | GitHub Pages (GitHub Actions) |
| Fonts | Syne (headings) · DM Sans (body) |

---

## 🚀 Running Locally

```bash
git clone https://github.com/YOUR_USERNAME/fitflow.git
cd fitflow
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Build & Preview

```bash
npm run build    # production build
npm run preview  # preview production build locally
```

---

## 📱 Deploy

The app auto-deploys to **GitHub Pages** on every push to `master` via GitHub Actions.

To enable: go to your repo → **Settings → Pages → Source → GitHub Actions**

Live URL: `https://YOUR_USERNAME.github.io/fitflow`

---

## 🗂️ Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Home screen, streak, stats
│   ├── WorkoutGenerator.jsx   # 3-step workout builder
│   ├── ActiveWorkout.jsx      # Live workout + set tracking
│   ├── History.jsx            # Past workouts + weekly chart
│   ├── Settings.jsx           # Equipment, fitness level, avoided areas
│   ├── ExerciseCard.jsx       # Clickable exercise card
│   ├── ExerciseDetailModal.jsx # Muscle diagram + YouTube link
│   ├── MuscleDiagram.jsx      # SVG body with highlighted muscle
│   ├── BodyPartSelector.jsx   # Muscle group grid selector
│   └── RestTimer.jsx          # Countdown ring timer
├── data/
│   └── exercises.js           # 58+ exercise database
├── hooks/
│   └── useWorkoutStore.js     # All state + localStorage logic
└── App.jsx                    # Screen navigation
```

---

## 🏋️ Exercise Database

58+ exercises across 9 muscle groups:

`Chest` · `Back` · `Shoulders` · `Biceps` · `Triceps` · `Legs` · `Glutes` · `Calves` · `Core`

Each exercise includes difficulty level (`beginner` / `intermediate` / `advanced`), equipment requirement (`none` / `bands` / `dumbbells`), and an `avoid_if` list for injury-safe filtering.

---

## 🎨 Design

- Dark near-black background `#0a0a0a`
- Electric lime accent `#c8f135`
- Flat, sharp, no gradients or glassmorphism
- Mobile-first, fully responsive
