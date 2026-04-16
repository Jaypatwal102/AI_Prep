"use client";

import type { TestConfig } from "@/lib/store";

type QuizSidebarProps = {
  answeredCount: number;
  config: TestConfig;
  progress: number;
  questionsCount: number;
  score: number;
  submitted: boolean;
  summaryTone: string;
  onClear: () => void;
  onReset: () => void;
  onSubmit: () => void;
};

export function QuizSidebar({
  answeredCount,
  config,
  progress,
  questionsCount,
  score,
  submitted,
  summaryTone,
  onClear,
  onReset,
  onSubmit,
}: QuizSidebarProps) {
  return (
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
          <p className="mt-2 text-2xl font-semibold">{questionsCount}</p>
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
          {answeredCount} of {questionsCount} answered
        </p>
      </div>

      {submitted ? (
        <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-5">
          <p className="text-sm font-medium text-emerald-100">{summaryTone}</p>
          <p className="mt-2 text-4xl font-semibold text-white">
            {score}/{questionsCount}
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
            onClick={onReset}
            className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950"
          >
            Retry quiz
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={answeredCount === 0}
            className="rounded-2xl bg-amber-300 px-4 py-3 text-sm font-semibold text-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Submit answers
          </button>
        )}

        <button
          type="button"
          onClick={onClear}
          className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white"
        >
          Clear quiz
        </button>
      </div>
    </aside>
  );
}
