import Link from "next/link";
import { AlertTriangleIcon } from "lucide-react";
import type { PracticeSession } from "@/components/practice/types";
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

type PracticePoolErrorProps = {
  session: PracticeSession;
  message: string;
};

export function PracticePoolError({ session, message }: PracticePoolErrorProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangleIcon className="size-5 text-destructive" />
          Questions unavailable
        </CardTitle>
        <CardDescription>
          {getSubjectLabel(session.subject)}
          {session.year ? ` · ${session.year}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-6 text-muted-foreground">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/practice" className={cn(buttonVariants(), "min-h-11")}>
            Try another subject
          </Link>
          <Link
            href="/dashboard"
            className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
          >
            Back to dashboard
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
