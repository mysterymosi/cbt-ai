import { workflow } from "@/components/landing/lib/content"
import { FeatureCard, SectionIntro } from "@/components/shared"

export function WorkflowSection() {
  return (
    <section id="workflow" className="border-b">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.75fr_1.25fr]">
        <SectionIntro
          eyebrow="Practice loop"
          title="Designed around the moment a student gets stuck."
          text="The product is intentionally narrow for the beta. It optimizes the path from a submitted answer to a clear explanation."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {workflow.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
