import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"

export const ProblemSection = () => (
  <section
    aria-labelledby="problem-heading"
    className="px-4 py-24 sm:px-6 lg:py-32"
  >
    <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h2
            id="problem-heading"
            className={cn(
              displayClass,
              "text-4xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-5xl"
            )}
          >
            {content.problem.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            {content.problem.description}
          </p>
          <p className="mt-8 max-w-md font-medium">
            {content.problem.bridge}{" "}
            <Link
              href="/#demo"
              className="underline decoration-primary decoration-2 underline-offset-4 hover:decoration-foreground"
            >
              {content.problem.bridgeCta}
            </Link>
          </p>
        </div>
      </div>

      <ul className="border-t border-foreground lg:col-span-7">
        {content.problem.pains.map((pain) => (
          <li
            key={pain.title}
            className="grid gap-2 border-b border-border py-7 sm:grid-cols-[11rem_1fr] sm:gap-8"
          >
            <h3
              className={cn(displayClass, "text-2xl font-bold tracking-tight")}
            >
              {pain.title}
            </h3>
            <p className="leading-relaxed text-muted-foreground">
              {pain.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  </section>
)
