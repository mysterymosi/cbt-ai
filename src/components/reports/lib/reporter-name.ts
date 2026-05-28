import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function getReporterFullNameByUserId(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", userId)
    .maybeSingle<{ name: string | null }>();

  return profile?.name?.trim() || "ExamAITutor user";
}

export async function getReporterFullName(user: User) {
  return getReporterFullNameByUserId(user.id);
}
