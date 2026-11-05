"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import HybridScienceCard, { TEAM_COLOR_CONFIG } from "./HybridScienceCard";
import { fetchQuestionsForGame } from "../lib/questionService";

const TEAM_COLORS = ["red", "blue", "green", "yellow", "purple"];
const MIN_QUESTIONS = 30;
const MAX_QUESTIONS = 90;

const RULES = [
  ["♥", "The objective", "Protect your five hearts", "Every team starts with five hearts. The surviving team with the most points wins.", "from-rose-500 to-fuchsia-500"],
  ["⚂", "Round order", "Roll and follow", "At the start of every round, the dice set a turn order. No team can choose who answers next.", "from-cyan-400 to-blue-500"],
  ["✦", "Correct answer", "Keep the momentum", "A correct answer earns points. The next surviving team in the rolled order takes the next question.", "from-emerald-400 to-cyan-400"],
  ["×", "Wrong answer", "Protect your hearts", "An incorrect answer costs one heart. Reach zero hearts and your team is eliminated from future turns.", "from-orange-400 to-rose-500"],
  ["★", "Round summary", "Standings between rounds", "After every team has taken a turn, review the standings before rolling the next round.", "from-fuchsia-400 to-violet-500"],
];

function snapQuestionCount(value, teamCount) {
  const nearest = Math.round(Number(value) / teamCount) * teamCount;
  return Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, nearest));
}

