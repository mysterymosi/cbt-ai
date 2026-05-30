import type { PracticeAttempt } from "@/components/practice/types";
import {
  mapPracticeQuestion,
  type PracticeQuestionRow,
} from "@/components/questions/lib/map-practice-question";
import { createClient } from "@/lib/supabase/server";

const questionSelect =
  "id, subject, year, question_text, options, correct_answer, source_explanation, local_override_answer, local_override_explanation, raw_payload";

export async function getTutorAccessContext({
  userId,
  sessionId,
  questionId,
}: {
  userId: string;
  sessionId: string;
  questionId: string;
}) {
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("practice_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", userId)
    .maybeSingle();

  if (!session) {
    return null;
  }

  const { data: attempt } = await supabase
    .from("attempts")
    .select("id, question_id, selected_answer, correct_answer, is_correct, created_at")
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle<PracticeAttempt>();

  if (!attempt) {
    return null;
  }

  const { data: questionRow } = await supabase
    .from("questions")
    .select(questionSelect)
    .eq("id", questionId)
    .eq("is_disabled", false)
    .maybeSingle<PracticeQuestionRow>();

  if (!questionRow) {
    return null;
  }

  const question = mapPracticeQuestion(questionRow);

  return { attempt, question };
}
