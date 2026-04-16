"use client";

import Link from "next/link";

export function EmptyQuizState() {
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
