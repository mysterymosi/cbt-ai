import { getQuestionExplanation } from "@/components/practice/lib/options";
import type { PracticeAttempt, PracticeQuestion } from "@/components/practice/types";
import type { TutorContext } from "@/components/tutor/types";

export function buildTutorContext(
  question: PracticeQuestion,
  attempt: PracticeAttempt,
): TutorContext {
  return {
    exam_type: "utme",
    subject: question.subject,
    year: question.year ? String(question.year) : null,
    question_id: question.id,
    question: question.question_text,
    options: question.options,
    correct_answer: attempt.correct_answer,
    student_answer: attempt.selected_answer,
    is_correct: attempt.is_correct,
    source_explanation: getQuestionExplanation(question),
    mode: "post_answer_explanation",
  };
}

export function formatTutorContextBlock(context: TutorContext) {
  const options = Object.entries(context.options)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}. ${value}`)
    .join("\n");

  return [
    `Exam: ${context.exam_type.toUpperCase()}`,
    `Subject: ${context.subject}`,
    context.year ? `Year: ${context.year}` : null,
    `Question ID: ${context.question_id}`,
    `Question:\n${context.question}`,
    `Options:\n${options}`,
    `Student answer: ${context.student_answer}`,
    `Correct answer: ${context.correct_answer}`,
    `Result: ${context.is_correct ? "Correct" : "Incorrect"}`,
    `Source explanation:\n${context.source_explanation}`,
    `Mode: ${context.mode}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
