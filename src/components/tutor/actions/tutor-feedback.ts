"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const tutorFeedbackSchema = z.object({
  sessionId: z.uuid(),
  questionId: z.uuid(),
  rating: z.enum(["up", "down"]),
});

export async function submitTutorFeedback(input: {
  sessionId: string;
  questionId: string;
  rating: "up" | "down";
}) {
  const parsed = tutorFeedbackSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false as const, error: "Invalid feedback." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false as const, error: "Unauthorized." };
  }

  const { error } = await supabase.from("tutor_feedback").upsert(
    {
      user_id: user.id,
      session_id: parsed.data.sessionId,
      question_id: parsed.data.questionId,
      rating: parsed.data.rating,
    },
    { onConflict: "user_id,session_id,question_id" },
  );

  if (error) {
    return { ok: false as const, error: error.message };
  }

  revalidatePath(`/practice/${parsed.data.sessionId}`);
  return { ok: true as const };
}

export async function getTutorFeedbackRating({
  sessionId,
  questionId,
}: {
  sessionId: string;
  questionId: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("tutor_feedback")
    .select("rating")
    .eq("user_id", user.id)
    .eq("session_id", sessionId)
    .eq("question_id", questionId)
    .maybeSingle<{ rating: "up" | "down" }>();

  return data?.rating ?? null;
}
