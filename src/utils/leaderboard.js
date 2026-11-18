import supabase from "../lib/supabaseClient";

export const MAX_PLAYER_NAME_LENGTH = 16;
const MAX_LEADERBOARD_LIMIT = 50;
const PROFANITY_WORDS = new Set([
  "arse",
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "bullshit",
  "cock",
  "crap",
  "cunt",
  "damn",
  "dick",
  "dickhead",
  "fucker",
  "fucking",
  "fuck",
  "motherfucker",
  "piss",
  "prick",
  "pussy",
  "shit",
  "shitty",
  "slut",
  "twat",
  "wanker",
  "whore",
]);

function getSupabaseClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured. Leaderboard is unavailable.");
  }

  return supabase;
}

export function containsProfanity(playerName) {
  const normalizeToken = (token) =>
    token
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/0/g, "o")
      .replace(/1/g, "i")
      .replace(/3/g, "e")
      .replace(/4/g, "a")
      .replace(/5/g, "s")
      .replace(/7/g, "t")
      .replace(/[^a-z0-9]/g, "");
  const words = playerName
    .split(/\s+/)
    .map(normalizeToken)
    .filter(Boolean);

  return words.some((word) => PROFANITY_WORDS.has(word))
    || PROFANITY_WORDS.has(words.filter((word) => word.length === 1).join(""));
}

export function sanitizePlayerName(playerName) {
  if (typeof playerName !== "string") {
    throw new Error("Enter a player name.");
  }

  const sanitizedName = playerName
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .trim()
    .replace(/\s+/g, " ");

  if (!sanitizedName) {
    throw new Error("Enter a player name.");
  }

  if (sanitizedName.length > MAX_PLAYER_NAME_LENGTH) {
    throw new Error(`Player names must be ${MAX_PLAYER_NAME_LENGTH} characters or fewer.`);
  }

  if (containsProfanity(sanitizedName)) {
    throw new Error("Please choose a player name without profanity.");
  }

  return sanitizedName;
}

export async function fetchTopScores(limit = 50) {
  const parsedLimit = Number(limit);
  const safeLimit = Number.isFinite(parsedLimit)
    ? Math.min(MAX_LEADERBOARD_LIMIT, Math.max(1, Math.trunc(parsedLimit)))
    : MAX_LEADERBOARD_LIMIT;
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("leaderboard")
    .select("*")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(safeLimit);

  if (error) throw error;
  return data || [];
}

export async function submitScore(playerName, score, gameMode = "Solo") {
  const sanitizedName = sanitizePlayerName(playerName);
  const numericScore = Number(score);

  if (!Number.isSafeInteger(numericScore) || numericScore < 0) {
    throw new Error("The score must be a non-negative whole number.");
  }

  const normalizedGameMode =
    typeof gameMode === "string" && gameMode.trim()
      ? gameMode.trim()
      : "Solo";
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("leaderboard")
    .insert({
      player_name: sanitizedName,
      score: numericScore,
      game_mode: normalizedGameMode,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
