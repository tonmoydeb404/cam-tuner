import { platforms } from "@/data/pseo/platforms"
import Link from "next/link"
import content from "../../../data/content.json"

const platformByName = new Map(platforms.map((p) => [p.name, p]))

export const WorksWith = () => (
  <section
    aria-label={content.worksWith.label}
    className="border-y border-border px-4 py-6 sm:px-6"
  >
    <div className="mx-auto flex max-w-6xl flex-col gap-x-10 gap-y-7 lg:flex-row lg:items-baseline">
      <p className="shrink-0 text-sm text-muted-foreground">
        {content.worksWith.label}
      </p>
      <ul className="flex flex-wrap gap-x-7 gap-y-5 font-medium">
        {content.worksWith.items.map((item) => {
          const platform = platformByName.get(item)
          return (
            <li key={item}>
              {platform ? (
                <Link
                  href={`/on/${platform.slug}`}
                  className="transition-colors hover:text-primary"
                >
                  {item}
                </Link>
              ) : (
                item
              )}
            </li>
          )
        })}
      </ul>
    </div>
  </section>
)
