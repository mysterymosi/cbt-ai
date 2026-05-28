import type { ReportIssueType } from "@/components/reports/types";

export type AdminReportRow = {
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
  questions: {
    question_text: string;
    external_question_id: string;
  } | null;
};

export type AdminQuestionRow = {
  id: string;
  subject: string;
  year: number | null;
  question_text: string;
  correct_answer: string;
  source_explanation: string | null;
  is_disabled: boolean;
  local_override_answer: string | null;
  local_override_explanation: string | null;
  external_question_id: string;
};

export type AdminUsageSummary = {
  messageCount: number;
  tokensIn: number;
  tokensOut: number;
};
