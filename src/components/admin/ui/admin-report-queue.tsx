import {
  forwardQuestionReportToAloc,
  resolveQuestionReport,
} from "@/components/admin/actions/admin-reports";
import type { AdminReportRow } from "@/components/admin/types";
import { REPORT_ISSUE_LABELS } from "@/components/reports";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SubmitButton } from "@/components/ui/submit-button";
import { getSubjectLabel } from "@/lib/constants/subjects";

type AdminReportQueueProps = {
  reports: AdminReportRow[];
};

export function AdminReportQueue({ reports }: AdminReportQueueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open reports</CardTitle>
        <CardDescription>
          Review student reports, forward valid issues to ALOC, then mark resolved.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reports.length ? (
          <div className="grid gap-4">
            {reports.map((report) => (
              <article key={report.id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {getSubjectLabel(report.subject)}
                  </Badge>
                  <Badge variant="outline">
                    {REPORT_ISSUE_LABELS[report.issue_type]}
                  </Badge>
                  {report.forwarded_to_aloc ? (
                    <Badge>Forwarded to ALOC</Badge>
                  ) : (
                    <Badge variant="outline">Pending review</Badge>
                  )}
                </div>
                <p className="mt-3 text-sm font-medium line-clamp-2">
                  {report.questions?.question_text ?? "Question"}
                </p>
                {report.message ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {report.message}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(report.created_at).toLocaleString()} · ALOC ID{" "}
                  {report.questions?.external_question_id ?? "unknown"}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {!report.forwarded_to_aloc ? (
                    <form action={forwardQuestionReportToAloc}>
                      <input type="hidden" name="reportId" value={report.id} />
                      <SubmitButton pendingLabel="Forwarding…" className="min-h-10">
                        Forward to ALOC
                      </SubmitButton>
                    </form>
                  ) : null}
                  <form action={resolveQuestionReport}>
                    <input type="hidden" name="reportId" value={report.id} />
                    <SubmitButton
                      variant="outline"
                      pendingLabel="Resolving…"
                      className="min-h-10"
                    >
                      Mark resolved
                    </SubmitButton>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No open reports.</p>
        )}
      </CardContent>
    </Card>
  );
}
