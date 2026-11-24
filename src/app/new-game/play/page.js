import Link from "next/link";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = {
  ...createPageMetadata({
    path: "/new-game/play",
    title: "New Game Playtest | Five Hearts",
    description: "A standalone placeholder for building and testing the new game.",
  }),
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewGamePlayPage() {
  return (
    <main className="relative flex h-full min-h-0 flex-col overflow-y-auto bg-[#090A0F] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 pb-4">
          <Link
            className="text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-300"
            href="/new-game"
          >
            ← Back to game setup
          </Link>
          <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
            Playtest placeholder
          </span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
              New game
            </p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              Build the gameplay here
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              This separate page is ready for the new game’s playable
              prototype. The game itself has not been built yet.
            </p>
          </div>

          <div
            aria-label="New game playtest area"
            className="flex min-h-80 flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-12 text-center"
          >
            <span
              aria-hidden="true"
              className="grid h-16 w-16 place-items-center rounded-2xl border border-fuchsia-300/20 bg-fuchsia-300/10 text-3xl text-fuchsia-200"
            >
              ▶
            </span>
            <h2 className="mt-5 text-xl font-bold text-white">
              Gameplay goes here
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              Replace this area with the new game when you’re ready to start
              implementing it.
            </p>
          </div>
        </section>

        <footer className="border-t border-white/10 pt-4 text-center text-xs text-slate-500">
          Standalone playtest · Not connected to the main game menu
        </footer>
      </div>
    </main>
  );
}
