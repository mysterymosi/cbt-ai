import { getTutorFeedbackRating, getTutorThread } from "@/components/tutor";
import type {
  PracticeAttempt,
  PracticeQuestion,
} from "@/components/practice/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeedbackState } from "./feedback-state";
import { QuestionForm } from "./question-form";

type QuestionCardProps = {
  sessionId: string;
  question: PracticeQuestion;
  attempt: PracticeAttempt | null;
  isComplete: boolean;
  isFirstEverAttempt?: boolean;
  returnTo: string;
};

export async function QuestionCard({
  sessionId,
  question,
  attempt,
  isComplete,
  isFirstEverAttempt = false,
  returnTo,
}: QuestionCardProps) {
  const tutorThread = attempt
    ? await getTutorThread(sessionId, question.id)
    : null;
  const tutorFeedbackRating = attempt
    ? await getTutorFeedbackRating({ sessionId, questionId: question.id })
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl leading-relaxed">
          {question.question_text}
        </CardTitle>
        <CardDescription>
          {question.year ? `Past UTME ${question.year}` : "Cached UTME question"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {attempt ? (
          <FeedbackState
            attempt={attempt}
            question={question}
            isComplete={isComplete}
            sessionId={sessionId}
            tutorThread={tutorThread}
            tutorFeedbackRating={tutorFeedbackRating}
            isFirstEverAttempt={isFirstEverAttempt}
            returnTo={returnTo}
          />
        ) : (
          <QuestionForm sessionId={sessionId} question={question} />
        )}
      </CardContent>
    </Card>
  );
}
