import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSubjectLabel } from "@/lib/constants/subjects";
import { cn } from "@/lib/utils";

type PracticeSessionHeaderProps = {
  sessionId: string;
  subject: string;
  year: number | null;
  currentQuestionNumber: number;
  totalQuestions: number;
};

export function PracticeSessionHeader({
  sessionId,
  subject,
  year,
  currentQuestionNumber,
  totalQuestions,
}: PracticeSessionHeaderProps) {
  return (
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="flex flex-col gap-2">
        <Badge className="w-fit" variant="secondary">
          {getSubjectLabel(subject)} · UTME{year ? ` · ${year}` : ""}
        </Badge>
        <h1 className="text-3xl font-semibold">Practice session</h1>
        <p className="text-muted-foreground">
          Question {currentQuestionNumber} of {totalQuestions}
        </p>
      </div>
      <Link
        href={`/practice/${sessionId}/summary`}
        className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
      >
        Summary
      </Link>
    </section>
  );
}
