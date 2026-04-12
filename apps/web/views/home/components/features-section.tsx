"use client"

import {
  IconPalette,
  IconSettings,
  IconShield,
  type TablerIcon,
} from "@tabler/icons-react"
import { motion } from "framer-motion"
import content from "../../../data/content.json"
import { FeatureCard } from "./feature-card"

const ICONS: Record<string, TablerIcon> = {
  Settings: IconSettings,
  Shield: IconShield,
  Palette: IconPalette,
}

export const FeaturesSection = () => {
  const primaryCard = content.features.cards[0]
  const secondaryCards = content.features.cards.slice(1)

  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="relative border-y border-border/50 bg-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-0 -z-10 h-[300px] w-[300px] translate-x-[-30%] -translate-y-1/2 rounded-full bg-primary/10 opacity-50 blur-[80px] sm:h-[500px] sm:w-[500px] sm:blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center sm:mb-16"
        >
          <h2
            id="features-heading"
            className="text-3xl font-black tracking-tighter uppercase sm:text-4xl md:text-5xl"
          >
            {content.features.title}
          </h2>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">
            {content.features.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-6 lg:grid-rows-2">
          {primaryCard && (
            <FeatureCard
              variant="primary"
              icon={ICONS[primaryCard.icon] ?? IconSettings}
              title={primaryCard.title}
              description={primaryCard.description}
              stats={primaryCard.stats}
              delay={0.1}
            />
          )}

          {secondaryCards.map((card, idx) => (
            <FeatureCard
              key={idx}
              variant="secondary"
              icon={ICONS[card.icon] ?? IconShield}
              title={card.title}
              description={card.description}
              index={idx}
              delay={0.2 + idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
