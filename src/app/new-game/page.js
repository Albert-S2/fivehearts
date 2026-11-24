import Link from "next/link";
import { createPageMetadata } from "../../lib/seo";

export const metadata = {
  ...createPageMetadata({
    path: "/new-game",
    title: "New Game Prototype | Five Hearts",
    description: "A standalone workspace for building the next Five Hearts game.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewGamePage() {
  return (
    <main className="relative flex h-full min-h-0 flex-col overflow-y-auto bg-[#090A0F] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-sm font-bold tracking-wide text-slate-300">
            Game development space
          </span>
          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            In development
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
              A fresh start
            </p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              Your next game starts here
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              This is a standalone space to shape your new game. Add its ideas,
              rules, and gameplay here when you’re ready.
            </p>
          </div>

          <div
            aria-label="New game prototype workspace"
            className="flex min-h-72 flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center"
          >
            <span
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-3xl text-cyan-200"
            >
              ✦
            </span>
            <h2 className="mt-5 text-xl font-bold text-white">
              Game prototype area
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Your new game’s first components can take shape here without
              changing the existing games or game menu.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link
              className="arcade-launch-button rounded-xl px-8 py-4 text-sm font-black"
              href="/new-game/play"
            >
              Start game
              <span aria-hidden="true" className="ml-2">→</span>
            </Link>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-4 text-center text-xs text-slate-500">
          Standalone prototype · Not connected to the main game menu
        </footer>
      </div>
    </main>
  );
}
