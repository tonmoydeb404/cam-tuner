import { cn } from "@workspace/ui/lib/utils"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"
import { InstallButton } from "./install-button"

export const InstallSection = () => (
  <section
    id="install"
    aria-labelledby="install-heading"
    className="scroll-mt-16 border-y border-border bg-card px-4 py-24 sm:px-6 lg:py-32"
  >
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <h2
          id="install-heading"
          className={cn(
            displayClass,
            "text-4xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-6xl"
          )}
        >
          {content.install.title}
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {content.install.description}
        </p>
      </div>

      <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
        {content.install.steps.map((step) => (
          <li key={step.number}>
            <span
              className={cn(
                displayClass,
                "block text-7xl leading-none font-bold tracking-[-0.05em] text-primary-foreground [-webkit-text-stroke:2px_var(--foreground)] dark:text-primary dark:[-webkit-text-stroke:0]"
              )}
            >
              {Number(step.number)}
            </span>
            <h3
              className={cn(
                displayClass,
                "mt-6 text-2xl font-bold tracking-tight"
              )}
            >
              {step.title}
            </h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-14">
        <InstallButton size="lg" />
      </div>
    </div>
  </section>
)
