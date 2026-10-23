import supabase from "./supabaseClient";

const INCORRECT_ANSWER_COLUMNS = Array.from(
  { length: 7 },
  (_, index) => `incorrect_answer_${index + 1}`,
);

const MOCK_QUESTIONS = [
  {
    id: "mock-science-1",
    category: "Science",
    difficulty: "easy",
    question_text: "Which planet is closest to the Sun?",
    correct_answer: "Mercury",
    incorrect_answer_1: "Venus",
    incorrect_answer_2: "Mars",
    incorrect_answer_3: "Earth",
    explanation: "Mercury is the closest planet to the Sun.",
  },
  {
    id: "mock-geography-1",
    category: "Geography",
    difficulty: "easy",
    question_text: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answer_1: "Atlantic Ocean",
    incorrect_answer_2: "Indian Ocean",
    incorrect_answer_3: "Arctic Ocean",
    explanation: "The Pacific Ocean is the largest and deepest ocean.",
  },
  {
    id: "mock-history-1",
    category: "History",
    difficulty: "easy",
    question_text: "Which ancient civilization built Machu Picchu?",
    correct_answer: "Inca",
    incorrect_answer_1: "Roman",
    incorrect_answer_2: "Viking",
    incorrect_answer_3: "Egyptian",
    explanation: "Machu Picchu was built by the Inca civilization.",
  },
  {
    id: "mock-nature-1",
    category: "Nature",
    difficulty: "easy",
    question_text: "What process do plants use to turn sunlight into energy?",
    correct_answer: "Photosynthesis",
    incorrect_answer_1: "Digestion",
    incorrect_answer_2: "Respiration",
    incorrect_answer_3: "Fermentation",
    explanation: "Plants use photosynthesis to convert sunlight into chemical energy.",
  },
  {
    id: "mock-space-1",
    category: "Space",
    difficulty: "easy",
    question_text: "Which star is at the center of our solar system?",
    correct_answer: "The Sun",
    incorrect_answer_1: "Sirius",
    incorrect_answer_2: "Polaris",
    incorrect_answer_3: "Betelgeuse",
    explanation: "The Sun is the star at the center of our solar system.",
  },
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function fallbackQuestionsForCategory(categoryName) {
  const matchingQuestions = MOCK_QUESTIONS.filter(
    (question) => question.category.toLowerCase() === categoryName?.toLowerCase(),
  );

  return matchingQuestions.length > 0 ? matchingQuestions : MOCK_QUESTIONS;
}

function getMockCategories(count) {
  return [...new Set(MOCK_QUESTIONS.map((question) => question.category))].slice(0, count);
}

function getDifficultyLabel(difficulty) {
  const normalizedDifficulty = difficulty?.trim().toLowerCase();

  if (normalizedDifficulty === "hard") return "Difficult";
  if (normalizedDifficulty === "difficult") return "Difficult";
  return "Easy";
}

export async function fetchRandomCategories(count = 3) {
  try {
    if (!supabase) return getMockCategories(count);

    const { data, error } = await supabase
      .from("questions")
      .select("category")
      .not("category", "is", null)
      .limit(500);

    if (error) throw error;

    const categories = [...new Set(
      (data || [])
        .map((row) => row.category?.trim())
        .filter(Boolean),
    )];

    if (categories.length === 0) {
      console.warn("Supabase returned no question categories. Using local practice categories.");
      return getMockCategories(count);
    }

    return shuffle(categories).slice(0, count);
  } catch (error) {
    console.error("Unable to fetch question categories from Supabase. Using local practice categories.", error);
    return getMockCategories(count);
  }
}

export async function fetchQuestionByCategory(categoryName) {
  try {
    if (!categoryName?.trim()) {
      console.warn("A category is required to fetch a question. Using a local practice question.");
      return MOCK_QUESTIONS[0];
    }

    if (!supabase) {
      return shuffle(fallbackQuestionsForCategory(categoryName))[0];
    }

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("category", categoryName)
      .limit(100);

    if (error) throw error;

    if (!data?.length) {
      console.warn(`No Supabase questions found for category "${categoryName}". Using local practice questions.`);
      return shuffle(fallbackQuestionsForCategory(categoryName))[0];
    }

    return shuffle(data)[0];
  } catch (error) {
    console.error(`Unable to fetch a question for category "${categoryName}". Using local practice questions.`, error);
    return shuffle(fallbackQuestionsForCategory(categoryName))[0];
  }
}

export async function fetchQuestionsForGame(count) {
  try {
    if (!supabase) {
      return shuffle(MOCK_QUESTIONS)
        .slice(0, Math.min(count, MOCK_QUESTIONS.length))
        .map(formatQuestionForGame);
    }

    const pageSize = 1000;
    const rows = [];
    let offset = 0;

    while (true) {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .range(offset, offset + pageSize - 1);

      if (error) throw error;
      rows.push(...(data || []));

      if (!data || data.length < pageSize) break;
      offset += pageSize;
    }

    const uniqueRows = [...new Map(
      rows
        .filter((row) => row.id && row.question_text)
        .map((row) => [row.id, row]),
    ).values()];

    const challengingRows = uniqueRows.filter((row) =>
      ["Hard", "Difficult"].includes(getDifficultyLabel(row.difficulty)),
    );
    let selectedRows = shuffle(uniqueRows).slice(0, count);

    if (
      challengingRows.length > 0 &&
      !selectedRows.some((row) => ["Hard", "Difficult"].includes(getDifficultyLabel(row.difficulty)))
    ) {
      selectedRows = [
        shuffle(challengingRows)[0],
        ...selectedRows.slice(1),
      ];
    }

    const formattedQuestions = shuffle(selectedRows)
      .map(formatQuestionForGame)
      .filter((question, index, questions) =>
        questions.findIndex((candidate) => candidate.id === question.id) === index,
      )
      .slice(0, count);

    if (formattedQuestions.length === 0) {
      throw new Error("Supabase returned no usable questions.");
    }

    if (formattedQuestions.length < count) {
      console.warn(
        `Only ${formattedQuestions.length} unique questions are available for a ${count}-question game.`,
      );
    }

    return formattedQuestions;
  } catch (error) {
    console.error("Unable to prepare unique Supabase questions. Using local practice questions.", error);
    return shuffle(MOCK_QUESTIONS)
      .slice(0, Math.min(count, MOCK_QUESTIONS.length))
      .map(formatQuestionForGame);
  }
}

export function formatQuestionForGame(rawQuestion) {
  try {
    if (!rawQuestion?.correct_answer || !rawQuestion.question_text) {
      throw new Error("Question row is missing question_text or correct_answer.");
    }

    const incorrectAnswers = INCORRECT_ANSWER_COLUMNS
      .map((column) => rawQuestion[column])
      .filter((answer) => typeof answer === "string" && answer.trim());

    if (incorrectAnswers.length < 3) {
      throw new Error("Question row must contain at least three incorrect answers.");
    }

    const options = shuffle([
      rawQuestion.correct_answer,
      ...shuffle(incorrectAnswers).slice(0, 3),
    ]);

    return {
      id: rawQuestion.id,
      category: rawQuestion.category,
      difficulty: rawQuestion.difficulty,
      difficultyLabel: getDifficultyLabel(rawQuestion.difficulty),
      questionText: rawQuestion.question_text,
      options,
      correctAnswerIndex: options.indexOf(rawQuestion.correct_answer),
      explanation: rawQuestion.explanation || "",
    };
  } catch (error) {
    console.error("Unable to format the Supabase question. Using a local practice question.", error);

    const fallbackQuestion = rawQuestion?.category
      ? fallbackQuestionsForCategory(rawQuestion.category)[0]
      : MOCK_QUESTIONS[0];

    return formatQuestionForGameWithoutFallback(fallbackQuestion);
  }
}

function formatQuestionForGameWithoutFallback(rawQuestion) {
  const options = shuffle([
    rawQuestion.correct_answer,
    ...shuffle(
      INCORRECT_ANSWER_COLUMNS
        .map((column) => rawQuestion[column])
        .filter(Boolean),
    ).slice(0, 3),
  ]);

  return {
    id: rawQuestion.id,
    category: rawQuestion.category,
    difficulty: rawQuestion.difficulty,
    difficultyLabel: getDifficultyLabel(rawQuestion.difficulty),
    questionText: rawQuestion.question_text,
    options,
    correctAnswerIndex: options.indexOf(rawQuestion.correct_answer),
    explanation: rawQuestion.explanation || "",
  };
}

export { MOCK_QUESTIONS };
