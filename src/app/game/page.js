"use client";

import Link from "next/link";
import { useState } from "react";
import GameLeaderView from "../../components/GameLeaderView";
import questionBank, { categories } from "../../data/questionBank";

const MODES = [
  {
    id: "SOLO",
    title: "Solo",
    description: "Play alone and build the highest score across the trivia board.",
    accent: "from-cyan-400/20 to-slate-900",
    icon: "★",
  },
  {
    id: "DUEL",
    title: "Duel",
    description: "Go head-to-head with one opponent. Every point and heart matters.",
    accent: "from-amber-400/20 to-slate-900",
    icon: "⚔",
  },
  {
    id: "BATTLE",
    title: "Battle",
    description: "Bring multiple teams into the arena and fight for the top score.",
    accent: "from-rose-400/20 to-slate-900",
    icon: "✦",
  },
];

const demoQuestion = questionBank[0];

function ModeSelection({ onSelect }) {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-5xl">
        <Link className="text-sm font-semibold text-slate-500 hover:text-amber-300" href="/">
          ← Back to games
        </Link>
        <div className="mt-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Five Hearts</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">Choose your mode</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Pick how you want to enter the trivia arena.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {MODES.map((mode) => (
            <button
              className={`group rounded-3xl border border-slate-700 bg-gradient-to-br ${mode.accent} p-7 text-left transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-950/30`}
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              type="button"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-400 text-3xl font-black text-slate-950">
                {mode.icon}
              </span>
              <h2 className="mt-8 text-3xl font-black group-hover:text-amber-300">{mode.title}</h2>
              <p className="mt-3 min-h-20 leading-7 text-slate-400">{mode.description}</p>
              <span className="mt-6 inline-block font-black text-amber-300">Enter arena →</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default function GamePage() {
  const [selectedMode, setSelectedMode] = useState(null);

  if (!selectedMode) return <ModeSelection onSelect={setSelectedMode} />;

  return (
    <div className="relative">
      <button
        className="absolute left-5 top-5 z-20 rounded-lg border border-slate-600 bg-slate-900/80 px-3 py-2 text-sm font-bold text-slate-300 hover:border-amber-400 hover:text-amber-300"
        onClick={() => setSelectedMode(null)}
        type="button"
      >
        Change mode
      </button>
      <GameLeaderView
        initialMode={selectedMode}
        initialCategories={categories.slice(0, 3)}
        initialQuestion={demoQuestion}
        initialTeams={[
          {
            id: "team-1",
            name: selectedMode === "SOLO" ? "Player One" : "The Challengers",
            hearts: 5,
            points: 0,
            isEliminated: false,
          },
          {
            id: "team-2",
            name: "Quiz Masters",
            hearts: 5,
            points: 0,
            isEliminated: false,
          },
        ]}
      />
    </div>
  );
}
