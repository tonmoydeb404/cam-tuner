"use client"

import { motion } from "framer-motion"
import content from "../../../data/content.json"

export const CtaSection = () => {
  return (
    <section
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-border/50 bg-background px-4 py-20 sm:px-6 sm:py-32"
    >
      {/* Background Gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <h2
          id="cta-heading"
          className="bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-4xl font-black tracking-tighter text-transparent sm:text-6xl lg:text-7xl"
        >
          {content.cta.headline}
        </h2>
        <p className="mt-6 px-4 text-lg font-medium text-muted-foreground sm:mt-8 sm:px-0 sm:text-2xl sm:text-xl">
          {content.cta.description}
        </p>

        <div className="mt-10 flex w-full justify-center sm:mt-12">
          <a
            href={process.env.NEXT_PUBLIC_CHROME_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-xl bg-primary px-8 text-xs font-black tracking-[0.2em] text-primary-foreground uppercase shadow-2xl shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/80 hover:shadow-primary/40 sm:h-16 sm:w-auto sm:rounded-2xl sm:px-12 sm:text-sm"
          >
            <span className="relative z-10 flex w-full items-center justify-center gap-2">
              {content.cta.button}
            </span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}
