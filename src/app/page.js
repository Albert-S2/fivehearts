import Link from "next/link";
import AdContainer from "../components/AdContainer";

const TRIVIA_CATEGORIES = [
  {
    name: "Science",
    question: "What does the chemical symbol Au represent?",
    answer: "Gold.",
    explanation: "Au comes from the Latin word aurum, the traditional name for gold.",
  },
  {
    name: "Geography",
    question: "What is the capital city of Canada?",
    answer: "Ottawa.",
    explanation: "Ottawa is in Ontario, near the border with Quebec, and is Canada’s national capital.",
  },
  {
    name: "History",
    question: "Which civilization built the mountain citadel of Machu Picchu?",
    answer: "The Inca.",
    explanation: "The Inca built Machu Picchu in the Andes during the 15th century.",
  },
  {
    name: "Nature",
    question: "What process lets plants use sunlight to make sugars?",
    answer: "Photosynthesis.",
    explanation: "Plants use light energy to convert water and carbon dioxide into sugars, releasing oxygen.",
  },
  {
    name: "Space",
    question: "Which planet is home to Olympus Mons, the largest known volcano in the Solar System?",
    answer: "Mars.",
    explanation: "Olympus Mons is a giant shield volcano on Mars, rising roughly 22 kilometers above its surroundings.",
  },
];

export default function Home() {
  return (
    <main className="relative h-full min-h-0 overflow-x-hidden overflow-y-auto bg-[#090A0F] text-white">
      <section
        aria-label="Five Hearts game launcher"
        className="relative isolate flex h-[100dvh] flex-col overflow-hidden px-4 pt-4 sm:px-8 sm:pt-6"
      >
        <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col pb-28 sm:pb-24">
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-xl font-black text-[#090A0F] shadow-lg shadow-cyan-500/20">
                5
              </span>
              <span className="block text-lg font-black tracking-tight">Five Hearts Quiz</span>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center py-7 text-center sm:py-8">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Choose your next game</p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              What are we playing?
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Gather around, pick a challenge, and let the room decide who takes the crown.
            </p>

            <Link
              className="group mt-7 w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/80 hover:shadow-cyan-950/40 sm:p-6"
              href="/game"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-fuchsia-400 to-violet-500 text-3xl font-black text-[#090A0F] shadow-lg shadow-fuchsia-500/20">
                  5
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black text-white sm:mt-6 sm:text-3xl">Five Hearts Quiz</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                A fast trivia battle where every team protects five hearts while collecting points.
              </p>
              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <div className="flex gap-2">
                  {["bg-rose-400", "bg-cyan-400", "bg-emerald-400", "bg-amber-300", "bg-fuchsia-400"].map((color) => (
                    <span className={`h-3 w-3 rounded-full ${color}`} key={color} />
                  ))}
                </div>
                <span className="flex items-center gap-2 text-sm font-black text-fuchsia-300">
                  Open game
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-cyan-400/20 bg-slate-950/95 px-4 py-12 sm:px-8 sm:py-20">
        <div aria-hidden="true" className="arcade-orb arcade-orb-cyan opacity-30" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia opacity-25" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">The Five Hearts guide</p>
            <h2 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl">
              How to Play Five Hearts
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
              Five Hearts is a trivia game about balancing knowledge and survival. Play alone, challenge one opponent, or bring a group together for a round-based team battle.
            </p>
          </header>

          <section aria-label="Game rules" className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2">
            <article className="rounded-2xl border border-cyan-400/25 bg-slate-900/80 p-5 shadow-xl shadow-cyan-950/20 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">The five-heart rule</p>
              <h3 className="mt-2 text-xl font-black text-white">Stay alive to keep scoring</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Every player or team starts with five hearts. A correct answer adds 10 points; a wrong answer or a timeout costs one heart. When a team reaches zero hearts, it is eliminated and cannot take more turns. In scheduled team games, the team with the most points at the finish wins.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-fuchsia-300">Solo mode</p>
              <h3 className="mt-2 text-xl font-black text-white">Play until your hearts run out</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Solo is a one-player run with no fixed question limit. Build your score by answering correctly and protect your hearts from mistakes. Choose the 60-second timer or turn it off before starting. The run ends when you lose all five hearts.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-300">Duel mode</p>
              <h3 className="mt-2 text-xl font-black text-white">Two teams, equal turns</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Name the two teams and choose an even question count. Dice lock the turn order for each round, giving both sides the same number of turns. Correct answers add points, wrong answers cost a heart, and a team with no hearts is out. The match ends when only one team remains or the scheduled questions are complete.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Round-based team battle</p>
              <h3 className="mt-2 text-xl font-black text-white">Roll, answer, review, repeat</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Set up several teams and choose the match length. At the start of each round, dice determine a locked turn order. Each surviving team answers once, then everyone can review the standings before the next round. Eliminated teams skip future turns; play ends when one team remains or all scheduled rounds are complete.
              </p>
            </article>
          </section>

          <div className="mx-auto mt-10 w-full max-w-3xl">
            <AdContainer
              className="w-full"
              format="auto"
              slotId="5081837565"
              style={{ minHeight: 250, width: "100%" }}
            />
          </div>

          <section aria-labelledby="trivia-samples-title" className="mt-14 sm:mt-20">
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-fuchsia-300">Explore the question mix</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl" id="trivia-samples-title">
                Featured Trivia Categories &amp; Sample Questions
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                The quiz spans subjects from the natural world to human history. Here are a few original examples, with answers and short explanations.
              </p>
            </header>
            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRIVIA_CATEGORIES.map((category) => (
                <article className="rounded-2xl border border-slate-700/70 bg-slate-900/80 p-5 shadow-xl" key={category.name}>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">{category.name}</p>
                  <h3 className="mt-3 text-base font-black leading-6 text-white">{category.question}</h3>
                  <p className="mt-3 text-sm font-bold text-fuchsia-200">Answer: {category.answer}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{category.explanation}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6 text-center sm:mt-16 sm:p-8">
            <h2 className="text-2xl font-black text-white">Ready to put your knowledge to the test?</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">Choose a mode and start a Five Hearts trivia game.</p>
            <Link className="arcade-launch-button mt-5 rounded-xl px-6 py-3 text-sm font-black" href="/game">
              Choose a game mode
            </Link>
          </section>

          <footer className="mt-12 border-t border-white/10 pt-6 text-center">
            <nav aria-label="Site information" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
              <Link className="transition-colors hover:text-cyan-200 focus-visible:text-cyan-200" href="/privacy-policy">Privacy Policy</Link>
              <Link className="transition-colors hover:text-cyan-200 focus-visible:text-cyan-200" href="/about">About</Link>
              <Link className="transition-colors hover:text-cyan-200 focus-visible:text-cyan-200" href="/contact">Contact</Link>
            </nav>
            <p className="mt-4 text-xs text-slate-500">Five Hearts Quiz · A browser-based trivia game</p>
          </footer>
        </div>
      </section>
      <div
        aria-hidden="true"
        className="shrink-0"
        style={{
          height: "calc(var(--anchor-ad-height) + var(--anchor-ad-gap) + env(safe-area-inset-bottom, 0px))",
        }}
      />
    </main>
  );
}
