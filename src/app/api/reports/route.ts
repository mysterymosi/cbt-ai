import { NextResponse } from "next/server";
import { reportQuestionSchema } from "@/components/reports/schemas";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = reportQuestionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid report payload" }, { status: 400 });
  }

  const { data: report, error } = await supabase
    .from("question_reports")
    .insert({
      user_id: user.id,
      question_id: parsed.data.questionId,
      subject: parsed.data.subject,
      session_id: parsed.data.sessionId,
      issue_type: parsed.data.issueType,
      message: parsed.data.message?.trim() || null,
      forwarded_to_aloc: false,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: report.id });
}
