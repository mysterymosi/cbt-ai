import { z } from "zod"
import { UTME_SUBJECT_VALUES } from "@/lib/constants/subjects"

export const syncQuestionsSchema = z.object({
  subjects: z.array(z.enum(UTME_SUBJECT_VALUES)).optional(),
  count: z.number().int().min(1).max(120).optional(),
})
