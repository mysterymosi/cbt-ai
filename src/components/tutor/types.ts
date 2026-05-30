import type { UIMessage } from "ai";
import type { PracticeAttempt, PracticeQuestion } from "@/components/practice/types";

export type TutorContext = {
  exam_type: "utme";
  subject: string;
  year: string | null;
  question_id: string;
  section: string | null;
  question: string;
  options: Record<string, string>;
  correct_answer: string;
  student_answer: string;
  is_correct: boolean;
  source_explanation: string;
  mode: "post_answer_explanation";
};

export type StoredTutorMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type TutorThreadState = {
  messages: UIMessage[];
  messagesUsedToday: number;
  dailyLimit: number;
};

export type TutorPanelProps = {
  sessionId: string;
  question: PracticeQuestion;
  attempt: PracticeAttempt;
  initialThread: TutorThreadState;
  feedbackRating?: "up" | "down" | null;
};

export const TUTOR_QUICK_ACTIONS = [
  { label: "Explain simply", prompt: "Explain this question in simple steps." },
  {
    label: "Why was I wrong?",
    prompt: "Why was my answer wrong, and how do I reach the correct answer?",
  },
  {
    label: "What topic is this?",
    prompt: "What UTME topic does this question test?",
  },
  {
    label: "Similar question",
    prompt: "Describe a similar practice question I could try for this topic.",
  },
] as const;
