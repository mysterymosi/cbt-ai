import type {
  DashboardProgress,
  MissedReviewItem,
  SubjectAccuracy,
} from "@/components/progress/types";
import { getSubjectLabel } from "@/lib/constants/subjects";
import { createClient } from "@/lib/supabase/server";

const MIN_ATTEMPTS_FOR_WEAKNESS = 3;

type AttemptRow = {
  id: string;
  is_correct: boolean;
  created_at: string;
  question_id: string;
  selected_answer: string;
  correct_answer: string;
  session_id: string;
  practice_sessions: { subject: string } | null;
  questions: { question_text: string } | null;
};

function computeStreak(completedAtValues: string[]) {
  const dayKeys = new Set(completedAtValues.map((value) => value.slice(0, 10)));

  let streak = 0;
  const cursor = new Date();

  for (let index = 0; index < 365; index++) {
    const key = cursor.toISOString().slice(0, 10);

    if (dayKeys.has(key)) {
      streak++;
      cursor.setUTCDate(cursor.getUTCDate() - 1);
      continue;
    }

    if (index === 0) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
      continue;
    }

    break;
  }

  return streak;
}

function buildSubjectAccuracies(attempts: AttemptRow[]): SubjectAccuracy[] {
  const bySubject = new Map<string, { correct: number; total: number }>();

  for (const attempt of attempts) {
    const subject = attempt.practice_sessions?.subject;

    if (!subject) {
      continue;
    }

    const current = bySubject.get(subject) ?? { correct: 0, total: 0 };
    current.total++;
    if (attempt.is_correct) {
      current.correct++;
    }
    bySubject.set(subject, current);
  }

  return [...bySubject.entries()]
    .map(([subject, stats]) => ({
      subject,
      correct: stats.correct,
      total: stats.total,
      accuracy: stats.total
        ? Math.round((stats.correct / stats.total) * 10000) / 100
        : 0,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);
}

function pickWeakestSubject(accuracies: SubjectAccuracy[]) {
  const qualified = accuracies.filter(
    (item) => item.total >= MIN_ATTEMPTS_FOR_WEAKNESS,
  );

  if (qualified.length) {
    return qualified[0];
  }

  return accuracies[0] ?? null;
}

function pickStrongestSubject(accuracies: SubjectAccuracy[]) {
  if (!accuracies.length) {
    return null;
  }

  return accuracies[accuracies.length - 1];
}

function buildInsightMessage(
  weakest: SubjectAccuracy | null,
  strongest: SubjectAccuracy | null,
) {
  if (weakest && strongest && weakest.subject !== strongest.subject) {
    return `You're getting stronger in ${getSubjectLabel(strongest.subject)}. Focus your next set on ${getSubjectLabel(weakest.subject)}.`;
  }

  if (weakest) {
    return `Keep building confidence in ${getSubjectLabel(weakest.subject)} with short, focused practice.`;
  }

  return "Complete a practice set to start tracking your strengths and weak areas.";
}

function mapMissedAttempts(attempts: AttemptRow[]): MissedReviewItem[] {
  return attempts
    .filter((attempt) => !attempt.is_correct)
    .map((attempt) => ({
      attemptId: attempt.id,
      sessionId: attempt.session_id,
      questionId: attempt.question_id,
      questionText: attempt.questions?.question_text ?? "Question",
      subject: attempt.practice_sessions?.subject ?? "unknown",
      selectedAnswer: attempt.selected_answer,
      correctAnswer: attempt.correct_answer,
      createdAt: attempt.created_at,
    }));
}

export async function getDashboardProgress(
  userId: string,
): Promise<DashboardProgress> {
  const supabase = await createClient();

  const { data: completedSessions } = await supabase
    .from("practice_sessions")
    .select("id, subject, score, total_questions, accuracy, completed_at")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false });

  const completed = completedSessions ?? [];
  const streakDays = computeStreak(
    completed.map((session) => session.completed_at!).filter(Boolean),
  );

  const recentSession = completed[0]
    ? {
        subject: completed[0].subject,
        score: completed[0].score ?? 0,
        totalQuestions: completed[0].total_questions,
        accuracy: completed[0].accuracy ?? 0,
        completedAt: completed[0].completed_at!,
      }
    : null;

  const { data: incomplete } = await supabase
    .from("practice_sessions")
    .select("id, subject, total_questions")
    .eq("user_id", userId)
    .is("completed_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let incompleteSession = null;

  if (incomplete) {
    const { count } = await supabase
      .from("attempts")
      .select("id", { count: "exact", head: true })
      .eq("session_id", incomplete.id)
      .eq("user_id", userId);

    incompleteSession = {
      id: incomplete.id,
      subject: incomplete.subject,
      progress: count ?? 0,
      totalQuestions: incomplete.total_questions,
    };
  }

  const { data: attemptRows } = await supabase
    .from("attempts")
    .select(
      "id, is_correct, created_at, question_id, selected_answer, correct_answer, session_id, practice_sessions(subject), questions(question_text)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<AttemptRow[]>();

  const attempts = attemptRows ?? [];
  const subjectAccuracies = buildSubjectAccuracies(attempts);
  const weakestSubject = pickWeakestSubject(subjectAccuracies);
  const strongestSubject = pickStrongestSubject(subjectAccuracies);
  const recentMissed = mapMissedAttempts(attempts).slice(0, 3);

  return {
    streakDays,
    weakestSubject,
    strongestSubject,
    recentSession,
    incompleteSession,
    recentMissed,
    subjectAccuracies,
    insightMessage: buildInsightMessage(weakestSubject, strongestSubject),
  };
}
