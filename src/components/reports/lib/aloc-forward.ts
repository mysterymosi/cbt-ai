import { toAlocSubject } from "@/components/questions/lib/map-exam-subject";
import type { ReportIssueType } from "@/components/reports/schemas";
import { env } from "@/env";

const ALOC_REPORT_URL = "https://questions.aloc.com.ng/api/r";

/**
 * ALOC report `type` values:
 * https://github.com/Seunope/aloc-endpoints/wiki/API-Parameters#report-questions
 * 1 Question, 2 Option A, 3 Option B, 4 Option C, 5 Option D, 6 Answer, 7 Solution
 */
const ISSUE_TYPE_TO_ALOC: Record<ReportIssueType, number> = {
  question: 1,
  option_a: 2,
  option_b: 3,
  option_c: 4,
  option_d: 5,
  answer: 6,
  solution: 7,
  duplicate: 1,
  other: 1,
};

export async function forwardReportToAloc({
  fullName,
  subject,
  externalQuestionId,
  issueType,
  message,
}: {
  fullName: string;
  subject: string;
  externalQuestionId: string;
  issueType: ReportIssueType;
  message?: string;
}) {
  if (!env.ALOC_ACCESS_TOKEN) {
    return { ok: false as const, error: "ALOC token not configured." };
  }

  const trimmedMessage = message?.trim();
  const alocMessage =
    issueType === "duplicate"
      ? `[Duplicate question] ${trimmedMessage || "Reported via ExamAITutor"}`
      : trimmedMessage || "Reported via ExamAITutor";

  const body = new URLSearchParams({
    full_name: fullName,
    message: alocMessage,
    subject: toAlocSubject(subject),
    question_id: externalQuestionId,
    type: String(ISSUE_TYPE_TO_ALOC[issueType]),
  });

  const response = await fetch(ALOC_REPORT_URL, {
    method: "POST",
    headers: {
      AccessToken: env.ALOC_ACCESS_TOKEN,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    return {
      ok: false as const,
      error: detail
        ? `ALOC report failed (${response.status}): ${detail.slice(0, 200)}`
        : `ALOC report failed with status ${response.status}.`,
    };
  }

  return { ok: true as const };
}
