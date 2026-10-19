"use client";

export default function ClassyBackground({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] animate-pulse rounded-full bg-indigo-900/30 blur-[120px] will-change-transform"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] animate-pulse rounded-full bg-amber-600/15 blur-[140px] [animation-delay:2s] will-change-transform"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-950/20 blur-[160px] will-change-transform"
      />

      <div className="relative z-10 min-h-screen w-full">{children}</div>
    </div>
  );
}
