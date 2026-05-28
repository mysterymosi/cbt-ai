"use client";

import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { submitTutorFeedback } from "@/components/tutor/actions/tutor-feedback";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TutorFeedbackButtonsProps = {
  sessionId: string;
  questionId: string;
  initialRating?: "up" | "down" | null;
};

export function TutorFeedbackButtons({
  sessionId,
  questionId,
  initialRating = null,
}: TutorFeedbackButtonsProps) {
  const [rating, setRating] = useState<"up" | "down" | null>(initialRating);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRate(nextRating: "up" | "down") {
    setError(null);
    startTransition(async () => {
      const result = await submitTutorFeedback({
        sessionId,
        questionId,
        rating: nextRating,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setRating(nextRating);
    });
  }

  return (
    <div className="flex flex-col gap-2 border-t px-4 py-3">
      <p className="text-xs font-medium text-muted-foreground">
        Was this tutor reply helpful?
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant={rating === "up" ? "default" : "outline"}
          size="sm"
          className="min-h-9"
          disabled={isPending}
          onClick={() => handleRate("up")}
        >
          <ThumbsUpIcon data-icon="inline-start" />
          Helpful
        </Button>
        <Button
          type="button"
          variant={rating === "down" ? "destructive" : "outline"}
          size="sm"
          className={cn("min-h-9", rating === "down" && "text-destructive-foreground")}
          disabled={isPending}
          onClick={() => handleRate("down")}
        >
          <ThumbsDownIcon data-icon="inline-start" />
          Not helpful
        </Button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
