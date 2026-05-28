"use server"

import { redirect } from "next/navigation"
import { onboardingSchema } from "@/components/onboarding/schemas"
import { trackServerEvent } from "@/lib/analytics/track-server"
import { createClient } from "@/lib/supabase/server"

export async function saveOnboarding(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const parsed = onboardingSchema.safeParse({
    name: String(formData.get("name") ?? "").trim(),
    subjects: formData.getAll("subjects"),
  })

  if (!parsed.success) {
    redirect("/onboarding?message=Choose at least one subject and add your name.")
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("selected_subjects")
    .eq("id", user.id)
    .maybeSingle<{ selected_subjects: string[] | null }>()

  const isFirstOnboarding = !existingProfile?.selected_subjects?.length

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    name: parsed.data.name,
    target_exam: "utme",
    selected_subjects: parsed.data.subjects,
    last_active_at: new Date().toISOString(),
  })

  if (error) {
    redirect(`/onboarding?message=${encodeURIComponent(error.message)}`)
  }

  if (isFirstOnboarding) {
    await trackServerEvent("signup_complete")
  }

  redirect("/dashboard")
}
