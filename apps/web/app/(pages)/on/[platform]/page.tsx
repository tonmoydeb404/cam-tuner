import { FaqList } from "@/components/faq-list"
import { JsonLd } from "@/components/json-ld"
import { brand } from "@/data/brand"
import { platformBySlug, platforms } from "@/data/pseo/platforms"
import { InstallButton } from "@/views/home/components/install-button"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageHeader from "@/layouts/page-layout/header"
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ platform: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return platforms.map((platform) => ({ platform: platform.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform: slug } = await params
  const platform = platformBySlug(slug)
  if (!platform) return {}
  return pageMetadata({
    path: `/on/${platform.slug}`,
    title: platform.metaTitle,
    description: platform.metaDescription,
    fileBasedImage: true,
  })
}

const SupportRow = ({
  ok,
  label,
  note,
}: {
  ok: boolean
  label: string
  note: string
}) => (
  <div className="flex gap-4 border-b border-border py-4 last:border-b-0">
    <span
      aria-hidden="true"
      className={cn(
        "mt-0.5 font-bold",
        ok ? "text-primary" : "text-destructive"
      )}
    >
      {ok ? "✓" : "✕"}
    </span>
    <div>
      <p className="font-medium text-foreground">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {note}
      </p>
    </div>
  </div>
)

const SectionHeading = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => (
  <h2
    id={id}
    className="mb-5 text-2xl font-bold tracking-tight text-foreground"
  >
    {children}
  </h2>
)

export default async function PlatformPage({ params }: Props) {
  const { platform: slug } = await params
  const platform = platformBySlug(slug)
  if (!platform) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Webcam guides", path: "/webcam" },
          { name: platform.name, path: `/on/${platform.slug}` },
        ])}
      />
      <JsonLd
        data={faqSchema(
          platform.faqs,
          `${brand.baseUrl}/on/${platform.slug}/#faq`
        )}
      />

      <PageHeader
        title={`CamTuner for ${platform.name}`}
        description={platform.metaDescription}
        className="mb-14"
      />

      <div className="container pb-32">
        <div className="max-w-3xl space-y-14">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {platform.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <section aria-labelledby="support-heading">
            <SectionHeading id="support-heading">
              Does CamTuner work with {platform.name}?
            </SectionHeading>
            <div className="rounded-lg border border-border bg-card px-6 py-2">
              <SupportRow
                ok={platform.support.web}
                label={`${platform.name} in the browser`}
                note={
                  platform.support.web
                    ? "Works. CamTuner adjusts the camera stream inside the browser before the platform receives it."
                    : "Not supported."
                }
              />
              {platform.support.desktopApp && (
                <SupportRow
                  ok={false}
                  label={`${platform.name} desktop app`}
                  note={`The desktop app captures your camera outside the browser, so CamTuner can't adjust it. ${platform.support.note}`}
                />
              )}
              {!platform.support.desktopApp && (
                <SupportRow
                  ok
                  label="No desktop app to worry about"
                  note={platform.support.note}
                />
              )}
            </div>
          </section>

          <section aria-labelledby="setup-heading">
            <SectionHeading id="setup-heading">
              Set it up in under a minute
            </SectionHeading>
            <ol className="space-y-6">
              {platform.steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="font-mono text-sm font-bold text-primary"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section
            aria-labelledby="ratio-heading"
            className="rounded-lg border border-border bg-card p-6"
          >
            <SectionHeading id="ratio-heading">
              Recommended framing for {platform.name}
            </SectionHeading>
            <p className="leading-relaxed text-muted-foreground">
              {platform.name} reads best with a {platform.recommendedRatio}{" "}
              frame. See exactly how to set it up in our{" "}
              <Link
                href={`/crop/${platform.recommendedRatio.replace(":", "-")}`}
                className="text-primary underline underline-offset-4"
              >
                crop to {platform.recommendedRatio} guide
              </Link>
              , or try your framing live in the{" "}
              <Link
                href="/#demo"
                className="text-primary underline underline-offset-4"
              >
                demo on the homepage
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="quirks-heading">
            <SectionHeading id="quirks-heading">Good to know</SectionHeading>
            <ul className="space-y-5">
              {platform.quirks.map((quirk) => (
                <li key={quirk.title}>
                  <h3 className="font-semibold text-foreground">
                    {quirk.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {quirk.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq-heading">
            <SectionHeading id="faq-heading">
              {platform.name} + CamTuner FAQ
            </SectionHeading>
            <FaqList items={platform.faqs} />
          </section>

          <section
            aria-labelledby="related-heading"
            className="border-t border-border pt-10"
          >
            <SectionHeading id="related-heading">
              Works with the rest of your tools too
            </SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {platforms
                .filter((p) => p.slug !== platform.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/on/${p.slug}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-full"
                      )}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>

          <div className="flex flex-col items-start gap-3 border-t border-border pt-10">
            <InstallButton
              label={`Add to Chrome — free`}
              className="h-14 px-8"
            />
            <p className="text-sm text-muted-foreground">
              No account. No watermark. Processing stays on your device.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
