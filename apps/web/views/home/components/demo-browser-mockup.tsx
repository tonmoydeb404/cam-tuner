"use client"

interface DemoBrowserMockupProps {
  children: React.ReactNode
}

export const DemoBrowserMockup = ({ children }: DemoBrowserMockupProps) => {
  return (
    <div
      role="region"
      aria-label="Interactive camera demo"
      className="relative rounded-2xl border border-border/50 shadow-2xl"
    >
      <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-linear-to-b from-primary/30 to-transparent opacity-50 blur-lg sm:blur-xl" />

      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-background shadow-inner">
        {children}
      </div>
    </div>
  )
}
