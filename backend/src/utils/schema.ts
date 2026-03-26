import { z } from "zod";

const normalized = (value: string) => value.trim().toLowerCase();

export const MCQSchema = z
  .object({
    question: z.string().min(1),
    options: z
      .array(z.string().min(1))
      .length(4)
      .refine(
        (options) => new Set(options.map(normalized)).size === options.length,
        "Each question must have 4 unique options.",
      ),
    correct_answer: z.string().min(1),
    explanation: z.string().min(1),
  })
  .refine(
    (question) =>
      question.options.some(
        (option) => normalized(option) === normalized(question.correct_answer),
      ),
    "correct_answer must match one of the options exactly.",
  );

export const AskResultSchema = z
  .array(MCQSchema)
  .min(1)
  .refine(
    (questions) =>
      new Set(questions.map((question) => normalized(question.question))).size ===
      questions.length,
    "Questions must be unique within a quiz.",
  );

export const AskStructuredSchema = z.object({
  questions: AskResultSchema,
});

export const AskResponseSchema = z.object({
  questions: AskResultSchema,
  meta: z.object({
    query: z.string().min(1),
    size: z.number().int().positive(),
    difficulty: z.string().min(1),
    generatedAt: z.string().min(1),
  }),
});

export type AskResult = z.infer<typeof AskResultSchema>;
export type AskResponse = z.infer<typeof AskResponseSchema>;
