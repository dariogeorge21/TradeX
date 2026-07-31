import "server-only";

// ---------------------------------------------------------------------------
// Groq configuration — single source of truth for model names & limits
// ---------------------------------------------------------------------------
export const GROQ_CHAT_MODEL = "llama-3.3-70b-versatile";
export const GROQ_FAST_MODEL = "llama-3.1-8b-instant";
export const GROQ_MAX_TOKENS = 2048;
export const GROQ_TEMPERATURE = 0.35;
export const GROQ_TIMEOUT_MS = 45_000;

export function getGroqApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY environment variable is not set.");
  return key;
}
