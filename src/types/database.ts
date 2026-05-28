export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Profile = {
  id: string
  name: string | null
  role: "student" | "admin"
  target_exam: "utme"
  selected_subjects: string[]
  created_at: string
  updated_at: string
  last_active_at: string | null
}

export type Question = {
  id: string
  external_source: "ALOC"
  external_question_id: string
  exam_type: "utme"
  subject: string
  year: number | null
  question_text: string
  options: Record<string, string>
  correct_answer: string
  source_explanation: string | null
  raw_payload: Json
  is_disabled: boolean
  local_override_answer: string | null
  local_override_explanation: string | null
  created_at: string
  updated_at: string
}
