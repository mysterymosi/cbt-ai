import { BETA_EXAM_TYPE } from "@/lib/constants/exams"

type AlocOption = {
  option?: string
  answer?: string
  value?: string
}

export type AlocQuestionPayload = {
  id?: string | number
  question?: string
  question_text?: string
  section?: string
  image?: string | null
  option?: Record<string, string> | AlocOption[]
  options?: Record<string, string> | AlocOption[]
  answer?: string
  correct_answer?: string
  solution?: string
  explanation?: string
  year?: string | number | null
  examyear?: string | number | null
  examtype?: string
  [key: string]: unknown
}

export type NormalizedQuestion = {
  external_source: "ALOC"
  external_question_id: string
  exam_type: typeof BETA_EXAM_TYPE
  subject: string
  year: number | null
  question_text: string
  options: Record<string, string>
  correct_answer: string
  source_explanation: string | null
  raw_payload: AlocQuestionPayload
}

function normalizeOptions(
  options: AlocQuestionPayload["option"] | AlocQuestionPayload["options"]
) {
  if (!options) {
    return {}
  }

  if (Array.isArray(options)) {
    return options.reduce<Record<string, string>>((acc, item, index) => {
      const key = item.option?.toUpperCase() ?? String.fromCharCode(65 + index)
      const value = item.answer ?? item.value
      if (value) {
        acc[key] = value
      }
      return acc
    }, {})
  }

  return Object.entries(options).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      acc[key.toUpperCase()] = String(value)
      return acc
    },
    {}
  )
}

function normalizeAnswer(answer?: string) {
  if (!answer) {
    return ""
  }

  const trimmed = answer.trim()
  const optionLetter = trimmed.match(/^[A-D]/i)?.[0]
  return (optionLetter ?? trimmed).toUpperCase()
}

export function normalizeAlocQuestion(
  payload: AlocQuestionPayload,
  subject: string
): NormalizedQuestion {
  const externalId = payload.id?.toString()
  const questionText = payload.question ?? payload.question_text
  const year = payload.year ?? payload.examyear

  if (!externalId || !questionText) {
    throw new Error("ALOC payload is missing question id or text.")
  }

  const correctAnswer = normalizeAnswer(payload.answer ?? payload.correct_answer)

  if (!correctAnswer) {
    throw new Error(`ALOC question ${externalId} is missing an answer.`)
  }

  return {
    external_source: "ALOC",
    external_question_id: externalId,
    exam_type: BETA_EXAM_TYPE,
    subject,
    year: year ? Number(year) : null,
    question_text: questionText,
    options: normalizeOptions(payload.option ?? payload.options),
    correct_answer: correctAnswer,
    source_explanation: payload.solution ?? payload.explanation ?? null,
    raw_payload: payload,
  }
}
