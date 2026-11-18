"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  containsProfanity,
  fetchTopScores,
  MAX_PLAYER_NAME_LENGTH,
  sanitizePlayerName,
  submitScore,
} from "../utils/leaderboard";

const RANK_STYLES = [
  "border-amber-300/70 bg-amber-400/15",
  "border-slate-300/50 bg-slate-300/10",
  "border-orange-400/50 bg-orange-500/10",
];

function getNameError(name) {
  if (!name.trim()) return "";

  try {
    sanitizePlayerName(name);
    return "";
  } catch (error) {
    return error.message;
  }
}

export default function SoloGameOverModal({
  playerName,
  score,
  questionsAsked,
  isRestarting = false,
  restartError = "",
  onPlayAgain,
  onMainMenu,
}) {
  const [view, setView] = useState("results");
  const [name, setName] = useState(playerName || "");
  const [declinedLeaderboard, setDeclinedLeaderboard] = useState(false);
  const [isLoadingScores, setIsLoadingScores] = useState(true);
  const [scoreLoadError, setScoreLoadError] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [savedRecord, setSavedRecord] = useState(null);
  const requestId = useRef(0);

  const loadLeaderboard = useCallback(async () => {
    const currentRequestId = ++requestId.current;
    setIsLoadingScores(true);
    setScoreLoadError("");

    try {
      const scores = await fetchTopScores(50);
      if (currentRequestId === requestId.current) setLeaderboard(scores);
      return scores;
    } catch (error) {
      console.error("Unable to load the leaderboard.", error);
      if (currentRequestId === requestId.current) {
        setScoreLoadError(error.message || "Unable to load the leaderboard.");
      }
      return null;
    } finally {
      if (currentRequestId === requestId.current) setIsLoadingScores(false);
    }
  }, []);

  useEffect(() => {
    const initialRequestId = ++requestId.current;

    fetchTopScores(50)
      .then((scores) => {
        if (initialRequestId === requestId.current) setLeaderboard(scores);
      })
      .catch((error) => {
        console.error("Unable to load the leaderboard.", error);
        if (initialRequestId === requestId.current) {
          setScoreLoadError(error.message || "Unable to load the leaderboard.");
        }
      })
      .finally(() => {
        if (initialRequestId === requestId.current) setIsLoadingScores(false);
      });

    return () => {
      requestId.current += 1;
    };
  }, []);

  const lowestQualifyingScore = leaderboard.length >= 50
    ? Number(leaderboard[49].score)
    : null;
  const qualifiesForLeaderboard = leaderboard.length < 50
    || Number(score) >= lowestQualifyingScore;
  const nameError = getNameError(name);

  async function handleSubmitScore(event) {
    event.preventDefault();
    if (nameError) return;

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const record = await submitScore(name, score, "Solo");
      setSavedRecord(record);
      setView("leaderboard");
      const updatedScores = await loadLeaderboard();
      if (!updatedScores) {
        setSubmissionError("Your score was saved, but the leaderboard could not be refreshed.");
      }
    } catch (error) {
      console.error("Unable to submit the solo score.", error);
      setSubmissionError(error.message || "Unable to submit your score.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderLeaderboard() {
    if (isLoadingScores) {
      return (
        <p className="py-6 text-center text-sm font-semibold text-slate-400" role="status">
          Loading leaderboard...
        </p>
      );
    }

    if (scoreLoadError) {
      return (
        <div className="mt-4 rounded-xl border border-rose-400/40 bg-rose-400/10 p-4 text-sm text-rose-200" role="alert">
          <p>{scoreLoadError}</p>
          <button
            className="mt-3 font-black underline underline-offset-2"
            onClick={() => {
              setSubmissionError("");
              loadLeaderboard();
            }}
            type="button"
          >
            Try again
          </button>
        </div>
      );
    }

    if (!leaderboard.length) {
      return <p className="py-6 text-center text-sm text-slate-400">No scores have been recorded yet.</p>;
    }

    return (
      <ol className="space-y-2">
        {leaderboard.map((record, index) => {
          const rank = index + 1;
          const rankStyle = RANK_STYLES[rank - 1] || "border-slate-800 bg-slate-900/70";

          return (
            <li
              className={`flex items-center gap-3 rounded-xl border p-3 ${rankStyle}`}
              key={record.id ?? `${record.player_name}-${index}`}
            >
              <span className="w-10 shrink-0 text-center text-sm font-black text-fuchsia-200">
                #{rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-black text-white">
                  {record.player_name || "Player"}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {record.game_mode || "Solo"}
                </p>
              </div>
              <p className="shrink-0 text-lg font-black tabular-nums text-cyan-200">
                {Number(record.score || 0).toLocaleString()}
              </p>
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <main className="arcade-shell arcade-end-screen arcade-game relative flex h-full min-h-0 flex-col overflow-hidden bg-[#090A0F] px-4 pb-28 pt-4 text-white sm:px-8 sm:pb-24 sm:pt-6">
      <div aria-hidden="true" className="arcade-orb arcade-orb-cyan" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-fuchsia" />
      <div aria-hidden="true" className="arcade-orb arcade-orb-violet" />
      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-500 text-lg font-black text-[#090A0F] shadow-lg shadow-cyan-500/20 sm:h-10 sm:w-10 sm:text-xl">
              5
            </span>
            <span className="truncate text-sm font-black tracking-tight sm:text-lg">Five Hearts Quiz</span>
          </div>
          <span className="ml-2 shrink-0 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-300 sm:ml-3 sm:px-3 sm:text-xs sm:tracking-[0.2em]">
            Solo run
          </span>
        </header>

        {view === "leaderboard" ? (
          <section className="flex min-h-0 flex-1 flex-col py-4 sm:py-7">
            <div className="shrink-0 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                Global rankings
              </p>
              <h1 className="mt-2 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-5xl">
                Top 50 Leaderboard
              </h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {savedRecord
                  ? `Score saved for ${savedRecord.player_name}.`
                  : "Current Five Hearts Quiz high scores"}
              </p>
            </div>
            {submissionError && (
              <p className="mt-3 shrink-0 rounded-xl border border-rose-400/40 bg-rose-400/10 p-3 text-center text-sm text-rose-200" role="alert">
                {submissionError}
              </p>
            )}
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl sm:mt-6 sm:p-4">
              {renderLeaderboard()}
            </div>
          </section>
        ) : (
          <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-0 text-center sm:py-7">
            {view !== "name" && (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-300">
                  Solo run complete
                </p>
                <h1 className="mt-2 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:mt-3 sm:text-5xl">
                  Game over
                </h1>
                <p className="solo-ending-description mt-2 max-w-xl text-xs leading-5 text-slate-400 sm:mt-3 sm:text-sm sm:leading-6">
                  You answered {questionsAsked} questions. Here&apos;s your final score.
                </p>
              </>
            )}
            {view === "name" && (
              <h1 className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-violet-500 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-5xl">
                Add your score
              </h1>
            )}

            <div className="mt-3 w-full max-w-lg rounded-2xl border border-slate-700/60 bg-slate-900/80 p-3 text-left shadow-2xl backdrop-blur-xl sm:mt-6 sm:p-6">
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-300">
                  Final score
                </p>
                <p className="mt-1 text-4xl font-black tabular-nums text-white sm:mt-2 sm:text-6xl">
                  {score}
                </p>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  points
                </p>
              </div>

              {view !== "name" && (
                <div className="mt-3 border-t border-white/10 pt-3 sm:mt-4 sm:pt-4">
                  {isLoadingScores ? (
                    <p className="text-center text-xs text-slate-300 sm:text-sm" role="status">
                      Checking your Top 50 eligibility...
                    </p>
                  ) : scoreLoadError ? (
                    <div className="text-center">
                      <p className="text-xs leading-5 text-rose-200 sm:text-sm" role="alert">
                        Could not check leaderboard eligibility: {scoreLoadError}
                      </p>
                      <button
                        className="mt-2 text-sm font-bold text-cyan-200 underline underline-offset-2"
                        onClick={loadLeaderboard}
                        type="button"
                      >
                        Try again
                      </button>
                    </div>
                  ) : qualifiesForLeaderboard ? (
                    declinedLeaderboard ? (
                      <p className="text-center text-xs font-semibold text-slate-300 sm:text-sm">
                        No problem. You can try for the leaderboard again next time.
                      </p>
                    ) : (
                      <>
                        <p className="text-center text-xs font-bold leading-5 text-white sm:text-sm sm:leading-6">
                          Your score qualifies for the Top 50! Would you like to add it to the leaderboard?
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
                          <button
                            className="arcade-launch-button rounded-xl px-3 py-2.5 text-xs font-black sm:px-4 sm:py-3 sm:text-sm"
                            onClick={() => setView("name")}
                            type="button"
                          >
                            Yes, add my score
                          </button>
                          <button
                            className="rounded-xl border border-slate-600 px-3 py-2.5 text-xs font-bold text-slate-200 hover:border-slate-400 sm:px-4 sm:py-3 sm:text-sm"
                            onClick={() => setDeclinedLeaderboard(true)}
                            type="button"
                          >
                            No, thanks
                          </button>
                        </div>
                      </>
                    )
                  ) : (
                    <p className="text-center text-xs font-semibold leading-5 text-slate-300 sm:text-sm sm:leading-6">
                      A score of {lowestQualifyingScore.toLocaleString()} points is currently needed to enter the Top 50. Keep playing and try again!
                    </p>
                  )}
                </div>
              )}

              {view === "name" && (
                <form className="mt-3 border-t border-white/10 pt-3 sm:mt-4 sm:pt-4" onSubmit={handleSubmitScore}>
                  <label className="block text-left text-xs font-bold text-slate-200 sm:text-sm" htmlFor="leaderboard-player-name">
                    Choose a leaderboard name
                    <input
                      autoComplete="nickname"
                      aria-describedby={nameError ? "leaderboard-name-error" : undefined}
                      aria-invalid={Boolean(nameError)}
                      className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-2.5 text-base font-bold text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-300"
                      id="leaderboard-player-name"
                      maxLength={MAX_PLAYER_NAME_LENGTH}
                      onChange={(event) => {
                        setName(event.target.value);
                        setSubmissionError("");
                      }}
                      placeholder="Player name"
                      required
                      value={name}
                    />
                  </label>
                  <p className="mt-1 text-[10px] text-slate-400 sm:text-xs">
                    Up to {MAX_PLAYER_NAME_LENGTH} characters.
                  </p>
                  {nameError && (
                    <p className="mt-1 text-xs font-semibold text-rose-300" id="leaderboard-name-error" role="alert">
                      {nameError}
                    </p>
                  )}
                  {submissionError && (
                    <p className="mt-1 text-xs font-semibold text-rose-300" role="alert">
                      {submissionError}
                    </p>
                  )}
                  <button
                    className="arcade-launch-button mt-2 w-full rounded-xl px-4 py-2.5 text-sm font-black disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={isSubmitting || !name.trim() || Boolean(nameError)}
                    type="submit"
                  >
                    {isSubmitting ? "Submitting score..." : "Submit score"}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        <footer className="grid shrink-0 gap-2 border-t border-white/10 pt-3 sm:gap-3 sm:pt-4">
          {view === "leaderboard" ? (
            <button
              className="arcade-launch-button w-full rounded-xl px-4 py-3 text-sm font-black"
              onClick={onMainMenu}
              type="button"
            >
              Main Menu
            </button>
          ) : view === "name" ? (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-black text-slate-200 transition-colors hover:border-cyan-300 hover:text-white"
                onClick={() => setView("results")}
                type="button"
              >
                Back
              </button>
              <button
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-black text-slate-200 transition-colors hover:border-fuchsia-300 hover:text-white"
                onClick={onMainMenu}
                type="button"
              >
                Main Menu
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                className="arcade-launch-button rounded-xl px-4 py-3 text-sm font-black disabled:cursor-wait disabled:opacity-60"
                disabled={isRestarting}
                onClick={onPlayAgain}
                type="button"
              >
                {isRestarting ? "Loading questions..." : "Play Again"}
              </button>
              <button
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm font-black text-slate-200 transition-colors hover:border-fuchsia-300 hover:text-white"
                onClick={onMainMenu}
                type="button"
              >
                Main Menu
              </button>
            </div>
          )}
          {restartError && view !== "leaderboard" && (
            <p className="text-center text-xs font-semibold text-rose-300 sm:text-sm" role="alert">
              {restartError}
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
