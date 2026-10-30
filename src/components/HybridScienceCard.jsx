"use client";

export const TEAM_COLOR_CONFIG = {
  red: { name: "Red", symbol: "◆", value: "#ff3b4d", panel: "#641b28", surface: "bg-player-red", border: "border-player-red", active: "ring-player-red", swatch: "bg-player-red", text: "text-white" },
  blue: { name: "Blue", symbol: "●", value: "#3288ff", panel: "#173d78", surface: "bg-player-blue", border: "border-player-blue", active: "ring-player-blue", swatch: "bg-player-blue", text: "text-white" },
  green: { name: "Green", symbol: "▲", value: "#2fcf73", panel: "#145b38", surface: "bg-player-green", border: "border-player-green", active: "ring-player-green", swatch: "bg-player-green", text: "text-white" },
  yellow: { name: "Yellow", symbol: "★", value: "#ffd447", panel: "#6b5315", surface: "bg-player-yellow", border: "border-player-yellow", active: "ring-player-yellow", swatch: "bg-player-yellow", text: "text-white" },
  purple: { name: "Purple", symbol: "✦", value: "#b65cff", panel: "#51216d", surface: "bg-player-purple", border: "border-player-purple", active: "ring-player-purple", swatch: "bg-player-purple", text: "text-white" },
};

function Heart({ active }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-5 w-5 ${active ? "fill-red-500 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.85)]" : "fill-slate-800 text-slate-700"}`}
      viewBox="0 0 24 24"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function HybridScienceCard({
  color = "red",
  teamName,
  hearts,
  points,
  isActiveTurn,
  isEliminated,
  compact = false,
  extraCompact = false,
}) {
  const config = TEAM_COLOR_CONFIG[color] || TEAM_COLOR_CONFIG.red;

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
        <p className={`${extraCompact ? "text-base" : compact ? "text-lg" : "text-2xl"} font-black ${config.text}`}>{points}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 px-4 pb-3 pt-8 text-center">
        <h2 className={`truncate ${extraCompact ? "text-xs" : compact ? "text-sm" : "text-lg"} font-black tracking-tight ${config.text}`}>{teamName}</h2>
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
