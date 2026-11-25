"use client";

import { useEffect, useRef, useState } from "react";

const HEX_RADIUS = 64;
const HEX_CENTERS = [
  { x: 220, y: 190 },
  { x: 331, y: 190 },
  { x: 275.5, y: 94 },
  { x: 164.5, y: 94 },
  { x: 109, y: 190 },
  { x: 164.5, y: 286 },
  { x: 275.5, y: 286 },
];
const TRIANGLE_COUNT = 6;
const TURN_HALF_DURATION = 300;
const MISTAKE_ALERT_DURATION = 1500;
const CENTER_METALS = ["cyan", "gold", "magenta", "blue", "green", "violet"];
const METAL_NAMES = {
  cyan: "cyan",
  gold: "gold",
  magenta: "magenta",
  blue: "blue",
  green: "green",
  violet: "violet",
};
const OUTER_MATCH_TRIANGLES = [3, 2, 1, 0, 5, 4];

function getHexVertices(x, y) {
  return Array.from({ length: TRIANGLE_COUNT }, (_, index) => {
    const angle = ((-30 + index * 60) * Math.PI) / 180;
    return {
      x: x + HEX_RADIUS * Math.cos(angle),
      y: y + HEX_RADIUS * Math.sin(angle),
    };
  });
}

function toPoints(points) {
  return points.map(({ x, y }) => `${x},${y}`).join(" ");
}

function shuffle(items) {
  const shuffledItems = [...items];

  for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffledItems[index], shuffledItems[swapIndex]] = [
      shuffledItems[swapIndex],
      shuffledItems[index],
    ];
  }

  return shuffledItems;
}

function createRound() {
  const centerColors = shuffle(CENTER_METALS);
  const matchCount = Math.floor(Math.random() * (TRIANGLE_COUNT - 1)) + 1;
  const matchingCenterTriangles = new Set(
    shuffle(Array.from({ length: TRIANGLE_COUNT }, (_, index) => index)).slice(
      0,
      matchCount,
    ),
  );
  const neighbors = OUTER_MATCH_TRIANGLES.map((outerTriangleIndex) => {
    const centerTriangleIndex = (outerTriangleIndex + 3) % TRIANGLE_COUNT;
    const targetColor = centerColors[centerTriangleIndex];
    const isMatch = matchingCenterTriangles.has(centerTriangleIndex);
    const otherColors = CENTER_METALS.filter((color) => color !== targetColor);

    return {
      color: isMatch
        ? targetColor
        : otherColors[Math.floor(Math.random() * otherColors.length)],
      isMatch,
      selected: false,
    };
  });

  return { centerColors, matchCount, neighbors };
}

function emptyRound() {
  return {
    centerColors: CENTER_METALS,
    matchCount: 0,
    neighbors: Array(TRIANGLE_COUNT).fill(null),
  };
}

function facetId(hexIndex, triangleIndex) {
  return `${hexIndex}:${triangleIndex}`;
}

