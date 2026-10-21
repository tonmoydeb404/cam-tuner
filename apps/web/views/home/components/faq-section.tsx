import { IconPlus } from "@tabler/icons-react"
import { cn } from "@workspace/ui/lib/utils"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"

export const FaqSection = () => (
  <section
    id="faq"
    aria-labelledby="faq-heading"
    className="scroll-mt-16 px-4 py-24 sm:px-6 lg:py-32"
  >
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12 lg:gap-16">
      <h2
        id="faq-heading"
        className={cn(
          displayClass,
          "text-4xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-5xl lg:col-span-4"
        )}
      >
        {content.faq.title}
      </h2>

      <div className="divide-y divide-border border-y border-foreground lg:col-span-8">
        {content.faq.items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {item.q}
              <IconPlus
                aria-hidden="true"
                className="size-5 shrink-0 transition-transform group-open:rotate-45 motion-reduce:transition-none"
              />
            </summary>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
)
