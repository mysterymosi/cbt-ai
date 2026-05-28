import { UTME_SUBJECTS, type UtmeSubject } from "@/lib/constants/subjects"

export function toAlocSubject(subject: UtmeSubject | string) {
  const match = UTME_SUBJECTS.find((item) => item.value === subject)

  if (!match) {
    throw new Error(`Unsupported UTME beta subject: ${subject}`)
  }

  return match.alocSubject
}
