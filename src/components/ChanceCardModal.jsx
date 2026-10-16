"use client";

import { useEffect, useState } from "react";

const CARD_DETAILS = {
  EXTRA_HEART: {
    title: "Extra Heart",
    description: "Restore one heart to the active team, up to five hearts.",
    icon: "♥",
  },
  REMOVE_ENEMY_HEART: {
    title: "Attack",
    description: "Choose an opponent to lose one heart.",
    icon: "⚔",
  },
  CHOOSE_CATEGORY: {
    title: "Custom Category Pick",
    description: "The active player chooses the next question category.",
    icon: "★",
  },
  REMOVE_FAKE_ANSWER: {
    title: "50/50",
    description: "Remove one incorrect answer from the question.",
    icon: "½",
  },
  NO_EFFECT: {
    title: "Cheering Card",
    description: "The crowd is behind you. This card has no effect.",
    icon: "✦",
  },
};

export default function ChanceCardModal({
  cardType,
  isOpen,
  opponents = [],
  onConfirm,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [targetTeamId, setTargetTeamId] = useState("");
  const card = CARD_DETAILS[cardType] || CARD_DETAILS.NO_EFFECT;
  const needsTarget = cardType === "REMOVE_ENEMY_HEART";

  useEffect(() => {
    if (!isOpen) return undefined;

    const flipTimer = window.setTimeout(() => setIsFlipped(true), 350);
    return () => window.clearTimeout(flipTimer);
  }, [isOpen, cardType]);

  if (!isOpen) return null;

  return (
    <div
      aria-labelledby="chance-card-title"
      aria-modal="true"
      className="fixed inset-0 z-40 grid place-items-center bg-slate-950/95 p-6 backdrop-blur-md"
      role="dialog"
    >
      <div className="w-full max-w-md text-center">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-amber-400">Chance card</p>
        <div className="mx-auto mt-6 h-80 w-56 [perspective:1000px]">
          <div
            className={`relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div className="absolute inset-0 grid place-items-center rounded-3xl border-2 border-amber-400 bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600 shadow-2xl shadow-amber-500/20 [backface-visibility:hidden]">
              <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-slate-950/30 text-7xl font-black text-slate-950">
                5
              </div>
            </div>
            <div className="absolute inset-0 grid place-items-center rounded-3xl border-2 border-amber-300 bg-slate-800 p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <div>
                <span className="text-6xl text-amber-300">{card.icon}</span>
                <h2 className="mt-5 text-2xl font-black text-white" id="chance-card-title">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">{card.description}</p>
              </div>
            </div>
          </div>
        </div>

        {isFlipped && needsTarget && (
          <label className="mt-6 block text-left text-sm font-bold text-slate-300" htmlFor="chance-target">
            Choose an opponent
            <select
              className="mt-2 w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white outline-none focus:border-amber-400"
              id="chance-target"
              onChange={(event) => setTargetTeamId(event.target.value)}
              value={targetTeamId}
            >
              <option value="">Select a team</option>
              {opponents.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          className="mt-6 w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!isFlipped || (needsTarget && !targetTeamId)}
          onClick={() => onConfirm({ cardType, targetTeamId })}
          type="button"
        >
          Confirm and apply card
        </button>
      </div>
    </div>
  );
}

export { CARD_DETAILS };
