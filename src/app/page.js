import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-white">
      <section className="w-full max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">
          Game room
        </p>
        <h1 className="mt-4 text-5xl font-black tracking-tight sm:text-6xl">Choose a game</h1>
        <p className="mt-4 text-slate-400">
          Select a game to start playing on the shared screen.
        </p>

        <Link
          className="group mt-10 block rounded-3xl border border-amber-400/50 bg-slate-900 p-8 text-left shadow-2xl shadow-amber-950/30 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-amber-900/40"
          href="/game"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-400 text-4xl font-black text-slate-950 shadow-lg shadow-amber-400/20">
              5
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
              Available
            </span>
          </div>
          <h2 className="mt-8 text-3xl font-black group-hover:text-amber-300">Five Hearts Duel</h2>
          <p className="mt-3 leading-7 text-slate-400">
            Battle your opponent, answer trivia questions, collect points, and protect your five hearts.
          </p>
          <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-5">
            <span className="text-sm font-semibold text-slate-500">Trivia battle</span>
            <span className="font-black text-amber-300">Play now <span aria-hidden="true">→</span></span>
          </div>
        </Link>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-800 px-5 py-4 text-sm text-slate-600">
          More games will appear here in the future.
        </div>
      </section>
    </main>
  );
}
