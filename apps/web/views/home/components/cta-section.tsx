import { cn } from "@workspace/ui/lib/utils"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"
import { InstallButton } from "./install-button"

/** Viewfinder corner mark; echoes the crop frame in the hero. */
const Corner = ({ className }: { className: string }) => (
  <span
    aria-hidden="true"
    className={cn(
      "absolute size-8 border-primary-foreground sm:size-12",
      className
    )}
  />
)

export const CtaSection = () => (
  <section
    aria-labelledby="cta-heading"
    className="dark relative bg-primary px-4 py-24 text-primary-foreground sm:px-6 lg:py-36"
  >
    <div className="relative mx-auto max-w-6xl md:px-20">
      <Corner className="-top-8 -left-2 border-t-2 border-l-2 sm:-top-10 sm:-left-6" />
      <Corner className="-top-8 -right-2 border-t-2 border-r-2 sm:-top-10 sm:-right-6" />
      <Corner className="-bottom-8 -left-2 border-b-2 border-l-2 sm:-bottom-10 sm:-left-6" />
      <Corner className="-right-2 -bottom-8 border-r-2 border-b-2 sm:-right-6 sm:-bottom-10" />

      <h2
        id="cta-heading"
        className={cn(
          displayClass,
          "max-w-4xl py-6 text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-balance selection:bg-primary-foreground selection:text-primary sm:text-7xl lg:text-8xl"
        )}
      >
        {content.cta.headline}
      </h2>
      <p className="mt-4 max-w-xl text-lg leading-relaxed">
        {content.cta.description}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 pb-6">
        <InstallButton
          size="lg"
          className="bg-background text-foreground hover:bg-background/85"
        />
        <span className="text-sm font-medium">{content.cta.note}</span>
      </div>
    </div>
  </section>
)
