"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTestStore, type Difficulty } from "@/lib/store";

const difficultyOptions: Difficulty[] = ["easy", "medium", "hard"];

export default function Home() {
  const { setQuestions } = useTestStore();
  const [query, setQuery] = useState("");
  const [size, setSize] = useState(5);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError(
        "Enter a topic, company, concept, or role to generate questions.",
      );
      return;
    }

    if (trimmedQuery.length > 20) {
      setError("Topic must be 20 characters or fewer.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: trimmedQuery, size, difficulty }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to generate quiz.");
      }

      if (!Array.isArray(data?.questions) || data.questions.length === 0) {
        throw new Error(
          "No questions were generated. Try a more specific topic.",
        );
      }

      setQuestions(data.questions, {
        query: data?.meta?.query ?? trimmedQuery,
        size: data?.meta?.size ?? size,
        difficulty: data?.meta?.difficulty ?? difficulty,
        createdAt: data?.meta?.generatedAt ?? null,
      });
      router.push("/test");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff6d8_0%,#f5efe2_35%,#efe6d5_100%)] px-4 py-10 text-stone-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row">
        <section className="flex-1 rounded-[32px] border border-stone-900/10 bg-white/80 p-8 shadow-[0_20px_80px_rgba(70,46,22,0.12)] backdrop-blur">
          <div className="inline-flex rounded-full border border-amber-500/30 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-900">
            AI Prep Studio
          </div>
          <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Generate a sharper practice test in a few seconds.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">
            Build interview-style MCQs for any topic, tune the difficulty, and
            review explanations question by question.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-500">
                Custom topics
              </p>
              <p className="mt-2 text-2xl font-semibold">Any subject</p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-500">Difficulty</p>
              <p className="mt-2 text-2xl font-semibold">Easy to hard</p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-medium text-stone-500">Review mode</p>
              <p className="mt-2 text-2xl font-semibold">Instant feedback</p>
            </div>
          </div>
        </section>

        <section className="w-full rounded-[32px] border border-stone-900/10 bg-stone-950 p-6 text-white shadow-[0_20px_80px_rgba(20,20,20,0.22)] lg:max-w-xl">
          <div className="rounded-[28px] bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create your quiz
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              Pick a topic, choose the number of questions, and start
              practicing.
            </p>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-stone-200">
                  Topic
                </span>
                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Examples: React hooks, system design, SQL joins, Node.js event loop..."
                  className="min-h-32 w-full rounded-3xl border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-400 focus:border-amber-300 focus:bg-white/12"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-200">
                    Questions
                  </span>
                  <input
                    type="range"
                    min={3}
                    max={15}
                    step={1}
                    value={size}
                    onChange={(event) => setSize(Number(event.target.value))}
                    className="w-full accent-amber-300"
                  />
                  <div className="mt-2 flex items-center justify-between text-sm text-stone-300">
                    <span>3</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 font-medium text-white">
                      {size}
                    </span>
                    <span>15</span>
                  </div>
                </label>

                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-stone-200">
                    Difficulty
                  </legend>
                  <div className="grid gap-2">
                    {difficultyOptions.map((level) => {
                      const active = difficulty === level;

                      return (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setDifficulty(level)}
                          className={`rounded-2xl border px-4 py-3 text-left text-sm capitalize transition ${
                            active
                              ? "border-amber-300 bg-amber-200 text-stone-950"
                              : "border-white/10 bg-white/5 text-stone-200 hover:bg-white/10"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-amber-300 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Generating your quiz..." : "Start practice test"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
