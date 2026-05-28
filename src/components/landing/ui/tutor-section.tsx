import { tutorPrompts } from "@/components/landing/lib/content"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SmallProof } from "@/components/shared"

export function TutorSection() {
  return (
    <section className="border-b">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <TutorPanel />
        <div className="flex flex-col gap-5">
          <Badge className="w-fit" variant="secondary">
            AI tutor
          </Badge>
          <h2 className="max-w-2xl text-4xl font-semibold leading-tight">
            Tutor help appears after the student has already tried.
          </h2>
          <p className="max-w-xl leading-7 text-muted-foreground">
            The tutor receives structured question context: subject, year,
            options, correct answer, student answer, and source explanation.
            That keeps answers grounded and makes follow-up questions useful.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {tutorPrompts.map((prompt) => (
              <SmallProof key={prompt.text} {...prompt} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function TutorPanel() {
  return (
    <div className="rounded-xl border bg-card p-2 shadow-lg shadow-foreground/5">
      <div className="rounded-lg border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Tutor context</p>
            <p className="text-sm text-muted-foreground">Chemistry · 2010</p>
          </div>
          <Badge variant="secondary">Post-answer</Badge>
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-3">
          <div className="max-w-[85%] rounded-lg border bg-card p-3 text-sm leading-6">
            Why is hydrogen the answer instead of oxygen?
          </div>
          <div className="ml-auto max-w-[90%] rounded-lg bg-primary p-3 text-sm leading-6 text-primary-foreground">
            Zinc is more reactive than hydrogen, so it displaces hydrogen from
            hydrochloric acid. Oxygen is not produced in this reaction.
          </div>
          <div className="max-w-[82%] rounded-lg border bg-card p-3 text-sm leading-6">
            What topic should I revise?
          </div>
        </div>
      </div>
    </div>
  )
}
