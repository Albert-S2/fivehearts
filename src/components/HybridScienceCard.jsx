"use client";

export const TEAM_COLOR_CONFIG = {
  ruby: { name: "Ruby", surface: "bg-rose-950", border: "border-rose-400", active: "ring-rose-400", swatch: "bg-rose-500" },
  coral: { name: "Coral", surface: "bg-orange-950", border: "border-orange-400", active: "ring-orange-400", swatch: "bg-orange-500" },
  sun: { name: "Sun", surface: "bg-amber-950", border: "border-amber-400", active: "ring-amber-400", swatch: "bg-amber-400" },
  lime: { name: "Lime", surface: "bg-lime-950", border: "border-lime-400", active: "ring-lime-400", swatch: "bg-lime-400" },
  forest: { name: "Forest", surface: "bg-emerald-950", border: "border-emerald-400", active: "ring-emerald-400", swatch: "bg-emerald-500" },
  ocean: { name: "Ocean", surface: "bg-cyan-950", border: "border-cyan-400", active: "ring-cyan-400", swatch: "bg-cyan-400" },
  sky: { name: "Sky", surface: "bg-sky-950", border: "border-sky-400", active: "ring-sky-400", swatch: "bg-sky-400" },
  violet: { name: "Violet", surface: "bg-violet-950", border: "border-violet-400", active: "ring-violet-400", swatch: "bg-violet-500" },
  fuchsia: { name: "Fuchsia", surface: "bg-fuchsia-950", border: "border-fuchsia-400", active: "ring-fuchsia-400", swatch: "bg-fuchsia-500" },
  slate: { name: "Slate", surface: "bg-slate-800", border: "border-slate-300", active: "ring-slate-300", swatch: "bg-slate-400" },
};

function Heart({ active }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 ${active ? "fill-rose-500 text-rose-500 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]" : "fill-slate-800 text-slate-700"}`}
      viewBox="0 0 24 24"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function HybridScienceCard({
  color = "slate",
  teamName,
  hearts,
  points,
  isActiveTurn,
  isEliminated,
  compact = false,
  extraCompact = false,
}) {
  const config = TEAM_COLOR_CONFIG[color] || TEAM_COLOR_CONFIG.slate;

  return (
    <article
      className={`relative min-h-24 w-full ${extraCompact ? "max-w-[280px]" : compact ? "max-w-[360px]" : "max-w-[520px]"} overflow-hidden rounded-3xl border-4 ${config.surface} shadow-2xl transition-all duration-300 ${config.border} ${isActiveTurn ? `scale-105 animate-pulse ring-4 ${config.active}` : ""} ${isEliminated ? "grayscale opacity-40" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/30" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center p-2">
        <div className="flex gap-0.5" aria-label={`${hearts} of 5 hearts remaining`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Heart active={index < Math.max(0, Math.min(5, hearts))} key={index} />
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 z-10 flex items-center p-4">
        <p className={`${extraCompact ? "text-base" : compact ? "text-lg" : "text-2xl"} font-black text-amber-400`}>{points}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-8 text-center">
        <h2 className={`truncate ${extraCompact ? "text-xs" : compact ? "text-sm" : "text-lg"} font-black tracking-tight text-white`}>{teamName}</h2>
      </div>

      {isEliminated && (
        <div className="absolute inset-0 z-20 grid place-items-center">
          <span className="rotate-[-8deg] border-4 border-rose-500 bg-slate-950/90 px-4 py-2 text-xl font-black tracking-widest text-rose-400">
            ELIMINATED
          </span>
        </div>
      )}
    </article>
  );
}
