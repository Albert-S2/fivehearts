import Link from "next/link";

const MODES = [
  {
    id: "solo",
    name: "Solo",
    description: "Play on your own and keep going until all five hearts are gone.",
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
    <main className="arcade-shell relative flex h-screen flex-col justify-between overflow-hidden bg-[#090A0F] px-5 pb-24 pt-5 text-white sm:px-8 sm:pt-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <Link className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1.5 text-xs font-semibold text-slate-400 shadow-sm transition-all duration-200 hover:text-cyan-400" href="/">
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

          <div className="mt-5 grid min-h-0 grid-cols-3 gap-2 sm:mt-8 sm:gap-4">
            {MODES.map((mode) => (
              <Link
                className="group rounded-2xl border border-slate-700/60 bg-slate-900/80 p-2.5 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01] hover:border-cyan-400/80 hover:shadow-cyan-950/40 active:scale-[0.99] sm:p-4 lg:p-6"
                key={mode.id}
                href={`/game/${mode.id}`}
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 via-fuchsia-400 to-violet-500 text-xl font-black text-[#090A0F] shadow-lg shadow-fuchsia-500/20 sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl lg:h-14 lg:w-14 lg:text-3xl">
                  {mode.icon}
                </span>
                <h2 className="mt-2 text-sm font-black text-white sm:mt-4 sm:text-xl lg:mt-5 lg:text-2xl">{mode.name}</h2>
                <p className="mt-2 hidden min-h-12 text-sm leading-6 text-slate-400 sm:block">{mode.description}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black text-fuchsia-300 transition-transform duration-300 group-hover:translate-x-1 sm:mt-4 sm:gap-2 sm:text-xs lg:mt-5 lg:text-sm">
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
