import Link from "next/link";
import BattleSetup from "../../../components/BattleSetup";

const MODE_DETAILS = {
  solo: {
    name: "Solo",
    description: "A personal trivia challenge with a score to beat.",
  },
  duel: {
    name: "Duel",
    description: "A head-to-head Five Hearts match for two players.",
  },
  battle: {
    name: "Battle",
    description: "A team trivia arena for a larger group.",
  },
};

export function generateStaticParams() {
  return Object.keys(MODE_DETAILS).map((mode) => ({ mode }));
}

export default async function ModePage({ params = {} }) {
  const resolvedParams = await params;
  const mode = resolvedParams?.mode;
  const details = MODE_DETAILS[mode] || {
    name: "Five Hearts",
    description: "This game mode is not available yet.",
  };

  if (mode === "battle") return <BattleSetup />;

  return (
    <main className="manga-shell flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <section className="w-full max-w-xl text-center">
        <Link className="text-sm font-semibold text-slate-500 hover:text-amber-300" href="/game">
          ← Back to modes
        </Link>
        <div className="mt-12 rounded-3xl border border-amber-400/30 bg-slate-900 p-8 shadow-2xl shadow-amber-950/20">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-400 text-3xl font-black text-slate-950">
            5
          </span>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Five Hearts · {details.name}</p>
          <h1 className="mt-4 text-4xl font-black">{details.name} setup</h1>
          <p className="mt-4 leading-7 text-slate-400">{details.description}</p>
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 px-5 py-6 text-sm text-slate-500">
            This mode is ready for its game setup and rules.
          </div>
        </div>
      </section>
    </main>
  );
}
