"use client";

import type { Question } from "@/lib/store";

type QuestionPanelProps = {
  currentIndex: number;
  question: Question;
  questionsCount: number;
  selectedAnswer?: string;
  submitted: boolean;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
};

export function QuestionPanel({
  currentIndex,
  question,
  questionsCount,
  selectedAnswer,
  submitted,
  onAnswer,
  onNext,
  onPrevious,
}: QuestionPanelProps) {
  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === questionsCount - 1;

  return (
    <div className="rounded-[28px] bg-stone-50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-500">
            Question {currentIndex + 1} of {questionsCount}
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
            {question.question}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className="rounded-2xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={isLastQuestion}
            className="rounded-2xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {question.options.map((option) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = question.correct_answer === option;
          const isWrongSelection =
            submitted && isSelected && question.correct_answer !== option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (!submitted) {
                  onAnswer(option);
                }
              }}
              className={`rounded-3xl border px-5 py-4 text-left transition ${
                submitted
                  ? isCorrect
                    ? "border-emerald-500 bg-emerald-50 text-emerald-950"
                    : isWrongSelection
                      ? "border-rose-400 bg-rose-50 text-rose-950"
                      : "border-stone-200 bg-white text-stone-700"
                  : isSelected
                    ? "border-amber-400 bg-amber-50 text-stone-950"
                    : "border-stone-200 bg-white text-stone-800 hover:border-stone-300 hover:bg-stone-100"
              }`}
            >
              <span className="block text-base font-medium">{option}</span>
              {submitted && isCorrect ? (
                <span className="mt-2 block text-sm font-medium text-emerald-700">
                  Correct answer
                </span>
              ) : null}
              {submitted && isWrongSelection ? (
                <span className="mt-2 block text-sm font-medium text-rose-700">
                  Your choice
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {submitted ? (
        <div className="mt-6 rounded-3xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
            Explanation
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            {question.explanation}
          </p>
        </div>
      ) : null}
    </div>
  );
}
