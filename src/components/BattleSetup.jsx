"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import HybridScienceCard, { TEAM_COLOR_CONFIG } from "./HybridScienceCard";
import { fetchQuestionsForGame } from "../lib/questionService";

const TEAM_COLORS = ["red", "blue", "green", "yellow", "purple"];
const RULES = [
  {
    icon: "♥",
    eyebrow: "The objective",
    title: "Protect your five hearts",
    body: "Every team starts with five hearts. The team with the most points among the survivors wins the battle.",
    accent: "from-rose-500 to-fuchsia-500",
  },
  {
    icon: "Ⅱ",
    eyebrow: "Your turn",
    title: "A team can answer twice",
    body: "The team chosen to answer gets the question. If they are correct, they keep control and can choose who answers next.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    icon: "✦",
    eyebrow: "Correct answer",
    title: "Keep the momentum",
    body: "A correct answer earns points and lets that team decide who takes the next question—including themselves once.",
    accent: "from-emerald-400 to-cyan-400",
  },
  {
    icon: "×",
    eyebrow: "Wrong answer",
    title: "Lose a heart, change control",
    body: "An incorrect answer costs one heart. The original choosing team controls the next selection, but cannot pick the team that missed.",
    accent: "from-orange-400 to-rose-500",
  },
  {
    icon: "★",
    eyebrow: "Score the win",
    title: "Easy points, bigger rewards",
    body: "Standard questions are worth 10 points. Difficult questions are worth 20. Survive, score, and take the crown.",
    accent: "from-fuchsia-400 to-violet-500",
  },
];

