import Link from "next/link";
import NewGameBoard from "../../../components/NewGameBoard";
import { createPageMetadata } from "../../../lib/seo";

export const metadata = {
  ...createPageMetadata({
    path: "/new-game/play",
    title: "The Hexagon Color Match Game | Five Hearts",
    description:
      "Memorize a wave of metallic colors, then match the neighboring hexagon triangles to score points.",
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
              Metallic reveal
            </p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              The Hexagon
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Memorize the center-color wave, then select matching colors from
              the six neighboring triangles. Complete five rounds to advance
              each level. Correct matches earn points equal to the level, while
              mistakes cost a heart. Final-level matches are worth 100 points.
            </p>
          </div>

          <div className="flex min-h-80 flex-1 items-center justify-center rounded-3xl border border-slate-700/70 bg-slate-900/50 px-4 py-8">
            <NewGameBoard />
          </div>
        </section>

        <footer className="border-t border-white/10 pt-4 text-center text-xs text-slate-500">
          Standalone playtest · Not connected to the main game menu
        </footer>
      </div>
    </main>
  );
}
