"use client"

import { releaseNotes } from "@/data/release-notes"
import { IconCheck, IconPackage } from "@tabler/icons-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

type Props = {}

const TimelineSection = (props: Props) => {
  const searchParams = useSearchParams()
  const activeVersion = searchParams.get("version") || releaseNotes[0]?.version

  const activeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute top-0 bottom-0 left-4 w-px bg-border sm:left-5" />

      <div className="space-y-8 sm:space-y-12">
        {releaseNotes.map((note) => {
          const isActive = note.version === activeVersion
          return (
            <div
              key={note.version}
              ref={isActive ? activeRef : undefined}
              className="relative flex gap-4 sm:gap-6"
            >
              {/* Dot */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 sm:h-10 sm:w-10 ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : note.breaking
                      ? "border-destructive/10 bg-red-100 text-destructive dark:bg-red-950"
                      : "border-border bg-background text-muted-foreground"
                }`}
              >
                <IconPackage size={14} className="sm:hidden" />
                <IconPackage size={16} className="hidden sm:block" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                {/* Version row */}
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground sm:text-base sm:font-bold">
                    v{note.version} — {note.title}
                  </h2>
                </div>

                {/* Date */}
                <div className="mb-4 block">
                  <time className="text-xs text-muted-foreground">
                    {new Date(note.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {isActive && (
                    <span className="ml-2 rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Latest
                    </span>
                  )}
                  {note.breaking && (
                    <span className="ml-2 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                      Breaking Changes
                    </span>
                  )}
                </div>

                {/* Highlights */}
                <ul className="space-y-2">
                  {note.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <IconCheck
                        size={14}
                        className="mt-0.5 shrink-0 text-primary"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TimelineSection
