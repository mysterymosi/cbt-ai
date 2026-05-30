"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { MessageCircleIcon, SendIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics/track";
import type { TutorPanelProps } from "@/components/tutor/types";
import { TUTOR_QUICK_ACTIONS } from "@/components/tutor/types";
import { TutorFeedbackButtons } from "@/components/tutor/ui/tutor-feedback-buttons";
import { MarkdownContent } from "@/components/shared";
import { getSubjectLabel } from "@/lib/constants/subjects";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function TutorPanel({
  sessionId,
  question,
  attempt,
  initialThread,
  feedbackRating = null,
}: TutorPanelProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [messagesUsedToday, setMessagesUsedToday] = useState(
    initialThread.messagesUsedToday,
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/tutor",
        body: {
          sessionId,
          questionId: question.id,
        },
      }),
    [question.id, sessionId],
  );

  const { messages, sendMessage, status, error } = useChat({
    id: `tutor-${sessionId}-${question.id}`,
    messages: initialThread.messages,
    transport,
    onError: (chatError) => {
      setQuotaError(chatError.message);
    },
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessagesUsedToday(initialThread.messagesUsedToday);
  }, [initialThread.messagesUsedToday]);

  useEffect(() => {
    if (open) {
      trackEvent("tutor_opened", {
        subject: question.subject,
        questionId: question.id,
      });
    }
  }, [open, question.id, question.subject]);

  const remaining = Math.max(0, initialThread.dailyLimit - messagesUsedToday);
  const isBusy = status === "submitted" || status === "streaming";
  const limitReached = remaining <= 0;

  async function handleSend(text: string) {
    const trimmed = text.trim();

    if (!trimmed || isBusy || limitReached) {
      return;
    }

    setQuotaError(null);
    setInput("");

    try {
      await sendMessage({ text: trimmed });
      setMessagesUsedToday((count) => count + 1);
    } catch {
      // onError handles quota and API failures
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button type="button" variant="outline" className="min-h-11 w-full sm:w-fit">
            <MessageCircleIcon data-icon="inline-start" />
            Ask AI Tutor
          </Button>
        }
      />
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 data-[side=right]:sm:max-w-lg">
        <SheetHeader className="border-b px-4 py-4 text-left">
          <SheetTitle>AI Tutor</SheetTitle>
          <SheetDescription>
            {getSubjectLabel(question.subject)}
            {question.year ? ` · ${question.year}` : ""} · Your answer:{" "}
            {attempt.selected_answer}
            {attempt.is_correct ? " (correct)" : " (incorrect)"}
          </SheetDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">
              {remaining} tutor {remaining === 1 ? "message" : "messages"} left today
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap gap-2 border-b px-4 py-3">
            {TUTOR_QUICK_ACTIONS.map((action) => (
              <Button
                key={action.label}
                type="button"
                variant="secondary"
                size="sm"
                className="min-h-9"
                disabled={isBusy || limitReached}
                onClick={() => handleSend(action.prompt)}
              >
                {action.label}
              </Button>
            ))}
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Ask a follow-up about this question. The tutor only sees this question
                and your submitted answer.
              </p>
            ) : (
              messages.map((message) => (
                <TutorMessage key={message.id} message={message} />
              ))
            )}

            {(error || quotaError) && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {quotaError?.includes("Daily tutor limit")
                  ? "Daily tutor limit reached. Try again tomorrow or review the explanation above."
                  : (quotaError ?? error?.message ?? "Something went wrong.")}
              </p>
            )}
          </div>

          {messages.some((message) => message.role === "assistant") ? (
            <TutorFeedbackButtons
              sessionId={sessionId}
              questionId={question.id}
              initialRating={feedbackRating}
            />
          ) : null}

          <form
            className="flex gap-2 border-t px-4 py-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend(input);
            }}
          >
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                limitReached
                  ? "Daily tutor limit reached"
                  : "Ask about this question..."
              }
              disabled={isBusy || limitReached}
              className="min-h-11"
              autoComplete="off"
            />
            <Button
              type="submit"
              className="min-h-11 shrink-0"
              disabled={isBusy || limitReached || !input.trim()}
              aria-busy={isBusy}
            >
              <SendIcon />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function TutorMessage({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n");

  if (!text) {
    return null;
  }

  return (
    <div
      className={cn(
        "max-w-[95%] rounded-lg px-3 py-2 text-sm leading-6",
        isUser ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
      )}
    >
      <p className="mb-1 text-xs font-medium opacity-80">
        {isUser ? "You" : "Tutor"}
      </p>
      {isUser ? (
        <p className="whitespace-pre-wrap">{text}</p>
      ) : (
        <MarkdownContent content={text} />
      )}
    </div>
  );
}
