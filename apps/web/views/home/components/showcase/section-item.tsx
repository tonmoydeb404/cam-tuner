"use client"

import { cn } from "@workspace/ui/lib/utils"
import { useInView } from "framer-motion"
import { type ReactNode, useEffect, useRef } from "react"
import { displayClass } from "../../fonts"

interface ShowcaseSectionItemProps {
  index: number
  title: string
  description: string
  active: boolean
  /** Called when this section crosses the middle of the viewport. */
  onActive: (index: number) => void
  children: ReactNode
}

export const ShowcaseSectionItem = ({
  index,
  title,
  description,
  active,
  onActive,
  children,
}: ShowcaseSectionItemProps) => {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" })

  useEffect(() => {
    if (inView) onActive(index)
  }, [inView, index, onActive])

  return (
    <article
      ref={ref}
      className={cn(
        "flex items-center py-10 transition-opacity duration-300 motion-reduce:transition-none lg:min-h-[70vh]",
        active ? "opacity-100" : "opacity-40 focus-within:opacity-100"
      )}
    >
      <div className="w-full">
        <h3
          className={cn(
            displayClass,
            "text-3xl leading-tight font-bold tracking-[-0.02em] text-balance sm:text-4xl"
          )}
        >
          {title}
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
          {description}
        </p>
        <div className="mt-6 rounded-[0.5rem] border border-border bg-card p-5">
          {children}
        </div>
      </div>
    </article>
  )
}
