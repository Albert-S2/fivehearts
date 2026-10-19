"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import HybridScienceCard, { CHARACTER_CONFIG } from "./HybridScienceCard";

const COLORS = [
  { name: "Ruby", value: "ruby", className: "bg-rose-500" },
  { name: "Ocean", value: "ocean", className: "bg-cyan-500" },
  { name: "Sun", value: "sun", className: "bg-amber-400" },
  { name: "Forest", value: "forest", className: "bg-emerald-500" },
  { name: "Violet", value: "violet", className: "bg-violet-500" },
];

const QUESTION_COUNTS = [20, 40, 60];
const CHARACTER_KEYS = ["engineer", "astronaut", "archeologist", "chemist", "biologist"];

export default function BattleSetup() {
  const [teamCount, setTeamCount] = useState(3);
  const [questionCount, setQuestionCount] = useState(20);
  const [timeLimit, setTimeLimit] = useState(60);
  const [teamColors, setTeamColors] = useState(["ruby", "ocean", "sun"]);
  const [teamCharacters, setTeamCharacters] = useState(["engineer", "astronaut", "archeologist"]);
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2", "Team 3"]);
  const [game, setGame] = useState(null);

  function updateTeamCount(count) {
    setTeamCount(count);
    setTeamColors((colors) =>
      Array.from({ length: count }, (_, index) => colors[index] || COLORS[index].value),
    );
    setTeamCharacters((characters) =>
      Array.from({ length: count }, (_, index) => characters[index] || CHARACTER_KEYS[index]),
    );
    setTeamNames((names) =>
      Array.from({ length: count }, (_, index) => names[index] || `Team ${index + 1}`),
    );
  }

  function updateTeamCharacter(index, characterKey) {
    setTeamCharacters((characters) =>
      characters.map((currentCharacter, characterIndex) =>
        characterIndex === index ? characterKey : currentCharacter,
      ),
    );
  }

  function updateTeamName(index, name) {
    setTeamNames((names) =>
      names.map((currentName, nameIndex) => (nameIndex === index ? name : currentName)),
    );
  }

  function createBattle() {
    setGame({
      phase: "dashboard",
      teams: teamCharacters.slice(0, teamCount).map((characterKey, index) => ({
        id: `team-${index + 1}`,
        name: teamNames[index].trim() || `Team ${index + 1}`,
        characterKey,
        color: teamColors[index],
        hearts: 5,
        points: 0,
      })),
      questionCount,
      timeLimit,
      startingTeamId: null,
      answeringTeamId: null,
      turnOrder: [],
      questionNumber: 1,
      lastTransition: "Roll the dice to create the team order.",
    });
  }

  if (game) return <BattleGame game={game} onUpdate={setGame} />;

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
            Choose the match rules and give each team a character. The selected character and name will stay with that team throughout the game.
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
              <h2 className="text-lg font-black">Questions in the game</h2>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    className={`rounded-xl border px-4 py-4 font-black transition ${
                      questionCount === count
                        ? "border-amber-400 bg-amber-400 text-slate-950"
                        : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400"
                    }`}
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    type="button"
                  >
                    {count}
                  </button>
                ))}
              </div>
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
              <h2 className="text-lg font-black">Choose team characters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Each team picks one unique character. Their picture, name, hearts, and score appear on the dashboard.
              </p>
              <div className="mt-6 space-y-8">
                {Array.from({ length: teamCount }, (_, teamIndex) => {
                  const selectedCharacter = teamCharacters[teamIndex];
                  const selectedConfig = CHARACTER_CONFIG[selectedCharacter];
                  return (
                    <div className="border-t border-slate-800 pt-6 first:border-t-0 first:pt-0" key={teamIndex}>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
                            Team {teamIndex + 1}
                          </p>
                          <p className="mt-1 font-black">{selectedConfig.name} · {selectedConfig.profession}</p>
                        </div>
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Selected
                        </span>
                      </div>
                      <label className="mb-4 block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                          Team name
                        </span>
                        <input
                          className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
                          maxLength={10}
                          onChange={(event) => updateTeamName(teamIndex, event.target.value)}
                          placeholder={`Enter Team ${teamIndex + 1} name`}
                          type="text"
                          value={teamNames[teamIndex]}
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                        {CHARACTER_KEYS.map((characterKey) => {
                          const character = CHARACTER_CONFIG[characterKey];
                          const isSelected = selectedCharacter === characterKey;
                          const isTakenByOtherTeam = teamCharacters.some(
                            (currentCharacter, currentIndex) =>
                              currentIndex !== teamIndex && currentCharacter === characterKey,
                          );
                          return (
                            <button
                              aria-label={`Select ${character.name} for Team ${teamIndex + 1}`}
                              className={`relative min-w-0 rounded-2xl text-left transition ${
                                isSelected
                                  ? "z-10 ring-4 ring-amber-400"
                                  : isTakenByOtherTeam
                                    ? "cursor-not-allowed opacity-30"
                                    : "hover:scale-[1.02] hover:ring-2 hover:ring-amber-300"
                              }`}
                              disabled={isTakenByOtherTeam}
                              key={characterKey}
                              onClick={() => updateTeamCharacter(teamIndex, characterKey)}
                              type="button"
                            >
                              <HybridScienceCard
                                characterKey={characterKey}
                                hearts={5}
                                isActiveTurn={false}
                                isEliminated={false}
                                points={0}
                                teamName={`Team ${teamIndex + 1}`}
                              />
                              {isSelected && (
                                <span className="absolute left-2 top-2 z-20 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-950">
                                  Picked
                                </span>
                              )}
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
            <button className="mt-8 w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 hover:bg-amber-300" onClick={createBattle} type="button">
              Create battle
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
                characterKey={team.characterKey}
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
          <p className={`${questionCompact ? "mt-1.5 pt-1.5 text-[9px]" : "mt-3 pt-3 text-xs"} border-t border-slate-800 font-bold uppercase tracking-[0.16em] text-slate-500`}>
            <span className="text-amber-300">Route:</span> {lastTransition}
          </p>
        )}
      </div>
    </div>
  );
}

const CHANCE_CARD_DETAILS = {
  EXTRA_HEART: {
    title: "Extra heart",
    description: "Restore one heart, up to a maximum of five.",
  },
  REMOVE_ENEMY_HEART: {
    title: "Attack",
    description: "Choose an enemy team to lose one heart.",
  },
  CHOOSE_CATEGORY: {
    title: "Pick your category",
    description: "Your team earns the right to choose the next category.",
  },
  REMOVE_FAKE_ANSWER: {
    title: "50/50",
    description: "Your team can remove one wrong answer on the next question.",
  },
  CHEERING: {
    title: "Cheering card",
    description: "Good luck next time!",
  },
};

function ChanceCardPanel({ attackTargetId, card, onApply, onTarget, teams }) {
  const details = CHANCE_CARD_DETAILS[card];

  return (
    <div className="fixed inset-0 z-20 grid place-items-center bg-slate-950/85 p-6 backdrop-blur-sm">
      <section className="w-full max-w-md rounded-3xl border border-amber-400/50 bg-slate-900 p-7 text-center shadow-2xl shadow-amber-950/40">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-400">Chance card received</p>
        <div className="mx-auto mt-5 grid h-20 w-20 place-items-center rounded-2xl bg-amber-400 text-4xl font-black text-slate-950">5</div>
        <h2 className="mt-5 text-3xl font-black text-amber-300">{details.title}</h2>
        <p className="mt-2 text-slate-300">{details.description}</p>
        {card === "REMOVE_ENEMY_HEART" && (
          <select
            className="mt-5 w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white"
            onChange={(event) => onTarget(event.target.value)}
            value={attackTargetId}
          >
            <option value="">Choose an enemy team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}
        <button
          className="mt-5 rounded-xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={card === "REMOVE_ENEMY_HEART" && !attackTargetId}
          onClick={onApply}
          type="button"
        >
          {card === "CHEERING" ? "Continue" : card === "REMOVE_FAKE_ANSWER" ? "Keep for next question" : "Use card"}
        </button>
      </section>
    </div>
  );
}

function BattleGame({ game, onUpdate }) {
  const INITIAL_ANSWERS = ["Venus", "Mercury", "Mars", "Earth"];
  const [isRolling, setIsRolling] = useState(false);
  const [diceFace, setDiceFace] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(game.timeLimit ?? 60);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [chanceCard, setChanceCard] = useState(null);
  const [attackTargetId, setAttackTargetId] = useState("");
  const [visibleAnswers, setVisibleAnswers] = useState(INITIAL_ANSWERS);
  const resolveAnswerRef = useRef(null);

  useEffect(() => {
    if (game.phase !== "question" || answerResult || chanceCard || game.timeLimit === null) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timer);
          resolveAnswerRef.current?.(false, true);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [game.phase, game.timeLimit, answerResult, chanceCard]);

  const drawChanceCard = useCallback(() => {
    const roll = Math.random() * 100;
    if (roll < 5) return "EXTRA_HEART";
    if (roll < 7) return "REMOVE_ENEMY_HEART";
    if (roll < 12) return "CHOOSE_CATEGORY";
    if (roll < 17) return "REMOVE_FAKE_ANSWER";
    return "CHEERING";
  }, []);

  const resolveAnswer = useCallback((isCorrect, timedOut = false) => {
    if (answerResult || chanceCard) return;

    const answeringTeam = game.teams.find((team) => team.id === game.answeringTeamId);
    if (!answeringTeam) return;

    const updatedTeams = game.teams.map((team) => {
      if (team.id !== answeringTeam.id) return team;
      if (isCorrect) return { ...team, points: team.points + 10 };

      const hearts = Math.max(team.hearts - 1, 0);
      return { ...team, hearts };
    });

    setAnswerResult({ isCorrect, timedOut });
    onUpdate({ ...game, teams: updatedTeams });

    if (isCorrect) {
      setChanceCard(drawChanceCard());
    }
  }, [answerResult, chanceCard, drawChanceCard, game, onUpdate]);

  function chooseAnswer(answer, index) {
    if (answerResult || chanceCard) return;
    setSelectedAnswer(index);
    resolveAnswer(answer === "Mercury");
  }

  function applyChanceCard() {
    if (!chanceCard) return;
    const answeringTeam = game.teams.find((team) => team.id === game.answeringTeamId);
    let updatedTeams = game.teams;

    if (chanceCard === "EXTRA_HEART" && answeringTeam) {
      updatedTeams = game.teams.map((team) =>
        team.id === answeringTeam.id ? { ...team, hearts: Math.min(team.hearts + 1, 5) } : team,
      );
    }

    if (chanceCard === "REMOVE_ENEMY_HEART" && attackTargetId) {
      updatedTeams = game.teams.map((team) =>
        team.id === attackTargetId ? { ...team, hearts: Math.max(team.hearts - 1, 0) } : team,
      );
    }

    onUpdate({
      ...game,
      phase: "decision",
      teams: updatedTeams,
      lastChanceCard: chanceCard,
      pendingChanceCard: chanceCard === "REMOVE_FAKE_ANSWER"
        ? { type: chanceCard, teamId: game.answeringTeamId }
        : null,
      startingTeamId: game.answeringTeamId,
      answeringTeamId: null,
      questionNumber: game.questionNumber + 1,
      lastTransition: `${answeringTeam.name} answered correctly and controls the next choice.`,
    });
    setChanceCard(null);
    setAttackTargetId("");
  }

  useEffect(() => {
    resolveAnswerRef.current = resolveAnswer;
  }, [resolveAnswer]);

  function chooseAnsweringTeam(teamId) {
    setSecondsLeft(game.timeLimit ?? 60);
    setSelectedAnswer(null);
    setAnswerResult(null);
    setVisibleAnswers(INITIAL_ANSWERS);
    onUpdate({ ...game, phase: "question", answeringTeamId: teamId });
  }

  function usePendingChanceCard() {
    if (!game.pendingChanceCard || game.pendingChanceCard.type !== "REMOVE_FAKE_ANSWER") return;
    const wrongAnswerIndex = visibleAnswers.findIndex((answer) => answer !== "Mercury");
    setVisibleAnswers(visibleAnswers.filter((_, index) => index !== wrongAnswerIndex));
    onUpdate({ ...game, pendingChanceCard: null });
  }

  function moveToNextQuestion() {
    const currentOrderIndex = game.turnOrder.indexOf(game.answeringTeamId);
    const orderedCandidates = game.turnOrder.length
      ? game.turnOrder.map((teamId, index) => ({
        teamId,
        index,
      }))
      : [];
    const nextCandidate = orderedCandidates
      .map((candidate, offset) => ({
        ...candidate,
        offset: (candidate.index - currentOrderIndex + game.turnOrder.length) % game.turnOrder.length || game.turnOrder.length,
        order: offset,
      }))
      .sort((first, second) => first.offset - second.offset)
      .find((candidate) => game.teams.find((team) => team.id === candidate.teamId)?.hearts > 0);
    const nextTeamId = nextCandidate?.teamId || game.teams.find((team) => team.hearts > 0)?.id;

    onUpdate({
      ...game,
      phase: "decision",
      startingTeamId: nextTeamId,
      answeringTeamId: null,
      questionNumber: game.questionNumber + 1,
      lastTransition: `${game.teams.find((team) => team.id === game.answeringTeamId)?.name} was incorrect. Original order advances to ${game.teams.find((team) => team.id === nextTeamId)?.name}.`,
    });
    setSelectedAnswer(null);
    setAnswerResult(null);
    setSecondsLeft(game.timeLimit ?? 60);
  }

  function rollDice() {
    if (isRolling) return;
    setIsRolling(true);
    let rolls = 0;
    const interval = window.setInterval(() => {
      setDiceFace(Math.floor(Math.random() * 6) + 1);
      rolls += 1;
      if (rolls === 10) {
        window.clearInterval(interval);
        const order = [...game.teams]
          .sort(() => Math.random() - 0.5)
          .map((team) => team.id);
        const team = game.teams.find((item) => item.id === order[0]);
        setDiceFace(1);
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

  if (game.phase === "decision" || game.phase === "question") {
    const startingTeam = game.teams.find((team) => team.id === game.startingTeamId);
    const answeringTeam = game.teams.find((team) => team.id === game.answeringTeamId);

    if (game.phase === "decision") {
      return (
        <main className="manga-shell min-h-screen bg-slate-950 pb-24 text-white lg:pb-36">
          <TeamStrip highlightedTeamId={game.startingTeamId} lastTransition={game.lastTransition} questionCompact questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
          <div className="mx-auto max-w-3xl px-6 py-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-amber-400">
              Question {game.questionNumber}
            </p>
            <div className="mt-6 rounded-3xl border border-amber-400/30 bg-slate-900 p-7 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Category</p>
              <h1 className="mt-4 text-4xl font-black text-amber-300">Science</h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-7 text-slate-300">
                {startingTeam?.name}, choose who will answer this question.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  className="rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 hover:bg-amber-300"
                  onClick={() => chooseAnsweringTeam(game.startingTeamId)}
                  type="button"
                >
                  {startingTeam?.name} will answer
                </button>
                {game.teams
                  .filter((team) => team.id !== game.startingTeamId && team.hearts > 0)
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
              Question {game.questionNumber} · Science
            </p>
            {game.timeLimit !== null && (
              <span className={`rounded-full border px-4 py-2 text-xl font-black tabular-nums ${secondsLeft <= 10 ? "border-red-400 text-red-400" : "border-amber-400 text-amber-300"}`}>
                {secondsLeft}s
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-black sm:text-5xl">Which planet is closest to the Sun?</h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {visibleAnswers.map((answer, index) => (
              <button
                className={`rounded-2xl border p-5 text-left text-lg font-bold ${
                  selectedAnswer === index
                    ? answerResult?.isCorrect
                      ? "border-emerald-400 bg-emerald-400/10"
                      : "border-red-400 bg-red-400/10"
                    : "border-slate-700 bg-slate-900 hover:border-amber-400"
                }`}
                disabled={Boolean(answerResult) || Boolean(chanceCard)}
                key={answer}
                onClick={() => chooseAnswer(answer, index)}
                type="button"
              >
                <span className="mr-3 text-amber-400">{String.fromCharCode(65 + index)}.</span>
                {answer}
              </button>
            ))}
          </div>
          {game.pendingChanceCard?.type === "REMOVE_FAKE_ANSWER" &&
            game.pendingChanceCard.teamId === game.answeringTeamId && (
              <div className="mt-6 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Your chance card</p>
                <p className="mt-2 font-black text-amber-300">50/50 · Remove one wrong answer</p>
                <button className="mt-4 rounded-xl bg-amber-400 px-5 py-3 font-black text-slate-950 hover:bg-amber-300" onClick={usePendingChanceCard} type="button">
                  Use 50/50
                </button>
              </div>
            )}
          <p className="mt-8 text-center text-slate-400">
            {answerResult?.timedOut
              ? `${answeringTeam?.name} ran out of time. One heart is lost.`
              : answerResult?.isCorrect
                ? `${answeringTeam?.name} is correct and earns 10 points!`
                : `${answeringTeam?.name} is incorrect. One heart is lost.`}
          </p>
          {answerResult && !answerResult.isCorrect && (
            <button
              className="mt-6 w-full rounded-xl bg-amber-400 px-5 py-4 font-black text-slate-950 hover:bg-amber-300"
              onClick={moveToNextQuestion}
              type="button"
            >
              Next question
            </button>
          )}
          {chanceCard && (
            <ChanceCardPanel
              attackTargetId={attackTargetId}
              card={chanceCard}
              onApply={applyChanceCard}
              onTarget={setAttackTargetId}
              teams={game.teams.filter((team) => team.id !== answeringTeam?.id && team.hearts > 0)}
            />
          )}
        </div>
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

        <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Starting team</p>
            <div className="mt-6 flex flex-col items-center text-center">
              <div className={`grid h-24 w-24 place-items-center rounded-3xl border-4 border-amber-400 bg-slate-800 text-5xl font-black text-amber-300 ${isRolling ? "animate-bounce" : ""}`}>
                {diceFace}
              </div>
              <p className="mt-5 text-xl font-black">
                {game.startingTeamId ? `${game.teams.find((team) => team.id === game.startingTeamId).name} starts` : "Roll to create team order"}
              </p>
              <button className="mt-5 rounded-xl bg-amber-400 px-6 py-3 font-black text-slate-950 hover:bg-amber-300 disabled:opacity-50" disabled={isRolling} onClick={rollDice} type="button">
                {isRolling ? "Rolling..." : game.startingTeamId ? "Roll again" : "Roll dice"}
              </button>
            </div>
          </div>
          <aside className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">Last chance card</p>
            <div className="mt-5 grid min-h-36 place-items-center rounded-2xl border border-dashed border-slate-700 text-center text-sm text-slate-500">
              {game.pendingChanceCard?.type === "REMOVE_FAKE_ANSWER"
                ? `${game.teams.find((team) => team.id === game.pendingChanceCard.teamId)?.name} · 50/50 ready`
                : "No card drawn yet"}
            </div>
          </aside>
        </section>

        <button className="mt-8 w-full rounded-2xl bg-amber-400 px-6 py-4 text-lg font-black text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40" disabled={!game.startingTeamId || isRolling} onClick={() => onUpdate({ ...game, phase: "decision", lastTransition: `${game.teams.find((team) => team.id === game.startingTeamId)?.name} is first in the order and chooses who answers.` })} type="button">
          Start game
        </button>
      </div>
    </main>
  );
}
