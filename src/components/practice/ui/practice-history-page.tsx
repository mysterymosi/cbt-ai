import Link from "next/link";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import type { PracticeSession } from "@/components/practice/types";
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
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

export async function PracticeHistoryPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("practice_sessions")
    .select("id, subject, year, total_questions, started_at, completed_at, score, accuracy, duration_seconds")
    .eq("user_id", user!.id)
    .order("started_at", { ascending: false })
    .limit(20)
    .returns<PracticeSession[]>();
  const sessions = data ?? [];

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <Badge className="w-fit" variant="secondary">
            Practice history
          </Badge>
          <h1 className="text-3xl font-semibold">Your recent sessions</h1>
          <p className="max-w-2xl text-muted-foreground">
            Track completed sets and continue unfinished practice.
          </p>
        </div>
        <Link href="/practice" className={cn(buttonVariants(), "min-h-11")}>
          <PlusIcon data-icon="inline-start" />
          New practice
        </Link>
      </section>

      {sessions.length ? (
        <div className="grid gap-3">
          {sessions.map((session) => {
            const complete = Boolean(session.completed_at);
            const href = complete
              ? `/practice/${session.id}/summary`
              : `/practice/${session.id}`;

            return (
              <Link
                key={session.id}
                href={href}
                className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                  <div>
                    <p className="font-medium">
                      {getSubjectLabel(session.subject)}
                      {session.year ? ` · ${session.year}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.started_at).toLocaleDateString()} ·{" "}
                      {complete ? "Completed" : "In progress"}
                    </p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <Badge variant="secondary">
                      {session.score ?? 0}/{session.total_questions}
                    </Badge>
                    <Badge variant="secondary">
                      {session.accuracy ?? 0}%
                    </Badge>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardListIcon className="size-4" />
              No sessions yet
            </CardTitle>
            <CardDescription>
              Start a 10-question set to create your first history entry.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/practice" className={cn(buttonVariants(), "min-h-11")}>
              Start practice
            </Link>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
