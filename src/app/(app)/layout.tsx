import { redirect } from "next/navigation"
import { AppHeader } from "@/components/app-shell"
import { createClient } from "@/lib/supabase/server"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("id", user.id)
    .maybeSingle<{ name: string | null; role: "student" | "admin" }>()

  return (
    <div className="min-h-dvh">
      <AppHeader
        name={profile?.name ?? user.user_metadata?.name}
        isAdmin={profile?.role === "admin"}
      />
      {children}
    </div>
  )
}
