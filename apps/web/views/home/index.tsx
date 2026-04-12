"use client"

import { CtaSection } from "./components/cta-section"
import { FeaturesSection } from "./components/features-section"
import { Footer } from "./components/footer"
import { HeroSection } from "./components/hero-section"
import { Navbar } from "./components/navbar"
import { WorkflowSection } from "./components/workflow-section"

const HomeView = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}

export default HomeView
