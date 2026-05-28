export type UtmeSubject =
  | "english"
  | "mathematics"
  | "biology"
  | "chemistry"
  | "physics"
  | "government"
  | "economics"

export const UTME_SUBJECT_VALUES = [
  "english",
  "mathematics",
  "biology",
  "chemistry",
  "physics",
  "government",
  "economics",
] as const

export const UTME_SUBJECTS: Array<{
  label: string
  value: UtmeSubject
  alocSubject: string
}> = [
  { label: "English", value: "english", alocSubject: "english" },
  { label: "Mathematics", value: "mathematics", alocSubject: "mathematics" },
  { label: "Biology", value: "biology", alocSubject: "biology" },
  { label: "Chemistry", value: "chemistry", alocSubject: "chemistry" },
  { label: "Physics", value: "physics", alocSubject: "physics" },
  { label: "Government", value: "government", alocSubject: "government" },
  { label: "Economics", value: "economics", alocSubject: "economics" },
]

export function getSubjectLabel(subject: string) {
  return UTME_SUBJECTS.find((item) => item.value === subject)?.label ?? subject
}
