import { FlameIcon, TargetIcon, TrendingUpIcon } from "lucide-react";
import type { DashboardProgress } from "@/components/progress/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSubjectLabel } from "@/lib/constants/subjects";

type DashboardMetricsProps = {
  progress: DashboardProgress;
};

export function DashboardMetrics({ progress }: DashboardMetricsProps) {
  const recentScore = progress.recentSession
    ? `${progress.recentSession.score}/${progress.recentSession.totalQuestions}`
    : "—";
  const recentAccuracy = progress.recentSession
    ? `${progress.recentSession.accuracy}%`
    : "—";
  const weakestLabel = progress.weakestSubject
    ? `${getSubjectLabel(progress.weakestSubject.subject)} · ${progress.weakestSubject.accuracy}%`
    : "—";

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Latest score</CardTitle>
          <CardDescription>Most recent completed set</CardDescription>
          <CardAction>
            <TrendingUpIcon />
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <span className="text-3xl font-semibold">{recentScore}</span>
          <span className="text-sm text-muted-foreground">{recentAccuracy} accuracy</span>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Weakest subject</CardTitle>
          <CardDescription>By attempt accuracy</CardDescription>
          <CardAction>
            <TargetIcon />
          </CardAction>
        </CardHeader>
        <CardContent className="text-lg font-semibold leading-snug">
          {weakestLabel}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Study streak</CardTitle>
          <CardDescription>Days with a completed set</CardDescription>
          <CardAction>
            <FlameIcon />
          </CardAction>
        </CardHeader>
        <CardContent className="text-3xl font-semibold">
          {progress.streakDays}
          <span className="ml-2 text-base font-normal text-muted-foreground">
            {progress.streakDays === 1 ? "day" : "days"}
          </span>
        </CardContent>
      </Card>
    </section>
  );
}
