import Link from "next/link";
import type { IncompleteSession } from "@/components/progress/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { EXAM_LABELS } from "@/lib/constants/exams";
import { cn } from "@/lib/utils";

type DashboardHeroProps = {
  name: string | null;
  insightMessage: string;
  incompleteSession: IncompleteSession | null;
};

export function DashboardHero({
  name,
  insightMessage,
  incompleteSession,
}: DashboardHeroProps) {
  return (
    <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          {EXAM_LABELS.utme}
        </Badge>
        <h1 className="text-3xl font-semibold">
          {name ? `${name}'s practice dashboard` : "Practice dashboard"}
        </h1>
        <p className="max-w-2xl text-muted-foreground">{insightMessage}</p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Link
          href="/onboarding"
          className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
        >
          Edit subjects
        </Link>
        {incompleteSession ? (
          <Link
            href={`/practice/${incompleteSession.id}`}
            className={cn(buttonVariants(), "min-h-11")}
          >
            Continue practice
          </Link>
        ) : (
          <Link href="/practice" className={cn(buttonVariants(), "min-h-11")}>
            Start practice
          </Link>
        )}
      </div>
    </section>
  );
}
