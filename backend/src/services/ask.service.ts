import { createChatModel } from "./lc-model";
import { AskStructuredSchema, type AskResult } from "../utils/schema";
import { sanitizeQuestions, validateQuestions } from "./question-utils";

const MAX_GENERATION_ATTEMPTS = 3;

export async function askStructured(
  query: string,
  size: number,
  difficulty: string,
): Promise<AskResult> {
  const { model } = createChatModel();
  const structured = model.withStructuredOutput(AskStructuredSchema, {
    method: "jsonMode",
  });

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      const system = [
        "You generate multiple-choice questions and must return only data that matches the provided schema.",
        "Every question must test a different concept or angle of the topic.",
        "Within a question, all 4 options must be unique and mutually distinct.",
        "Avoid reusing the same distractor phrases across different questions unless the topic absolutely requires it.",
      ].join("\n");

      const user = [
        `Generate ${size} multiple-choice questions about "${query}".`,
        `Difficulty: ${difficulty}.`,
        "Return a JSON object with a single field named questions.",
        `The questions array must contain exactly ${size} items.`,
        "Each question must include exactly these fields:",
        "question, options, correct_answer, explanation.",
        "Each options array must contain exactly 4 unique choices.",
        "correct_answer must exactly match one of the 4 options.",
        "Questions must not repeat or paraphrase each other.",
        "Return valid JSON only with no markdown or extra commentary.",
        "Do not include any extra fields.",
      ].join("\n");

      const result = await structured.invoke([
        { role: "system", content: system },
        { role: "user", content: user },
      ]);

      const sanitized = sanitizeQuestions(result.questions);
      validateQuestions(sanitized, size);
      return sanitized;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Failed to generate a clean question set.");
}
