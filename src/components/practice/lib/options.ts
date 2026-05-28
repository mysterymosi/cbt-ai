import type { PracticeQuestion } from "@/components/practice/types";

export function getSortedOptions(question: Pick<PracticeQuestion, "options">) {
  return Object.entries(question.options).sort(([a], [b]) =>
    a.localeCompare(b),
  );
}

export function getQuestionExplanation(question: PracticeQuestion) {
  if (
    question.source_explanation === "" ||
    question.source_explanation === null ||
    question.source_explanation === undefined
  ) {
    return "No explanation is available for this question yet.";
  }
  return question.local_override_explanation ?? question.source_explanation;
}
