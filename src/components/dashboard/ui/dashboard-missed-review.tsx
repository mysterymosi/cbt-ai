import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import type { MissedReviewItem } from "@/components/progress/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSubjectLabel } from "@/lib/constants/subjects";

type DashboardMissedReviewProps = {
  items: MissedReviewItem[];
};

export function DashboardMissedReview({ items }: DashboardMissedReviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Review missed questions</CardTitle>
        <CardDescription>
          Reopen a question to read feedback and ask the AI tutor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length ? (
          <div className="grid gap-3">
            {items.map((item) => (
              <Link
                key={`${item.sessionId}-${item.questionId}`}
                href={`/practice/${item.sessionId}?question=${item.questionId}`}
                className="rounded-lg border p-4 text-sm transition-colors hover:bg-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">
                    {getSubjectLabel(item.subject)}
                  </span>
                  <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground" />
                </div>
                <span className="mt-2 line-clamp-2 block text-muted-foreground">
                  {item.questionText}
                </span>
                <span className="mt-2 block text-xs text-muted-foreground">
                  Your answer: {item.selectedAnswer} · Correct: {item.correctAnswer}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No missed questions yet. Complete a practice set to build your review
            queue.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
