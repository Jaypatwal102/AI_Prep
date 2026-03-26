"use client";

import Link from "next/link";
import { useState } from "react";
import { useTestStore } from "@/lib/store";

export default function TestPage() {
  const {
    answers,
    clearQuestions,
    config,
    getScore,
    questions,
    resetAnswers,
    setAnswer,
    submitted,
    submitTest,
  } = useTestStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!questions.length) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-stone-950 px-4 py-10 text-white">
        <div className="w-full max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
          <p className="text-sm uppercase tracking-[0.24em] text-stone-400">
            No active quiz
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Generate a quiz to begin.
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-300">
            Your practice questions will appear here after you create a test.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950"
          >
            Back to generator
          </Link>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const score = getScore();
  const progress = Math.round((answeredCount / questions.length) * 100);
  const selectedAnswer = answers[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const ratio = score / questions.length;
  const summaryTone =
    ratio >= 0.8 ? "Excellent work" : ratio >= 0.6 ? "Strong attempt" : "Good start";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#16120d_0%,#241b13_35%,#f3ead9_35%,#f6efe3_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <aside className="w-full rounded-[32px] border border-white/10 bg-stone-950 p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:sticky lg:top-6 lg:max-w-sm lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
            Active quiz
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance">
            {config.query || "Practice test"}
          </h1>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-stone-400">Questions</p>
              <p className="mt-2 text-2xl font-semibold">{questions.length}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <p className="text-stone-400">Difficulty</p>
              <p className="mt-2 text-2xl font-semibold capitalize">
                {config.difficulty}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-stone-300">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-3 rounded-full bg-white/10">
              <div
                className="h-3 rounded-full bg-amber-300 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-stone-400">
              {answeredCount} of {questions.length} answered
            </p>
          </div>

          {submitted ? (
            <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
              <p className="text-sm font-medium text-emerald-100">{summaryTone}</p>
              <p className="mt-2 text-4xl font-semibold text-white">
                {score}/{questions.length}
              </p>
              <p className="mt-2 text-sm leading-6 text-stone-200">
                Review each answer below to see the correct choice and explanation.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-6 text-stone-300">
                Answer all questions you can, then submit to see your score and
                explanations.
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={resetAnswers}
                className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950"
              >
                Retry quiz
              </button>
            ) : (
              <button
                type="button"
                onClick={submitTest}
                disabled={answeredCount === 0}
                className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Submit answers
              </button>
            )}

            <button
              type="button"
              onClick={clearQuestions}
              className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white"
            >
              Clear quiz
            </button>
          </div>
        </aside>

        <section className="flex-1 rounded-[32px] border border-stone-900/10 bg-white/85 p-4 shadow-[0_24px_80px_rgba(48,37,22,0.12)] backdrop-blur sm:p-6">
          <div className="rounded-[28px] bg-stone-50 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-stone-500">
                  Question {currentIndex + 1} of {questions.length}
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  {currentQuestion.question}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((index) => Math.max(index - 1, 0))}
                  disabled={currentIndex === 0}
                  className="rounded-2xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentIndex((index) =>
                      Math.min(index + 1, questions.length - 1),
                    )
                  }
                  disabled={isLastQuestion}
                  className="rounded-2xl border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = currentQuestion.correct_answer === option;
                const isWrongSelection =
                  submitted && isSelected && currentQuestion.correct_answer !== option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => !submitted && setAnswer(currentIndex, option)}
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
                  {currentQuestion.explanation}
                </p>
              </div>
            ) : null}
          </div>

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
                  onClick={() => setCurrentIndex(index)}
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
        </section>
      </div>
    </main>
  );
}
