import { submitAttempt } from "@/components/practice/actions/practice";
import { getSortedOptions } from "@/components/practice/lib/options";
import type { PracticeQuestion } from "@/components/practice/types";
import { RichHtml } from "@/components/shared";
import { SubmitButton } from "@/components/ui/submit-button";

type QuestionFormProps = {
  sessionId: string;
  question: PracticeQuestion;
};

export function QuestionForm({ sessionId, question }: QuestionFormProps) {
  const options = getSortedOptions(question);

  return (
    <form action={submitAttempt} className="flex flex-col gap-5">
      <input type="hidden" name="sessionId" value={sessionId} />
      <input type="hidden" name="questionId" value={question.id} />
      <fieldset className="grid gap-3">
        <legend className="sr-only">Choose an answer</legend>
        {options.map(([key, value]) => (
          <label
            key={key}
            className="flex min-h-14 cursor-pointer items-start gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-muted/70 has-checked:border-primary has-checked:bg-primary/5"
          >
            <input
              type="radio"
              name="selectedAnswer"
              value={key}
              required
              className="mt-1 size-4 accent-primary"
            />
            <span className="flex gap-2 text-sm leading-6">
              <span className="font-semibold">{key}.</span>
              <RichHtml html={value} />
            </span>
          </label>
        ))}
      </fieldset>
      <SubmitButton pendingLabel="Submitting…" className="min-h-11 w-full sm:w-fit">
        Submit answer
      </SubmitButton>
    </form>
  );
}
