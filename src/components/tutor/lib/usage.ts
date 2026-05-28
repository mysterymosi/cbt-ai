import { env } from "@/env";
import { createClient } from "@/lib/supabase/server";

export function getTutorDailyLimit() {
  return env.TUTOR_DAILY_MESSAGE_LIMIT;
}

function getStartOfUtcDay() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function getTutorMessagesUsedToday(userId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("ai_usage_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", getStartOfUtcDay().toISOString());

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function assertTutorQuota(userId: string) {
  const limit = getTutorDailyLimit();
  const used = await getTutorMessagesUsedToday(userId);

  if (used >= limit) {
    return {
      allowed: false as const,
      used,
      limit,
    };
  }

  return {
    allowed: true as const,
    used,
    limit,
    remaining: limit - used,
  };
}

export async function logTutorUsage({
  userId,
  sessionId,
  questionId,
  tokensIn,
  tokensOut,
}: {
  userId: string;
  sessionId: string;
  questionId: string;
  tokensIn: number;
  tokensOut: number;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from("ai_usage_logs").insert({
    user_id: userId,
    session_id: sessionId,
    question_id: questionId,
    tokens_in: tokensIn,
    tokens_out: tokensOut,
  });

  if (error) {
    throw error;
  }
}
