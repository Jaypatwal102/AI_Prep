"use client";

import type { Question } from "@/lib/store";

type QuestionNavigatorProps = {
  answers: Record<number, string>;
  currentIndex: number;
  questions: Question[];
  submitted: boolean;
  onSelect: (index: number) => void;
};

export function QuestionNavigator({
  answers,
  currentIndex,
  questions,
  submitted,
  onSelect,
}: QuestionNavigatorProps) {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
      {questions.map((question, index) => {
        const answered = Boolean(answers[index]);
        const active = currentIndex === index;
        const correct = submitted && answers[index] === question.correct_answer;
        const incorrect =
          submitted && answers[index] && answers[index] !== question.correct_answer;

        return (
          <button
            key={`${question.question}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`aspect-square rounded-2xl text-sm font-semibold transition ${
              active
                ? "bg-stone-950 text-white"
                : submitted && correct
                  ? "bg-emerald-100 text-emerald-900"
                  : submitted && incorrect
                    ? "bg-rose-100 text-rose-900"
                    : answered
                      ? "bg-amber-100 text-amber-900"
                      : "bg-stone-100 text-stone-500"
            }`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
