"use server";

import { redirect } from "next/navigation";
import { ensureQuestionPoolForSession } from "@/components/questions/lib/ensure-pool";
import {
  startPracticeSchema,
  submitAttemptSchema,
} from "@/components/practice/schemas";
import type {
  PracticeQuestion,
  PracticeSession,
} from "@/components/practice/types";
import { generateSessionConceptTags } from "@/components/progress/lib/concept-tags";
import { trackServerEvent } from "@/lib/analytics/track-server";
import { createClient } from "@/lib/supabase/server";

async function getUserOrRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return { supabase, user };
}

function normalizeAnswer(answer: string) {
  return answer.trim().toUpperCase();
}

function computeSessionStats(attempts: Array<{ is_correct: boolean }>) {
  const answered = attempts.length;
  const score = attempts.filter((attempt) => attempt.is_correct).length;
  const accuracy = answered ? Math.round((score / answered) * 10000) / 100 : 0;

  return { score, accuracy, answered };
}

export async function startPracticeSession(formData: FormData) {
  const parsed = startPracticeSchema.safeParse({
    subject: formData.get("subject"),
    year: formData.get("year"),
    count: formData.get("count"),
  });

  if (!parsed.success) {
    redirect("/practice?message=Choose a subject and question count.");
  }

  const { supabase, user } = await getUserOrRedirect();
  const { data: session, error } = await supabase
    .from("practice_sessions")
    .insert({
      user_id: user.id,
      exam_type: "utme",
      subject: parsed.data.subject,
      year: parsed.data.year,
      mode: "practice",
      total_questions: parsed.data.count,
    })
    .select("id")
    .single();

  if (error || !session) {
    redirect(
      `/practice?message=${encodeURIComponent(error?.message ?? "Could not start practice.")}`,
    );
  }

  const poolStatus = await ensureQuestionPoolForSession({
    subject: parsed.data.subject,
    year: parsed.data.year,
    total_questions: parsed.data.count,
  });

  if (!poolStatus.ok) {
    await supabase.from("practice_sessions").delete().eq("id", session.id);
    redirect(`/practice?message=${encodeURIComponent(poolStatus.message)}`);
  }

  redirect(`/practice/${session.id}`);
}

export async function submitAttempt(formData: FormData) {
  const parsed = submitAttemptSchema.safeParse({
    sessionId: formData.get("sessionId"),
    questionId: formData.get("questionId"),
    selectedAnswer: formData.get("selectedAnswer"),
  });

  if (!parsed.success) {
    redirect("/practice?message=Choose an answer before submitting.");
  }

  const { supabase, user } = await getUserOrRedirect();
  const { sessionId, questionId } = parsed.data;

  const { data: session } = await supabase
    .from("practice_sessions")
    .select("id, user_id, total_questions, started_at, completed_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!session || session.completed_at) {
    redirect(`/practice/${sessionId}/summary`);
  }

  const { data: question, error: questionError } = await supabase
    .from("questions")
    .select("id, correct_answer, local_override_answer")
    .eq("id", questionId)
    .eq("is_disabled", false)
    .maybeSingle<
      Pick<PracticeQuestion, "id" | "correct_answer" | "local_override_answer">
    >();

  if (questionError || !question) {
    redirect(`/practice/${sessionId}?message=Question is no longer available.`);
  }

  const correctAnswer = normalizeAnswer(
    question.local_override_answer ?? question.correct_answer,
  );
  const selectedAnswer = normalizeAnswer(parsed.data.selectedAnswer);
  const { error: attemptError } = await supabase.from("attempts").upsert(
    {
      session_id: sessionId,
      user_id: user.id,
      question_id: questionId,
      selected_answer: selectedAnswer,
      correct_answer: correctAnswer,
      is_correct: selectedAnswer === correctAnswer,
      time_spent_seconds: null,
    },
    { onConflict: "session_id,question_id" },
  );

  if (attemptError) {
    redirect(
      `/practice/${sessionId}?message=${encodeURIComponent(attemptError.message)}`,
    );
  }

  await syncSessionProgress(sessionId);
  redirect(`/practice/${sessionId}?question=${questionId}`);
}

async function syncSessionProgress(sessionId: string) {
  const { supabase, user } = await getUserOrRedirect();
  const { data: session } = await supabase
    .from("practice_sessions")
    .select("id, subject, total_questions, started_at, completed_at")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .maybeSingle<
      Pick<
        PracticeSession,
        "id" | "subject" | "total_questions" | "started_at" | "completed_at"
      >
    >();

  if (!session || session.completed_at) {
    return;
  }

  const { data: attempts } = await supabase
    .from("attempts")
    .select("is_correct")
    .eq("session_id", sessionId)
    .eq("user_id", user.id);

  const attemptRows = attempts ?? [];

  if (!attemptRows.length) {
    return;
  }

  const { score, accuracy, answered } = computeSessionStats(attemptRows);
  const isComplete = answered >= session.total_questions;
  const durationSeconds = Math.max(
    1,
    Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000),
  );

  let conceptTags: string[] = [];

  if (isComplete) {
    const { data: missedAttempts } = await supabase
      .from("attempts")
      .select("questions(question_text)")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .eq("is_correct", false)
      .overrideTypes<Array<{ questions: { question_text: string } | null }>>();

    const missedTexts =
      missedAttempts
        ?.map((row) => row.questions?.question_text)
        .filter((text): text is string => Boolean(text)) ?? [];

    conceptTags = await generateSessionConceptTags(
      session.subject,
      missedTexts,
    );
  }

  const { error: updateError } = await supabase
    .from("practice_sessions")
    .update({
      score,
      accuracy,
      ...(isComplete
        ? {
            completed_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            concept_tags: conceptTags,
          }
        : {}),
    })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (updateError || !isComplete) {
    return;
  }

  await trackServerEvent("session_complete", {
    subject: session.subject,
    score,
    accuracy,
  });
}
