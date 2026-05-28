import { z } from "zod"
import { UTME_SUBJECT_VALUES } from "@/lib/constants/subjects"

export const onboardingSchema = z.object({
  name: z.string().min(2),
  subjects: z.array(z.enum(UTME_SUBJECT_VALUES)).min(1),
})
