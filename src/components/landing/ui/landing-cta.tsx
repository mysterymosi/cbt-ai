import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LandingCta() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1fr_auto] md:items-center">
        <div className="flex flex-col gap-3">
          <Badge
            variant="outline"
            className="w-fit border-primary-foreground/30 text-primary-foreground"
          >
            Private beta
          </Badge>
          <h2 className="max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl">
            Start with Practice Mode. Add the full tutor loop next.
          </h2>
          <p className="max-w-2xl text-primary-foreground/75">
            M1 gives the product its foundation. M2 turns the interface into a
            complete scored practice session.
          </p>
        </div>
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "secondary" }),
            "min-h-11 w-full cursor-pointer md:w-auto"
          )}
        >
          Create account
          <ArrowRightIcon data-icon="inline-end" />
        </Link>
      </div>
    </section>
  )
}
