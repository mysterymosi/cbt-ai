"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/components/admin/lib/admin-data";
import { forwardReportToAloc } from "@/components/reports/lib/aloc-forward";
import { getReporterFullNameByUserId } from "@/components/reports/lib/reporter-name";
import type { ReportIssueType } from "@/components/reports/types";

const reportActionSchema = z.object({
  reportId: z.uuid(),
});

type ReportForwardRow = {
  id: string;
  user_id: string;
  subject: string;
  issue_type: ReportIssueType;
  message: string | null;
  forwarded_to_aloc: boolean;
  questions: { external_question_id: string } | null;
};

export async function forwardQuestionReportToAloc(formData: FormData) {
  const parsed = reportActionSchema.safeParse({
    reportId: formData.get("reportId"),
  });

  if (!parsed.success) {
    redirect("/admin?message=Invalid report.");
  }

  const { supabase } = await requireAdminUser();

  const { data: report } = await supabase
    .from("question_reports")
    .select(
      "id, user_id, subject, issue_type, message, forwarded_to_aloc, questions(external_question_id)",
    )
    .eq("id", parsed.data.reportId)
    .maybeSingle<ReportForwardRow>();

  if (!report) {
    redirect("/admin?message=Report not found.");
  }

  if (report.forwarded_to_aloc) {
    redirect("/admin?message=Report was already forwarded to ALOC.");
  }

  const externalQuestionId = report.questions?.external_question_id;

  if (!externalQuestionId) {
    redirect(
      "/admin?message=Could not find the ALOC question id for this report.",
    );
  }

  const fullName = await getReporterFullNameByUserId(report.user_id);
  const forwardResult = await forwardReportToAloc({
    fullName,
    subject: report.subject,
    externalQuestionId,
    issueType: report.issue_type,
    message: report.message ?? undefined,
  });

  if (!forwardResult.ok) {
    redirect(`/admin?message=${encodeURIComponent(forwardResult.error)}`);
  }

  const { error } = await supabase
    .from("question_reports")
    .update({ forwarded_to_aloc: true })
    .eq("id", report.id);

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect("/admin?message=Report forwarded to ALOC.");
}

export async function resolveQuestionReport(formData: FormData) {
  const parsed = reportActionSchema.safeParse({
    reportId: formData.get("reportId"),
  });

  if (!parsed.success) {
    redirect("/admin?message=Invalid report.");
  }

  const { supabase } = await requireAdminUser();

  const { error } = await supabase
    .from("question_reports")
    .update({ status: "resolved" })
    .eq("id", parsed.data.reportId);

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect("/admin?message=Report marked resolved.");
}
