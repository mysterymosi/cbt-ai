import type { Json } from "@/types/database";

export type PracticeSession = {
  id: string;
  subject: string;
  year: number | null;
  total_questions: number;
  started_at: string;
  completed_at: string | null;
  score: number | null;
  accuracy: number | null;
  duration_seconds: number | null;
  concept_tags: string[];
};

export type PracticeQuestion = {
  id: string;
  subject: string;
  year: number | null;
  question_text: string;
  options: Record<string, string>;
  correct_answer: string;
  source_explanation: string | null;
  local_override_answer: string | null;
  local_override_explanation: string | null;
  section: string | null;
};

export type PracticeAttempt = {
  id: string;
  question_id: string;
  selected_answer: string;
  correct_answer: string;
  is_correct: boolean;
  created_at: string;
};

export type PracticeAttemptWithQuestion = PracticeAttempt & {
  questions: Pick<PracticeQuestion, "id" | "question_text" | "year"> | null;
};

export type PracticeHistoryItem = PracticeSession & {
  attempts: { count: number }[];
};

export type PracticeOptionMap = Json & Record<string, string>;
