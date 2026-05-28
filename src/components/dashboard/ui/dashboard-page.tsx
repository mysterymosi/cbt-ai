import { getDashboardProgress } from "@/components/progress";
import { createClient } from "@/lib/supabase/server";
import type { DashboardProfile } from "../types";
import { DashboardContinueCard } from "./dashboard-continue-card";
import { DashboardHero } from "./dashboard-hero";
import { DashboardMetrics } from "./dashboard-metrics";
import { DashboardMissedReview } from "./dashboard-missed-review";
import { DashboardSubjects } from "./dashboard-subjects";

type DashboardPageProps = {
  message?: string;
};

export async function DashboardPage({ message }: DashboardPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, selected_subjects, target_exam")
    .eq("id", user!.id)
    .maybeSingle<DashboardProfile>();

  const selectedSubjects =
    profile?.selected_subjects?.length ? profile.selected_subjects : [];

  const progress = await getDashboardProgress(user!.id);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      {message ? (
        <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
          {message}
        </p>
      ) : null}
      <DashboardHero
        name={profile?.name ?? null}
        insightMessage={progress.insightMessage}
        incompleteSession={progress.incompleteSession}
      />
      {progress.incompleteSession ? (
        <DashboardContinueCard session={progress.incompleteSession} />
      ) : null}
      <DashboardMetrics progress={progress} />
      <DashboardMissedReview items={progress.recentMissed} />
      <DashboardSubjects selectedSubjects={selectedSubjects} />
    </main>
  );
}