function padQuestions(questions, count) {
  if (!questions.length) return [];
  return Array.from({ length: count }, (_, index) => questions[index % questions.length]);
}

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

  function resetBattleState() {
    setTeamCount(3);
    setQuestionCount(30);
    setTimeLimit(60);
    setTeamColors(["red", "blue", "yellow"]);
    setTeamNames(["Team 1", "Team 2", "Team 3"]);
    setGame(null);
    setIsCreatingBattle(false);
    setShowRules(true);
    setRuleIndex(0);
    setSetupStep("settings");
  }

  function exitToMainMenu() {
    resetBattleState();
    router.replace("/");
  }

  function updateTeamCount(count) {
    setTeamCount(count);
    setQuestionCount((current) => snapQuestionCount(current, count));
    setTeamColors(TEAM_COLORS.slice(0, count));
    setTeamNames((names) => Array.from({ length: count }, (_, index) => names[index] || `Team ${index + 1}`));
  }

  async function createBattle() {
    setIsCreatingBattle(true);
    const questions = padQuestions(await fetchQuestionsForGame(questionCount), questionCount);
    if (!questions.length) {
      console.error("No usable questions are available to start the battle.");
      setIsCreatingBattle(false);
      return;
    }

    setGame({
      phase: "dashboard",
      teams: teamColors.slice(0, teamCount).map((color, index) => ({
        id: `team-${index + 1}`,
        name: teamNames[index].trim() || `Team ${index + 1}`,
        color,
        hearts: 5,
        points: 0,
        questionsAsked: 0,
      })),
      questionCount,
      rounds: questionCount / teamCount,
      questions,
      timeLimit,
      roundNumber: 1,
      roundOrder: [],
      roundTurnIndex: 0,
      questionNumber: 1,
      answeringTeamId: null,
      lastTransition: "Roll the dice to set the first round order.",
    });
    setIsCreatingBattle(false);
  }

  if (game) {
    return <BattleGame game={game} onMainMenu={exitToMainMenu} onUpdate={setGame} />;
  }

  if (showRules) {
    const [icon, eyebrow, title, body, accent] = RULES[ruleIndex];
    const isLastRule = ruleIndex === RULES.length - 1;
    return (
      <main className="arcade-shell arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] px-5 py-5 text-white sm:px-8">
        <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
            <Link className="text-sm font-semibold text-slate-400 transition-colors hover:text-cyan-300" href="/game">← Back to modes</Link>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">How to play</span>
          </header>
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Five Hearts Quiz · Battle</p>
            <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-6xl">Know the play</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Five quick cards to get everyone ready before the first question.</p>
            <article className="mt-7 w-full max-w-xl rounded-2xl border border-slate-700/60 bg-slate-900/80 p-7 text-left shadow-2xl shadow-fuchsia-950/20 backdrop-blur-xl sm:p-9">
              <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${accent} text-3xl font-black text-white shadow-lg`}>{icon}</div>
              <p className="mt-7 text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">{eyebrow}</p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">{title}</h2>
              <p className="mt-4 text-base leading-7 text-slate-300">{body}</p>
            </article>
            <div className="mt-6 flex items-center gap-2" aria-label={`Rule ${ruleIndex + 1} of ${RULES.length}`}>
              {RULES.map((rule, index) => <span className={`h-2 rounded-full transition-all ${index === ruleIndex ? "w-8 bg-cyan-400" : "w-2 bg-slate-700"}`} key={rule[2]} />)}
            </div>
            <div className="mt-6 flex w-full max-w-xl items-center justify-between gap-4">
              <button className="text-sm font-bold text-slate-400 hover:text-white" onClick={() => setShowRules(false)} type="button">Skip rules</button>
              <button className="arcade-launch-button rounded-xl px-7 py-3 text-sm font-extrabold" onClick={() => isLastRule ? setShowRules(false) : setRuleIndex((index) => index + 1)} type="button">
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
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" /><div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" /><div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <Link className="shrink-0 text-sm font-semibold text-slate-400 hover:text-cyan-300" href="/game">← Back to modes</Link>
        <header className="mt-3 shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Five Hearts Quiz · Battle</p>
          <h1 className="mt-1 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">{setupStep === "settings" ? "Set the table" : "Name your teams"}</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">{setupStep === "settings" ? "Choose a clean round structure before inviting teams to the table." : "Give each team a name, then start the game when everyone is ready."}</p>
        </header>
        {setupStep === "settings" ? (
          <div className="mt-6 grid min-h-0 flex-1 content-center gap-4 pb-20 sm:grid-cols-3 lg:pb-[110px]">
            <section className="arcade-panel rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 sm:p-5"><h2 className="text-base font-black">Number of teams</h2><p className="mt-2 text-xs leading-5 text-slate-400">Choose three to five teams.</p><div className="mt-4 grid grid-cols-3 gap-2">{[3, 4, 5].map((count) => <button className={`rounded-xl border px-2 py-3 text-base font-black sm:px-3 sm:text-lg ${teamCount === count ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400"}`} key={count} onClick={() => updateTeamCount(count)} type="button">{count}</button>)}</div></section>
            <section className="arcade-panel rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 sm:p-5"><div className="flex items-center justify-between gap-4"><h2 className="text-base font-black">Questions in the game</h2><span className="rounded-full bg-amber-400 px-3 py-1 text-lg font-black text-slate-950">{questionCount}</span></div><p className="mt-2 text-xs leading-5 text-slate-400">The slider always snaps to a value divisible by {teamCount}.</p><label className="mt-4 block"><span className="sr-only">Number of questions</span><input aria-label="Number of questions" className="w-full accent-amber-400" max={MAX_QUESTIONS} min={MIN_QUESTIONS} onChange={(event) => setQuestionCount(snapQuestionCount(event.target.value, teamCount))} step="1" type="range" value={questionCount} /><span className="mt-1 flex justify-between text-[10px] font-bold text-slate-500"><span>{MIN_QUESTIONS}</span><span>{MAX_QUESTIONS}</span></span></label><p className="mt-4 text-sm font-black text-cyan-300">{questionCount} total questions = {questionCount / teamCount} rounds per team</p></section>
            <section className="arcade-panel rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 sm:p-5"><h2 className="text-base font-black">Time limit</h2><p className="mt-2 text-xs leading-5 text-slate-400">Set the time each team gets to answer.</p><div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{[{ label: "60 seconds", value: 60 }, { label: "No limit", value: null }].map((option) => <button className={`rounded-xl border px-2 py-3 text-xs font-bold ${timeLimit === option.value ? "border-amber-400 bg-amber-400 text-slate-950" : "border-slate-700 bg-slate-800 text-slate-200 hover:border-amber-400"}`} key={option.label} onClick={() => setTimeLimit(option.value)} type="button">{option.label}</button>)}</div></section>
            <button className="arcade-launch-button rounded-xl px-5 py-3.5 font-extrabold sm:col-span-3 sm:mx-auto sm:w-80" onClick={() => setSetupStep("teams")} type="button">Arrange teams →</button>
          </div>
        ) : (
          <div className="mt-5 flex min-h-0 flex-1 flex-col pb-20 lg:pb-[110px]"><div className="flex min-h-0 flex-1 items-center justify-around gap-3 overflow-x-auto px-2 py-4 lg:px-8">{Array.from({ length: teamCount }, (_, index) => { const color = teamColors[index]; const config = TEAM_COLOR_CONFIG[color]; return <div className="team-playing-card w-[150px] shrink-0 rounded-2xl border border-slate-700/60 p-4 sm:w-[170px]" key={index} style={{ backgroundImage: `linear-gradient(160deg, ${config.panel} 0%, ${config.value}bb 100%)` }}><div className="flex min-h-[190px] flex-col justify-between gap-6"><div className="flex items-start justify-between gap-2"><span aria-hidden="true" className="text-4xl font-black leading-none" style={{ color: config.value }}>{config.symbol}</span><span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Team {index + 1}</span></div><input aria-label={`Team ${index + 1} name`} className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white outline-none" maxLength={10} onChange={(event) => setTeamNames((names) => names.map((name, nameIndex) => nameIndex === index ? event.target.value : name))} placeholder={`Enter Team ${index + 1} name`} type="text" value={teamNames[index]} /></div></div>; })}</div><footer className="mt-5 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button className="text-sm font-bold text-slate-400 hover:text-white" onClick={() => setSetupStep("settings")} type="button">← Back to settings</button><button className="arcade-launch-button rounded-xl px-8 py-3.5 font-extrabold disabled:opacity-60" disabled={isCreatingBattle} onClick={createBattle} type="button">{isCreatingBattle ? "Loading questions..." : "Start the game"}</button></footer></div>
        )}
      </div>
    </main>
  );
}

function Hearts({ count }) {
  return <div className="flex gap-0.5" aria-label={`${count} of 5 hearts`}><span className="text-lg text-rose-400">{"♥".repeat(count)}</span><span className="text-lg text-slate-700">{"♥".repeat(5 - count)}</span></div>;
}

function ExitGameButton({ onConfirm, className = "", label = "← Exit" }) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <>
      <button className={`${className || "text-sm font-bold text-slate-400 hover:text-white"}`} onClick={() => setIsConfirming(true)} type="button">{label}</button>
      {isConfirming && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#090A0F]/85 p-5 backdrop-blur-md">
          <section aria-labelledby="exit-game-title" aria-modal="true" className="w-full max-w-md rounded-3xl border-2 border-rose-400/70 bg-slate-950 p-7 text-center shadow-2xl shadow-rose-950/40" role="dialog">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-rose-300">Exit game</p>
            <h2 className="mt-3 text-3xl font-black text-white" id="exit-game-title">Are you sure?</h2>
            <p className="mt-4 leading-6 text-slate-300">All progress and saves from this game may be lost.</p>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button className="w-full rounded-xl border border-slate-700 px-5 py-3 font-black text-slate-300 hover:border-cyan-300 hover:text-white" onClick={() => setIsConfirming(false)} type="button">Cancel</button>
              <button className="w-full rounded-xl border border-rose-400 bg-rose-500/20 px-5 py-3 font-black text-rose-200 hover:bg-rose-500/40" onClick={onConfirm} type="button">Yes, exit to main menu</button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function TeamStrip({ teams, highlightedTeamId, roundNumber, rounds, roundOrder, lastTransition, onMainMenu }) {
  const orderedTeams = roundOrder.length ? roundOrder.map((id) => teams.find((team) => team.id === id)).filter(Boolean) : teams;
  return <header className="arcade-hud border-b border-white/10 px-6 py-4"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><ExitGameButton onConfirm={onMainMenu} /><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Round {roundNumber} of {rounds}</p><p className="mt-1 text-xs text-slate-400">{lastTransition}</p></div><div className="flex flex-wrap justify-end gap-3">{orderedTeams.map((team) => { const config = TEAM_COLOR_CONFIG[team.color] || TEAM_COLOR_CONFIG.red; return <div aria-label={`${team.name}, ${team.points} points, ${team.hearts} of 5 hearts`} className={`min-w-32 rounded-xl border px-4 py-3 text-center shadow-lg ${team.id === highlightedTeamId ? "ring-2 ring-cyan-300 ring-offset-2 ring-offset-[#090A0F]" : ""} ${team.hearts === 0 ? "opacity-40 grayscale" : ""}`} key={team.id} style={{ background: `linear-gradient(145deg, ${config.panel}, ${config.value}cc)`, borderColor: team.id === highlightedTeamId ? "#67e8f9" : config.value }}><div className="flex items-center justify-center gap-2"><span aria-hidden="true" className="text-lg font-black leading-none">{config.symbol}</span><p className="max-w-28 truncate text-sm font-black text-white">{team.name}</p></div><div className="mt-2 flex items-center justify-center gap-3"><Hearts count={team.hearts} /><span className="text-sm font-black text-white">{team.points} pts</span></div></div>; })}</div></div></header>;
}

function StandingsModal({ game, onNextRound }) {
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-[#090A0F]/85 p-5 backdrop-blur-md"><section aria-labelledby="round-summary-title" aria-modal="true" className="w-full max-w-3xl rounded-3xl border-2 border-fuchsia-400/70 bg-slate-950 p-6 shadow-2xl shadow-fuchsia-950/50 sm:p-8" role="dialog"><p className="text-center text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Round {game.roundNumber} complete</p><h2 className="mt-3 text-center text-4xl font-black text-white" id="round-summary-title">Standings update</h2><div className="mt-7 grid gap-3">{[...game.teams].sort((a, b) => b.points - a.points).map((team, index) => <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-3" key={team.id}><span className="w-7 text-center text-lg font-black text-fuchsia-300">#{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-black text-white">{team.name}</p><p className="text-xs text-slate-400">{team.hearts === 0 ? "ELIMINATED" : `${team.hearts} hearts remaining`}</p></div><p className="text-2xl font-black text-cyan-300">{team.points}</p></div>)}</div><button className="arcade-launch-button mt-7 w-full rounded-xl px-5 py-4 font-black" onClick={onNextRound} type="button">{game.roundNumber >= game.rounds ? "See final results" : "Start Next Round · Roll Dice"}</button></section></div>;
}

function VictoryScreen({ teams, onMainMenu }) {
  const survivors = teams.filter((team) => team.hearts > 0);
  const winner = [...(survivors.length ? survivors : teams)].sort((a, b) => b.points - a.points)[0];
  return <main className="arcade-game relative flex min-h-screen flex-col items-center bg-[#090A0F] px-6 py-12 text-white"><ExitGameButton className="absolute left-6 top-6 text-sm font-bold text-slate-400 hover:text-white" onConfirm={onMainMenu} /><p className="text-sm font-bold uppercase tracking-[0.35em] text-cyan-300">Battle complete</p><h1 className="mt-4 text-6xl font-black text-fuchsia-300">Victory!</h1><p className="mt-4 text-center text-slate-300">{survivors.length === 1 ? `${winner.name} is the last team standing.` : "All scheduled rounds are complete."}</p><div className="mt-8 w-full max-w-sm"><HybridScienceCard color={winner.color} hearts={winner.hearts} isActiveTurn isEliminated={winner.hearts === 0} points={winner.points} teamName={winner.name} /></div><ExitGameButton className="arcade-launch-button mt-10 rounded-xl px-8 py-4 font-black" label="Go to main menu" onConfirm={onMainMenu} /></main>;
}

function BattleGame({ game, onMainMenu, onUpdate }) {
  const [isRolling, setIsRolling] = useState(false);
  const [diceFace, setDiceFace] = useState("?");
  const [rollingTeamId, setRollingTeamId] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(game.timeLimit ?? 60);
  const resolveAnswerRef = useRef(null);
  const diceIntervalRef = useRef(null);
  const activeQuestion = game.questions[game.questionNumber - 1];
  const activeTeam = game.teams.find((team) => team.id === game.answeringTeamId);

  useEffect(() => {
    if (game.phase !== "question" || answerResult || game.timeLimit === null) return undefined;
    const timer = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [answerResult, game.phase, game.timeLimit]);

  useEffect(() => {
    if (game.phase === "question" && game.timeLimit !== null && secondsLeft === 0 && !answerResult) resolveAnswerRef.current?.(false, true);
  }, [answerResult, game.phase, game.timeLimit, secondsLeft]);

  function rollDice(gameToRoll = game) {
    if (isRolling) return;
    if (!gameToRoll?.teams?.length) return;
    setIsRolling(true);
    let rolls = 0;
    diceIntervalRef.current = window.setInterval(() => {
      const alive = gameToRoll.teams.filter((team) => team.hearts > 0);
      if (!alive.length) {
        window.clearInterval(diceIntervalRef.current);
        diceIntervalRef.current = null;
        setIsRolling(false);
        onUpdate({ ...gameToRoll, phase: "victory" });
        return;
      }
      const team = alive[Math.floor(Math.random() * alive.length)];
      setRollingTeamId(team.id);
      setDiceFace(team.name);
      rolls += 1;
      if (rolls >= 12) {
        window.clearInterval(diceIntervalRef.current);
        diceIntervalRef.current = null;
        const order = [...alive].sort(() => Math.random() - 0.5);
        const first = order[0];
        setRollingTeamId(first.id);
        setDiceFace(first.name);
        setIsRolling(false);
        onUpdate({ ...gameToRoll, phase: "orderReady", roundOrder: order.map((team) => team.id), roundTurnIndex: 0, answeringTeamId: first.id, lastTransition: `Order locked: ${order.map((team) => team.name).join(" → ")}`, });
        setSecondsLeft(gameToRoll.timeLimit ?? 60);
      }
    }, 180);
  }

  function resolveAnswer(isCorrect, timedOut = false) {
    if (answerResult || !activeTeam) return;
    const updatedTeams = game.teams.map((team) => {
      if (team.id !== activeTeam.id) return team;
      const points = isCorrect ? team.points + (["Hard", "Difficult"].includes(activeQuestion.difficultyLabel) ? 20 : 10) : team.points;
      return { ...team, points, questionsAsked: team.questionsAsked + 1, hearts: isCorrect ? team.hearts : Math.max(0, team.hearts - 1) };
    });
    setAnswerResult({
      isCorrect,
      timedOut,
      explanation: activeQuestion.explanation || "No explanation was provided for this question.",
    });
    onUpdate({ ...game, teams: updatedTeams });
  }

  useEffect(() => {
    resolveAnswerRef.current = resolveAnswer;
  });

  useEffect(() => () => {
    if (diceIntervalRef.current) window.clearInterval(diceIntervalRef.current);
  }, []);

  function nextQuestion() {
    const updatedTeams = game.teams;
    const survivingTeams = updatedTeams.filter((team) => team.hearts > 0);
    if (survivingTeams.length <= 1 || game.questionNumber >= game.questionCount) {
      onUpdate({ ...game, phase: "victory", teams: updatedTeams });
      return;
    }
    let nextIndex = game.roundTurnIndex + 1;
    while (nextIndex < game.roundOrder.length && !updatedTeams.find((team) => team.id === game.roundOrder[nextIndex] && team.hearts > 0)) nextIndex += 1;
    setSelectedAnswer(null);
    setAnswerResult(null);
    setSecondsLeft(game.timeLimit ?? 60);
    if (nextIndex >= game.roundOrder.length) {
      onUpdate({ ...game, phase: "summary", teams: updatedTeams, answeringTeamId: null, lastTransition: `Round ${game.roundNumber} complete. Review the standings.` });
      return;
    }
    const nextTeam = updatedTeams.find((team) => team.id === game.roundOrder[nextIndex]);
    onUpdate({ ...game, teams: updatedTeams, questionNumber: game.questionNumber + 1, roundTurnIndex: nextIndex, answeringTeamId: nextTeam.id, lastTransition: `${nextTeam.name} is next in the locked order.` });
  }

  if (game.phase === "victory") return <VictoryScreen onMainMenu={onMainMenu} teams={game.teams} />;
  if (game.phase === "summary") return <><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><StandingsModal game={game} onNextRound={() => {
    if (game.roundNumber >= game.rounds) {
      onUpdate({ ...game, phase: "victory" });
      return;
    }
    const nextGame = { ...game, phase: "rolling", roundNumber: game.roundNumber + 1, roundOrder: [], roundTurnIndex: 0, questionNumber: game.questionNumber + 1 };
    onUpdate(nextGame);
    rollDice(nextGame);
  }} /></>;

  if (game.phase === "dashboard") return <main className="arcade-game flex min-h-screen flex-col bg-[#090A0F] text-white"><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Battle dashboard</p><h1 className="mt-4 text-5xl font-black text-white">Ready to play?</h1><div className={`mt-8 grid h-36 w-36 place-items-center rounded-3xl border-4 border-fuchsia-400 bg-slate-900 text-center shadow-[0_0_45px_rgba(217,70,239,0.35)] ${isRolling ? "dice-rolling" : ""}`}><span className="max-w-28 truncate px-2 text-2xl font-black text-cyan-300">{isRolling ? diceFace : "?"}</span></div><p className="mt-6 text-slate-400">{game.questionCount} questions · {game.rounds} rounds per team</p><button className="arcade-launch-button mt-8 rounded-xl px-8 py-4 font-black" disabled={isRolling} onClick={() => rollDice(game)} type="button">{isRolling ? "Rolling..." : "Roll Dice to Set Order"}</button></section></main>;
  const rollingTeam = game.teams.find((team) => team.id === rollingTeamId);
  const rollingTeamConfig = TEAM_COLOR_CONFIG[rollingTeam?.color] || TEAM_COLOR_CONFIG.red;
  const diceStyle = {
    background: `linear-gradient(145deg, ${rollingTeamConfig.panel}, ${rollingTeamConfig.value}dd)`,
    borderColor: rollingTeamConfig.value,
    boxShadow: `0 0 45px ${rollingTeamConfig.value}80`,
  };

  if (game.phase === "dashboard") return <main className="arcade-game flex min-h-screen flex-col bg-[#090A0F] text-white"><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Battle dashboard</p><h1 className="mt-4 text-5xl font-black text-white">Ready to play?</h1><div className={`mt-8 grid h-36 w-36 place-items-center rounded-3xl border-4 text-center ${isRolling ? "dice-rolling" : ""}`} style={diceStyle}><span className="max-w-28 truncate px-2 text-2xl font-black text-white">{isRolling ? diceFace : "?"}</span></div><p className="mt-6 text-slate-400">{game.questionCount} questions · {game.rounds} rounds per team</p><button className="arcade-launch-button mt-8 rounded-xl px-8 py-4 font-black" disabled={isRolling} onClick={() => rollDice(game)} type="button">{isRolling ? "Rolling..." : "Roll Dice to Set Order"}</button></section></main>;

  if (game.phase === "rolling") return <main className="arcade-game flex min-h-screen flex-col bg-[#090A0F] text-white"><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Round {game.roundNumber} · rolling</p><h1 className="mt-4 text-5xl font-black text-white">Who goes first?</h1><div className={`mt-8 grid h-36 w-36 place-items-center rounded-3xl border-4 text-center ${isRolling ? "dice-rolling" : ""}`} style={diceStyle}><span className="max-w-28 truncate px-2 text-2xl font-black text-white">{diceFace}</span></div><p className="mt-6 text-slate-400">The dice are locking the order for this round.</p></section></main>;
  if (game.phase === "orderReady") return <main className="arcade-game flex min-h-screen flex-col bg-[#090A0F] text-white"><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Round {game.roundNumber} · order locked</p><h1 className="mt-4 text-5xl font-black text-white">You&apos;re up!</h1><p className="mt-4 text-slate-400">The dice have set the sequence. Make sure every team is ready.</p><div className="mt-8 w-full rounded-2xl border border-fuchsia-400/60 bg-slate-900/90 p-5 text-left shadow-2xl shadow-fuchsia-950/30"><p className="text-center text-xs font-black uppercase tracking-[0.25em] text-fuchsia-300">Answering order</p><ol className="mt-4 space-y-2">{game.roundOrder.map((teamId, index) => { const team = game.teams.find((item) => item.id === teamId); return <li className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${teamId === game.answeringTeamId ? "border-cyan-300 bg-cyan-400/10" : "border-slate-700 bg-slate-950/70"}`} key={teamId}><span className="w-6 text-center font-black text-fuchsia-300">{index + 1}</span><span className="font-black text-white">{team?.name}</span>{index === 0 && <span className="ml-auto text-xs font-bold uppercase tracking-wider text-cyan-300">First up</span>}</li>; })}</ol></div><button className="arcade-launch-button mt-8 rounded-xl px-10 py-4 font-black" onClick={() => onUpdate({ ...game, phase: "question" })} type="button">Ready to play →</button></section></main>;

  return <main className="arcade-game min-h-screen bg-[#090A0F] pb-10 text-white"><TeamStrip {...game} highlightedTeamId={game.answeringTeamId} onMainMenu={onMainMenu} /><section className="arcade-arena mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-slate-700/60 bg-slate-900/80 px-6 py-6 shadow-2xl sm:px-8 sm:py-8"><div className="flex items-center justify-between gap-4"><p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Question {game.questionNumber} · {activeQuestion.category}</p>{game.timeLimit !== null && <span className="rounded-full border border-amber-400 px-4 py-2 text-xl font-black">{secondsLeft}s</span>}</div><p className="mt-2 text-sm font-bold text-fuchsia-300">{activeTeam?.name}&apos;s turn</p><h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{activeQuestion.questionText}</h1><div className="mt-6 grid gap-3 sm:grid-cols-2">{activeQuestion.options.map((answer, index) => <button className={`rounded-xl border p-4 text-left text-lg font-semibold ${answerResult && index === activeQuestion.correctAnswerIndex ? "answer-correct" : selectedAnswer === index && answerResult ? "answer-incorrect" : "border-slate-700 bg-slate-800/90 text-slate-100 hover:border-cyan-400"}`} disabled={Boolean(answerResult)} key={answer} onClick={() => { setSelectedAnswer(index); resolveAnswer(index === activeQuestion.correctAnswerIndex); }} type="button"><span className="mr-3 text-cyan-300">{String.fromCharCode(65 + index)}.</span>{answer}</button>)}</div></section>{answerResult && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#090A0F]/85 p-6 backdrop-blur-sm"><section aria-modal="true" className="w-full max-w-xl rounded-3xl border-2 border-fuchsia-400 bg-slate-950 p-8 text-center" role="dialog"><p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">{answerResult.isCorrect ? "Correct" : "Wrong answer"}</p><h2 className="mt-4 text-3xl font-black text-white">{answerResult.isCorrect ? `${activeTeam.name} earns points!` : `${activeTeam.name} loses 1 heart.`}</h2><p className="mt-5 text-lg text-emerald-300">Correct answer: {activeQuestion.options[activeQuestion.correctAnswerIndex]}</p><div className="mt-5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-left"><p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">Explanation</p><p className="mt-2 leading-6 text-slate-200">{answerResult.explanation || "No explanation was provided for this question."}</p></div><button className="arcade-launch-button mt-8 w-full rounded-xl px-5 py-4 font-black" onClick={nextQuestion} type="button">Continue</button></section></div>}</main>;
}
