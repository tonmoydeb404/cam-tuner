import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"
import { HeroStage } from "./hero-stage"
import { InstallButton } from "./install-button"

export const HeroSection = () => (
  <section
    aria-labelledby="hero-heading"
    className="px-4 pt-28 pb-16 sm:px-6 sm:pt-36 lg:pb-24"
  >
    <div className="mx-auto max-w-6xl">
      <h1
        id="hero-heading"
        className={cn(
          displayClass,
          "max-w-5xl text-5xl leading-[0.95] font-bold tracking-[-0.04em] text-balance sm:text-7xl lg:text-8xl"
        )}
      >
        {content.hero.headlineMain}
      </h1>

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <p className="text-lg leading-relaxed text-muted-foreground">
            {content.hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col">
            <InstallButton
              label={content.hero.primaryCta}
              className="h-14 px-8"
            />
            <Link
              href="/#demo"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-14 rounded-full px-8 text-base font-semibold"
              )}
            >
              {content.hero.secondaryCta}
            </Link>
          </div>

          <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
            {content.hero.trust.map((item) => (
              <li key={item} className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-primary"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-8">
          <HeroStage />
        </div>
      </div>
    </div>
  </section>
)
