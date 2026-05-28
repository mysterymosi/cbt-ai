import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export async function SiteHeader() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-20 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            EA
          </span>
          <span className="font-semibold">ExamAITutor</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#preview" className="transition-colors hover:text-foreground">
            Preview
          </a>
          <a href="#workflow" className="transition-colors hover:text-foreground">
            Flow
          </a>
          <a href="#subjects" className="transition-colors hover:text-foreground">
            Subjects
          </a>
          <a href="#trust" className="transition-colors hover:text-foreground">
            Trust
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link href="/dashboard" className={cn(buttonVariants(), "min-h-11")}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }), "min-h-11")}
              >
                Log in
              </Link>
              <Link href="/signup" className={cn(buttonVariants(), "min-h-11")}>
                Start practice
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
