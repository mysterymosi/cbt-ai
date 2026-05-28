"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/components/admin/lib/admin-data";

const updateQuestionSchema = z.object({
  questionId: z.uuid(),
  localOverrideAnswer: z.string().max(1).optional(),
  localOverrideExplanation: z.string().max(4000).optional(),
  isDisabled: z.enum(["true", "false"]).optional(),
});

export async function updateQuestionOverride(formData: FormData) {
  const parsed = updateQuestionSchema.safeParse({
    questionId: formData.get("questionId"),
    localOverrideAnswer: formData.get("localOverrideAnswer") || undefined,
    localOverrideExplanation:
      formData.get("localOverrideExplanation") || undefined,
    isDisabled: formData.get("isDisabled") || undefined,
  });

  if (!parsed.success) {
    redirect("/admin?message=Invalid question update.");
  }

  const { supabase } = await requireAdminUser();

  const update: Record<string, string | boolean | null> = {};

  if (parsed.data.localOverrideAnswer !== undefined) {
    update.local_override_answer =
      parsed.data.localOverrideAnswer.trim().toUpperCase() || null;
  }

  if (parsed.data.localOverrideExplanation !== undefined) {
    update.local_override_explanation =
      parsed.data.localOverrideExplanation.trim() || null;
  }

  if (parsed.data.isDisabled !== undefined) {
    update.is_disabled = parsed.data.isDisabled === "true";
  }

  const { error } = await supabase
    .from("questions")
    .update(update)
    .eq("id", parsed.data.questionId);

  if (error) {
    redirect(`/admin?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin");
  redirect("/admin?message=Question updated.");
}

export async function searchQuestions(formData: FormData) {
  const query = String(formData.get("query") ?? "").trim();

  if (!query) {
    redirect("/admin");
  }

  redirect(`/admin?q=${encodeURIComponent(query)}`);
}
