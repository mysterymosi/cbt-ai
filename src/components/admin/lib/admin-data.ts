import { redirect } from "next/navigation";
import type {
  AdminQuestionRow,
  AdminReportRow,
  AdminUsageSummary,
} from "@/components/admin/types";
import { createClient } from "@/lib/supabase/server";

export async function requireAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle<{ role: "student" | "admin" }>();

  if (profile?.role !== "admin") {
    redirect("/dashboard?message=Admin access required.");
  }

  return { supabase, user };
}

export async function getAdminDashboardData() {
  const { supabase } = await requireAdminUser();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: reports }, { data: usageRows }, { count: openReportCount }] =
    await Promise.all([
      supabase
        .from("question_reports")
        .select(
          "id, user_id, question_id, subject, session_id, issue_type, message, status, forwarded_to_aloc, created_at, questions(question_text, external_question_id)",
        )
        .eq("status", "open")
        .order("created_at", { ascending: false })
        .limit(50)
        .overrideTypes<AdminReportRow[]>(),
      supabase
        .from("ai_usage_logs")
        .select("tokens_in, tokens_out, created_at")
        .gte("created_at", sevenDaysAgo)
        .overrideTypes<Array<{ tokens_in: number; tokens_out: number; created_at: string }>>(),
      supabase
        .from("question_reports")
        .select("id", { count: "exact", head: true })
        .eq("status", "open"),
    ]);

  const usageSummary: AdminUsageSummary = {
    messageCount: usageRows?.length ?? 0,
    tokensIn: usageRows?.reduce((sum, row) => sum + row.tokens_in, 0) ?? 0,
    tokensOut: usageRows?.reduce((sum, row) => sum + row.tokens_out, 0) ?? 0,
  };

  return {
    openReports: reports ?? [],
    openReportCount: openReportCount ?? 0,
    usageSummary,
  };
}

export async function searchAdminQuestions(query: string): Promise<AdminQuestionRow[]> {
  const { supabase } = await requireAdminUser();
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      trimmed,
    );

  let request = supabase
    .from("questions")
    .select(
      "id, subject, year, question_text, correct_answer, source_explanation, is_disabled, local_override_answer, local_override_explanation, external_question_id",
    )
    .order("updated_at", { ascending: false })
    .limit(20);

  if (isUuid) {
    request = request.eq("id", trimmed);
  } else {
    request = request.or(
      `subject.ilike.%${trimmed}%,question_text.ilike.%${trimmed}%,external_question_id.ilike.%${trimmed}%`,
    );
  }

  const { data } = await request.overrideTypes<AdminQuestionRow[]>();
  return data ?? [];
}
