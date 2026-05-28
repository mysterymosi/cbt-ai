import { Badge } from "@/components/ui/badge"
import { SectionIntro } from "@/components/shared"
import { UTME_SUBJECTS } from "@/lib/constants/subjects"

export function SubjectsSection() {
  return (
    <section id="subjects" className="border-b bg-card/60">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[360px_1fr]">
        <SectionIntro
          eyebrow="Subject coverage"
          title="Seven high-demand UTME subjects, one clean starting point."
          text="Keeping the beta focused makes question sync, grading, reports, and tutor explanations easier to validate before broader exam coverage."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {UTME_SUBJECTS.map((subject, index) => (
            <div
              key={subject.value}
              className="group flex min-h-32 flex-col justify-between rounded-lg border bg-background p-4 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Badge variant="outline">UTME</Badge>
              </div>
              <div>
                <h3 className="font-semibold">{subject.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Question cache ready
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
