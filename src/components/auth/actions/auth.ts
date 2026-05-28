"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
  authSchema,
  resetPasswordSchema,
} from "@/components/auth/schemas"
import { createClient } from "@/lib/supabase/server"

async function getOrigin() {
  const headersList = await headers()
  return headersList.get("origin") ?? "http://localhost:3000"
}

export async function signIn(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    redirect("/login?message=Check your email and password.")
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    redirect(`/login?message=${encodeURIComponent(error.message)}`)
  }

  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const parsed = authSchema.safeParse(Object.fromEntries(formData))
  const name = String(formData.get("name") ?? "").trim()

  if (!parsed.success || !name) {
    redirect("/signup?message=Add your name, email, and a password with at least 6 characters.")
  }

  const supabase = await createClient()
  const origin = await getOrigin()
  const { error } = await supabase.auth.signUp({
    ...parsed.data,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/onboarding`,
      data: { name },
    },
  })

  if (error) {
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  redirect("/login?message=Check your email to confirm your account.")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function requestPasswordReset(formData: FormData) {
  const parsed = resetPasswordSchema.safeParse(Object.fromEntries(formData))

  if (!parsed.success) {
    redirect("/reset-password?message=Enter a valid email address.")
  }

  const supabase = await createClient()
  const origin = await getOrigin()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/auth/callback?next=/settings`,
  })

  if (error) {
    redirect(`/reset-password?message=${encodeURIComponent(error.message)}`)
  }

  redirect("/login?message=Password reset email sent.")
}
