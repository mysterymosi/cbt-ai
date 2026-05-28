import type { UIMessage } from "ai";
import { uiMessagesToStored } from "@/components/tutor/lib/messages";
import type { StoredTutorMessage } from "@/components/tutor/types";
import { createClient } from "@/lib/supabase/server";

export async function loadTutorConversation(
  userId: string,
  sessionId: string,
  questionId: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tutor_conversations")
    .select("id, messages")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("question_id", questionId)
    .maybeSingle<{ id: string; messages: StoredTutorMessage[] }>();

  if (error) {
    throw error;
  }

  return data?.messages ?? [];
}

export async function saveTutorConversation({
  userId,
  sessionId,
  questionId,
  messages,
}: {
  userId: string;
  sessionId: string;
  questionId: string;
  messages: UIMessage[];
}) {
  const stored = uiMessagesToStored(messages);

  if (!stored.length) {
    return;
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("tutor_conversations")
    .select("id")
    .eq("user_id", userId)
    .eq("session_id", sessionId)
    .eq("question_id", questionId)
    .maybeSingle<{ id: string }>();

  if (existing) {
    const { error } = await supabase
      .from("tutor_conversations")
      .update({ messages: stored })
      .eq("id", existing.id);

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabase.from("tutor_conversations").insert({
    user_id: userId,
    session_id: sessionId,
    question_id: questionId,
    messages: stored,
  });

  if (error) {
    throw error;
  }
}
