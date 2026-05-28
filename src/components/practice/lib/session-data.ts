import { redirect } from "next/navigation";
import { ensureQuestionPoolForSession } from "@/components/questions/lib/ensure-pool";
import type {
  PracticeAttempt,
  PracticeAttemptWithQuestion,
  PracticeQuestion,
  PracticeSession,
} from "@/components/practice/types";
import { buildPracticeRecommendation } from "@/components/progress/lib/recommendations";
import { parseConceptTags } from "@/components/progress/lib/concept-tags";
import type { PracticeRecommendation } from "@/components/progress/types";
import { createClient } from "@/lib/supabase/server";

const sessionSelect =
  "id, subject, year, total_questions, started_at, completed_at, score, accuracy, duration_seconds, concept_tags";
const attemptSelect =
  "id, question_id, selected_answer, correct_answer, is_correct, created_at";
const attemptWithQuestionSelect =
  "id, question_id, selected_answer, correct_answer, is_correct, created_at, questions(id, question_text, year)";
const questionSelect =
  "id, subject, year, question_text, options, correct_answer, source_explanation, local_override_answer, local_override_explanation";

export type PracticeSessionState = {
  session: PracticeSession;
  attempts: PracticeAttempt[];
  currentAttempt: PracticeAttempt | null;
  currentQuestion: PracticeQuestion | null;
  progress: number;
  poolError: string | null;
  isFirstEverAttempt: boolean;
};

export type PracticeSummaryState = {
  session: PracticeSession;
  attempts: PracticeAttemptWithQuestion[];
  missed: PracticeAttemptWithQuestion[];
  score: number;
  answered: number;
  accuracy: number;
  conceptTags: string[];
  recommendation: PracticeRecommendation;
};

export async function getPracticeSessionState({
  sessionId,
  questionId,
}: {
  sessionId: string;
  questionId?: string;
}): Promise<PracticeSessionState> {
  const { userId, session } = await getOwnedPracticeSession(sessionId);
  const attempts = await getPracticeAttempts(sessionId, userId);

  const currentAttempt = questionId
    ? await getAttemptForQuestion(sessionId, userId, questionId)
    : null;

  if (session.completed_at && !currentAttempt) {
    redirect(`/practice/${sessionId}/summary`);
  }

  const attemptedQuestionIds = attempts.map((attempt) => attempt.question_id);
  let currentQuestion = questionId
    ? await getQuestionById(questionId)
    : await getNextQuestion(session, attemptedQuestionIds);

  if (!currentQuestion && !questionId) {
    const poolStatus = await ensureQuestionPoolForSession(
      session,
      attemptedQuestionIds,
    );

    if (!poolStatus.ok) {
      const totalAttempts = await getUserAttemptCount(userId);

      return {
        session,
        attempts,
        currentAttempt,
        currentQuestion: null,
        progress: Math.min(attempts.length, session.total_questions),
        poolError: poolStatus.message,
        isFirstEverAttempt: totalAttempts === 1 && Boolean(currentAttempt),
      };
    }

    currentQuestion = await getNextQuestion(session, attemptedQuestionIds);
  }

  if (!currentQuestion) {
    if (attempts.length >= session.total_questions) {
      redirect(`/practice/${sessionId}/summary`);
    }

    const totalAttempts = await getUserAttemptCount(userId);

    return {
      session,
      attempts,
      currentAttempt,
      currentQuestion: null,
      progress: Math.min(attempts.length, session.total_questions),
      poolError:
        "No questions are available for this session. Try another subject or remove the year filter.",
      isFirstEverAttempt: totalAttempts === 1 && Boolean(currentAttempt),
    };
  }

  const totalAttempts = await getUserAttemptCount(userId);

  return {
    session,
    attempts,
    currentAttempt,
    currentQuestion,
    progress: Math.min(attempts.length, session.total_questions),
    poolError: null,
    isFirstEverAttempt: totalAttempts === 1 && Boolean(currentAttempt),
  };
}

export async function getPracticeSummaryState(
  sessionId: string,
): Promise<PracticeSummaryState> {
  const { userId, session } = await getOwnedPracticeSession(sessionId);
  const attempts = await getPracticeAttemptsWithQuestions(sessionId, userId);
  const answered = attempts.length;
  const score =
    session.score ?? attempts.filter((attempt) => attempt.is_correct).length;
  const accuracy =
    session.accuracy ??
    (answered ? Math.round((score / answered) * 10000) / 100 : 0);
  const missed = attempts.filter((attempt) => !attempt.is_correct);
  const conceptTags = session.concept_tags;
  const weakestSubject = missed.length > 0 ? session.subject : null;

  return {
    session,
    attempts,
    missed,
    score,
    answered,
    accuracy,
    conceptTags,
    recommendation: buildPracticeRecommendation({
      sessionSubject: session.subject,
      weakestSubject,
      conceptTags,
    }),
  };
}

async function getUserAttemptCount(userId: string) {
  const supabase = await createClient();
  const { count } = await supabase
    .from("attempts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  return count ?? 0;
}

async function getOwnedPracticeSession(sessionId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: session } = await supabase
    .from("practice_sessions")
    .select(sessionSelect)
    .eq("id", sessionId)
    .eq("user_id", user!.id)
    .maybeSingle<PracticeSession>();

  if (!session) {
    redirect("/practice?message=Practice session not found.");
  }

  return {
    userId: user!.id,
    session: {
      ...session,
      concept_tags: parseConceptTags(session.concept_tags),
    },
  };
}

async function getPracticeAttempts(sessionId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("attempts")
    .select(attemptSelect)
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .overrideTypes<PracticeAttempt[]>();

  return data ?? [];
}

async function getPracticeAttemptsWithQuestions(
  sessionId: string,
  userId: string,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("attempts")
    .select(attemptWithQuestionSelect)
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .overrideTypes<PracticeAttemptWithQuestion[]>();

  return data ?? [];
}

async function getAttemptForQuestion(
  sessionId: string,
  userId: string,
  questionId: string,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("attempts")
    .select(attemptSelect)
    .eq("session_id", sessionId)
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle<PracticeAttempt>();

  return data;
}

async function getQuestionById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select(questionSelect)
    .eq("id", id)
    .eq("is_disabled", false)
    .maybeSingle<PracticeQuestion>();

  return data;
}

async function getNextQuestion(
  session: PracticeSession,
  attemptedQuestionIds: string[],
) {
  const supabase = await createClient();
  let query = supabase
    .from("questions")
    .select(questionSelect)
    .eq("exam_type", "utme")
    .eq("subject", session.subject)
    .eq("is_disabled", false)
    .order("created_at", { ascending: false })
    .limit(1);

  if (session.year) {
    query = query.eq("year", session.year);
  }

  if (attemptedQuestionIds.length) {
    query = query.not("id", "in", `(${attemptedQuestionIds.join(",")})`);
  }

  const { data } = await query.overrideTypes<PracticeQuestion[]>();
  return data?.[0] ?? null;
}
