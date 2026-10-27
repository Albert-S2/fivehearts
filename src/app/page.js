import Link from "next/link";

export default function Home() {
  return (
    <main className="arcade-shell relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#090A0F] px-5 py-5 text-white sm:px-8 sm:py-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-4xl flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-xl font-black text-[#090A0F] shadow-lg shadow-cyan-500/20">
              5
            </span>
            <div>
              <span className="block text-lg font-black tracking-tight">Five Hearts Quiz</span>
              <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgb(74_222_128_/_0.8)]" />
                Live room
              </span>
            </div>
          </div>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
            Shared screen
          </span>
        </header>

        <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-7 text-center sm:py-8">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Choose your next game</p>
          <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
            What are we playing?
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
            Gather around, pick a challenge, and let the room decide who takes the crown.
          </p>

          <Link
            className="group mt-7 w-full max-w-md rounded-2xl border border-slate-700/60 bg-slate-900/80 p-6 text-left shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/50 hover:shadow-fuchsia-950/40"
            href="/game"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 via-fuchsia-400 to-violet-500 text-3xl font-black text-[#090A0F] shadow-lg shadow-fuchsia-500/20">
                5
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                Ready to play
              </span>
            </div>
            <h2 className="mt-6 text-3xl font-black text-white">Five Hearts Quiz</h2>
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
