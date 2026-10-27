"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import HybridScienceCard, { TEAM_COLOR_CONFIG } from "./HybridScienceCard";
import { fetchQuestionsForGame } from "../lib/questionService";

const COLORS = [
  "red", "blue", "green", "yellow", "purple",
];

export default function BattleSetup() {
  const router = useRouter();
  const [teamCount, setTeamCount] = useState(3);
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(60);
  const [teamColors, setTeamColors] = useState(["red", "blue", "yellow"]);
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2", "Team 3"]);
  const [game, setGame] = useState(null);
  const [isCreatingBattle, setIsCreatingBattle] = useState(false);

  function updateTeamCount(count) {
    setTeamCount(count);
    setTeamColors((colors) => Array.from({ length: count }, (_, index) => colors[index] || COLORS[index]));
    setTeamNames((names) =>
      Array.from({ length: count }, (_, index) => names[index] || `Team ${index + 1}`),
    );
  }

  function updateTeamName(index, name) {
    setTeamNames((names) =>
      names.map((currentName, nameIndex) => (nameIndex === index ? name : currentName)),
    );
  }

  async function createBattle() {
    setIsCreatingBattle(true);
    const questions = await fetchQuestionsForGame(questionCount);

    if (questions.length === 0) {
      console.error("No usable questions are available to start the battle.");
      setIsCreatingBattle(false);
      return;
    }

    setGame({
      phase: "dashboard",
      teams: teamColors.slice(0, teamCount).map((_, index) => ({
        id: `team-${index + 1}`,
        name: teamNames[index].trim() || `Team ${index + 1}`,
        color: teamColors[index],
        hearts: 5,
        points: 0,
        questionsAsked: 0,
      })),
      questionCount: questions.length,
      questions,
      timeLimit,
      startingTeamId: null,
      answeringTeamId: null,
      lastAnsweringTeamId: null,
      excludedTeamId: null,
      turnOrder: [],
      questionNumber: 1,
      selfSelectionTeamId: null,
      selfSelectionCount: 0,
      lastTransition: "Roll the dice to create the team order.",
    });
    setIsCreatingBattle(false);
  }

  if (game) {
    return (
      <BattleGame
        game={game}
        onMainMenu={() => {
          setGame(null);
          router.replace("/");
        }}
        onUpdate={setGame}
      />
    );
  }

  return (
    <main className="manga-shell min-h-screen bg-slate-950 px-5 py-8 pb-24 text-white sm:px-8 lg:pb-36">
      <div className="mx-auto max-w-4xl">
        <Link className="text-sm font-semibold text-slate-500 hover:text-amber-300" href="/game">
          ← Back to modes
        </Link>

        <header className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Five Hearts · Battle</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">Set up your battle</h1>
          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Choose the match rules, team names, and a unique color for each team.
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_280px] lg:items-start">
          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-black">Number of teams</h2>
              <p className="mt-1 text-sm text-slate-500">Battle supports three to five teams.</p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {[3, 4, 5].map((count) => (
                  <button
                    className={`rounded-xl border px-4 py-4 text-xl font-black transition ${
                      teamCount === count
                        ? "border-amber-400 bg-amber-400 text-slate-950"
                        : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400"
                    }`}
                    key={count}
                    onClick={() => updateTeamCount(count)}
                    type="button"
                  >
                    {count}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-black">Questions in the game</h2>
                <span className="rounded-full bg-amber-400 px-4 py-2 text-xl font-black text-slate-950">
                  {questionCount}
                </span>
              </div>
              <label className="mt-6 block">
                <span className="sr-only">Number of questions</span>
                <input
                  aria-label="Number of questions"
                  className="w-full accent-amber-400"
                  max="100"
                  min="10"
                  onChange={(event) => setQuestionCount(Number(event.target.value))}
                  step="1"
                  type="range"
                  value={questionCount}
                />
                <span className="mt-2 flex justify-between text-xs font-bold text-slate-500">
                  <span>10 questions</span>
                  <span>100 questions</span>
                </span>
              </label>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-black">Time limit per question</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[{ label: "60 seconds", value: 60 }, { label: "No limit", value: null }].map((option) => (
                  <button
                    className={`rounded-xl border px-4 py-4 font-bold transition ${
                      timeLimit === option.value
                        ? "border-amber-400 bg-amber-400 text-slate-950"
                        : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400"
                    }`}
                    key={option.label}
                    onClick={() => setTimeLimit(option.value)}
                    type="button"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-lg font-black">Set team names and colors</h2>
              <p className="mt-1 text-sm text-slate-500">
                Each team picks a unique color. Their name, hearts, and score appear throughout the game.
              </p>
              <div className="mt-6 space-y-8">
                {Array.from({ length: teamCount }, (_, teamIndex) => {
                  const selectedColor = teamColors[teamIndex];
                  const selectedTeamColor = TEAM_COLOR_CONFIG[selectedColor];
                  return (
                    <div className={`rounded-xl border-t border-l-4 ${selectedTeamColor.border} ${selectedTeamColor.surface}/10 pt-6 pl-4 first:border-t-0 first:pt-0`} key={teamIndex}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${selectedTeamColor.swatch} ring-2 ring-white`} />
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                              Team {teamIndex + 1}
                            </p>
                          </div>
                          <p className={`mt-1 font-black ${selectedTeamColor.text}`}>{selectedTeamColor.name}</p>
                        </div>
                        <span className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${selectedTeamColor.swatch} ${selectedTeamColor.text}`}>
                          Selected
                        </span>
                      </div>
                      <label className="mb-4 block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          Team name
                        </span>
                        <input
                          className={`w-full rounded-xl border bg-slate-950 px-4 py-3 font-bold text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${selectedTeamColor.border} focus:ring-amber-400/20`}
                          maxLength={10}
                          onChange={(event) => updateTeamName(teamIndex, event.target.value)}
                          placeholder={`Enter Team ${teamIndex + 1} name`}
                          type="text"
                          value={teamNames[teamIndex]}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {COLORS.map((colorKey) => {
                          const color = TEAM_COLOR_CONFIG[colorKey];
                          const isSelected = selectedColor === colorKey;
                          const isTakenByOtherTeam = teamColors.some(
                            (currentColor, currentIndex) => currentIndex !== teamIndex && currentColor === colorKey,
                          );
                          return (
                            <button
                              aria-label={`Select ${color.name} for Team ${teamIndex + 1}`}
                              className={`relative min-w-0 rounded-2xl text-left transition ${
                                isSelected
                                  ? `z-10 scale-[1.04] ring-4 ring-offset-2 ring-offset-white ${color.active}`
                                  : isTakenByOtherTeam
                                    ? "cursor-not-allowed opacity-30"
                                    : `hover:scale-[1.02] hover:ring-2 ${color.active}`
                              }`}
                              disabled={isTakenByOtherTeam}
                              key={colorKey}
                              onClick={() => setTeamColors((colors) => colors.map((currentColor, currentIndex) => currentIndex === teamIndex ? colorKey : currentColor))}
                              type="button"
                            >
                              <span
                                className={`flex h-16 items-center justify-center rounded-xl text-sm font-black ${color.text}`}
                                style={{ backgroundColor: color.value }}
                              >
                                {isSelected && <span className="mr-1" aria-hidden="true">✓</span>}
                                {color.name}
                              </span>
                              {isSelected && <span className="mt-1 block text-center text-[10px] font-black uppercase tracking-wider text-emerald-300">Picked</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="rounded-3xl border border-amber-400/30 bg-amber-400/5 p-6 lg:sticky lg:top-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Match summary</p>
            <h2 className="mt-3 text-2xl font-black">Battle</h2>
            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <dt className="text-slate-500">Teams</dt>
                <dd className="font-bold">{teamCount}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <dt className="text-slate-500">Questions</dt>
                <dd className="font-bold">{questionCount}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-3">
                <dt className="text-slate-500">Time limit</dt>
                <dd className="font-bold">{timeLimit === null ? "None" : `${timeLimit}s`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Starting hearts</dt>
                <dd className="font-bold text-rose-400">5 each</dd>
              </div>
            </dl>
            <button className="mt-8 w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 hover:bg-amber-300 disabled:cursor-wait disabled:opacity-60" disabled={isCreatingBattle} onClick={createBattle} type="button">
              {isCreatingBattle ? "Loading questions..." : "Create battle"}
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Hearts({ count }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} of 5 hearts`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span className={`text-lg ${index < count ? "text-rose-400" : "text-slate-700"}`} key={index}>
          ♥
        </span>
      ))}
    </div>
  );
}

function TeamStrip({ teams, highlightedTeamId, questionNumber, questionCount, turnOrder, lastTransition, questionCompact = false }) {
  const orderedTeams = turnOrder.length
    ? turnOrder.map((teamId) => teams.find((team) => team.id === teamId)).filter(Boolean)
    : teams;

  return (
    <div className="border-b border-slate-800 bg-slate-900 p-3">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400">Progress</p>
          <p className="mt-1 text-lg font-black text-white">
            {questionNumber} <span className="text-sm font-bold text-slate-400">of {questionCount}</span>
          </p>
          <p className="text-xs text-slate-500">{Math.max(questionCount - questionNumber, 0)} left</p>
        </div>
          <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {orderedTeams.map((team) => (
            <div className="relative min-w-0" key={team.id}>
              <HybridScienceCard
                color={team.color}
                hearts={team.hearts}
                isActiveTurn={team.id === highlightedTeamId}
                isEliminated={team.hearts === 0}
                points={team.points}
                compact
                extraCompact={questionCompact}
                teamName={team.name}
              />
            </div>
          ))}
        </div>
      </div>
        {turnOrder.length > 0 && (
          <p className={`${questionCompact ? "mt-2 pt-2 text-xs" : "mt-3 pt-3 text-sm"} border-t border-slate-800 font-bold uppercase tracking-[0.12em] text-slate-300`}>
            <span className="text-amber-300">Route:</span> {lastTransition}
          </p>
        )}
      </div>
    </div>
  );
}

function VictoryScreen({ teams, onMainMenu }) {
  const allTeamsEliminated = teams.every((team) => team.hearts === 0);
  const eligibleTeams = allTeamsEliminated
    ? teams
    : teams.filter((team) => team.hearts > 0);
  const winner = [...eligibleTeams].sort((first, second) => second.points - first.points)[0];
  const pointsLeader = winner;
  const heartsLeader = [...teams].sort((first, second) => second.hearts - first.hearts)[0];
  const questionsLeader = [...teams].sort((first, second) => second.questionsAsked - first.questionsAsked)[0];

  return (
    <main className="manga-shell relative z-[55] min-h-screen bg-slate-950 px-6 py-10 pb-32 text-white lg:pb-40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Five Hearts · Battle complete</p>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-amber-300 sm:text-7xl">Victory!</h1>
          <p className="mt-4 text-lg text-slate-300">
            {allTeamsEliminated
              ? "Every team was eliminated. The team with the most points wins."
              : "The winner is the surviving team with the most points."}
          </p>
        </div>

        <section className="mx-auto mt-10 max-w-sm text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Champion</p>
          <div className="mt-4 flex justify-center">
            <HybridScienceCard
              color={winner.color}
              hearts={winner.hearts}
              isActiveTurn
              isEliminated={winner.hearts === 0}
              points={winner.points}
              teamName={winner.name}
            />
          </div>
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <VictoryStat label={allTeamsEliminated ? "Most points" : "Most points among survivors"} team={pointsLeader} value={pointsLeader.points} />
          <VictoryStat label="Most hearts left" team={heartsLeader} value={heartsLeader.hearts} />
          <VictoryStat label="Most questions asked" team={questionsLeader} value={questionsLeader.questionsAsked} />
        </div>

      </div>
      <button
        className="fixed bottom-[62px] left-1/2 z-[60] inline-flex -translate-x-1/2 rounded-xl border-2 border-white bg-amber-400 px-8 py-4 text-base font-black text-slate-950 shadow-2xl shadow-black/60 hover:bg-amber-300"
        onClick={onMainMenu}
        type="button"
      >
        Go to main menu
      </button>
    </main>
  );
}

function VictoryStat({ label, team, value }) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">{label}</p>
      <p className="mt-4 text-2xl font-black text-white">{team.name}</p>
      <p className="mt-2 text-4xl font-black text-amber-300">{value}</p>
    </section>
  );
}

function BattleGame({ game, onMainMenu, onUpdate }) {
  const [isRolling, setIsRolling] = useState(false);
  const [diceFace, setDiceFace] = useState("?");
  const [secondsLeft, setSecondsLeft] = useState(game.timeLimit ?? 60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [isCorrectAnswerRevealed, setIsCorrectAnswerRevealed] = useState(false);
  const [isFeedbackReady, setIsFeedbackReady] = useState(false);
  const activeQuestion = game.questions?.[game.questionNumber - 1];
  const [visibleAnswers, setVisibleAnswers] = useState(activeQuestion?.options || []);
  const resolveAnswerRef = useRef(null);
  const feedbackTimerRef = useRef(null);

  useEffect(() => () => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (game.phase !== "question" || answerResult || game.timeLimit === null) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        return Math.max(seconds - 1, 0);
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [game.phase, game.timeLimit, answerResult]);

  useEffect(() => {
    if (
      game.phase === "question"
      && game.timeLimit !== null
      && secondsLeft === 0
      && !answerResult
    ) {
      resolveAnswerRef.current?.(false, true);
    }
  }, [answerResult, game.phase, game.timeLimit, secondsLeft]);

  const resolveAnswer = useCallback((isCorrect, timedOut = false) => {
    if (answerResult) return;

    const answeringTeam = game.teams.find((team) => team.id === game.answeringTeamId);
    if (!answeringTeam) return;

    const updatedTeams = game.teams.map((team) => {
      if (team.id !== answeringTeam.id) return team;
      const questionsAsked = team.questionsAsked + 1;
      const pointsAwarded = ["Hard", "Difficult"].includes(activeQuestion.difficultyLabel) ? 20 : 10;
      if (isCorrect) return { ...team, points: team.points + pointsAwarded, questionsAsked };

      const hearts = Math.max(team.hearts - 1, 0);
      return { ...team, hearts, questionsAsked };
    });
    const allTeamsEliminated = updatedTeams.every((team) => team.hearts === 0);

    setAnswerResult({ isCorrect, timedOut });
    setIsCorrectAnswerRevealed(isCorrect);
    setIsFeedbackReady(isCorrect);
    if (!isCorrect) {
      feedbackTimerRef.current = window.setTimeout(() => {
        setIsCorrectAnswerRevealed(true);
        setIsFeedbackReady(true);
      }, 1000);
    }
    onUpdate({ ...game, teams: updatedTeams, allTeamsEliminated });
  }, [activeQuestion, answerResult, game, onUpdate]);

  function chooseAnswer(answer, index) {
    if (answerResult) return;
    setSelectedAnswer(index);
    setIsCorrectAnswerRevealed(false);
    setIsFeedbackReady(false);
    resolveAnswer(index === activeQuestion.correctAnswerIndex);
  }

  useEffect(() => {
    resolveAnswerRef.current = resolveAnswer;
  }, [resolveAnswer]);

  function chooseAnsweringTeam(teamId) {
    const isSelfSelection = teamId === game.startingTeamId;
    const cannotSelfSelectAgain = isSelfSelection
      && game.selfSelectionTeamId === teamId
      && game.selfSelectionCount >= 1;
    if (teamId === game.excludedTeamId || cannotSelfSelectAgain) return;

    setSecondsLeft(game.timeLimit ?? 60);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setIsCorrectAnswerRevealed(false);
    setIsFeedbackReady(false);
    const nextQuestion = game.questions[game.questionNumber - 1];
    setVisibleAnswers(nextQuestion.options);
    onUpdate({
      ...game,
      phase: "question",
      answeringTeamId: teamId,
      selfSelectionTeamId: isSelfSelection ? teamId : null,
      selfSelectionCount: isSelfSelection ? game.selfSelectionCount + 1 : 0,
    });
  }


  function moveToNextQuestion() {
    const answeringTeam = game.teams.find((team) => team.id === game.answeringTeamId);
    const answeredCorrectly = answerResult?.isCorrect;
    const nextControllerId = answeredCorrectly
      ? game.answeringTeamId
      : game.startingTeamId;
    const nextController = game.teams.find(
      (team) => team.id === nextControllerId && team.hearts > 0,
    );
    const fallbackController = game.teams.find(
      (team) => team.hearts > 0 && team.id !== game.answeringTeamId,
    );
    const nextTeamId = nextController?.id || fallbackController?.id;
    const excludedTeamId = answeredCorrectly ? null : game.answeringTeamId;

    onUpdate({
      ...game,
      phase: game.questionNumber >= game.questionCount || game.allTeamsEliminated ? "victory" : "decision",
      startingTeamId: nextTeamId,
      answeringTeamId: null,
      excludedTeamId,
      questionNumber: game.questionNumber + 1,
      lastTransition: answeredCorrectly
        ? `${answeringTeam?.name} answered correctly and now chooses who answers next.`
        : `${answeringTeam?.name} was incorrect. ${game.teams.find((team) => team.id === nextTeamId)?.name} chooses next, but cannot select ${answeringTeam?.name}.`,
    });
    setSelectedAnswer(null);
    setAnswerResult(null);
    setIsCorrectAnswerRevealed(false);
    setIsFeedbackReady(false);
    setSecondsLeft(game.timeLimit ?? 60);
  }

  function rollDice() {
    if (isRolling) return;
    setIsRolling(true);
    let rolls = 0;
    const interval = window.setInterval(() => {
      const randomTeam = game.teams[Math.floor(Math.random() * game.teams.length)];
      setDiceFace(randomTeam.name);
      rolls += 1;
      if (rolls === 10) {
        window.clearInterval(interval);
        const order = [...game.teams]
          .sort(() => Math.random() - 0.5)
          .map((team) => team.id);
        const team = game.teams.find((item) => item.id === order[0]);
        setDiceFace(team.name);
        onUpdate({
          ...game,
          startingTeamId: team.id,
          turnOrder: order,
          lastTransition: `Dice order set: ${order.map((teamId) => game.teams.find((item) => item.id === teamId)?.name).join(" → ")}.`,
        });
        setIsRolling(false);
      }
    }, 90);
  }

  if (game.phase === "victory") {
    return <VictoryScreen onMainMenu={onMainMenu} teams={game.teams} />;
  }

  if (game.phase === "decision" || game.phase === "question") {
    const startingTeam = game.teams.find((team) => team.id === game.startingTeamId);
    const answeringTeam = game.teams.find((team) => team.id === game.answeringTeamId);

    if (game.phase === "decision") {
      const availableAnsweringTeams = game.teams.filter(
        (team) => team.hearts > 0 && team.id !== game.excludedTeamId,
      );
      const cannotSelfSelect = game.selfSelectionTeamId === game.startingTeamId
        && game.selfSelectionCount >= 1;
      return (
        <main className="manga-shell min-h-screen bg-slate-950 pb-24 text-white lg:pb-36">
          <TeamStrip highlightedTeamId={game.startingTeamId} lastTransition={game.lastTransition} questionCompact questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
          <div className="mx-auto max-w-3xl px-6 py-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
              Question {game.questionNumber}
            </p>
            <div className="mt-6 rounded-3xl border border-amber-400/30 bg-slate-900 p-7 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Category</p>
              <h1 className="mt-4 flex items-center justify-center gap-3 text-4xl font-black text-amber-300">
                {activeQuestion?.category}
                <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-sm uppercase tracking-[0.15em] text-sky-300">
                  {activeQuestion?.difficultyLabel}
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-slate-300">
                {startingTeam?.name}, choose who will answer this question.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {!cannotSelfSelect && (
                  <button
                    className="rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 hover:bg-amber-300"
                    onClick={() => chooseAnsweringTeam(game.startingTeamId)}
                    type="button"
                  >
                    {startingTeam?.name} will answer
                  </button>
                )}
                {game.teams
                  .filter((team) => team.id !== game.startingTeamId && team.hearts > 0 && team.id !== game.excludedTeamId)
                  .map((team) => (
                    <button
                      className="rounded-xl border border-slate-600 bg-slate-800 px-5 py-4 font-bold text-white hover:border-amber-400 hover:text-amber-300"
                      key={team.id}
                      onClick={() => chooseAnsweringTeam(team.id)}
                      type="button"
                    >
                      {team.name} will answer
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </main>
      );
    }

    return (
      <main className="manga-shell min-h-screen bg-slate-950 pb-24 text-white lg:pb-36">
        <TeamStrip highlightedTeamId={game.answeringTeamId} lastTransition={game.lastTransition} questionCompact questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
      <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
              Question {game.questionNumber} · {activeQuestion?.category}
              <span className="ml-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sky-300">
                {activeQuestion?.difficultyLabel}
              </span>
            </p>
            {game.timeLimit !== null && (
              <span className={`rounded-full border px-4 py-2 text-xl font-black tabular-nums ${secondsLeft <= 10 ? "border-red-400 text-red-400" : "border-amber-400 text-amber-300"}`}>
                {secondsLeft}s
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">{activeQuestion?.questionText}</h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {visibleAnswers.map((answer, index) => (
              <button
                className={`rounded-2xl border p-5 text-left text-lg font-bold transition-all duration-300 ease-out ${
                  answerResult && index === activeQuestion.correctAnswerIndex && isCorrectAnswerRevealed
                      ? "answer-correct border-brass bg-brass/20 text-ink-blue"
                    : selectedAnswer === index && answerResult && !answerResult.isCorrect
                        ? "answer-incorrect border-terracotta bg-terracotta/20 text-ink-blue"
                      : selectedAnswer === index && answerResult?.isCorrect
                          ? "answer-correct border-brass bg-brass/20 text-ink-blue"
                        : "border-slate-700 bg-slate-900 hover:border-amber-400"
                }`}
                disabled={Boolean(answerResult)}
                key={answer}
                onClick={() => chooseAnswer(answer, index)}
                type="button"
              >
                <span className="mr-3 text-amber-400">{String.fromCharCode(65 + index)}.</span>
                {answer}
              </button>
            ))}
          </div>
        </div>
        {answerResult && isFeedbackReady && (
          <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/80 p-6 backdrop-blur-sm">
            <section
              aria-labelledby="answer-result-title"
              aria-modal="true"
              className={`w-full max-w-xl rounded-3xl border-4 p-8 text-center shadow-2xl ${
                answerResult.isCorrect
                  ? "border-emerald-400 bg-emerald-950"
                  : "border-red-400 bg-red-950"
              }`}
              role="dialog"
            >
              <p className={`text-sm font-black uppercase tracking-[0.3em] ${answerResult.isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                {answerResult.isCorrect ? "Correct" : "Wrong answer"}
              </p>
              <h2 className="mt-4 text-3xl font-black text-white" id="answer-result-title">
                {answerResult.isCorrect
                  ? `${answeringTeam?.name} is correct and earns ${["Hard", "Difficult"].includes(activeQuestion?.difficultyLabel) ? 20 : 10} points!`
                  : answerResult.timedOut
                    ? `${answeringTeam?.name} ran out of time and loses 1 heart.`
                    : `${answeringTeam?.name} loses 1 heart.`}
              </h2>
              {!answerResult.isCorrect && (
                <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-left">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">
                    Correct answer
                  </p>
                  <p className="mt-2 text-xl font-black text-emerald-100">
                    {activeQuestion?.options?.[activeQuestion.correctAnswerIndex]}
                  </p>
                </div>
              )}
              {activeQuestion?.explanation && (
                <p className="mt-5 text-lg leading-8 text-slate-200">{activeQuestion.explanation}</p>
              )}
              <button
                className="mt-8 w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 hover:bg-amber-300"
                onClick={moveToNextQuestion}
                type="button"
              >
                {game.questionNumber >= game.questionCount ? "See results" : "Next question"}
              </button>
            </section>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="manga-shell min-h-screen bg-slate-950 pb-24 text-white lg:pb-36">
      <TeamStrip highlightedTeamId={game.startingTeamId} lastTransition={game.lastTransition} questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">Battle dashboard</p>
            <h1 className="mt-3 text-4xl font-black">Ready to play?</h1>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-400">
            {game.questionCount} questions · {game.timeLimit === null ? "No time limit" : `${game.timeLimit} seconds`}
          </div>
        </div>

        <section className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Starting team</p>
            <div className="mt-6 flex flex-col items-center text-center">
              <div className={`grid h-32 w-64 max-w-full place-items-center rounded-3xl border-4 border-amber-400 bg-slate-800 px-4 text-center text-2xl font-black text-amber-300 ${isRolling ? "animate-bounce" : ""}`}>
                {diceFace}
              </div>
              <p className="mt-5 text-xl font-black">
                {game.startingTeamId ? `${game.teams.find((team) => team.id === game.startingTeamId).name} starts` : "Roll to create team order"}
              </p>
              {!game.startingTeamId && (
                <button className="mt-5 rounded-xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300 disabled:opacity-50" disabled={isRolling} onClick={rollDice} type="button">
                  {isRolling ? "Rolling..." : "Roll dice"}
                </button>
              )}
            </div>
          </div>
        </section>

        <button className="mt-8 w-full rounded-2xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40" disabled={!game.startingTeamId || isRolling} onClick={() => onUpdate({ ...game, phase: "decision", lastTransition: `${game.teams.find((team) => team.id === game.startingTeamId)?.name} is first in the order and chooses who answers.` })} type="button">
          Start game
        </button>
      </div>
    </main>
  );
}
