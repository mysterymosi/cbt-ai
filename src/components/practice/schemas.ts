import { z } from "zod";
import { UTME_SUBJECT_VALUES } from "@/lib/constants/subjects";

export const practiceCounts = [10, 20, 40] as const;

export const startPracticeSchema = z.object({
  subject: z.enum(UTME_SUBJECT_VALUES),
  year: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? Number(value) : null))
    .refine((value) => value === null || Number.isInteger(value), {
      message: "Choose a valid year.",
    }),
  count: z.coerce.number().int().refine((value) => practiceCounts.includes(value as typeof practiceCounts[number]), {
    message: "Choose 10, 20, or 40 questions.",
  }),
});

export const submitAttemptSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedAnswer: z.string().trim().min(1),
});
