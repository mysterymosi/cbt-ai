import Link from "next/link";
import { ArrowRightIcon, RotateCcwIcon, SparklesIcon } from "lucide-react";
import { getPracticeSummaryState } from "@/components/practice/lib/session-data";
import { RichHtml } from "@/components/shared";
import { Badge } from "@/components/ui/badge";
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

type PracticeSummaryPageProps = {
  sessionId: string;
};

export async function PracticeSummaryPage({ sessionId }: PracticeSummaryPageProps) {
  const {
    session,
    missed,
    score,
    answered,
    accuracy,
    conceptTags,
    recommendation,
  } = await getPracticeSummaryState(sessionId);

  const durationLabel = session.duration_seconds
    ? `${Math.round(session.duration_seconds / 60)} min`
    : null;

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <Badge className="w-fit" variant="secondary">
            {getSubjectLabel(session.subject)} · Summary
          </Badge>
          <h1 className="text-3xl font-semibold">Session summary</h1>
          <p className="max-w-2xl text-muted-foreground">
            Review your score, weak areas, and follow-up practice.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href={recommendation.href}
            className={cn(buttonVariants(), "min-h-11")}
          >
            <SparklesIcon data-icon="inline-start" />
            Recommended practice
          </Link>
          <Link
            href="/history"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
          >
            History
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Score" value={`${score}/${session.total_questions}`} />
        <MetricCard title="Accuracy" value={`${accuracy}%`} />
        <MetricCard
          title="Time"
          value={durationLabel ?? `${answered} answered`}
        />
      </section>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Recommended next</CardTitle>
          <CardDescription>{recommendation.reason}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={recommendation.href}
            className={cn(buttonVariants(), "min-h-11 w-full sm:w-fit")}
          >
            <RotateCcwIcon data-icon="inline-start" />
            Start {getSubjectLabel(recommendation.subject)} · {recommendation.count}{" "}
            questions
          </Link>
        </CardContent>
      </Card>

      {conceptTags.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Weak concepts</CardTitle>
            <CardDescription>
              Topics to revisit from questions you missed this session.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {conceptTags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Missed questions</CardTitle>
          <CardDescription>
            Reopen a question to review feedback or ask the AI tutor.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {missed.length ? (
            <div className="grid gap-3">
              {missed.map((attempt) => (
                <Link
                  key={attempt.id}
                  href={`/practice/${sessionId}?question=${attempt.question_id}`}
                  className="rounded-lg border p-4 text-sm transition-colors hover:bg-muted"
                >
                  <RichHtml
                    as="span"
                    className="line-clamp-2 font-medium"
                    html={attempt.questions?.question_text ?? "Question"}
                  />
                  <span className="mt-2 flex text-muted-foreground">
                    Your answer: {attempt.selected_answer} · Correct:{" "}
                    {attempt.correct_answer}
                    <ArrowRightIcon className="ml-2 size-4" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No missed questions in this session. Great work.
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-semibold">{value}</CardContent>
    </Card>
  );
}
