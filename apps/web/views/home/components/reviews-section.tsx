import envLib from "@/lib/env"
import { IconStarFilled } from "@tabler/icons-react"
import { FaChrome, FaFirefoxBrowser } from "react-icons/fa6"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"
import content from "../../../data/content.json"
import { displayClass } from "../fonts"

const BROWSER_ICONS = {
  chrome: FaChrome,
  firefox: FaFirefoxBrowser,
} as const

type Review = Omit<(typeof content.reviews.items)[number], "browser"> & {
  browser: keyof typeof BROWSER_ICONS
}

/** Imported JSON widens `browser` to `string`; restore the literal union. */
const reviews = content.reviews.items as Review[]

/** The store list is repeated so one copy always overflows the viewport. */
const MARQUEE_COPIES = 3

const repeatedReviews = Array.from(
  { length: MARQUEE_COPIES },
  () => reviews
).flat()

const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

const Stars = () => (
  <span className="flex gap-0.5 text-primary" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, index) => (
      <IconStarFilled key={index} className="size-4" />
    ))}
  </span>
)

const ReviewCard = ({ review }: { review: Review }) => {
  const BrowserIcon = BROWSER_ICONS[review.browser]

  return (
    <li className="flex w-80 shrink-0 flex-col border-t border-foreground pt-5 sm:w-96">
      <Stars />
      <blockquote className="mt-4 leading-relaxed">
        <p>&ldquo;{review.quote}&rdquo;</p>
      </blockquote>
      <footer className="mt-auto flex items-center gap-3 pt-6">
        <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary">
          <span
            aria-hidden="true"
            className="text-xs font-semibold text-muted-foreground"
          >
            {getInitials(review.name)}
          </span>
          {review.avatar && (
            <Image
              src={review.avatar}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">
            {review.name}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <BrowserIcon className="size-3.5" aria-hidden="true" />
            {content.reviews.sources[review.browser]}
          </span>
        </span>
      </footer>
    </li>
  )
}

export const ReviewsSection = () => (
  <section
    id="reviews"
    aria-labelledby="reviews-heading"
    className="scroll-mt-16 py-24 lg:py-32"
  >
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Stars />
          <span className="text-sm font-semibold">
            {content.reviews.rating}
          </span>
        </div>
        <h2
          id="reviews-heading"
          className={cn(
            displayClass,
            "mt-5 text-4xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-6xl"
          )}
        >
          {content.reviews.title}
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          {content.reviews.subtitle}
        </p>
      </div>
    </div>

    {/* Screen readers get the list once; the animated marquee is decorative. */}
    <ul className="sr-only">
      {content.reviews.items.map((review) => (
        <li key={review.name}>
          {review.quote} — {review.name}
        </li>
      ))}
    </ul>

    <div
      aria-hidden="true"
      className="group mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {[false, true].map((isCopy) => (
          <ul
            key={isCopy ? "copy" : "original"}
            className="flex w-max gap-6 pr-6"
          >
            {repeatedReviews.map((review, index) => (
              <ReviewCard key={`${review.name}-${index}`} review={review} />
            ))}
          </ul>
        ))}
      </div>
    </div>

    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <Link
        href={`${envLib.chromeStoreUrl ?? "#"}/reviews`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-16 inline-flex items-center font-medium underline decoration-primary decoration-2 underline-offset-4 hover:decoration-foreground"
      >
        {content.reviews.allReviewsCta}
      </Link>
    </div>
  </section>
)
