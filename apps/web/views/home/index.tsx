import { CtaSection } from "./components/cta-section"
import { FeaturesSection } from "./components/features-section"
import { HeroSection } from "./components/hero-section"
import { WorkflowSection } from "./components/workflow-section"

const HomeView = () => {
  return (
    <main className="pt-16">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <CtaSection />
    </main>
  )
}

export default HomeView
