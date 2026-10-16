"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getQuestionByCategory } from "../data/questionBank";
import useGameTimer from "./useGameTimer";

const MAX_HEARTS = 5;
const MAX_SELF_SELECTIONS = 2;
const STARTING_TIMER = 45;

const DEFAULT_TEAMS = [
  { id: "team-1", name: "Team 1", hearts: MAX_HEARTS, points: 0, isEliminated: false },
  { id: "team-2", name: "Team 2", hearts: MAX_HEARTS, points: 0, isEliminated: false },
];

const DEFAULT_CHANCE_CARDS = [
  "EXTRA_HEART",
  "REMOVE_ENEMY_HEART",
  "CHOOSE_CATEGORY",
  "REMOVE_FAKE_ANSWER",
  "NO_EFFECT",
];

const EMPTY_QUESTION = {
  text: "",
  options: [],
  correctAnswerIndex: null,
  category: "",
};

function createTeams(teams) {
  return teams.map((team) => ({
    id: team.id,
    name: team.name,
    hearts: team.hearts ?? MAX_HEARTS,
    points: team.points ?? 0,
    isEliminated: team.isEliminated ?? false,
  }));
}

export default function useFiveHearts({
  initialMode = "SOLO",
  initialTeams = DEFAULT_TEAMS,
  initialCategories = [],
  initialQuestion = EMPTY_QUESTION,
  initialChanceCards = DEFAULT_CHANCE_CARDS,
} = {}) {
  const [mode, setMode] = useState(initialMode);
  const [teams, setTeams] = useState(() => createTeams(initialTeams));
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [selfSelectionCount, setSelfSelectionCount] = useState(0);
  const [currentCategories, setCurrentCategories] = useState(initialCategories);
  const [activeQuestion, setActiveQuestion] = useState(initialQuestion);
  const [chanceCards, setChanceCards] = useState(initialChanceCards);
  const [usedQuestionIds, setUsedQuestionIds] = useState(
    () => (initialQuestion.id ? [initialQuestion.id] : []),
  );
  const [roundStatus, setRoundStatus] = useState(
    () => (initialQuestion.text ? "QUESTION_ACTIVE" : "CATEGORY_SELECTION"),
  );
  const submitAnswerRef = useRef(null);
  const timer = useGameTimer(STARTING_TIMER, () => submitAnswerRef.current?.(-1));
  const resetTimer = timer.reset;

  const selectNextTeam = useCallback(
    (targetTeamId) => {
      const targetIndex = teams.findIndex((team) => team.id === targetTeamId);
      if (targetIndex === -1 || teams[targetIndex].isEliminated) return false;

      if (targetIndex === activeTeamIndex) {
        if (selfSelectionCount >= MAX_SELF_SELECTIONS) return false;
        setSelfSelectionCount((count) => Math.min(count + 1, MAX_SELF_SELECTIONS));
        return true;
      }

      setActiveTeamIndex(targetIndex);
      setSelfSelectionCount(0);
      return true;
    },
    [activeTeamIndex, selfSelectionCount, teams],
  );

  const deductHeart = useCallback((targetTeamId) => {
    setTeams((currentTeams) =>
      currentTeams.map((team) => {
        if (team.id !== targetTeamId) return team;

        const hearts = Math.max(team.hearts - 1, 0);
        return { ...team, hearts, isEliminated: hearts === 0 };
      }),
    );
  }, []);

  const addHeart = useCallback((targetTeamId) => {
    setTeams((currentTeams) =>
      currentTeams.map((team) => {
        if (team.id !== targetTeamId) return team;

        const hearts = Math.min(team.hearts + 1, MAX_HEARTS);
        return { ...team, hearts, isEliminated: false };
      }),
    );
  }, []);

  const beginRound = useCallback(
    (category) => {
      const question = getQuestionByCategory(category, usedQuestionIds);
      if (!question) return false;

      setActiveQuestion(question);
      setUsedQuestionIds((questionIds) =>
        questionIds.includes(question.id) ? questionIds : [...questionIds, question.id],
      );
      setRoundStatus("QUESTION_ACTIVE");
      resetTimer();
      return true;
    },
    [resetTimer, usedQuestionIds],
  );

  const submitAnswer = useCallback(
    (chosenIndex) => {
      const currentTeam = teams[activeTeamIndex];
      if (!currentTeam || currentTeam.isEliminated || activeQuestion.correctAnswerIndex === null) {
        return false;
      }

      const isCorrect = chosenIndex === activeQuestion.correctAnswerIndex;
      if (isCorrect) {
        setTeams((currentTeams) =>
          currentTeams.map((team, index) =>
            index === activeTeamIndex ? { ...team, points: team.points + 1 } : team,
          ),
        );
      } else {
        deductHeart(currentTeam.id);
      }

      setRoundStatus("ANSWERED");
      resetTimer();
      return isCorrect;
    },
    [activeQuestion.correctAnswerIndex, activeTeamIndex, deductHeart, resetTimer, teams],
  );

  useEffect(() => {
    submitAnswerRef.current = submitAnswer;
  }, [submitAnswer]);

  const drawChanceCard = useCallback(() => {
    if (chanceCards.length === 0) return null;

    const cardIndex = Math.floor(Math.random() * chanceCards.length);
    const drawnCard = chanceCards[cardIndex];
    setChanceCards((cards) => cards.filter((_, index) => index !== cardIndex));
    return drawnCard;
  }, [chanceCards]);

  const activeTeam = useMemo(() => teams[activeTeamIndex] ?? null, [activeTeamIndex, teams]);

  return {
    mode,
    setMode,
    teams,
    setTeams,
    activeTeam,
    activeTeamIndex,
    selfSelectionCount,
    timer: timer.secondsRemaining,
    currentCategories,
    setCurrentCategories,
    activeQuestion,
    setActiveQuestion,
    usedQuestionIds,
    roundStatus,
    chanceCards,
    selectNextTeam,
    submitAnswer,
    drawChanceCard,
    deductHeart,
    addHeart,
    beginRound,
    resetTimer: timer.reset,
    setTimer: (seconds) => timer.reset(seconds),
  };
}

export {
  DEFAULT_CHANCE_CARDS,
  DEFAULT_TEAMS,
  EMPTY_QUESTION,
  MAX_HEARTS,
  MAX_SELF_SELECTIONS,
  STARTING_TIMER,
};
