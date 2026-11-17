import Link from "next/link";

export default function Home() {
  return (
    <main className="arcade-shell relative flex h-[100dvh] flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#090A0F] px-4 pb-28 pt-4 text-white sm:px-8 sm:pb-24 sm:pt-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />

      <div className="relative z-10 mx-auto flex min-h-max w-full max-w-4xl flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-xl font-black text-[#090A0F] shadow-lg shadow-cyan-500/20">
              5
            </span>
            <div>
              <span className="block text-lg font-black tracking-tight">Five Hearts Quiz</span>
            </div>
          </div>
        </header>

        <section className="flex min-h-max flex-1 flex-col items-center justify-center py-7 text-center sm:py-8">
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
        </section>

        <footer className="shrink-0 border-t border-white/10 pt-4 text-center text-xs text-slate-500">
          More games will appear here in the future · Five Hearts Quiz
        </footer>
      </div>
    </main>
  );
}
