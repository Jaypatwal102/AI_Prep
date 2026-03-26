import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Question = {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export type TestConfig = {
  query: string;
  size: number;
  difficulty: Difficulty;
  createdAt: string | null;
};

type TestStore = {
  questions: Question[];
  answers: Record<number, string>;
  submitted: boolean;
  config: TestConfig;
  setQuestions: (questions: Question[], config?: Partial<TestConfig>) => void;
  setAnswer: (index: number, answer: string) => void;
  submitTest: () => void;
  resetAnswers: () => void;
  clearQuestions: () => void;
  getScore: () => number;
};

const defaultConfig: TestConfig = {
  query: "",
  size: 5,
  difficulty: "easy",
  createdAt: null,
};

export const useTestStore = create<TestStore>()(
  persist(
    (set, get) => ({
      questions: [],
      answers: {},
      submitted: false,
      config: defaultConfig,
      setQuestions: (questions, config = {}) =>
        set({
          questions,
          answers: {},
          submitted: false,
          config: {
            ...defaultConfig,
            ...config,
            difficulty: config.difficulty ?? defaultConfig.difficulty,
            createdAt: new Date().toISOString(),
          },
        }),
      setAnswer: (index, answer) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [index]: answer,
          },
        })),
      submitTest: () => set({ submitted: true }),
      resetAnswers: () => set({ answers: {}, submitted: false }),
      clearQuestions: () =>
        set({
          questions: [],
          answers: {},
          submitted: false,
          config: defaultConfig,
        }),
      getScore: () =>
        get().questions.reduce((score, question, index) => {
          return get().answers[index] === question.correct_answer
            ? score + 1
            : score;
        }, 0),
    }),
    {
      name: "test-storage",
    },
  ),
);
