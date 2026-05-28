"use client";

import { FlagIcon } from "lucide-react";
import { useState } from "react";
import { submitQuestionReport } from "@/components/reports/actions/report-question";
import { REPORT_ISSUE_LABELS, type ReportIssueType } from "@/components/reports/types";
import { reportIssueTypes } from "@/components/reports/schemas";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { FormPending } from "@/components/ui/form-pending";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type ReportQuestionDialogProps = {
  questionId: string;
  sessionId: string;
  subject: string;
  returnTo: string;
  className?: string;
};

export function ReportQuestionDialog({
  questionId,
  sessionId,
  subject,
  returnTo,
  className,
}: ReportQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [issueType, setIssueType] = useState<ReportIssueType>(reportIssueTypes[0]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("min-h-11 w-full sm:w-fit", className)}
          >
            <FlagIcon data-icon="inline-start" />
            Report issue
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report a question issue</DialogTitle>
          <DialogDescription>
            Flag problems with the question, answer key, or explanation. Our team
            will review your report before forwarding it to ALOC if needed.
          </DialogDescription>
        </DialogHeader>

        <form action={submitQuestionReport}>
          <input type="hidden" name="questionId" value={questionId} />
          <input type="hidden" name="sessionId" value={sessionId} />
          <input type="hidden" name="subject" value={subject} />
          <input type="hidden" name="returnTo" value={returnTo} />
          <input type="hidden" name="issueType" value={issueType} />

          <FormPending>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="issueType">Issue type</FieldLabel>
                <Select
                  value={issueType}
                  onValueChange={(value) => {
                    if (value) {
                      setIssueType(value as ReportIssueType);
                    }
                  }}
                >
                  <SelectTrigger id="issueType" className="min-h-11 w-full">
                    <SelectValue placeholder="Choose issue type">
                      {REPORT_ISSUE_LABELS[issueType]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {reportIssueTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {REPORT_ISSUE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="message">Details (optional)</FieldLabel>
                <Textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={1000}
                  placeholder="What looks wrong?"
                  className="min-h-24 bg-background"
                />
                <FieldDescription>
                  Keep it short — e.g. “Option C should be correct.”
                </FieldDescription>
              </Field>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="min-h-11"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <SubmitButton pendingLabel="Submitting…" className="min-h-11">
                  Submit report
                </SubmitButton>
              </DialogFooter>
            </FieldGroup>
          </FormPending>
        </form>
      </DialogContent>
    </Dialog>
  );
}
