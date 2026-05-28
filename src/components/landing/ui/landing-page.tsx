import { HeroSection } from "@/components/landing/ui/hero-section"
import { LandingCta } from "@/components/landing/ui/landing-cta"
import { SiteFooter } from "@/components/landing/ui/site-footer"
import { SiteHeader } from "@/components/landing/ui/site-header"
import { SubjectsSection } from "@/components/landing/ui/subjects-section"
import { TrustSection } from "@/components/landing/ui/trust-section"
import { TutorSection } from "@/components/landing/ui/tutor-section"
import { WorkflowSection } from "@/components/landing/ui/workflow-section"

export function LandingPage() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background">
      <SiteHeader />
      <HeroSection />
      <WorkflowSection />
      <SubjectsSection />
      <TutorSection />
      <TrustSection />
      <LandingCta />
      <SiteFooter />
    </main>
  )
}
