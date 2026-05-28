import Link from "next/link";
import { BookOpenCheckIcon, ClockIcon, HistoryIcon } from "lucide-react";
import { startPracticeSession } from "@/components/practice/actions/practice";
import { practiceCounts } from "@/components/practice/schemas";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormPending } from "@/components/ui/form-pending";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  getSubjectLabel,
  UTME_SUBJECT_VALUES,
  UTME_SUBJECTS,
} from "@/lib/constants/subjects";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

type PracticeSetupPageProps = {
  message?: string;
  recommendedSubject?: string;
  recommendedCount?: string;
};

export async function PracticeSetupPage({
  message,
  recommendedSubject,
  recommendedCount,
}: PracticeSetupPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("selected_subjects")
    .eq("id", user!.id)
    .maybeSingle<{ selected_subjects: string[] }>();

  const selectedSubjects = profile?.selected_subjects?.length
    ? profile.selected_subjects
    : UTME_SUBJECTS.map((subject) => subject.value);
  const subjectOptions = selectedSubjects.map((subject) => ({
    value: subject,
    label: getSubjectLabel(subject),
  }));
  const countOptions = practiceCounts.map((count) => ({
    value: String(count),
    label: `${count} questions`,
  }));

  const defaultSubject = UTME_SUBJECT_VALUES.includes(
    recommendedSubject as (typeof UTME_SUBJECT_VALUES)[number],
  )
    ? recommendedSubject!
    : subjectOptions[0]?.value ?? UTME_SUBJECTS[0].value;

  const defaultCount = practiceCounts.includes(
    Number(recommendedCount) as (typeof practiceCounts)[number],
  )
    ? String(recommendedCount)
    : countOptions[0]?.value ?? "10";

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div className="flex flex-col gap-2">
          <Badge className="w-fit" variant="secondary">
            Practice Mode
          </Badge>
          <h1 className="text-3xl font-semibold">Start a UTME practice set</h1>
          <p className="max-w-2xl text-muted-foreground">
            Choose a subject and question count. Answers are graded on the
            server and saved to your history.
          </p>
        </div>
        <Link
          href="/history"
          className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
        >
          <HistoryIcon data-icon="inline-start" />
          History
        </Link>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>Practice setup</CardTitle>
            <CardDescription>
              Keep it short for feedback, or choose 40 for a fuller drill.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message ? (
              <p className="mb-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
                {message}
              </p>
            ) : null}
            <form action={startPracticeSession}>
              <FormPending>
                <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="subject">Subject</FieldLabel>
                  <Select
                    id="subject"
                    name="subject"
                    required
                    defaultValue={defaultSubject}
                  >
                    <SelectTrigger className="min-h-11 w-full bg-background px-3">
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {subjectOptions.map((subject) => (
                        <SelectItem key={subject.value} value={subject}>
                          {subject.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Change your subject list from onboarding.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="year">Exam year</FieldLabel>
                  <Input
                    id="year"
                    name="year"
                    type="number"
                    min="2001"
                    max="2026"
                    placeholder="Any year"
                  />
                  <FieldDescription>
                    Optional. Leave blank to mix available cached years.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="count">Questions</FieldLabel>
                  <Select
                    id="count"
                    name="count"
                    required
                    defaultValue={defaultCount}
                  >
                    <SelectTrigger className="min-h-11 w-full bg-background px-3">
                      <SelectValue placeholder="Choose a count" />
                    </SelectTrigger>
                    <SelectContent align="start">
                      {countOptions.map((count) => (
                        <SelectItem key={count.value} value={count}>
                          {count.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <SubmitButton pendingLabel="Starting…" className="min-h-11 w-full">
                  <BookOpenCheckIcon data-icon="inline-start" />
                  Start practice
                </SubmitButton>
                </FieldGroup>
              </FormPending>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClockIcon className="size-4" />
                How practice works
              </CardTitle>
              <CardDescription>
                Submit an answer, see feedback, then move forward.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Available subjects</CardTitle>
              <CardDescription>
                {selectedSubjects.map(getSubjectLabel).join(", ")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </main>
  );
}
