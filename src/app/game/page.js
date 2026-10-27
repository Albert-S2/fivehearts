import Link from "next/link";

const MODES = [
  {
    id: "solo",
    name: "Solo",
    description: "Play on your own and build the highest score.",
    icon: "★",
    accent: "from-cyan-400/20",
  },
  {
    id: "duel",
    name: "Duel",
    description: "Face one opponent in a direct trivia fight.",
    icon: "⚔",
    accent: "from-amber-400/20",
  },
  {
    id: "battle",
    name: "Battle",
    description: "Bring teams together and compete for the top score.",
    icon: "✦",
    accent: "from-rose-400/20",
  },
];

export default function GamePage() {
  return (
    <main className="arcade-shell relative flex h-screen flex-col justify-between overflow-hidden bg-[#090A0F] px-5 py-5 text-white sm:px-8 sm:py-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <Link className="text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-300" href="/">
            ← Back to game room
          </Link>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
            Five Hearts Quiz
          </span>
        </header>

        <section className="flex min-h-0 flex-1 flex-col justify-center py-7 sm:py-8">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Choose your mode</p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              How will you play?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Pick a way to play, gather everyone around, and start the next challenge.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {MODES.map((mode) => (
              <Link
                className="group rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 text-left shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-fuchsia-950/40"
                key={mode.id}
                href={`/game/${mode.id}`}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-fuchsia-400 to-violet-500 text-3xl font-black text-[#090A0F] shadow-lg shadow-fuchsia-500/20">
                  {mode.icon}
                </span>
                <h2 className="mt-5 text-2xl font-black text-white">{mode.name}</h2>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{mode.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-fuchsia-300">
                  Choose {mode.name}
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="shrink-0 border-t border-white/10 pt-4 text-center text-xs text-slate-500">
          Every mode uses the Five Hearts Quiz scoring and heart system.
        </footer>
      </div>
    </main>
  );
}
