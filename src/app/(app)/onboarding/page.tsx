import { redirect } from "next/navigation"
import { OnboardingForm } from "@/components/onboarding"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>
}) {
  const { message } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, selected_subjects")
    .eq("id", user.id)
    .maybeSingle()

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary">Setup</p>
        <h1 className="text-3xl font-semibold">Choose your UTME subjects</h1>
        <p className="text-muted-foreground">
          This keeps practice recommendations focused on the exams you are
          preparing for now.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Study profile</CardTitle>
          <CardDescription>UTME beta supports seven core subjects.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {message ? (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              {message}
            </p>
          ) : null}
          <OnboardingForm
            defaultName={profile?.name ?? user.user_metadata?.name}
            selectedSubjects={profile?.selected_subjects ?? []}
          />
        </CardContent>
      </Card>
    </main>
  )
}
