import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { ExamWorkspacePreview } from "@/components/landing/ui/workspace-preview"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { heroStats } from "@/components/landing/lib/content"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative border-b bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:py-16">
        <div className="flex flex-col gap-7">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">JAMB/UTME beta</Badge>
            <span className="text-sm text-muted-foreground">
              Practice mode first. Timed mode follows later.
            </span>
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Professional exam practice with explanations when students need
              them.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              ExamAITutor turns past-question practice into a focused study
              loop: answer, get feedback, then ask a tutor to explain the
              mistake in simple terms.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={cn(buttonVariants(), "min-h-11 cursor-pointer px-4")}
            >
              Start practice
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              href="#preview"
              className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
            >
              View workspace
            </Link>
          </div>

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            {heroStats.map((item, index) => (
              <div
                key={item.label}
                className={cn(
                  "flex min-h-24 flex-col justify-center gap-1 rounded-lg border bg-background px-4",
                  index === 1 && "bg-muted/40"
                )}
              >
                <p className="text-xl font-semibold">{item.value}</p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="preview" className="relative">
          <ExamWorkspacePreview />
        </div>
      </div>
    </section>
  )
}
