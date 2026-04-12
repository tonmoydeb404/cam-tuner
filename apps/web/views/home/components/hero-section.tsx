import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { motion } from "framer-motion"
import Link from "next/link"
import content from "../../../data/content.json"
import { DemoSection } from "./demo-section"

export const HeroSection = () => {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex flex-col items-center overflow-hidden px-4 pt-28 pb-20 text-center sm:px-6 lg:pt-36 lg:pb-28"
    >
      {/* Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-70 blur-[80px] sm:h-[600px] sm:w-[600px] sm:blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-secondary/10 opacity-50 blur-[60px] sm:h-[400px] sm:w-[400px] sm:blur-[100px]"
      />

      {/* Headline */}
      <motion.h1
        id="hero-heading"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="max-w-[90vw] text-5xl leading-[1.1] font-black tracking-tighter sm:max-w-5xl sm:text-7xl sm:leading-[0.95] md:text-8xl lg:text-[9rem]"
      >
        <span className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
          {content.hero.headlineMain}
        </span>
        <br />
        <span className="text-muted-foreground/30">
          {content.hero.headlineSub}
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-6 max-w-xl text-base leading-relaxed font-medium text-muted-foreground sm:mt-8 sm:max-w-2xl sm:text-lg md:text-xl"
      >
        {content.hero.description}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="z-10 mt-10 flex w-full flex-col gap-4 sm:mt-12 sm:w-auto sm:flex-row"
      >
        <Link
          href={process.env.NEXT_PUBLIC_CHROME_STORE_URL!}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-15 min-w-[240px] text-base font-semibold"
          )}
        >
          {content.hero.primaryCta}
        </Link>
        <Link
          href={"/#hero-demo"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-15 min-w-[200px] text-base font-semibold"
          )}
        >
          {content.hero.secondaryCta}
        </Link>
      </motion.div>

      <DemoSection />
    </section>
  )
}
