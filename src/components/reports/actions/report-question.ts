"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reportQuestionSchema } from "@/components/reports/schemas";
import { createClient } from "@/lib/supabase/server";

function redirectWithMessage(returnTo: string, message: string): never {
  const url = new URL(returnTo, "http://local");
  url.searchParams.set("message", message);
  redirect(`${url.pathname}${url.search}`);
}

export async function submitQuestionReport(formData: FormData) {
  const parsed = reportQuestionSchema.safeParse({
    questionId: formData.get("questionId"),
    sessionId: formData.get("sessionId"),
    subject: formData.get("subject"),
    issueType: formData.get("issueType"),
    message: formData.get("message") || undefined,
  });

  const returnTo = String(formData.get("returnTo") ?? "/practice");

  if (!parsed.success) {
    redirectWithMessage(
      returnTo,
      "Could not submit report. Check the form and try again.",
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("question_reports").insert({
    user_id: user.id,
    question_id: parsed.data.questionId,
    subject: parsed.data.subject,
    session_id: parsed.data.sessionId,
    issue_type: parsed.data.issueType,
    message: parsed.data.message?.trim() || null,
    forwarded_to_aloc: false,
  });

  if (error) {
    redirectWithMessage(returnTo, error.message);
  }

  revalidatePath("/admin");
  redirectWithMessage(
    returnTo,
    "Thanks — your report was submitted for review.",
  );
}
