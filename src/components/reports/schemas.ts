import { z } from "zod";

export const reportIssueTypes = [
  "question",
  "option_a",
  "option_b",
  "option_c",
  "option_d",
  "answer",
  "solution",
  "duplicate",
  "other",
] as const;

export type ReportIssueType = (typeof reportIssueTypes)[number];

export const reportQuestionSchema = z.object({
  questionId: z.uuid(),
  sessionId: z.uuid(),
  subject: z.string().min(1),
  issueType: z.enum(reportIssueTypes),
  message: z.string().max(1000).optional(),
});
