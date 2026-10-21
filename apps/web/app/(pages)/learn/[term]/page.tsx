import { FaqList } from "@/components/faq-list"
import { JsonLd } from "@/components/json-ld"
import { brand } from "@/data/brand"
import {
  glossaryBySlug,
  glossary,
  relatedGlossaryEntries,
} from "@/data/pseo/glossary"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import PageHeader from "@/layouts/page-layout/header"
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo"

interface Props {
  params: Promise<{ term: string }>
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

export const dynamicParams = false

export function generateStaticParams() {
  return glossary.map((entry) => ({ term: entry.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term: slug } = await params
  const entry = glossaryBySlug(slug)
  if (!entry) return {}
  return pageMetadata({
    path: `/learn/${entry.slug}`,
    title: entry.metaTitle,
    description: entry.metaDescription,
    fileBasedImage: true,
  })
}

export default async function GlossaryPage({ params }: Props) {
  const { term: slug } = await params
  const entry = glossaryBySlug(slug)
  if (!entry) notFound()

  const related = relatedGlossaryEntries(entry)

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Webcam guides", path: "/webcam" },
          { name: entry.term, path: `/learn/${entry.slug}` },
        ])}
      />
      <JsonLd
        data={faqSchema(
          entry.faqs,
          `${brand.baseUrl}/learn/${entry.slug}/#faq`
        )}
      />

      <PageHeader
        title={`What is ${entry.term}?`}
        description={entry.metaDescription}
        className="mb-14"
      />

      <div className="container pb-32">
        <div className="max-w-3xl space-y-14">
          <p className="border-l-4 border-primary pl-5 text-lg leading-relaxed font-medium text-foreground">
            {entry.definition}
          </p>

          <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
            {entry.body.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>

          <section
            aria-labelledby="camtuner-heading"
            className="rounded-lg border border-border bg-card p-6"
          >
            <SectionHeading id="camtuner-heading">
              How CamTuner fits in
            </SectionHeading>
            <p className="leading-relaxed text-muted-foreground">
              {entry.camtunerAngle}
            </p>
            <div className="mt-5">
              <Link
                href="/#demo"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "rounded-full"
                )}
              >
                See it live in the demo
              </Link>
            </div>
          </section>

          <section aria-labelledby="faq-heading">
            <SectionHeading id="faq-heading">{entry.term} FAQ</SectionHeading>
            <FaqList items={entry.faqs} />
          </section>

          {related.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="border-t border-border pt-10"
            >
              <SectionHeading id="related-heading">
                Related terms
              </SectionHeading>
              <ul className="flex flex-wrap gap-2">
                {related.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/learn/${item.slug}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-full"
                      )}
                    >
                      What is {item.term}?
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section
            aria-labelledby="all-terms-heading"
            className="border-t border-border pt-10"
          >
            <SectionHeading id="all-terms-heading">All terms</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {glossary
                .filter((g) => g.slug !== entry.slug)
                .map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/learn/${g.slug}`}
                      className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                    >
                      {g.term}
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
