import Link from "next/link";
import AdContainer from "../../components/AdContainer";

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
    <main className="manga-shell min-h-screen bg-slate-950 px-5 py-8 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
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
                className={`group rounded-3xl border border-slate-700 bg-gradient-to-br ${mode.accent} to-slate-900 p-7 text-left transition hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-950/30`}
                key={mode.id}
                href={`/game/${mode.id}`}
              >
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-400 text-3xl font-black text-slate-950">
                  {mode.icon}
                </span>
                <h2 className="mt-8 text-3xl font-black group-hover:text-amber-300">{mode.name}</h2>
                <p className="mt-3 min-h-14 leading-7 text-slate-400">{mode.description}</p>
                <span className="mt-7 inline-block font-black text-amber-300">Choose {mode.name} →</span>
              </Link>
            ))}
          </div>
          <AdContainer
            className="mx-auto mt-10 h-[250px] w-[300px]"
            format="rectangle"
            slotId="five-hearts-category-selection"
          />
        </section>

        <footer className="border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          Every mode uses the Five Hearts scoring and heart system.
        </footer>
      </div>
    </main>
  );
}
