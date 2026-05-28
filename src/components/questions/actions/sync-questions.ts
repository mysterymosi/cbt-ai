import { fetchAlocQuestions } from "@/components/questions/lib/aloc-client";
import { UTME_SUBJECTS } from "@/lib/constants/subjects";
import { createAdminClient } from "@/lib/supabase/admin";

export async function syncUtmeQuestions(
  subjects = UTME_SUBJECTS.map((subject) => subject.value),
  count = 100,
) {
  const supabase = createAdminClient();
  const results: Array<{ subject: string; upserted: number; error?: string }> =
    [];

  for (const subject of subjects) {
    try {
      const questions = await fetchAlocQuestions({ subject, count });

      if (!questions.length) {
        results.push({ subject, upserted: 0 });
        continue;
      }

      const { error } = await supabase.from("questions").upsert(questions, {
        onConflict: "external_source,external_question_id,subject",
      });

      if (error) {
        throw error;
      }

      results.push({ subject, upserted: questions.length });
    } catch (error) {
      results.push({
        subject,
        upserted: 0,
        error: error instanceof Error ? error.message : "Unknown sync error",
      });
    }
  }

  return results;
}
