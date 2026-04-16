import type { AskResult } from "../utils/schema";

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

export function sanitizeQuestions(questions: AskResult): AskResult {
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

export function validateQuestions(questions: AskResult, expectedSize: number) {
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
