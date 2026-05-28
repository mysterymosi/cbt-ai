import Link from "next/link"
import { HistoryIcon, LogOutIcon, ShieldIcon } from "lucide-react"
import { signOut } from "@/components/auth"
import { SubmitButton } from "@/components/ui/submit-button"

export function AppHeader({
  name,
  isAdmin = false,
}: {
  name?: string | null
  isAdmin?: boolean
}) {
  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/dashboard" className="font-semibold text-primary">
          ExamAITutor
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/practice"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline"
          >
            Practice
          </Link>
          <Link
            href="/history"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:inline"
          >
            <HistoryIcon className="mr-1 inline size-4" />
            History
          </Link>
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:inline"
            >
              <ShieldIcon className="mr-1 inline size-4" />
              Admin
            </Link>
          ) : null}
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {name ? `Hi, ${name}` : "JAMB/UTME"}
          </span>
          <form action={signOut}>
            <SubmitButton
              variant="outline"
              pendingLabel="Signing out…"
              className="min-h-11"
            >
              <LogOutIcon data-icon="inline-start" />
              Log out
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  )
}