export default function BattleSetup() {
  const router = useRouter();
  const [teamCount, setTeamCount] = useState(3);
  const [questionCount, setQuestionCount] = useState(30);
  const [timeLimit, setTimeLimit] = useState(60);
  const [teamColors, setTeamColors] = useState(["red", "blue", "yellow"]);
  const [teamNames, setTeamNames] = useState(["Team 1", "Team 2", "Team 3"]);
  const [game, setGame] = useState(null);
  const [isCreatingBattle, setIsCreatingBattle] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [ruleIndex, setRuleIndex] = useState(0);
  const [setupStep, setSetupStep] = useState("settings");

  function updateTeamCount(count) {
    setTeamCount(count);
    setTeamColors(TEAM_COLORS.slice(0, count));
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

  if (showRules) {
    const rule = RULES[ruleIndex];
    const isLastRule = ruleIndex === RULES.length - 1;
    return (
      <main className="arcade-shell arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] px-5 py-5 text-white sm:px-8">
        <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
            <Link className="text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-300" href="/game">
              ← Back to modes
            </Link>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">
              How to play
            </span>
          </header>

          <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
              Five Hearts Quiz · Battle
            </p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">
              Know the play
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Five quick cards to get everyone ready before the first question.
            </p>

            <article className="mt-7 w-full max-w-xl rounded-2xl border border-slate-700/60 bg-slate-900/80 p-7 text-left shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl sm:p-9">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${rule.accent} text-3xl font-black text-white shadow-lg`}>
                {rule.icon}
              </div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">{rule.eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{rule.title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">{rule.body}</p>
            </article>

            <div className="mt-6 flex items-center gap-2" aria-label={`Rule ${ruleIndex + 1} of ${RULES.length}`}>
              {RULES.map((item, index) => (
                <span
                  className={`h-2 rounded-full transition-all duration-300 ${index === ruleIndex ? "w-8 bg-cyan-400 shadow-[0_0_12px_rgb(34_211_238_/_0.7)]" : "w-2 bg-slate-700"}`}
                  key={item.title}
                />
              ))}
            </div>

            <div className="mt-6 flex w-full max-w-xl items-center justify-between gap-4">
              <button
                className="text-sm font-bold text-slate-400 transition-colors hover:text-white"
                onClick={() => setShowRules(false)}
                type="button"
              >
                Skip rules
              </button>
              <button
                className="arcade-launch-button rounded-xl px-7 py-3 text-sm font-extrabold"
                onClick={() => {
                  if (isLastRule) {
                    setShowRules(false);
                  } else {
                    setRuleIndex((index) => index + 1);
                  }
                }}
                type="button"
              >
                {isLastRule ? "Set up battle →" : "Next rule →"}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="arcade-shell arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] px-5 py-4 pb-20 text-white sm:px-8 lg:pb-[110px]">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <Link className="shrink-0 text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-300" href="/game">
          ← Back to modes
        </Link>

        <header className="mt-3 shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Five Hearts Quiz · Battle</p>
          <h1 className="mt-1 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">
            {setupStep === "settings" ? "Set the table" : "Name your teams"}
          </h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">
            {setupStep === "settings"
              ? "Choose the shape of your battle before inviting teams to the table."
              : "Give each team a name, then start the game when everyone is ready."}
          </p>
        </header>

        {setupStep === "settings" ? (
        <div className="mt-6 grid min-h-0 flex-1 content-center gap-4 pb-20 sm:grid-cols-3 lg:pb-[110px]">
          <div className="contents">
            <section className="arcade-panel min-w-0 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 backdrop-blur-xl sm:min-h-[210px] sm:p-5">
              <h2 className="flex min-h-8 items-center text-base font-black">Number of teams</h2>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">Choose three to five teams.</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[3, 4, 5].map((count) => (
                  <button
                    className={`rounded-xl border px-2 py-3 text-base font-black transition sm:px-3 sm:text-lg ${
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

            <section className="arcade-panel min-w-0 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 backdrop-blur-xl sm:min-h-[210px] sm:p-5">
              <div className="flex min-h-8 items-center justify-between gap-4">
                <h2 className="text-base font-black">Questions in the game</h2>
                <span className="rounded-full bg-amber-400 px-3 py-1 text-lg font-black text-slate-950">
                  {questionCount}
                </span>
              </div>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">
                Choose how many questions your group will play.
              </p>
              <label className="mt-4 block">
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
                <span className="mt-1 flex justify-between text-[10px] font-bold text-slate-500">
                  <span>10 questions</span>
                  <span>100 questions</span>
                </span>
              </label>
            </section>

            <section className="arcade-panel min-w-0 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 backdrop-blur-xl sm:min-h-[210px] sm:p-5">
              <h2 className="flex min-h-8 items-center text-base font-black">Time limit</h2>
              <p className="mt-2 min-h-10 text-xs leading-5 text-slate-400">
                Set the time each team gets to answer.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[{ label: "60 seconds", value: 60 }, { label: "No limit", value: null }].map((option) => (
                  <button
                    className={`rounded-xl border px-2 py-3 text-[10px] font-bold transition sm:px-3 sm:text-xs ${
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
          </div>

          <button
            className="arcade-launch-button rounded-xl px-5 py-3.5 font-extrabold sm:col-span-3 sm:mx-auto sm:w-80"
            onClick={() => setSetupStep("teams")}
            type="button"
          >
            Arrange teams →
          </button>
        </div>
        ) : (
          <div className="mt-5 flex min-h-0 flex-1 flex-col pb-20 lg:pb-[110px]">
            <div className="flex min-h-0 flex-1 items-center justify-around gap-3 overflow-x-auto px-2 py-4 lg:px-8">
              {Array.from({ length: teamCount }, (_, teamIndex) => {
                const selectedColor = teamColors[teamIndex];
                const selectedTeamColor = TEAM_COLOR_CONFIG[selectedColor];
                return (
                  <div
                    className="team-playing-card w-[150px] shrink-0 rounded-2xl border border-slate-700/60 p-4 shadow-lg shadow-black/20 sm:w-[170px]"
                    key={teamIndex}
                    style={{
                      backgroundImage: `linear-gradient(160deg, ${selectedTeamColor.panel} 0%, ${selectedTeamColor.value}bb 100%)`,
                    }}
                  >
                    <div className="flex min-h-[190px] flex-col justify-between gap-6">
                      <div className="flex items-start justify-between gap-2">
                        <span
                          aria-hidden="true"
                          className="text-4xl font-black leading-none"
                          style={{ color: selectedTeamColor.value }}
                        >
                          {selectedTeamColor.symbol}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                          Team {teamIndex + 1}
                        </span>
                      </div>
                      <label className="block">
                        <span className="sr-only">Team name</span>
                        <input
                          className={`w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white outline-none transition placeholder:text-slate-500 focus:ring-2 ${selectedTeamColor.border} focus:ring-cyan-400/20`}
                          maxLength={10}
                          onChange={(event) => updateTeamName(teamIndex, event.target.value)}
                          placeholder={`Enter Team ${teamIndex + 1} name`}
                          type="text"
                          value={teamNames[teamIndex]}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
            <footer className="mt-5 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                className="text-sm font-bold text-slate-400 transition-colors hover:text-white"
                onClick={() => setSetupStep("settings")}
                type="button"
              >
                ← Back to settings
              </button>
              <button
                className="arcade-launch-button rounded-xl px-8 py-3.5 font-extrabold disabled:cursor-wait disabled:opacity-60"
                disabled={isCreatingBattle}
                onClick={createBattle}
                type="button"
              >
                {isCreatingBattle ? "Loading questions..." : "Start the game"}
              </button>
            </footer>
          </div>
        )}
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

function TeamStrip({ teams, highlightedTeamId, questionNumber, questionCount, turnOrder, lastTransition, questionCompact = false, onMainMenu }) {
  const orderedTeams = turnOrder.length
    ? turnOrder.map((teamId) => teams.find((team) => team.id === teamId)).filter(Boolean)
    : teams;

  return (
    <div className="arcade-hud shrink-0 border-b border-white/10 bg-slate-950/80 p-3 backdrop-blur-xl">
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
        {onMainMenu && (
          <button
            className="ml-auto shrink-0 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-rose-400 hover:text-rose-300"
            onClick={onMainMenu}
            type="button"
          >
            Give up game
          </button>
        )}
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
    <main className="arcade-game relative z-[55] flex h-screen flex-col overflow-hidden bg-[#090A0F] px-6 py-6 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-amber-400">Five Hearts Quiz · Battle complete</p>
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
        <main className="arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] pb-6 text-white">
          <TeamStrip highlightedTeamId={game.startingTeamId} lastTransition={game.lastTransition} onMainMenu={onMainMenu} questionCompact questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
          <div className="mx-auto max-w-3xl px-6 py-10">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
              Question {game.questionNumber}
            </p>
            <div className="arcade-arena mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 text-center shadow-2xl backdrop-blur-xl sm:mt-6 sm:p-8">
              <p className="mb-4 inline-block rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Category</p>
              <h1 className="mt-4 flex items-center justify-center gap-3 text-4xl font-black text-amber-300">
                {activeQuestion?.category}
                <span className="rounded-full border border-sky-400/40 bg-sky-400/10 px-3 py-1 text-sm uppercase tracking-[0.15em] text-sky-300">
                  {activeQuestion?.difficultyLabel} · +{["Hard", "Difficult"].includes(activeQuestion?.difficultyLabel) ? 20 : 10} points
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
      <main className="arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] pb-6 text-white">
        <TeamStrip highlightedTeamId={game.answeringTeamId} lastTransition={game.lastTransition} onMainMenu={onMainMenu} questionCompact questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
      <div className="arcade-arena mx-auto w-full max-w-4xl rounded-2xl border border-slate-700/60 bg-slate-900/80 px-6 py-6 shadow-2xl backdrop-blur-xl sm:px-8 sm:py-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-cyan-300">
              Question {game.questionNumber} · {activeQuestion?.category}
              <span className="ml-2 rounded-full border border-sky-400/40 bg-sky-400/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-sky-300">
                {activeQuestion?.difficultyLabel} · +{["Hard", "Difficult"].includes(activeQuestion?.difficultyLabel) ? 20 : 10} points
              </span>
            </p>
            {game.timeLimit !== null && (
              <span className={`rounded-full border px-4 py-2 text-xl font-black tabular-nums ${secondsLeft <= 10 ? "border-red-400 text-red-400" : "border-amber-400 text-amber-300"}`}>
                {secondsLeft}s
              </span>
            )}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{activeQuestion?.questionText}</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {visibleAnswers.map((answer, index) => (
              <button
                className={`rounded-xl border p-4 text-left text-lg font-semibold shadow-md transition-all duration-200 active:scale-[0.99] ${
                  answerResult && index === activeQuestion.correctAnswerIndex && isCorrectAnswerRevealed
                      ? "answer-correct border-brass bg-brass/20 text-ink-blue"
                    : selectedAnswer === index && answerResult && !answerResult.isCorrect
                        ? "answer-incorrect border-terracotta bg-terracotta/20 text-ink-blue"
                      : selectedAnswer === index && answerResult?.isCorrect
                          ? "answer-correct border-brass bg-brass/20 text-ink-blue"
                        : "border-slate-700 bg-slate-800/90 text-slate-100 hover:border-cyan-400 hover:bg-slate-800 hover:shadow-cyan-500/20"
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
          <div className="fixed inset-0 z-[70] grid place-items-center bg-[#090A0F]/85 p-6 backdrop-blur-sm">
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
    <main className="arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] pb-6 text-white">
      <TeamStrip highlightedTeamId={game.startingTeamId} lastTransition={game.lastTransition} onMainMenu={onMainMenu} questionCount={game.questionCount} questionNumber={game.questionNumber} teams={game.teams} turnOrder={game.turnOrder} />
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
