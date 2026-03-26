import { createChatModel } from "./lc-model";
import { AskResult, AskStructuredSchema } from "./utils/schema";

const MAX_GENERATION_ATTEMPTS = 3;

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizedKey(value: string) {
  return normalize(value).toLowerCase();
}

function shuffleOptions(options: string[]) {
  const shuffled = [...options];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

function sanitizeQuestions(questions: AskResult): AskResult {
  return questions.map((question) => {
    const options = question.options.map(normalize);
    const correctAnswer = normalize(question.correct_answer);
    const explanation = normalize(question.explanation);
    const matchedCorrectAnswer =
      options.find((option) => normalizedKey(option) === normalizedKey(correctAnswer)) ??
      correctAnswer;

    return {
      question: normalize(question.question),
      options: shuffleOptions(options),
      correct_answer: matchedCorrectAnswer,
      explanation,
    };
  });
}

function validateQuestions(questions: AskResult, expectedSize: number) {
  if (questions.length !== expectedSize) {
    throw new Error(
      `Expected ${expectedSize} questions but received ${questions.length}.`,
    );
  }

  const seenQuestions = new Set<string>();

  questions.forEach((question, index) => {
    const questionKey = normalizedKey(question.question);

    if (seenQuestions.has(questionKey)) {
      throw new Error(`Question ${index + 1} duplicates another generated question.`);
    }
    seenQuestions.add(questionKey);

    if (question.options.length !== 4) {
      throw new Error(`Question ${index + 1} does not have exactly 4 options.`);
    }

    const uniqueOptions = new Set(question.options.map(normalizedKey));
    if (uniqueOptions.size !== question.options.length) {
      throw new Error(`Question ${index + 1} contains duplicate options.`);
    }

    if (
      !question.options.some(
        (option) => normalizedKey(option) === normalizedKey(question.correct_answer),
      )
    ) {
      throw new Error(
        `Question ${index + 1} has a correct answer missing from the options.`,
      );
    }
  });
}

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
