import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { NextResponse } from "next/server";
import { buildTutorContext } from "@/components/tutor/lib/build-context";
import { saveTutorConversation } from "@/components/tutor/lib/persistence";
import { buildTutorSystemPrompt } from "@/components/tutor/lib/system-prompt";
import { tutorRequestSchema } from "@/components/tutor/schemas";
import {
  assertTutorQuota,
  logTutorUsage,
} from "@/components/tutor/lib/usage";
import { getTutorAccessContext } from "@/components/tutor/lib/verify-access";
import { env } from "@/env";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(request: Request) {
  if (!env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Tutor is not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to enable it.",
      },
      { status: 503 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = tutorRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid tutor request" }, { status: 400 });
  }

  const { messages, sessionId, questionId } = parsed.data;
  const access = await getTutorAccessContext({
    userId: user.id,
    sessionId,
    questionId,
  });

  if (!access) {
    return NextResponse.json({ error: "Tutor context not found" }, { status: 404 });
  }

  const quota = await assertTutorQuota(user.id);

  if (!quota.allowed) {
    return NextResponse.json(
      {
        error: `Daily tutor limit reached (${quota.limit} messages). Try again tomorrow.`,
      },
      { status: 429 },
    );
  }

  const context = buildTutorContext(access.question, access.attempt);
  const uiMessages = messages as UIMessage[];

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: buildTutorSystemPrompt(context),
    messages: await convertToModelMessages(uiMessages),
    maxOutputTokens: 600,
    onFinish: async ({ usage }) => {
      await logTutorUsage({
        userId: user.id,
        sessionId,
        questionId,
        tokensIn: usage.inputTokens ?? 0,
        tokensOut: usage.outputTokens ?? 0,
      });
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: uiMessages,
    onFinish: async ({ messages: finalMessages }) => {
      await saveTutorConversation({
        userId: user.id,
        sessionId,
        questionId,
        messages: finalMessages,
      });
    },
  });
}
