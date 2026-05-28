export type ReportIssueType =
  | "question"
  | "option_a"
  | "option_b"
  | "option_c"
  | "option_d"
  | "answer"
  | "solution"
  | "duplicate"
  | "other";

export type QuestionReport = {
  id: string;
  user_id: string;
  question_id: string;
  subject: string;
  session_id: string | null;
  issue_type: ReportIssueType;
  message: string | null;
  status: "open" | "resolved";
  forwarded_to_aloc: boolean;
  created_at: string;
};

export type QuestionReportWithQuestion = QuestionReport & {
  questions: {
    question_text: string;
    external_question_id: string;
  } | null;
};

export const REPORT_ISSUE_LABELS: Record<ReportIssueType, string> = {
  question: "Question text is wrong",
  option_a: "Option A is wrong",
  option_b: "Option B is wrong",
  option_c: "Option C is wrong",
  option_d: "Option D is wrong",
  answer: "Marked answer is wrong",
  solution: "Explanation is wrong",
  duplicate: "Duplicate question",
  other: "Other issue",
};
