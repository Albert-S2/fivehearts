"use client";

export const TEAM_COLOR_CONFIG = {
  ruby: { name: "Rose", surface: "bg-player-coral", border: "border-player-coral", active: "ring-player-coral", swatch: "bg-player-coral" },
  sun: { name: "Butter", surface: "bg-player-gold", border: "border-player-gold", active: "ring-player-gold", swatch: "bg-player-gold" },
  forest: { name: "Mint", surface: "bg-player-forest", border: "border-player-forest", active: "ring-player-forest", swatch: "bg-player-forest" },
  ocean: { name: "Powder Blue", surface: "bg-player-slate", border: "border-player-slate", active: "ring-player-slate", swatch: "bg-player-slate" },
  sky: { name: "Periwinkle", surface: "bg-ink-blue/20", border: "border-ink-blue", active: "ring-ink-blue", swatch: "bg-ink-blue/20" },
  violet: { name: "Lilac", surface: "bg-player-plum", border: "border-player-plum", active: "ring-player-plum", swatch: "bg-player-plum" },
  fuchsia: { name: "Lavender", surface: "bg-player-plum/70", border: "border-player-plum", active: "ring-player-plum", swatch: "bg-player-plum/70" },
  slate: { name: "Cloud", surface: "bg-player-slate/70", border: "border-player-slate", active: "ring-player-slate", swatch: "bg-player-slate/70" },
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
      className={`relative min-h-24 w-full ${extraCompact ? "max-w-[280px]" : compact ? "max-w-[360px]" : "max-w-[520px]"} overflow-hidden rounded-xl border ${config.surface} shadow-md transition-all duration-300 ease-out ${config.border} ${isActiveTurn ? `scale-105 ring-4 ${config.active}` : ""} ${isEliminated ? "grayscale opacity-40" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-ink-blue/5" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center p-2">
        <div className="flex gap-0.5" aria-label={`${hearts} of 5 hearts remaining`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Heart active={index < Math.max(0, Math.min(5, hearts))} key={index} />
          ))}
        </div>
      </div>

      <div className="absolute inset-y-0 right-0 z-10 flex items-center p-4">
        <p className={`${extraCompact ? "text-base" : compact ? "text-lg" : "text-2xl"} font-black text-brass`}>{points}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-8 text-center">
        <h2 className={`truncate ${extraCompact ? "text-xs" : compact ? "text-sm" : "text-lg"} font-black tracking-tight text-ink-blue`}>{teamName}</h2>
      </div>

      {isEliminated && (
        <div className="absolute inset-0 z-20 grid place-items-center">
          <span className="rotate-[-8deg] border-2 border-terracotta bg-ink-blue/90 px-4 py-2 text-xl font-black tracking-widest text-parchment">
            ELIMINATED
          </span>
        </div>
      )}
    </article>
  );
}
