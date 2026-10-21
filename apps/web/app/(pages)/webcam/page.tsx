import { FaqList } from "@/components/faq-list"
import { glossary } from "@/data/pseo/glossary"
import { personas } from "@/data/pseo/personas"
import { platforms } from "@/data/pseo/platforms"
import { ratios } from "@/data/pseo/ratios"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"

import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/webcam",
  title: "Webcam Guides & Tools — CamTuner",
  description:
    "Webcam tools and platform guides: test your camera online, fix your framing on Meet, Zoom and Teams, and crop your feed to any aspect ratio.",
})

const cardClass =
  "block rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/40"

export default function WebcamHubPage() {
  return (
    <>
      <div className="container pt-32">
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
          Webcam guides &amp; tools
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Everything you need to look right on camera: test your webcam, fix
          your framing on the platform you call from, and crop your feed to the
          exact shape you need.
        </p>

        <div className="max-w-3xl space-y-16 pt-16 pb-32">
          <section aria-labelledby="tools-heading">
            <h2
              id="tools-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/webcam-test" className={cardClass}>
                <p className="font-semibold">Webcam test</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  Check your camera in the browser — see the live feed, detected
                  resolution and frame rate. Nothing is uploaded.
                </p>
              </Link>
              <Link href="/whats-new" className={cardClass}>
                <p className="font-semibold">What&apos;s new</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  The full CamTuner release history — every version, dated, with
                  the highlights of each update.
                </p>
              </Link>
            </div>
          </section>

          <section aria-labelledby="platforms-heading">
            <h2
              id="platforms-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              By platform
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {platforms.map((platform) => (
                <Link
                  key={platform.slug}
                  href={`/on/${platform.slug}`}
                  className={cardClass}
                >
                  <p className="font-semibold">{platform.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {platform.metaDescription.split(".")[0]}.
                  </p>
                  <p className="mt-3 text-xs font-medium text-primary">
                    Best framing: {platform.recommendedRatio}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="personas-heading">
            <h2
              id="personas-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              By call type
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {personas.map((persona) => (
                <Link
                  key={persona.slug}
                  href={`/for/${persona.slug}`}
                  className={cardClass}
                >
                  <p className="font-semibold">For {persona.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {persona.metaDescription.split(".")[0]}.
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="ratios-heading">
            <h2
              id="ratios-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              By aspect ratio
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ratios.map((ratio) => (
                <Link
                  key={ratio.slug}
                  href={`/crop/${ratio.slug}`}
                  className={cardClass}
                >
                  <p className="font-semibold">Crop to {ratio.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {ratio.metaDescription.split(".")[0]}.
                  </p>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="learn-heading">
            <h2
              id="learn-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              Learn the terms
            </h2>
            <ul className="flex flex-wrap gap-2">
              {glossary.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    href={`/learn/${entry.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-full"
                    )}
                  >
                    What is {entry.term}?
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq-heading">
            <h2
              id="faq-heading"
              className="mb-6 text-2xl font-bold tracking-tight"
            >
              Common questions
            </h2>
            <FaqList
              items={[
                {
                  q: "How do I fix a badly framed webcam?",
                  a: "Install a framing tool that adjusts the video before your call app sees it. CamTuner lets you crop, zoom and align your feed once in the browser, and the framing applies to every call automatically.",
                },
                {
                  q: "Why do I look so small and far away on calls?",
                  a: "Laptop webcams use wide-angle lenses designed to fit the whole room in frame. Cropping and zooming at the source — rather than relying on the app's automatic crop — puts you back in focus.",
                },
                {
                  q: "Does adjusting my webcam require extra software?",
                  a: "Not with CamTuner. It's a browser extension, so there's no virtual camera driver or desktop app to install, and all processing happens on your device.",
                },
              ]}
            />
          </section>

          <div>
            <Link
              href="/#demo"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-12 rounded-full px-6 text-base font-semibold"
              )}
            >
              Try the live demo
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