function wait(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export default function NewGameBoard() {
  const [roundData, setRoundData] = useState(emptyRound);
  const [coloredCenter, setColoredCenter] = useState(
    () => Array(TRIANGLE_COUNT).fill(false),
  );
  const [neighborsRevealed, setNeighborsRevealed] = useState(false);
  const [activeFacets, setActiveFacets] = useState([]);
  const [phase, setPhase] = useState("ready");
  const [hearts, setHearts] = useState(5);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [mistakeMessage, setMistakeMessage] = useState("");
  const isPlaying = useRef(false);
  const retryTimer = useRef(null);

  useEffect(
    () => () => {
      if (retryTimer.current !== null) {
        window.clearTimeout(retryTimer.current);
      }
    },
    [],
  );

  async function runRound(nextRoundData) {
    if (isPlaying.current) return;
    isPlaying.current = true;
    setMistakeMessage("");
    setRoundData(nextRoundData);
    setColoredCenter(Array(TRIANGLE_COUNT).fill(false));
    setNeighborsRevealed(false);
    setPhase("revealing");

    for (let triangleIndex = 0; triangleIndex < TRIANGLE_COUNT; triangleIndex += 1) {
      const previousTriangle = triangleIndex - 1;
      setActiveFacets(
        previousTriangle >= 0
          ? [
              facetId(0, previousTriangle),
              facetId(0, triangleIndex),
            ]
          : [facetId(0, triangleIndex)],
      );
      await wait(TURN_HALF_DURATION);
      setColoredCenter((current) =>
        current.map((isColored, index) => {
          if (index === triangleIndex) return true;
          if (index === previousTriangle) return false;
          return isColored;
        }),
      );
      await wait(TURN_HALF_DURATION);
    }

    setPhase("returning");
    setActiveFacets([facetId(0, TRIANGLE_COUNT - 1)]);
    await wait(TURN_HALF_DURATION);
    setColoredCenter((current) =>
      current.map((isColored, index) =>
        index === TRIANGLE_COUNT - 1 ? false : isColored,
      ),
    );
    await wait(TURN_HALF_DURATION);

    setPhase("revealingNeighbors");
    setActiveFacets(
      OUTER_MATCH_TRIANGLES.map((triangleIndex, index) =>
        facetId(index + 1, triangleIndex),
      ),
    );
    await wait(TURN_HALF_DURATION);
    setNeighborsRevealed(true);
    await wait(TURN_HALF_DURATION);

    setActiveFacets([]);
    setPhase("matching");
    isPlaying.current = false;
  }

  function startRound() {
    if (phase !== "ready") return;
    void runRound(createRound());
  }

  function chooseNeighbor(neighborIndex) {
    if (phase !== "matching") return;

    const chosenNeighbor = roundData.neighbors[neighborIndex];
    if (!chosenNeighbor || chosenNeighbor.selected) return;

    const nextNeighbors = roundData.neighbors.map((neighbor, index) =>
      index === neighborIndex ? { ...neighbor, selected: true } : neighbor,
    );
    setRoundData((current) => ({ ...current, neighbors: nextNeighbors }));

    if (chosenNeighbor.isMatch) {
      setScore((current) => current + 10);
      const matchesFound = nextNeighbors.filter(
        (neighbor) => neighbor.isMatch && neighbor.selected,
      ).length;

      if (matchesFound === roundData.matchCount) {
        setPhase("roundComplete");
      }
      return;
    }

    const remainingHearts = hearts - 1;
    setHearts(remainingHearts);

    if (remainingHearts === 0) {
      setMistakeMessage("Incorrect match. You lost your last heart. Game over.");
      setPhase("gameOver");
      return;
    }

    setMistakeMessage(
      `Incorrect match. You lost one heart. Round ${round} will restart with a new pattern.`,
    );
    setPhase("mistake");
    retryTimer.current = window.setTimeout(() => {
      retryTimer.current = null;
      void runRound(createRound());
    }, MISTAKE_ALERT_DURATION);
  }

  function handleNeighborKeyDown(event, neighborIndex) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      chooseNeighbor(neighborIndex);
    }
  }

  function resetBoard() {
    setRoundData(emptyRound());
    setColoredCenter(Array(TRIANGLE_COUNT).fill(false));
    setNeighborsRevealed(false);
    setActiveFacets([]);
  }

  function startNextRound() {
    resetBoard();
    setRound((current) => current + 1);
    setPhase("ready");
  }

  function restartGame() {
    if (retryTimer.current !== null) {
      window.clearTimeout(retryTimer.current);
      retryTimer.current = null;
    }
    isPlaying.current = false;
    resetBoard();
    setRound(1);
    setScore(0);
    setHearts(5);
    setMistakeMessage("");
    setPhase("ready");
  }

  const phaseLabel = {
    ready: "Press Start to memorize the center colors.",
    revealing: "Watch the center triangles in order.",
    returning: "The center is resetting.",
    revealingNeighbors: "The neighboring triangles are revealing together.",
    matching: "Select only the neighbors that match.",
    mistake: "Mistake! Replaying this round shortly.",
    roundComplete: "Round complete! You found every match.",
    gameOver: "No hearts remaining. Game over.",
  }[phase];

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div
        aria-label="Game status"
        className="grid w-full max-w-[44rem] grid-cols-3 gap-3"
      >
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Round
          </p>
          <p className="text-lg font-black text-white">{round}</p>
        </div>
        <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Score
          </p>
          <p className="text-lg font-black text-cyan-300">{score}</p>
        </div>
        <div
          aria-label={`${hearts} of 5 hearts remaining`}
          className="rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-center"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Hearts
          </p>
          <p aria-hidden="true" className="text-lg font-black tracking-[0.15em]">
            {Array.from({ length: 5 }, (_, index) => (
              <span className={index < hearts ? "text-rose-400" : "text-slate-700"} key={index}>
                ♥
              </span>
            ))}
          </p>
        </div>
      </div>

      <svg
        aria-labelledby="hex-board-title hex-board-description"
        className="h-auto w-full max-w-[28rem] md:max-w-[34rem] lg:max-w-[44rem]"
        role="group"
        viewBox="0 0 440 380"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="hex-board-title">The Hexagon color matching game</title>
        <desc id="hex-board-description">
          Memorize the six center colors as they move in a wave. Then select
          matching colors from the six surrounding triangles that touch the
          center. Correct matches earn ten points; incorrect picks lose a heart.
        </desc>
        <defs>
          <linearGradient id="silver-metal" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#cbd2da" />
            <stop offset="18%" stopColor="#afb8c2" />
            <stop offset="34%" stopColor="#d7dce2" />
            <stop offset="56%" stopColor="#aeb7c2" />
            <stop offset="76%" stopColor="#cbd1d9" />
            <stop offset="100%" stopColor="#9da7b2" />
          </linearGradient>
          <linearGradient id="metal-cyan" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#0e7490" />
            <stop offset="24%" stopColor="#67e8f9" />
            <stop offset="42%" stopColor="#ecfeff" />
            <stop offset="62%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#164e63" />
          </linearGradient>
          <linearGradient id="metal-gold" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#92400e" />
            <stop offset="24%" stopColor="#fbbf24" />
            <stop offset="42%" stopColor="#fffbeb" />
            <stop offset="62%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="metal-magenta" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#86198f" />
            <stop offset="24%" stopColor="#e879f9" />
            <stop offset="42%" stopColor="#fdf4ff" />
            <stop offset="62%" stopColor="#c026d3" />
            <stop offset="100%" stopColor="#701a75" />
          </linearGradient>
          <linearGradient id="metal-blue" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="24%" stopColor="#60a5fa" />
            <stop offset="42%" stopColor="#eff6ff" />
            <stop offset="62%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="metal-green" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#065f46" />
            <stop offset="24%" stopColor="#6ee7b7" />
            <stop offset="42%" stopColor="#ecfdf5" />
            <stop offset="62%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="metal-violet" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#5b21b6" />
            <stop offset="24%" stopColor="#a78bfa" />
            <stop offset="42%" stopColor="#f5f3ff" />
            <stop offset="62%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4c1d95" />
          </linearGradient>
        </defs>
        {HEX_CENTERS.map(({ x, y }, hexIndex) => {
          const vertices = getHexVertices(x, y);
          const outerNeighbor =
            hexIndex > 0 ? roundData.neighbors[hexIndex - 1] : null;
          const isCorrectHex =
            Boolean(outerNeighbor?.selected) && Boolean(outerNeighbor?.isMatch);
          const isWrongHex =
            Boolean(outerNeighbor?.selected) && !outerNeighbor?.isMatch;

          return (
            <g key={`${x}-${y}`}>
              {vertices.map((vertex, triangleIndex) => {
                const nextVertex = vertices[(triangleIndex + 1) % vertices.length];
                const points = toPoints([{ x, y }, vertex, nextVertex]);
                const isCenterHex = hexIndex === 0;
                const neighborIndex = hexIndex - 1;
                const neighbor = isCenterHex
                  ? null
                  : roundData.neighbors[neighborIndex];
                const isNeighborTarget =
                  !isCenterHex &&
                  triangleIndex === OUTER_MATCH_TRIANGLES[neighborIndex];
                const isColoredCenter =
                  isCenterHex && coloredCenter[triangleIndex];
                const isColoredNeighbor =
                  isNeighborTarget && neighborsRevealed;
                const isColored =
                  isColoredCenter ||
                  isColoredNeighbor ||
                  isCorrectHex ||
                  isWrongHex;
                const isActive = activeFacets.includes(
                  facetId(hexIndex, triangleIndex),
                );
                const color = isCenterHex
                  ? roundData.centerColors[triangleIndex]
                  : neighbor?.color ?? "cyan";
                const facetColor = isCorrectHex
                  ? "#34d399"
                  : isWrongHex
                    ? "#fb7185"
                    : `url(#metal-${color})`;
                const isSelectedNeighbor =
                  isNeighborTarget && neighbor?.selected;
                const selectedStroke = isSelectedNeighbor
                  ? neighbor.isMatch
                    ? "#34d399"
                    : "#fb7185"
                  : "#0f172a";
                const canSelect =
                  isNeighborTarget &&
                  phase === "matching" &&
                  !neighbor?.selected;
                const neighborLabel = isNeighborTarget
                  ? `Neighbor ${neighborIndex + 1}, ${
                      neighborsRevealed
                        ? `${METAL_NAMES[neighbor?.color ?? "cyan"]} metallic`
                        : "color hidden"
                    }${
                      neighbor?.selected
                        ? neighbor.isMatch
                          ? ", correct match"
                          : ", incorrect pick"
                        : ""
                    }`
                  : undefined;

                return (
                  <g
                    aria-disabled={
                      isNeighborTarget && !canSelect ? true : undefined
                    }
                    aria-label={neighborLabel}
                    aria-pressed={
                      isNeighborTarget ? Boolean(neighbor?.selected) : undefined
                    }
                    className={[
                      isActive ? "hex-facet-flipping" : "",
                      canSelect ? "hex-neighbor-target" : "",
                      isSelectedNeighbor ? "hex-facet-pushed" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={triangleIndex}
                    onClick={
                      isNeighborTarget
                        ? () => chooseNeighbor(neighborIndex)
                        : undefined
                    }
                    onKeyDown={
                      canSelect
                        ? (event) => handleNeighborKeyDown(event, neighborIndex)
                        : undefined
                    }
                    role={isNeighborTarget ? "button" : undefined}
                    tabIndex={canSelect ? 0 : -1}
                  >
                    <polygon
                      className="hex-facet-face"
                      fill="url(#silver-metal)"
                      opacity={isColored ? 0 : 1}
                      points={points}
                      stroke={selectedStroke}
                      strokeLinejoin="round"
                      strokeWidth={isSelectedNeighbor ? "5" : "3"}
                    />
                    {(isCenterHex ||
                      isNeighborTarget ||
                      isCorrectHex ||
                      isWrongHex) && (
                      <polygon
                        className="hex-facet-face"
                        fill={facetColor}
                        opacity={isColored ? 1 : 0}
                        points={points}
                        stroke={selectedStroke}
                        strokeLinejoin="round"
                        strokeWidth={isSelectedNeighbor ? "5" : "3"}
                      />
                    )}
                  </g>
                );
              })}
              <polygon
                fill="none"
                points={toPoints(vertices)}
                stroke={
                  isCorrectHex
                    ? "#34d399"
                    : isWrongHex
                      ? "#fb7185"
                      : "#f8fafc"
                }
                strokeOpacity={isCorrectHex || isWrongHex ? "1" : "0.72"}
                strokeWidth={isCorrectHex || isWrongHex ? "3.5" : "1.5"}
              />
            </g>
          );
        })}
      </svg>

      <p
        aria-live="polite"
        className="min-h-6 text-center text-sm font-semibold text-slate-300"
      >
        {phaseLabel}
      </p>
      {mistakeMessage && (
        <p
          className="rounded-xl border border-rose-400/40 bg-rose-400/10 px-4 py-2 text-center text-sm font-semibold text-rose-200"
          role="alert"
        >
          {mistakeMessage}
        </p>
      )}

      <div className="flex min-h-14 flex-col items-center justify-center gap-3">
        {phase === "ready" && (
          <button
            className="arcade-launch-button min-w-44 rounded-xl px-8 py-4 text-sm font-black"
            onClick={startRound}
            type="button"
          >
            Start
          </button>
        )}
        {phase === "roundComplete" && (
          <button
            className="arcade-launch-button min-w-44 rounded-xl px-8 py-4 text-sm font-black"
            onClick={startNextRound}
            type="button"
          >
            Next round
          </button>
        )}
        {phase === "gameOver" && (
          <button
            className="arcade-launch-button min-w-44 rounded-xl px-8 py-4 text-sm font-black"
            onClick={restartGame}
            type="button"
          >
            Play again
          </button>
        )}
      </div>
    </div>
  );
}
