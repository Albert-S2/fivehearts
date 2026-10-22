import Link from "next/link";

export default function Home() {
  return (
    <main className="manga-shell min-h-screen bg-slate-950 px-5 py-6 text-white sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-400 text-xl font-black text-slate-950">
              5
            </span>
            <span className="text-lg font-black tracking-tight">Game Room</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-600">Play together</span>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Choose a game</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">What are we playing?</h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-400">
            Pick a game to start. More shared-screen games can be added here over time.
          </p>

          <Link
            className="group mt-10 w-full max-w-md rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-400/15 via-slate-900 to-slate-900 p-7 text-left shadow-2xl shadow-amber-950/20 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-amber-900/30"
            href="/game"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-amber-400 text-4xl font-black text-slate-950 shadow-lg shadow-amber-400/20">
                5
              </span>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Available
              </span>
            </div>
            <h2 className="mt-8 text-3xl font-black group-hover:text-amber-300">Five Hearts</h2>
            <p className="mt-3 leading-7 text-slate-400">
              A fast trivia battle where every team protects five hearts while collecting points.
            </p>
            <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-sm font-semibold text-slate-500">Trivia battle</span>
              <span className="font-black text-amber-300">Open game <span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </section>

        <footer className="border-t border-slate-800 pt-5 text-center text-xs text-slate-600">
          More games will appear here in the future.
        </footer>
      </div>
    </main>
  );
}
