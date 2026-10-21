import { FaqList } from "@/components/faq-list"
import { JsonLd } from "@/components/json-ld"
import { brand } from "@/data/brand"
import { platformBySlug } from "@/data/pseo/platforms"
import { otherRatios, ratioBySlug, ratios } from "@/data/pseo/ratios"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageHeader from "@/layouts/page-layout/header"
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo"
import { InstallButton } from "@/views/home/components/install-button"
import { RatioTool } from "./ratio-tool"

interface Props {
  params: Promise<{ ratio: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return ratios.map((ratio) => ({ ratio: ratio.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ratio: slug } = await params
  const ratio = ratioBySlug(slug)
  if (!ratio) return {}
  return pageMetadata({
    path: `/crop/${ratio.slug}`,
    title: ratio.metaTitle,
    description: ratio.metaDescription,
    fileBasedImage: true,
  })
}

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

export default async function CropRatioPage({ params }: Props) {
  const { ratio: slug } = await params
  const ratio = ratioBySlug(slug)
  if (!ratio) notFound()

  const fitsPlatforms = ratio.fitsPlatformSlugs
    .map((s) => platformBySlug(s))
    .filter((p) => p !== undefined)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Webcam guides", path: "/webcam" },
          { name: `Crop to ${ratio.name}`, path: `/crop/${ratio.slug}` },
        ])}
      />
      <JsonLd
        data={faqSchema(ratio.faqs, `${brand.baseUrl}/crop/${ratio.slug}/#faq`)}
      />

      <PageHeader
        title={`Crop your webcam to ${ratio.name}`}
        description={ratio.metaDescription}
        className="mb-14"
      />

      <div className="container space-y-14 pb-32">
        <div className="max-w-3xl space-y-14">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {ratio.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
        <RatioTool ratio={ratio.ratio} />
        <div className="max-w-3xl space-y-14">
          <section aria-labelledby="use-cases-heading">
            <SectionHeading id="use-cases-heading">
              When to frame {ratio.name}
            </SectionHeading>
            <ul className="space-y-3">
              {ratio.useCases.map((useCase) => (
                <li
                  key={useCase}
                  className="flex gap-3 leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {useCase}
                </li>
              ))}
            </ul>
            {fitsPlatforms.length > 0 && (
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Native fit for:{" "}
                {fitsPlatforms.map((platform, index) => (
                  <span key={platform.slug}>
                    {index > 0 && ", "}
                    <Link
                      href={`/on/${platform.slug}`}
                      className="text-primary underline underline-offset-4"
                    >
                      {platform.name}
                    </Link>
                  </span>
                ))}
                .
              </p>
            )}
          </section>

          <section aria-labelledby="tips-heading">
            <SectionHeading id="tips-heading">
              Framing tips for {ratio.name}
            </SectionHeading>
            <ul className="space-y-3">
              {ratio.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex gap-3 leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  {tip}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="faq-heading">
            <SectionHeading id="faq-heading">
              {ratio.name} webcam FAQ
            </SectionHeading>
            <FaqList items={ratio.faqs} />
          </section>

          <section
            aria-labelledby="related-heading"
            className="border-t border-border pt-10"
          >
            <SectionHeading id="related-heading">Other shapes</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {otherRatios(ratio.slug).map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/crop/${other.slug}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "rounded-full"
                    )}
                  >
                    {other.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-col items-start gap-3 border-t border-border pt-10">
            <InstallButton size="lg" />
            <p className="text-sm text-muted-foreground">
              The extension applies your crop automatically in Meet, Zoom and
              everywhere else. Free, no account, on-device.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
