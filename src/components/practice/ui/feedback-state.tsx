import Link from "next/link";
import { ArrowRightIcon, CheckCircle2Icon, XCircleIcon } from "lucide-react";
import { TrackOnce } from "@/components/analytics/track-once";
import {
  getQuestionExplanation,
  getSortedOptions,
} from "@/components/practice/lib/options";
import type {
  PracticeAttempt,
  PracticeQuestion,
} from "@/components/practice/types";
import { ReportQuestionDialog } from "@/components/reports";
import { TutorPanel } from "@/components/tutor";
import type { TutorThreadState } from "@/components/tutor/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FeedbackStateProps = {
  attempt: PracticeAttempt;
  question: PracticeQuestion;
  isComplete: boolean;
  sessionId: string;
  tutorThread?: TutorThreadState | null;
  tutorFeedbackRating?: "up" | "down" | null;
  isFirstEverAttempt?: boolean;
  returnTo: string;
};

export function FeedbackState({
  attempt,
  question,
  isComplete,
  sessionId,
  tutorThread,
  tutorFeedbackRating = null,
  isFirstEverAttempt = false,
  returnTo,
}: FeedbackStateProps) {
  const options = getSortedOptions(question);
  const explanation = getQuestionExplanation(question);

  return (
    <div className="flex flex-col gap-5">
      {isFirstEverAttempt ? (
        <TrackOnce event="first_question_answered" properties={{ subject: question.subject }} />
      ) : null}

      <div className="flex items-center gap-2">
        {attempt.is_correct ? (
          <CheckCircle2Icon className="size-5 text-primary" />
        ) : (
          <XCircleIcon className="size-5 text-destructive" />
        )}
        <p className="font-medium">
          {attempt.is_correct ? "Correct answer" : "Incorrect answer"}
        </p>
      </div>

      <div className="grid gap-3">
        {options.map(([key, value]) => {
          const isSelected = key === attempt.selected_answer;
          const isCorrect = key === attempt.correct_answer;

          return (
            <div
              key={key}
              className={cn(
                "rounded-lg border p-4 text-sm leading-6",
                isCorrect && "border-primary bg-primary/5",
                isSelected && !isCorrect && "border-destructive bg-destructive/5",
              )}
            >
              <span className="font-semibold">{key}.</span> {value}
              {isCorrect ? (
                <span className="ml-2 font-medium text-primary">Correct</span>
              ) : null}
              {isSelected && !isCorrect ? (
                <span className="ml-2 font-medium text-destructive">
                  Your answer
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-medium">Explanation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {explanation}
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {tutorThread ? (
          <TutorPanel
            sessionId={sessionId}
            question={question}
            attempt={attempt}
            initialThread={tutorThread}
            feedbackRating={tutorFeedbackRating}
          />
        ) : null}
        <ReportQuestionDialog
          questionId={question.id}
          sessionId={sessionId}
          subject={question.subject}
          returnTo={returnTo}
        />
        <Link
          href={isComplete ? `/practice/${sessionId}/summary` : `/practice/${sessionId}`}
          className={cn(buttonVariants(), "min-h-11 w-full sm:w-fit")}
        >
          {isComplete ? "View summary" : "Next question"}
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </div>
  );
}
