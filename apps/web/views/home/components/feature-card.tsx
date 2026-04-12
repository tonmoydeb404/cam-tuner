"use client"

import { type TablerIcon } from "@tabler/icons-react"
import { motion } from "framer-motion"

const transitionProps = { duration: 0.6, ease: "easeOut" } as const

interface FeatureCardStat {
  value: string
  label: string
}

interface PrimaryFeatureCardProps {
  variant: "primary"
  icon: TablerIcon
  title: string
  description: string
  stats?: FeatureCardStat[]
  delay?: number
}

interface SecondaryFeatureCardProps {
  variant: "secondary"
  icon: TablerIcon
  title: string
  description: string
  index: number
  delay?: number
}

type FeatureCardProps = PrimaryFeatureCardProps | SecondaryFeatureCardProps

export const FeatureCard = (props: FeatureCardProps) => {
  const { variant, icon: Icon, title, description, delay = 0 } = props

  if (variant === "primary") {
    const { stats } = props as PrimaryFeatureCardProps
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ ...transitionProps, delay }}
        className="group relative col-span-1 overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-md transition-all hover:bg-card/60 sm:p-8 md:col-span-4 md:rounded-3xl lg:row-span-2"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/20 sm:mb-10 sm:size-14 sm:rounded-2xl">
            <Icon className="size-5 sm:size-6" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
          {stats && stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/50 pt-6 sm:mt-12 sm:gap-8 sm:pt-8">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const { index } = props as SecondaryFeatureCardProps
  const gradientClass = index === 0 ? "from-secondary/5" : "from-accent/5"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ ...transitionProps, delay }}
      className="group relative col-span-1 overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-6 shadow-xl backdrop-blur-md transition-all hover:bg-card/60 sm:p-8 md:col-span-2 md:rounded-3xl"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradientClass} via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100`}
      />
      <div className="relative z-10">
        <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-border/50 bg-muted/50 text-foreground sm:mb-6 sm:size-12">
          <Icon className="size-5" />
        </div>
        <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
