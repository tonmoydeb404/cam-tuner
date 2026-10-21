import { CtaSection } from "./components/cta-section"
import { FaqSection } from "./components/faq-section"
import { FeaturesSection } from "./components/features-section"
import { HeroSection } from "./components/hero-section"
import { InstallSection } from "./components/install-section"
import { MobileInstallBar } from "./components/mobile-install-bar"
import { ProblemSection } from "./components/problem-section"
import { ReviewsSection } from "./components/reviews-section"
import { Showcase } from "./components/showcase"
import { WorksWith } from "./components/works-with"
import { display } from "./fonts"

const HomeView = () => {
  return (
    <main className={display.variable}>
      <HeroSection />
      <WorksWith />
      <ProblemSection />
      <Showcase />
      <FeaturesSection />
      <ReviewsSection />
      <InstallSection />
      <FaqSection />
      <CtaSection />
      <MobileInstallBar />
    </main>
  )
}

export default HomeView
