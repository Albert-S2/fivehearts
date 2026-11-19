import Link from "next/link";

const INFORMATION_LINKS = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function PublisherPageLayout({ title, intro, children }) {
  return (
    <main className="relative h-full min-h-0 overflow-x-hidden overflow-y-auto bg-[#090A0F] px-4 py-4 text-white sm:px-8 sm:py-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan opacity-30" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia opacity-25" />
      <div className="relative z-10 mx-auto w-full max-w-4xl">
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link className="inline-flex items-center gap-2 text-sm font-black text-white transition-colors hover:text-cyan-200" href="/">
            <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-lg font-black text-[#090A0F]">5</span>
            Five Hearts Quiz
          </Link>
          <Link className="shrink-0 text-xs font-bold text-slate-400 transition-colors hover:text-cyan-200 sm:text-sm" href="/">
            Back to home
          </Link>
        </header>

        <article className="mx-auto mt-8 w-full max-w-3xl sm:mt-12">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-300">Five Hearts Games</p>
          <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">{intro}</p>
          <div className="mt-8 space-y-8 text-sm leading-7 text-slate-300 sm:mt-10 sm:text-base">
            {children}
          </div>
        </article>

        <footer className="mx-auto mt-12 max-w-3xl border-t border-white/10 py-6 text-center">
          <nav aria-label="Site information" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-400">
            {INFORMATION_LINKS.map((link) => (
              <Link className="transition-colors hover:text-cyan-200 focus-visible:text-cyan-200" href={link.href} key={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="mt-4 text-xs text-slate-500">Five Hearts Games</p>
        </footer>
      </div>
      <div
        aria-hidden="true"
        className="h-28"
        style={{
          height: "calc(var(--anchor-ad-height) + var(--anchor-ad-gap) + env(safe-area-inset-bottom, 0px))",
        }}
      />
    </main>
  );
}
