"use client";

import { useState } from "react";
import { EmptyQuizState } from "@/components/test/EmptyQuizState";
import { QuestionNavigator } from "@/components/test/QuestionNavigator";
import { QuestionPanel } from "@/components/test/QuestionPanel";
import { QuizSidebar } from "@/components/test/QuizSidebar";
import { getProgress, getSummaryTone } from "@/components/test/testPageUtils";
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
    return <EmptyQuizState />;
  }

  const safeCurrentIndex = Math.min(currentIndex, questions.length - 1);
  const currentQuestion = questions[safeCurrentIndex];
  const answeredCount = Object.keys(answers).length;
  const score = getScore();
  const progress = getProgress(answeredCount, questions.length);
  const selectedAnswer = answers[safeCurrentIndex];
  const summaryTone = getSummaryTone(score, questions.length);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#16120d_0%,#241b13_35%,#f3ead9_35%,#f6efe3_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <QuizSidebar
          answeredCount={answeredCount}
          config={config}
          progress={progress}
          questionsCount={questions.length}
          score={score}
          submitted={submitted}
          summaryTone={summaryTone}
          onClear={clearQuestions}
          onReset={resetAnswers}
          onSubmit={submitTest}
        />

        <section className="flex-1 rounded-[32px] border border-stone-900/10 bg-white/85 p-4 shadow-[0_24px_80px_rgba(48,37,22,0.12)] backdrop-blur sm:p-6">
          <QuestionPanel
            currentIndex={safeCurrentIndex}
            question={currentQuestion}
            questionsCount={questions.length}
            selectedAnswer={selectedAnswer}
            submitted={submitted}
            onAnswer={(answer) => setAnswer(safeCurrentIndex, answer)}
            onNext={() =>
              setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
            }
            onPrevious={() =>
              setCurrentIndex((index) => Math.max(index - 1, 0))
            }
          />

          <QuestionNavigator
            answers={answers}
            currentIndex={safeCurrentIndex}
            questions={questions}
            submitted={submitted}
            onSelect={setCurrentIndex}
          />
        </section>
      </div>
    </main>
  );
}
