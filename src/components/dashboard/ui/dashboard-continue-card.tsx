import Link from "next/link";
import { PlayIcon } from "lucide-react";
import type { IncompleteSession } from "@/components/progress/types";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSubjectLabel } from "@/lib/constants/subjects";
import { cn } from "@/lib/utils";

type DashboardContinueCardProps = {
  session: IncompleteSession;
};

export function DashboardContinueCard({ session }: DashboardContinueCardProps) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle>Continue practice</CardTitle>
        <CardDescription>
          Pick up your in-progress {getSubjectLabel(session.subject)} set.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Question {Math.min(session.progress + 1, session.totalQuestions)} of{" "}
          {session.totalQuestions} remaining
        </p>
        <Link
          href={`/practice/${session.id}`}
          className={cn(buttonVariants(), "min-h-11 w-full sm:w-fit")}
        >
          <PlayIcon data-icon="inline-start" />
          Continue session
        </Link>
      </CardContent>
    </Card>
  );
}
