"use client"

import { motion } from "framer-motion"
import content from "../../../data/content.json"

export const WorkflowSection = () => {
  return (
    <section id="workflow" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden bg-background">
      <div className="mx-auto max-w-3xl relative z-10">
        <div className="space-y-16 sm:space-y-24">
          {content.workflow.steps.map((s: { number: string; title: string; description: string }, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              className="group flex flex-col md:flex-row md:gap-12 lg:gap-16 items-start md:items-center"
            >
              <div className="text-6xl sm:text-7xl font-black text-muted transition-colors duration-500 group-hover:text-primary md:text-8xl lg:text-9xl">
                {s.number}
              </div>
              <div className="mt-2 md:mt-0">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground uppercase">
                  {s.title}
                </h3>
                <p className="mt-2 sm:mt-4 text-base sm:text-lg lg:text-xl leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
