export function getProgress(answeredCount: number, totalQuestions: number) {
  if (totalQuestions === 0) {
    return 0;
  }

  return Math.round((answeredCount / totalQuestions) * 100);
}

export function getSummaryTone(score: number, totalQuestions: number) {
  if (totalQuestions === 0) {
    return "Ready when you are";
  }

  const ratio = score / totalQuestions;

  if (ratio >= 0.8) {
    return "Excellent work";
  }

  if (ratio >= 0.6) {
    return "Strong attempt";
  }

  return "Good start";
}
