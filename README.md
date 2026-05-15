# DriveMind 🚗

Israeli right-of-way training app — practice intersection priority decisions under pressure.

## Features

- 🎯 **Three modes**: Learn, Practice, Test (10-question challenge)
- 🧠 **Smart practice** — adapts to your weak spots
- 🚦 **Realistic scenarios** — main road + side street, uncontrolled, left-turn, T-junction, U-turn
- 🚶 **Pedestrians** at crosswalks (occasional)
- 🏆 **14 achievements** to unlock
- 📋 **Mistake history** — review and replay every wrong answer
- ⚙️ **3 difficulty levels**
- 🔊 **Audio feedback** — generated on the fly, no asset files
- 📱 **Installable PWA** — works offline once installed

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (with persist middleware)
- Vitest

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

The `dist/` folder is a static bundle — drag it onto Netlify, Vercel, GitHub Pages, etc.

## Test the priority engine

```bash
npm test
```
