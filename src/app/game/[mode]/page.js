import Link from "next/link";
import BattleSetup from "../../../components/BattleSetup";

const MODE_DETAILS = {
  solo: {
    name: "Solo",
    description: "A personal trivia challenge with a score to beat.",
  },
  duel: {
    name: "Duel",
    description: "A head-to-head Five Hearts Quiz match for two players.",
  },
  battle: {
    name: "Battle",
    description: "A team trivia arena for a larger group.",
  },
};

//generateStaticParams function is used to generate the static paths for each game mode. It returns an array of objects, each containing a mode parameter corresponding to the keys in the MODE_DETAILS object. This allows Next.js to pre-render pages for each game mode at build time, improving performance and SEO.
export function generateStaticParams() {
  return Object.keys(MODE_DETAILS).map((mode) => ({ mode }));
}
// The ModePage component is an asynchronous function that takes in a params object, which contains the mode parameter. It retrieves the mode from the params and looks up the corresponding details in the MODE_DETAILS object. If the mode is "battle", it renders the BattleSetup component. Otherwise, it renders a main section with information about the selected game mode, including its name and description. If the mode is not found in MODE_DETAILS, it defaults to a generic message indicating that the game mode is not available yet.
export default async function ModePage({ params = {} }) {
  const resolvedParams = await params;
  const mode = resolvedParams?.mode;
  const details = MODE_DETAILS[mode] || {
    name: "Five Hearts Quiz",
    description: "This game mode is not available yet.",
  };

  if (mode === "battle" || mode === "duel") return <BattleSetup mode={mode} />;

  return (
    <main className="manga-shell flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <section className="w-full max-w-xl text-center">
        <Link className="inline-flex rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg transition-all hover:border-cyan-400/80 hover:text-white" href="/game">
          ← Back to modes
        </Link>
        <div className="mt-12 rounded-3xl border border-amber-400/30 bg-slate-900 p-8 shadow-2xl shadow-amber-950/20">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-400 text-3xl font-black text-slate-950">
            5
          </span>
          <p className="mt-8 text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Five Hearts Quiz · {details.name}</p>
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
