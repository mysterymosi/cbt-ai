import { fetchAlocQuestions } from "@/components/questions/lib/aloc-client";
import type { PracticeSession } from "@/components/practice/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type QuestionPoolStatus =
  | { ok: true; available: number }
  | { ok: false; reason: "empty" | "aloc_unavailable"; message: string };

export async function countAvailableQuestions({
  subject,
  year,
  excludeIds = [],
}: {
  subject: string;
  year?: number | null;
  excludeIds?: string[];
}) {
  const supabase = await createClient();
  let query = supabase
    .from("questions")
    .select("id", { count: "exact", head: true })
    .eq("exam_type", "utme")
    .eq("subject", subject)
    .eq("is_disabled", false);

  if (year) {
    query = query.eq("year", year);
  }

  if (excludeIds.length) {
    query = query.not("id", "in", `(${excludeIds.join(",")})`);
  }

  const { count, error } = await query;

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function ensureQuestionPoolForSession(
  session: Pick<PracticeSession, "subject" | "year" | "total_questions">,
  excludeIds: string[] = [],
): Promise<QuestionPoolStatus> {
  let available = await countAvailableQuestions({
    subject: session.subject,
    year: session.year,
    excludeIds,
  });

  if (available > 0) {
    return { ok: true, available };
  }

  try {
    const questions = await fetchAlocQuestions({
      subject: session.subject,
      year: session.year ?? undefined,
      count: Math.min(session.total_questions, 40),
    });

    if (questions.length) {
      const admin = createAdminClient();
      await admin.from("questions").upsert(questions, {
        onConflict: "external_source,external_question_id,subject",
      });

      available = await countAvailableQuestions({
        subject: session.subject,
        year: session.year,
        excludeIds,
      });

      if (available > 0) {
        return { ok: true, available };
      }
    }
  } catch {
    return {
      ok: false,
      reason: "aloc_unavailable",
      message:
        "Question bank is empty and we could not reach ALOC. Try another subject or check back later.",
    };
  }

  return {
    ok: false,
    reason: "empty",
    message:
      "No questions are available for this subject yet. Try another subject or remove the year filter.",
  };
}
