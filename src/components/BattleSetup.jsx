"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
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
  const minimum = Math.ceil(MIN_QUESTIONS / teamCount) * teamCount;
  const maximum = Math.floor(MAX_QUESTIONS / teamCount) * teamCount;
  const nearest = Math.round(Number(value) / teamCount) * teamCount;
  return Math.min(maximum, Math.max(minimum, nearest));
}

function padQuestions(questions, count) {
  if (!questions.length) return [];
  return Array.from({ length: count }, (_, index) => questions[index % questions.length]);
}

function DuelSetup({ questionCount, setQuestionCount, timeLimit, setTimeLimit, teamNames, setTeamNames, isCreating, onCreate }) {
  return (
    <main className="arcade-shell arcade-game relative flex min-h-screen flex-col overflow-x-hidden bg-[#090A0F] px-5 pb-24 pt-5 text-white sm:px-8 sm:pt-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <Link className="inline-flex rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg transition-all hover:border-cyan-400/80 hover:text-white" href="/game">← Back to modes</Link>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Duel setup</span>
        </header>

        <section className="flex flex-1 flex-col justify-center py-5 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Five Hearts Quiz · Duel</p>
          <h1 className="mt-3 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black text-transparent sm:text-5xl">Red vs Blue</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Set your teams and match length. Dice decide who answers first each round.</p>

          <div className="mx-auto mt-5 grid w-full max-w-5xl items-center gap-4 lg:grid-cols-[minmax(150px,0.7fr)_minmax(220px,1fr)_minmax(150px,0.7fr)] xl:grid-cols-[240px_minmax(320px,1fr)_240px]">
            {["red", "blue"].map((color, index) => {
              const config = TEAM_COLOR_CONFIG[color];
              return (
                <Fragment key={color}>
                  <article className={`team-textured-card flex min-h-[170px] w-full flex-col justify-between rounded-2xl border p-4 text-left shadow-2xl lg:row-start-1 ${index === 0 ? "lg:col-start-1" : "lg:col-start-3"}`} style={{ background: `linear-gradient(145deg, ${config.panel}, ${config.value}cc)`, borderColor: config.value }}>
                    <div className="flex items-start justify-between gap-3">
                      <span aria-hidden="true" className="text-4xl font-black leading-none">{config.symbol}</span>
                      <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-black uppercase tracking-[0.16em]">{config.name} team</span>
                    </div>
                    <label className="mt-5 block text-xs font-bold uppercase tracking-[0.16em] text-white/75">
                      Team name
                      <input className="mt-2 w-full rounded-xl border border-white/25 bg-black/25 px-4 py-3 text-base font-bold normal-case tracking-normal text-white outline-none placeholder:text-white/55 focus:border-white/70" maxLength={16} onChange={(event) => setTeamNames((names) => names.map((name, nameIndex) => nameIndex === index ? event.target.value : name))} placeholder={`${config.name} Team`} type="text" value={teamNames[index]} />
                    </label>
                  </article>

                  {index === 0 && (
                    <section className="arcade-panel flex w-full flex-col justify-center rounded-2xl border border-slate-700/60 bg-slate-900/90 p-4 text-left shadow-2xl sm:p-5 lg:col-start-2 lg:row-start-1">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-base font-black text-white">Questions</h2>
                        <span className="rounded-full bg-cyan-400 px-3 py-1 text-lg font-black text-slate-950">{questionCount}</span>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-slate-400">Even numbers give each team the same turns.</p>
                      <label className="mt-3 block">
                        <span className="sr-only">Number of questions</span>
                        <input aria-label="Number of questions" className="w-full accent-cyan-400" max={MAX_QUESTIONS} min={MIN_QUESTIONS} onChange={(event) => setQuestionCount(snapQuestionCount(event.target.value, 2))} step="2" type="range" value={questionCount} />
                        <span className="mt-1 flex justify-between text-[10px] font-bold text-slate-500"><span>{MIN_QUESTIONS}</span><span>{MAX_QUESTIONS}</span></span>
                      </label>
                      <p className="mt-2 text-center text-sm font-bold text-slate-300">{questionCount / 2} rounds per team</p>

                      <fieldset className="mt-4 border-t border-white/10 pt-3">
                        <legend className="text-sm font-black text-white">Time limit</legend>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {[{ label: "60 seconds", value: 60 }, { label: "No limit", value: null }].map((option) => <button aria-pressed={timeLimit === option.value} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-all ${timeLimit === option.value ? "is-selected border-cyan-300 bg-cyan-400/20 text-cyan-100" : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-cyan-400/80"}`} key={option.label} onClick={() => setTimeLimit(option.value)} type="button">{option.label}</button>)}
                        </div>
                      </fieldset>
                    </section>
                  )}
                  {index === 0 && <button className="arcade-launch-button duel-start-button w-full rounded-xl px-5 py-3.5 font-black disabled:cursor-wait disabled:opacity-60 lg:col-start-2 lg:row-start-2" disabled={isCreating} onClick={onCreate} type="button">{isCreating ? "Loading questions..." : "Start Duel · Roll Dice"}</button>}
                </Fragment>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function BattleSetup({ mode = "battle" }) {
  const router = useRouter();
  const isDuel = mode === "duel";
  const [teamCount, setTeamCount] = useState(isDuel ? 2 : 3);
  const [questionCount, setQuestionCount] = useState(30);
  const [timeLimit, setTimeLimit] = useState(60);
  const [teamColors, setTeamColors] = useState(isDuel ? ["red", "blue"] : ["red", "blue", "yellow"]);
  const [teamNames, setTeamNames] = useState(isDuel ? ["Red Team", "Blue Team"] : ["Team 1", "Team 2", "Team 3"]);
  const [game, setGame] = useState(null);
  const [isCreatingBattle, setIsCreatingBattle] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [ruleIndex, setRuleIndex] = useState(0);
  const [setupStep, setSetupStep] = useState("settings");

  function resetBattleState() {
    setTeamCount(isDuel ? 2 : 3);
    setQuestionCount(30);
    setTimeLimit(60);
    setTeamColors(isDuel ? ["red", "blue"] : ["red", "blue", "yellow"]);
    setTeamNames(isDuel ? ["Red Team", "Blue Team"] : ["Team 1", "Team 2", "Team 3"]);
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
      mode,
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
      <main className={`arcade-shell arcade-game relative flex flex-col bg-[#090A0F] px-5 pb-24 text-white sm:px-8 ${isDuel ? "min-h-screen overflow-y-auto pt-3" : "h-screen overflow-hidden pt-5"}`}>
        <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
        <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
          <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
            <Link className="inline-flex rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg transition-all hover:border-cyan-400/80 hover:text-white" href="/game">← Back to modes</Link>
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">How to play</span>
          </header>
          <section className={`flex min-h-0 flex-1 flex-col items-center justify-center text-center ${isDuel ? "py-4" : "py-8 lg:py-4"}`}>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Five Hearts Quiz · {isDuel ? "Duel" : "Battle"}</p>
            <h1 className={`${isDuel ? "mt-2 text-3xl sm:text-5xl" : "mt-3 text-4xl sm:text-6xl"} bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text font-black tracking-tight text-transparent`}>Know the play</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">Five quick cards to get everyone ready before the first question.</p>
            <article className={`${isDuel ? "mt-4 p-5 sm:p-6" : "mt-7 p-7 sm:p-9 lg:mt-5 lg:p-6"} w-full max-w-xl rounded-2xl border border-slate-700/60 bg-slate-900/80 text-left shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/80`}>
              <div className={`grid ${isDuel ? "h-12 w-12 text-2xl" : "h-14 w-14 text-3xl"} place-items-center rounded-2xl bg-gradient-to-br ${accent} font-black text-white shadow-lg`}>{icon}</div>
              <p className={`${isDuel ? "mt-4" : "mt-7"} text-xs font-bold uppercase tracking-[0.28em] text-cyan-300`}>{eyebrow}</p>
              <h2 className={`${isDuel ? "mt-2 text-2xl sm:text-3xl" : "mt-3 text-3xl sm:text-4xl"} font-black text-white`}>{title}</h2>
              <p className={`${isDuel ? "mt-3 text-sm leading-6" : "mt-4 text-base leading-7"} text-slate-300`}>{body}</p>
            </article>
            <div className={`${isDuel ? "mt-4" : "mt-6 lg:mt-4"} flex items-center gap-2`} aria-label={`Rule ${ruleIndex + 1} of ${RULES.length}`}>
              {RULES.map((rule, index) => <span className={`h-2 rounded-full transition-all ${index === ruleIndex ? "w-8 bg-cyan-400" : "w-2 bg-slate-700"}`} key={rule[2]} />)}
            </div>
            <div className={`${isDuel ? "mt-4" : "mt-6 lg:mt-4"} flex w-full max-w-xl items-center justify-between gap-4`}>
              <button className="text-sm font-bold text-slate-400 hover:text-white" onClick={() => setShowRules(false)} type="button">Skip rules</button>
              <button className={`arcade-launch-button rounded-xl text-sm font-extrabold ${isDuel ? "px-5 py-2.5" : "px-7 py-3"}`} onClick={() => isLastRule ? setShowRules(false) : setRuleIndex((index) => index + 1)} type="button">
                {isLastRule ? `Set up ${isDuel ? "duel" : "battle"} →` : "Next rule →"}
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (isDuel) {
    return <DuelSetup isCreating={isCreatingBattle} onCreate={createBattle} questionCount={questionCount} setQuestionCount={setQuestionCount} setTeamNames={setTeamNames} setTimeLimit={setTimeLimit} teamNames={teamNames} timeLimit={timeLimit} />;
  }

  return (
    <main className="arcade-shell arcade-game relative flex h-screen flex-col overflow-hidden bg-[#090A0F] px-5 pb-24 pt-4 text-white sm:px-8">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" /><div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" /><div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col">
        <Link className="inline-flex shrink-0 self-start rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg transition-all hover:border-cyan-400/80 hover:text-white" href="/game">← Back to modes</Link>
        <header className="mt-3 shrink-0">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">Five Hearts Quiz · Battle</p>
          <h1 className="mt-1 bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent sm:text-3xl">{setupStep === "settings" ? "Set the table" : setupStep === "teams" ? "Name your teams" : "Review your game"}</h1>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-400 sm:text-sm">{setupStep === "settings" ? "Choose a clean round structure before inviting teams to the table." : setupStep === "teams" ? "Give each team a name, then review the game before you start." : "Check the details with everyone, then roll the dice to begin."}</p>
        </header>
        {setupStep === "settings" ? (
          <div className="mt-6 grid min-h-0 flex-1 content-center gap-4 pb-20 sm:grid-cols-3 lg:pb-[110px]">
            <section className="arcade-panel rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 shadow-2xl transition-all duration-300 hover:border-cyan-400/80 sm:p-5"><h2 className="text-base font-black">Number of teams</h2><p className="mt-2 text-xs leading-5 text-slate-400">Choose three to five teams.</p><div className="mt-4 grid grid-cols-3 gap-2">{[3, 4, 5].map((count) => <button aria-pressed={teamCount === count} className={`rounded-xl border bg-slate-900/80 px-2 py-3 text-base font-black transition-all duration-300 sm:px-3 sm:text-lg ${teamCount === count ? "is-selected border-cyan-300 bg-cyan-400/20 text-cyan-100" : "border-slate-700 text-slate-200 hover:border-cyan-400/80"}`} key={count} onClick={() => updateTeamCount(count)} type="button">{count}{teamCount === count && <span aria-hidden="true" className="ml-1 text-cyan-300">✓</span>}</button>)}</div></section>
            <section className="arcade-panel rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 shadow-2xl transition-all duration-300 hover:border-cyan-400/80 sm:p-5"><div className="flex items-center justify-between gap-4"><h2 className="text-base font-black">Questions in the game</h2><span className="rounded-full bg-cyan-400 px-3 py-1 text-lg font-black text-slate-950">{questionCount}</span></div><p className="mt-2 text-xs leading-5 text-slate-400">The slider always snaps to a value divisible by {teamCount}.</p><label className="mt-4 block"><span className="sr-only">Number of questions</span><input aria-label="Number of questions" className="w-full accent-cyan-400" max={MAX_QUESTIONS} min={MIN_QUESTIONS} onChange={(event) => setQuestionCount(snapQuestionCount(event.target.value, teamCount))} step="1" type="range" value={questionCount} /><span className="mt-1 flex justify-between text-[10px] font-bold text-slate-500"><span>{MIN_QUESTIONS}</span><span>{MAX_QUESTIONS}</span></span></label><p className="mt-4 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-center text-sm font-black text-cyan-200">{questionCount} questions <span className="mx-1 text-cyan-400">·</span> {questionCount / teamCount} rounds per team</p></section>
            <section className="arcade-panel rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 shadow-2xl transition-all duration-300 hover:border-cyan-400/80 sm:p-5"><h2 className="text-base font-black">Time limit</h2><p className="mt-2 text-xs leading-5 text-slate-400">Set the time each team gets to answer.</p><div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">{[{ label: "60 seconds", value: 60 }, { label: "No limit", value: null }].map((option) => <button aria-pressed={timeLimit === option.value} className={`rounded-xl border bg-slate-900/80 px-2 py-3 text-xs font-bold transition-all duration-300 ${timeLimit === option.value ? "is-selected border-cyan-300 bg-cyan-400/20 text-cyan-100" : "border-slate-700 text-slate-200 hover:border-cyan-400/80"}`} key={option.label} onClick={() => setTimeLimit(option.value)} type="button">{option.label}{timeLimit === option.value && <span aria-hidden="true" className="ml-1 text-cyan-300">✓</span>}</button>)}</div></section>
            <button className="arcade-launch-button rounded-xl px-5 py-3.5 font-extrabold sm:col-span-3 sm:col-start-1 sm:justify-self-center sm:w-80" onClick={() => setSetupStep("teams")} type="button">Arrange teams →</button>
          </div>
        ) : setupStep === "teams" ? (
          <div className="mt-5 flex min-h-0 flex-1 flex-col pb-20 lg:pb-[110px]"><div className="flex min-h-0 flex-1 items-center justify-around gap-3 overflow-x-auto px-2 py-4 lg:px-8">{Array.from({ length: teamCount }, (_, index) => { const color = teamColors[index]; const config = TEAM_COLOR_CONFIG[color]; return <div className="team-playing-card team-textured-card w-[150px] shrink-0 rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/80" data-team-color={color} key={index} style={{ backgroundImage: `linear-gradient(160deg, ${config.panel} 0%, ${config.value}bb 100%)` }}><div className="team-playing-card-content flex min-h-[190px] flex-col justify-between gap-6"><div className="flex items-start justify-between gap-2"><span aria-hidden="true" className="text-4xl font-black leading-none" style={{ color: config.value }}>{config.symbol}</span><span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">Team {index + 1}</span></div><input aria-label={`Team ${index + 1} name`} className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 px-3 py-3 text-sm font-bold text-white outline-none" maxLength={10} onChange={(event) => setTeamNames((names) => names.map((name, nameIndex) => nameIndex === index ? event.target.value : name))} placeholder={`Enter Team ${index + 1} name`} type="text" value={teamNames[index]} /></div></div>; })}</div><footer className="mt-5 flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button className="inline-flex self-start rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg transition-all hover:border-cyan-400/80 hover:text-white" onClick={() => setSetupStep("settings")} type="button">← Back to settings</button><button className="arcade-launch-button rounded-xl px-8 py-3.5 font-extrabold" onClick={() => setSetupStep("review")} type="button">Review game →</button></footer></div>
        ) : (
          <div className="mx-auto mt-4 flex min-h-0 w-full max-w-3xl flex-1 flex-col justify-start gap-4 overflow-y-auto pb-4 lg:justify-center">
            <section className="shrink-0 rounded-3xl border border-cyan-400/30 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-xl sm:p-6">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Teams</p><p className="mt-2 text-2xl font-black text-white">{teamCount}</p></div>
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Questions</p><p className="mt-2 text-2xl font-black text-white">{questionCount}</p></div>
                <div className="rounded-2xl border border-slate-700/70 bg-slate-950/60 p-4"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Time limit</p><p className="mt-2 text-2xl font-black text-white">{timeLimit === null ? "None" : `${timeLimit}s`}</p></div>
              </div>
              <p className="mt-5 text-center text-sm font-bold text-slate-300">{questionCount} questions · {questionCount / teamCount} rounds per team</p>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">{teamColors.slice(0, teamCount).map((color, index) => { const config = TEAM_COLOR_CONFIG[color]; return <div className="team-textured-card flex items-center gap-3 overflow-hidden rounded-2xl border p-2.5" key={color} style={{ background: `linear-gradient(145deg, ${config.panel}, ${config.value}cc)`, borderColor: config.value }}><span aria-hidden="true" className="relative z-10 text-2xl font-black">{config.symbol}</span><span className="relative z-10 min-w-0 truncate font-black text-white">{teamNames[index].trim() || `Team ${index + 1}`}</span></div>; })}</div>
            </section>
            <footer className="flex shrink-0 flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"><button className="inline-flex self-start rounded-full border border-slate-700/60 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-300 shadow-lg transition-all hover:border-cyan-400/80 hover:text-white" onClick={() => setSetupStep("teams")} type="button">← Edit team names</button><button className="arcade-launch-button rounded-xl px-8 py-3.5 font-extrabold disabled:opacity-60" disabled={isCreatingBattle} onClick={createBattle} type="button">{isCreatingBattle ? "Loading questions..." : "Start the game →"}</button></footer>
          </div>
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
  const roundTeams = roundOrder.length
    ? [
      ...roundOrder.map((id) => teams.find((team) => team.id === id)).filter(Boolean),
      ...teams.filter((team) => !roundOrder.includes(team.id)),
    ]
    : teams;
  const orderedTeams = roundTeams
    .sort((a, b) => Number(b.hearts > 0) - Number(a.hearts > 0));
  return <header className="arcade-hud border-b border-white/10 px-6 py-4"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><ExitGameButton onConfirm={onMainMenu} /><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Round {roundNumber} of {rounds}</p></div><div className="flex flex-wrap justify-end gap-3">{orderedTeams.map((team) => { const config = TEAM_COLOR_CONFIG[team.color] || TEAM_COLOR_CONFIG.red; const isEliminated = team.hearts === 0; return <div aria-label={`${team.name}, ${isEliminated ? "eliminated" : `${team.points} points, ${team.hearts} of 5 hearts`}`} className={`team-textured-card w-40 rounded-xl border px-4 py-3 text-center shadow-lg ${team.id === highlightedTeamId ? "ring-2 ring-cyan-300 ring-offset-2 ring-offset-[#090A0F]" : ""} ${isEliminated ? "opacity-60 grayscale" : ""}`} key={team.id} style={{ background: `linear-gradient(145deg, ${config.panel}, ${config.value}cc)`, borderColor: team.id === highlightedTeamId ? "#67e8f9" : config.value }}><div className="flex items-center justify-center gap-2"><span aria-hidden="true" className="text-lg font-black leading-none">{config.symbol}</span><p className="max-w-28 truncate text-sm font-black text-white">{team.name}</p></div>{isEliminated ? <p className="mt-2 text-xs font-black uppercase tracking-wider text-rose-200">Eliminated</p> : <div className="mt-2 flex items-center justify-center gap-3"><Hearts count={team.hearts} /><span className="text-sm font-black text-white">{team.points} pts</span></div>}</div>; })}</div></div></header>;
}

function StandingsModal({ game, onNextRound }) {
  return <div className="arcade-summary fixed inset-0 z-[80] grid place-items-center bg-[#090A0F]/85 p-5 backdrop-blur-md"><section aria-labelledby="round-summary-title" aria-modal="true" className="w-full max-w-3xl rounded-3xl border-2 border-cyan-400/60 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/40 sm:p-8" role="dialog"><div className="text-center"><p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">Round {game.roundNumber}</p><h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl" id="round-summary-title">Standings</h2></div><div className="mt-7 grid gap-3">{[...game.teams].sort((a, b) => b.points - a.points).map((team, index) => <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900/80 p-3" key={team.id}><span className="w-7 text-center text-lg font-black text-fuchsia-300">#{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate font-black text-white">{team.name}</p><p className="text-xs text-slate-400">{team.hearts === 0 ? "ELIMINATED" : `${team.hearts} hearts remaining`}</p></div><p className="text-2xl font-black text-cyan-300">{team.points}</p></div>)}</div><button className="arcade-launch-button mt-7 w-full rounded-xl px-5 py-4 font-black" onClick={onNextRound} type="button">{game.roundNumber >= game.rounds ? "See final results" : "Start Next Round · Roll Dice"}</button></section></div>;
}

function VictoryScreen({ teams, onMainMenu, mode = "battle" }) {
  const gameName = mode === "duel" ? "Duel" : "Battle";
  const survivors = teams.filter((team) => team.hearts > 0);
  const winner = [...(survivors.length ? survivors : teams)].sort((a, b) => b.points - a.points)[0];
  const winnerConfig = TEAM_COLOR_CONFIG[winner.color] || TEAM_COLOR_CONFIG.red;
  return <main className="arcade-shell arcade-game relative flex min-h-screen flex-col overflow-hidden bg-[#090A0F] px-6 pb-24 pt-6 text-white"><div aria-hidden="true" className="arcade-orb arcade-orb-cyan" /><div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" /><div className="relative z-10 flex min-h-0 flex-1 flex-col"><ExitGameButton className="self-start text-sm font-bold text-slate-400 hover:text-white" onConfirm={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">{gameName} complete</p><h1 className="mt-4 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-6xl font-black tracking-tight text-transparent">Victory!</h1><p className="mt-4 text-slate-300">{survivors.length === 1 ? `${winner.name} is the last team standing.` : "All scheduled rounds are complete."}</p><div className="team-textured-card mt-8 w-full rounded-3xl border border-cyan-400/30 bg-slate-900/80 p-6 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border-2 text-4xl font-black shadow-lg" style={{ background: `linear-gradient(145deg, ${winnerConfig.panel}, ${winnerConfig.value}dd)`, borderColor: winnerConfig.value }}>{winnerConfig.symbol}</div><p className="mt-5 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">Winning team</p><h2 className="mt-2 text-3xl font-black text-white">{winner.name}</h2><p className="mt-4 text-5xl font-black text-cyan-300">{winner.points}<span className="ml-2 text-base uppercase tracking-wider text-slate-400">points</span></p><div className="mt-4 flex justify-center"><Hearts count={winner.hearts} /></div></div><ExitGameButton className="arcade-launch-button mt-8 block rounded-xl px-8 py-4 font-black" label="Go to main menu" onConfirm={onMainMenu} /></section></div></main>;
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
  const activeTeamConfig = TEAM_COLOR_CONFIG[activeTeam?.color] || TEAM_COLOR_CONFIG.red;
  const gameName = game.mode === "duel" ? "Duel" : "Battle";

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

  if (game.phase === "victory") return <VictoryScreen mode={game.mode} onMainMenu={onMainMenu} teams={game.teams} />;
  if (game.phase === "summary") return <><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><StandingsModal game={game} onNextRound={() => {
    if (game.roundNumber >= game.rounds) {
      onUpdate({ ...game, phase: "victory" });
      return;
    }
    const nextGame = { ...game, phase: "rolling", roundNumber: game.roundNumber + 1, roundOrder: [], roundTurnIndex: 0, questionNumber: game.questionNumber + 1 };
    onUpdate(nextGame);
    rollDice(nextGame);
  }} /></>;

  const rollingTeam = game.teams.find((team) => team.id === rollingTeamId) || game.teams.find((team) => team.hearts > 0);
  const rollingTeamConfig = TEAM_COLOR_CONFIG[rollingTeam?.color] || TEAM_COLOR_CONFIG.red;
  const diceStyle = {
    background: `linear-gradient(145deg, ${rollingTeamConfig.panel}, ${rollingTeamConfig.value}dd)`,
    borderColor: rollingTeamConfig.value,
    boxShadow: `0 0 45px ${rollingTeamConfig.value}80`,
  };

  if (game.phase === "dashboard") return <main className="arcade-game flex min-h-screen flex-col bg-[#090A0F] text-white"><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">{gameName} dashboard</p><h1 className="mt-4 text-5xl font-black text-white">Ready to play?</h1><div className={`mt-8 grid h-36 w-36 place-items-center rounded-3xl border-4 text-center ${isRolling ? "dice-rolling" : ""}`} style={diceStyle}><span className="max-w-28 truncate px-2 text-2xl font-black text-white">{isRolling ? diceFace : "?"}</span></div><p className="mt-6 text-slate-400">{game.questionCount} questions · {game.rounds} rounds per team</p><button className="arcade-launch-button mt-8 rounded-xl px-8 py-4 font-black" disabled={isRolling} onClick={() => rollDice(game)} type="button">{isRolling ? "Rolling..." : "Roll Dice to Set Order"}</button></section></main>;

  if (game.phase === "rolling") return <main className="arcade-game flex min-h-screen flex-col bg-[#090A0F] text-white"><TeamStrip {...game} highlightedTeamId={null} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Round {game.roundNumber} · rolling</p><h1 className="mt-4 text-5xl font-black text-white">Who goes first?</h1><div className={`mt-8 grid h-36 w-36 place-items-center rounded-3xl border-4 text-center ${isRolling ? "dice-rolling" : ""}`} style={diceStyle}><span className="max-w-28 truncate px-2 text-2xl font-black text-white">{diceFace}</span></div><p className="mt-6 text-slate-400">The dice are locking the order for this round.</p></section></main>;
  if (game.phase === "orderReady") { const startingTeam = game.teams.find((team) => team.id === game.answeringTeamId); const startingTeamConfig = TEAM_COLOR_CONFIG[startingTeam?.color] || TEAM_COLOR_CONFIG.red; return <main className="arcade-shell arcade-game relative flex min-h-screen flex-col overflow-hidden bg-[#090A0F] text-white"><div aria-hidden="true" className="arcade-orb arcade-orb-cyan" /><div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" /><div className="relative z-10 flex min-h-0 flex-1 flex-col"><TeamStrip {...game} highlightedTeamId={game.answeringTeamId} onMainMenu={onMainMenu} /><section className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-10 text-center"><p className="text-xs font-black uppercase tracking-[0.35em] text-cyan-300">Round {game.roundNumber} · order locked</p><div className="mt-6 w-full rounded-3xl border border-cyan-400/30 bg-slate-900/80 p-8 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl sm:p-10"><div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl border-2 text-4xl font-black shadow-lg" style={{ background: `linear-gradient(145deg, ${startingTeamConfig.panel}, ${startingTeamConfig.value}dd)`, borderColor: startingTeamConfig.value }}>{startingTeamConfig.symbol}</div><h1 className="mt-6 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">{startingTeam?.name} starts!</h1><p className="mt-4 text-slate-300">The first team is ready to answer.</p><button className="arcade-launch-button mt-8 rounded-xl px-10 py-4 font-black" onClick={() => onUpdate({ ...game, phase: "question" })} type="button">Ready to play →</button></div></section></div></main>; }

  return <main className="arcade-game min-h-screen bg-[#090A0F] pb-10 text-white"><TeamStrip {...game} highlightedTeamId={game.answeringTeamId} onMainMenu={onMainMenu} /><section className="arcade-arena mx-auto mt-8 w-full max-w-4xl rounded-2xl border border-slate-700/60 bg-slate-900/80 px-6 py-6 shadow-2xl sm:px-8 sm:py-8"><div className="flex items-center justify-between gap-4"><p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-300">Question {game.questionNumber} · {activeQuestion.category}</p>{game.timeLimit !== null && <span className="rounded-full border border-amber-400 px-4 py-2 text-xl font-black">{secondsLeft}s</span>}</div><div className="mt-3 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-black text-white" style={{ background: `linear-gradient(145deg, ${activeTeamConfig.panel}, ${activeTeamConfig.value}cc)`, borderColor: activeTeamConfig.value }}><span aria-hidden="true" className="text-lg leading-none">{activeTeamConfig.symbol}</span><span>{activeTeam?.name}&apos;s turn</span></div><h1 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">{activeQuestion.questionText}</h1><div className="mt-6 grid gap-3 sm:grid-cols-2">{activeQuestion.options.map((answer, index) => <button className={`rounded-xl border p-4 text-left text-lg font-semibold ${answerResult && index === activeQuestion.correctAnswerIndex ? "answer-correct" : selectedAnswer === index && answerResult ? "answer-incorrect" : "border-slate-700 bg-slate-800/90 text-slate-100 hover:border-cyan-400"}`} disabled={Boolean(answerResult)} key={answer} onClick={() => { setSelectedAnswer(index); resolveAnswer(index === activeQuestion.correctAnswerIndex); }} type="button"><span className="mr-3 text-cyan-300">{String.fromCharCode(65 + index)}.</span>{answer}</button>)}</div></section>{answerResult && <div className={`fixed inset-0 z-[70] grid place-items-center p-6 backdrop-blur-sm ${answerResult.isCorrect ? "bg-emerald-950/85" : "bg-rose-950/85"}`}><section aria-modal="true" className={`w-full max-w-xl rounded-3xl border-2 p-8 text-center shadow-2xl ${answerResult.isCorrect ? "border-emerald-300 bg-emerald-950 shadow-emerald-950/60" : "border-rose-300 bg-rose-950 shadow-rose-950/60"}`} role="dialog"><p className={`text-xs font-black uppercase tracking-[0.3em] ${answerResult.isCorrect ? "text-emerald-300" : "text-rose-300"}`}>{answerResult.isCorrect ? "Correct" : "Wrong answer"}</p><h2 className="mt-4 text-3xl font-black text-white">{answerResult.isCorrect ? `${activeTeam.name} earns points!` : `${activeTeam.name} loses 1 heart.`}</h2><p className={`mt-5 text-lg ${answerResult.isCorrect ? "text-emerald-200" : "text-rose-200"}`}>Correct answer: {activeQuestion.options[activeQuestion.correctAnswerIndex]}</p><div className={`mt-5 rounded-xl border p-4 text-left ${answerResult.isCorrect ? "border-emerald-300/40 bg-emerald-400/15" : "border-rose-300/40 bg-rose-400/15"}`}><p className={`text-xs font-black uppercase tracking-[0.2em] ${answerResult.isCorrect ? "text-emerald-300" : "text-rose-300"}`}>Explanation</p><p className="mt-2 leading-6 text-slate-100">{answerResult.explanation || "No explanation was provided for this question."}</p></div><button className={`mt-8 w-full rounded-xl px-5 py-4 font-black ${answerResult.isCorrect ? "bg-emerald-400 text-emerald-950 hover:bg-emerald-300" : "bg-rose-400 text-rose-950 hover:bg-rose-300"}`} onClick={nextQuestion} type="button">Continue</button></section></div>}</main>;
}
