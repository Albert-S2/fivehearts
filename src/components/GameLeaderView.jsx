"use client";

import { useMemo, useState } from "react";
import useFiveHearts from "../hooks/useFiveHearts";
import { getRandomCategories } from "../data/questionBank";
import CategoryPickerModal from "./CategoryPickerModal";
import ChanceCardModal from "./ChanceCardModal";

function HeartIcon({ active }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-7 w-7 ${active ? "text-rose-500" : "text-slate-600"}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 21s-7.5-4.35-9.5-9.5C.78 7.12 2.83 3.75 6.5 3.75c2.06 0 3.55 1.2 4.5 2.63.95-1.43 2.44-2.63 4.5-2.63 3.67 0 5.72 3.37 4 7.75C19.5 16.65 12 21 12 21Z" />
    </svg>
  );
}

function TimerDisplay({ timer }) {
  const progress = Math.max(0, Math.min(timer / 45, 1)) * 360;
  const timerWarning = timer <= 10;

  return (
    <div className="flex items-center gap-4" aria-label={`${timer} seconds remaining`}>
      <div
        className={`relative grid h-20 w-20 place-items-center rounded-full ${
          timerWarning ? "animate-pulse" : ""
        }`}
        style={{
          background: `conic-gradient(${timerWarning ? "#ef4444" : "#f59e0b"} ${progress}deg, #334155 ${progress}deg)`,
        }}
      >
        <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-900">
          <span className={`text-2xl font-black tabular-nums ${timerWarning ? "text-red-400" : "text-amber-300"}`}>
            {timer}
          </span>
        </div>
      </div>
      <div className="hidden text-left sm:block">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Time left</p>
        <div className="mt-2 h-2 w-36 overflow-hidden rounded-full bg-slate-700">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${timerWarning ? "bg-red-500" : "bg-amber-400"}`}
            style={{ width: `${(timer / 45) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function GameLeaderView(gameOptions) {
  const game = useFiveHearts(gameOptions);
  const [showCategories, setShowCategories] = useState(game.currentCategories.length > 0);
  const [revealed, setRevealed] = useState(false);
  const [targetMenuOpen, setTargetMenuOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [chanceCard, setChanceCard] = useState(null);

  const activeQuestion = game.activeQuestion || {};
  const answers = activeQuestion.options || [];
  const activeTeamId = game.activeTeam?.id;
  const nextTeam = useMemo(() => {
    if (!game.teams.length) return null;
    for (let offset = 1; offset <= game.teams.length; offset += 1) {
      const candidate = game.teams[(game.activeTeamIndex + offset) % game.teams.length];
      if (!candidate.isEliminated) return candidate;
    }
    return null;
  }, [game.activeTeamIndex, game.teams]);

  function chooseCategory(category) {
    if (game.beginRound(category)) setShowCategories(false);
  }

  function answerQuestion(answerIndex) {
    setSelectedAnswer(answerIndex);
    const isCorrect = game.submitAnswer(answerIndex);
    if (isCorrect) setChanceCard(game.drawChanceCard());
    setRevealed(true);
  }

  function applyChanceCard({ cardType, targetTeamId }) {
    if (cardType === "EXTRA_HEART" && activeTeamId) {
      game.addHeart(activeTeamId);
    }
    if (cardType === "REMOVE_ENEMY_HEART" && targetTeamId) {
      game.deductHeart(targetTeamId);
    }
    if (cardType === "REMOVE_FAKE_ANSWER") {
      const wrongAnswerIndex = answers.findIndex(
        (_, index) => index !== activeQuestion.correctAnswerIndex,
      );
      if (wrongAnswerIndex !== -1) {
        const nextOptions = answers.filter((_, index) => index !== wrongAnswerIndex);
        const correctAnswerIndex =
          activeQuestion.correctAnswerIndex > wrongAnswerIndex
            ? activeQuestion.correctAnswerIndex - 1
            : activeQuestion.correctAnswerIndex;
        game.setActiveQuestion({
          ...activeQuestion,
          options: nextOptions,
          correctAnswerIndex,
        });
      }
    }
    if (cardType === "CHOOSE_CATEGORY") {
      setShowCategories(true);
    }
    setChanceCard(null);
  }

  function advanceTurn() {
    if (nextTeam) game.selectNextTeam(nextTeam.id);
    game.setCurrentCategories(getRandomCategories());
    setShowCategories(true);
    setSelectedAnswer(null);
    setRevealed(false);
    setTargetMenuOpen(false);
  }

  return (
    <main className="flex min-h-screen w-full flex-col bg-slate-950 text-white">
      <header className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400 text-2xl font-black text-slate-950 shadow-lg shadow-amber-400/20">
            5
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Five Hearts</h1>
            <span className="mt-1 inline-flex rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
              {game.mode}
            </span>
          </div>
        </div>
        <TimerDisplay timer={game.timer} />
      </header>

      <div className="flex min-h-0 flex-1 justify-center gap-6 p-6 lg:gap-10 lg:p-8">
        <aside className="hidden w-72 shrink-0 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 xl:block" aria-label="Left advertising space" />

        <section className="flex min-w-0 max-w-5xl flex-1 flex-col">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Live round</p>
              <p className="mt-1 text-sm text-slate-400">
                {game.activeTeam ? `${game.activeTeam.name}'s turn` : "Waiting for a team"}
              </p>
            </div>
            {activeQuestion.category && (
              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300">
                {activeQuestion.category}
              </span>
            )}
          </div>

          <article className="flex min-h-0 flex-1 flex-col justify-center rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl shadow-black/20 sm:p-10">
            <p className="mb-6 text-center text-2xl font-bold leading-tight text-slate-100 sm:text-4xl lg:text-5xl">
              {activeQuestion.text || "Choose a category to begin the round"}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {answers.map((answer, index) => {
                const isCorrect = revealed && index === activeQuestion.correctAnswerIndex;
                const isWrong = revealed && selectedAnswer === index && !isCorrect;
                return (
                  <button
                    className={`rounded-2xl border p-5 text-left text-lg font-semibold transition sm:text-xl ${
                      isCorrect
                        ? "border-emerald-400 bg-emerald-400/20 text-emerald-200"
                        : isWrong
                          ? "border-red-400 bg-red-400/20 text-red-200"
                          : "border-slate-700 bg-slate-800 text-slate-100 hover:border-amber-400 hover:bg-slate-700"
                    }`}
                    disabled={revealed || !activeTeamId}
                    key={answer}
                    onClick={() => answerQuestion(index)}
                  >
                    <span className="mr-3 text-amber-400">{String.fromCharCode(65 + index)}.</span>
                    {answer}
                  </button>
                );
              })}
            </div>
          </article>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {game.teams.map((team, index) => (
              <div
                className={`rounded-2xl border p-4 transition ${
                  index === game.activeTeamIndex ? "border-amber-400 bg-amber-400/10" : "border-slate-800 bg-slate-900"
                } ${team.isEliminated ? "opacity-40" : ""}`}
                key={team.id}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{team.name}</span>
                  <span className="text-2xl font-black text-amber-300">{team.points} pts</span>
                </div>
                <div className="mt-2 flex gap-1" aria-label={`${team.hearts} of 5 hearts remaining`}>
                  {Array.from({ length: 5 }, (_, heartIndex) => (
                    <HeartIcon active={heartIndex < team.hearts} key={heartIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="hidden w-72 shrink-0 rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 xl:block" aria-label="Right advertising space" />
      </div>

      <footer className="relative flex shrink-0 flex-wrap items-center justify-center gap-3 border-t border-slate-800 bg-slate-900 px-6 py-4">
        <button className="rounded-xl border border-slate-600 px-5 py-3 font-bold text-slate-200 hover:border-amber-400 hover:text-amber-300" onClick={() => setRevealed(true)}>
          Reveal Answer
        </button>
        <button className="rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 hover:bg-amber-300" onClick={advanceTurn}>
          Next Turn
        </button>
        <button className="rounded-xl border border-amber-400/60 px-5 py-3 font-bold text-amber-300 hover:bg-amber-400/10" onClick={() => setTargetMenuOpen((open) => !open)}>
          Target Selection
        </button>
        {targetMenuOpen && (
          <div className="absolute bottom-full right-6 mb-3 min-w-56 rounded-2xl border border-slate-700 bg-slate-800 p-2 shadow-xl">
            {game.teams.filter((team) => !team.isEliminated).map((team) => (
              <button
                className="block w-full rounded-xl px-4 py-3 text-left font-semibold hover:bg-amber-400/10 hover:text-amber-300"
                key={team.id}
                onClick={() => {
                  game.selectNextTeam(team.id);
                  setTargetMenuOpen(false);
                }}
              >
                {team.name}
              </button>
            ))}
          </div>
        )}
      </footer>

      <CategoryPickerModal
        activePlayerName={game.activeTeam?.name}
        categories={game.currentCategories}
        isOpen={showCategories && game.currentCategories.length > 0}
        onSelect={chooseCategory}
      />
      <ChanceCardModal
        cardType={chanceCard}
        isOpen={chanceCard !== null}
        key={chanceCard}
        onConfirm={applyChanceCard}
        opponents={game.teams.filter((team) => team.id !== activeTeamId && !team.isEliminated)}
      />
    </main>
  );
}
