"use server";

import { storedMessagesToUi } from "@/components/tutor/lib/messages";
import { loadTutorConversation } from "@/components/tutor/lib/persistence";
import {
  getTutorDailyLimit,
  getTutorMessagesUsedToday,
} from "@/components/tutor/lib/usage";
import { getTutorAccessContext } from "@/components/tutor/lib/verify-access";
import type { TutorThreadState } from "@/components/tutor/types";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getTutorThread(
  sessionId: string,
  questionId: string,
): Promise<TutorThreadState | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const access = await getTutorAccessContext({
    userId: user.id,
    sessionId,
    questionId,
  });

  if (!access) {
    return null;
  }

  const stored = await loadTutorConversation(user.id, sessionId, questionId);
  const messagesUsedToday = await getTutorMessagesUsedToday(user.id);

  return {
    messages: storedMessagesToUi(stored),
    messagesUsedToday,
    dailyLimit: getTutorDailyLimit(),
  };
}
