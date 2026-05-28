import { getPracticeSessionState } from "@/components/practice/lib/session-data";
import { PracticePoolError } from "./practice-pool-error";
import { PracticeSessionHeader } from "./practice-session-header";
import { QuestionCard } from "./question-card";

type PracticeSessionPageProps = {
  sessionId: string;
  questionId?: string;
  message?: string;
};

export async function PracticeSessionPage({
  sessionId,
  questionId,
  message,
}: PracticeSessionPageProps) {
  const {
    session,
    attempts,
    currentAttempt,
    currentQuestion,
    progress,
    poolError,
    isFirstEverAttempt,
  } = await getPracticeSessionState({ sessionId, questionId });
  const isComplete = attempts.length >= session.total_questions;
  const currentQuestionNumber = currentAttempt ? progress : progress + 1;
  const returnTo = questionId
    ? `/practice/${sessionId}?question=${questionId}`
    : `/practice/${sessionId}`;

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <PracticeSessionHeader
        sessionId={sessionId}
        subject={session.subject}
        year={session.year}
        currentQuestionNumber={currentQuestionNumber}
        totalQuestions={session.total_questions}
      />

      {message ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}

      {poolError || !currentQuestion ? (
        <PracticePoolError
          session={session}
          message={
            poolError ??
            "No questions are available for this session. Try another subject."
          }
        />
      ) : (
        <QuestionCard
          sessionId={sessionId}
          question={currentQuestion}
          attempt={currentAttempt}
          isComplete={isComplete}
          isFirstEverAttempt={isFirstEverAttempt}
          returnTo={returnTo}
        />
      )}
    </main>
  );
}
