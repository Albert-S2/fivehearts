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
    <main className="manga-shell min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <Link className="text-sm font-semibold text-slate-500 hover:text-amber-300" href="/">
            ← Back to game room
          </Link>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-600">Five Hearts</span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-12">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Choose your mode</p>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">How will you play?</h1>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Choose a mode to set up your Five Hearts game.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {MODES.map((mode) => (
              <Link
                className={`boutique-card group border-stone-300/70 bg-white p-7 text-left hover:-translate-y-1 hover:border-forest-sage/40 hover:shadow-xl`}
                key={mode.id}
                href={`/game/${mode.id}`}
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brass text-3xl font-black text-ink-blue shadow-[inset_0_-4px_0_rgb(154_107_45_/_0.3)]">
                  {mode.icon}
                </span>
                <h2 className="mt-8 text-3xl font-black group-hover:text-terracotta">{mode.name}</h2>
                <p className="mt-3 min-h-14 leading-7 text-slate-400">{mode.description}</p>
                <span className="boutique-button mt-7 inline-flex px-4 py-2 text-sm">Choose {mode.name} →</span>
              </Link>
            ))}
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          Every mode uses the Five Hearts scoring and heart system.
        </footer>
      </div>
    </main>
  );
}
