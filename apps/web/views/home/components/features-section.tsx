import { cn } from "@workspace/ui/lib/utils"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"

export const FeaturesSection = () => (
  <section
    id="features"
    aria-labelledby="features-heading"
    className="scroll-mt-16 px-4 py-24 sm:px-6 lg:py-32"
  >
    <div className="mx-auto max-w-6xl">
      <div className="max-w-3xl">
        <h2
          id="features-heading"
          className={cn(
            displayClass,
            "text-4xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-6xl"
          )}
        >
          {content.features.title}
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {content.features.subtitle}
        </p>
      </div>

      <ul className="mt-16 grid gap-x-16 gap-y-12 md:grid-cols-2">
        {content.features.cards.map((card) => {
          const stat = "stat" in card ? card.stat : undefined
          return (
            <li key={card.title} className="border-t border-foreground pt-5">
              <h3
                className={cn(
                  displayClass,
                  "text-2xl font-bold tracking-tight"
                )}
              >
                {card.title}
              </h3>
              <p className="mt-3 max-w-md leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              {stat && (
                <p className="mt-4 inline-block rounded-sm bg-primary px-2 py-1 text-sm font-semibold text-primary-foreground">
                  {stat.value} {stat.label.toLowerCase()}
                </p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  </section>
)
