import { loadEnv } from "./utils/env";
import { ChatGroq } from "@langchain/groq";

export type Provider = "openai" | "gemini" | "groq";
export function createChatModel(): { provider: Provider; model: any } {
  loadEnv();
  const forced = (process.env.PROVIDER || "").toLowerCase();

  const hasGroq = !!process.env.GROQ_API_KEY;
  const base = { temperature: 0 as const };

  if (forced === "groq" || (!forced && hasGroq)) {
    return {
      provider: "groq",
      model: new ChatGroq({
        ...base,
        model: "llama-3.1-8b-instant",
      }),
    };
  }
  throw new Error(
    "No model provider is configured. Set PROVIDER and a matching API key.",
  );
}
