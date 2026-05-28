import { updateQuestionOverride } from "@/components/admin/actions/admin-questions";
import type { AdminQuestionRow } from "@/components/admin/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getSubjectLabel } from "@/lib/constants/subjects";

type AdminQuestionOverridesProps = {
  questions: AdminQuestionRow[];
  query?: string;
};

export function AdminQuestionOverrides({
  questions,
  query,
}: AdminQuestionOverridesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question overrides</CardTitle>
        <CardDescription>
          Search by question ID, subject, or text snippet. Override answers or
          disable bad rows.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <form action="/admin" method="get" className="flex flex-col gap-3 sm:flex-row">
          <Input
            name="q"
            defaultValue={query}
            placeholder="Search questions…"
            className="min-h-11"
          />
          <Button type="submit" className="min-h-11 sm:w-fit">
            Search
          </Button>
        </form>

        {questions.length ? (
          <div className="grid gap-4">
            {questions.map((question) => (
              <article key={question.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {getSubjectLabel(question.subject)}
                  </Badge>
                  {question.year ? (
                    <Badge variant="outline">{question.year}</Badge>
                  ) : null}
                  {question.is_disabled ? (
                    <Badge variant="destructive">Disabled</Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-sm font-medium">{question.question_text}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  ALOC ID {question.external_question_id} · DB {question.id}
                </p>

                <form action={updateQuestionOverride} className="mt-4 grid gap-3">
                  <input type="hidden" name="questionId" value={question.id} />
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Override answer</span>
                    <Input
                      name="localOverrideAnswer"
                      defaultValue={question.local_override_answer ?? ""}
                      placeholder={question.correct_answer}
                      maxLength={1}
                      className="min-h-11 uppercase"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Override explanation</span>
                    <textarea
                      name="localOverrideExplanation"
                      defaultValue={question.local_override_explanation ?? ""}
                      rows={3}
                      className="flex min-h-24 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"
                    />
                  </label>
                  <label className="grid gap-1 text-sm">
                    <span className="font-medium">Status</span>
                    <select
                      name="isDisabled"
                      defaultValue={question.is_disabled ? "true" : "false"}
                      className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm"
                    >
                      <option value="false">Enabled in practice</option>
                      <option value="true">Disabled</option>
                    </select>
                  </label>
                  <SubmitButton pendingLabel="Saving…" className="min-h-11 w-fit">
                    Save override
                  </SubmitButton>
                </form>
              </article>
            ))}
          </div>
        ) : query ? (
          <p className="text-sm text-muted-foreground">No questions matched that search.</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Search to find a question to override.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
