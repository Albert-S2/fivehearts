import Link from "next/link";

export default function Home() {
  return (
    <main className="manga-shell min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-4xl flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brass text-xl font-black text-ink-blue shadow-[inset_0_-3px_0_rgb(154_107_45_/_0.3)]">
              5
            </span>
            <span className="text-lg font-black tracking-tight">Game Room</span>
          </div>
          <span className="rounded-full border border-brass/50 bg-brass/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">Play together</span>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-terracotta">Choose a game</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">What are we playing?</h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-400">
            Pick a game to start. More shared-screen games can be added here over time.
          </p>

          <Link
            className="boutique-card group mt-10 w-full max-w-md border-stone-300/70 bg-white p-7 text-left hover:-translate-y-1 hover:border-forest-sage/40 hover:shadow-xl"
            href="/game"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-brass text-4xl font-black text-ink-blue shadow-[inset_0_-4px_0_rgb(154_107_45_/_0.3)]">
                5
              </span>
              <span className="rounded-full border border-forest-sage/30 bg-forest-sage/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-forest-sage">
                Available
              </span>
            </div>
            <h2 className="mt-8 text-3xl font-black group-hover:text-terracotta">Five Hearts</h2>
            <p className="mt-3 leading-7 text-slate-400">
              A fast trivia battle where every team protects five hearts while collecting points.
            </p>
            <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-5">
              <span className="text-sm font-semibold text-slate-500">Trivia battle</span>
              <span className="boutique-button inline-flex items-center gap-2 px-4 py-2 text-sm">Open game <span aria-hidden="true">→</span></span>
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
