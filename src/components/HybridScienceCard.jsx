"use client";

import Image from "next/image";

export const CHARACTER_CONFIG = {
  engineer: {
    name: "NOAH",
    profession: "ENGINEER",
    theme: "slate",
    image: "/images/engineer.jpeg",
    borderClass: "border-slate-400",
    badgeBg: "bg-slate-800 text-slate-200",
    glow: "shadow-slate-400/20",
  },
  astronaut: {
    name: "STELLA",
    profession: "ASTRONAUT",
    theme: "sky",
    image: "/images/astronaut.jpeg",
    borderClass: "border-sky-400",
    badgeBg: "bg-sky-900/90 text-sky-200",
    glow: "shadow-sky-400/20",
  },
  archeologist: {
    name: "LEO",
    profession: "ARCHEOLOGIST",
    theme: "amber",
    image: "/images/archeologist.jpeg",
    borderClass: "border-amber-400",
    badgeBg: "bg-amber-900/90 text-amber-200",
    glow: "shadow-amber-400/20",
  },
  chemist: {
    name: "MAYA",
    profession: "CHEMIST",
    theme: "purple",
    image: "/images/chemist.jpeg",
    borderClass: "border-purple-400",
    badgeBg: "bg-purple-900/90 text-purple-200",
    glow: "shadow-purple-400/20",
  },
  biologist: {
    name: "LUNA",
    profession: "BIOLOGIST",
    theme: "emerald",
    image: "/images/biologist.jpeg",
    borderClass: "border-emerald-400",
    badgeBg: "bg-emerald-900/90 text-emerald-200",
    glow: "shadow-emerald-400/20",
  },
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
  characterKey,
  teamName,
  hearts,
  points,
  isActiveTurn,
  isEliminated,
  compact = false,
  extraCompact = false,
}) {
  const config = CHARACTER_CONFIG[characterKey] || CHARACTER_CONFIG.engineer;

  return (
    <article
      className={`relative aspect-[2/3] w-full ${extraCompact ? "max-w-[135px]" : compact ? "max-w-[180px]" : "max-w-[310px]"} overflow-hidden rounded-3xl border-4 bg-slate-950 shadow-2xl transition-all duration-300 ${config.borderClass} ${config.glow} ${isActiveTurn ? "scale-105 animate-pulse ring-4 ring-amber-400" : ""} ${isEliminated ? "grayscale opacity-40" : ""}`}
    >
      <Image
        alt={`${config.name}, ${config.profession}`}
        className="object-cover"
        fill
        priority
        sizes="(max-width: 640px) 80vw, 310px"
        src={config.image}
      />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-center bg-gradient-to-b from-slate-950/90 to-transparent p-3">
        <div className="flex gap-0.5" aria-label={`${hearts} of 5 hearts remaining`}>
          {Array.from({ length: 5 }, (_, index) => (
            <Heart active={index < Math.max(0, Math.min(5, hearts))} key={index} />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-4 pt-14">
        <p className={`${extraCompact ? "text-base" : compact ? "text-lg" : "text-2xl"} self-end font-black text-amber-400`}>{points}</p>
        <h2 className={`w-full truncate text-center ${extraCompact ? "text-xs" : compact ? "text-sm" : "text-lg"} font-black tracking-tight text-white`}>{teamName}</h2>
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
