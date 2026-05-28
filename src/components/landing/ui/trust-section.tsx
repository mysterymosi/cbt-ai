import { outcomes } from "@/components/landing/lib/content"
import { FeatureCard, SectionIntro } from "@/components/shared"

export function TrustSection() {
  return (
    <section id="trust" className="border-b bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.7fr_1.3fr]">
        <SectionIntro
          eyebrow="Foundation"
          title="Modern UI backed by a practical data model."
          text="The first milestone already includes the pieces needed for practice, progress, reports, tutor history, and cost controls."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {outcomes.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
