import { CtaSection } from "@/components/sections/CtaSection"
import { FeatureSection } from "@/components/sections/FeatureSection"
import { HeroSection } from "@/components/sections/HeroSection"
import { ModelSummarySection } from "@/components/sections/ModelSummarySection"
import { WorkflowSection } from "@/components/sections/WorkflowSection"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <WorkflowSection />
      <ModelSummarySection />
      <CtaSection />
    </>
  )
}
