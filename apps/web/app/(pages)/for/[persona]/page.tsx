import { FaqList } from "@/components/faq-list"
import { JsonLd } from "@/components/json-ld"
import { brand } from "@/data/brand"
import { personaBySlug, personas } from "@/data/pseo/personas"
import { platformBySlug } from "@/data/pseo/platforms"
import { ratioBySlug } from "@/data/pseo/ratios"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageHeader from "@/layouts/page-layout/header"
import { InstallButton } from "@/views/home/components/install-button"
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ persona: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return personas.map((persona) => ({ persona: persona.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { persona: slug } = await params
  const persona = personaBySlug(slug)
  if (!persona) return {}
  return pageMetadata({
    path: `/for/${persona.slug}`,
    title: persona.metaTitle,
    description: persona.metaDescription,
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

export default async function PersonaPage({ params }: Props) {
  const { persona: slug } = await params
  const persona = personaBySlug(slug)
  if (!persona) notFound()

  const ratio = ratioBySlug(persona.ratioSlug)
  const platforms = persona.platformSlugs
    .map((s) => platformBySlug(s))
    .filter((p) => p !== undefined)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Webcam guides", path: "/webcam" },
          { name: `For ${persona.name}`, path: `/for/${persona.slug}` },
        ])}
      />
      <JsonLd
        data={faqSchema(
          persona.faqs,
          `${brand.baseUrl}/for/${persona.slug}/#faq`
        )}
      />

      <PageHeader
        title={`Better webcam framing for ${persona.name}`}
        description={persona.metaDescription}
        className="mb-14"
      />

      <div className="container pb-32">
        <div className="max-w-3xl space-y-14">
          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {persona.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <section aria-labelledby="pains-heading">
            <SectionHeading id="pains-heading">
              The camera problems {persona.name} run into
            </SectionHeading>
            <ul className="space-y-5">
              {persona.pains.map((pain) => (
                <li key={pain.title}>
                  <h3 className="font-semibold text-foreground">
                    {pain.title}
                  </h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">
                    {pain.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="setup-heading"
            className="rounded-lg border border-border bg-card p-6"
          >
            <SectionHeading id="setup-heading">
              The setup that works
            </SectionHeading>
            <p className="leading-relaxed text-muted-foreground">
              Start with a{" "}
              {ratio && (
                <Link
                  href={`/crop/${ratio.slug}`}
                  className="text-primary underline underline-offset-4"
                >
                  {ratio.name} crop
                </Link>
              )}{" "}
              as the foundation, then layer in the features that fit how{" "}
              {persona.name} work:
            </p>
            <ul className="mt-5 space-y-4">
              {persona.features.map((feature) => (
                <li key={feature.title} className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {feature.title}
                    </p>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="tips-heading">
            <SectionHeading id="tips-heading">
              Tips for {persona.name}
            </SectionHeading>
            <ul className="space-y-3">
              {persona.tips.map((tip) => (
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

          {platforms.length > 0 && (
            <section aria-labelledby="platforms-heading">
              <SectionHeading id="platforms-heading">
                Where {persona.name} use it
              </SectionHeading>
              <ul className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <li key={platform.slug}>
                    <Link
                      href={`/on/${platform.slug}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-full"
                      )}
                    >
                      {platform.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="faq-heading">
            <SectionHeading id="faq-heading">
              {persona.name} webcam FAQ
            </SectionHeading>
            <FaqList items={persona.faqs} />
          </section>

          <section
            aria-labelledby="related-heading"
            className="border-t border-border pt-10"
          >
            <SectionHeading id="related-heading">
              Other call types
            </SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {personas
                .filter((p) => p.slug !== persona.slug)
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/for/${p.slug}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-full"
                      )}
                    >
                      For {p.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>

          <div className="flex flex-col items-start gap-3 border-t border-border pt-10">
            <InstallButton
              label="Add to Chrome — it's free"
              className="h-14 px-8"
            />
            <p className="text-sm text-muted-foreground">
              Set it up once — every call after that is already framed. No
              account, fully on-device.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
