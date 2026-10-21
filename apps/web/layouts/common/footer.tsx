import { assets } from "@/assets"
import { brand } from "@/data/brand"
import { glossary } from "@/data/pseo/glossary"
import { personas } from "@/data/pseo/personas"
import { platforms } from "@/data/pseo/platforms"
import { ratios } from "@/data/pseo/ratios"
import Image from "next/image"
import Link from "next/link"

const linkClass =
  "text-sm text-muted-foreground transition-colors hover:text-foreground"

interface FooterLink {
  label: string
  href: string
}

const FooterColumn = ({
  label,
  links,
}: {
  label: string
  links: FooterLink[]
}) => (
  <nav aria-label={label}>
    <h2 className="text-sm font-semibold text-foreground">{label}</h2>
    <ul className="mt-4 space-y-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={linkClass}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
)

const tools: FooterLink[] = [
  { label: "Live demo", href: "/#demo" },
  { label: "Webcam test", href: "/webcam-test" },
  { label: "What's new", href: "/whats-new" },
]

const guides: FooterLink[] = [
  ...ratios.map((ratio) => ({
    label: `Crop to ${ratio.name}`,
    href: `/crop/${ratio.slug}`,
  })),
  ...personas.map((persona) => ({
    label: `For ${persona.name}`,
    href: `/for/${persona.slug}`,
  })),
]

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">
            <Link
              href="/"
              className="font-heading flex items-center gap-x-2 text-lg font-bold text-foreground"
            >
              <Image src={assets.logo} alt="" width={24} />
              <span>{brand.name}</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {brand.description.short}
            </p>
          </div>

          <FooterColumn label="Tools" links={tools} />
          <FooterColumn
            label="Works with"
            links={platforms.map((platform) => ({
              label: platform.name,
              href: `/on/${platform.slug}`,
            }))}
          />
          <FooterColumn label="Guides" links={guides} />
          <FooterColumn
            label="Learn"
            links={glossary.map((entry) => ({
              label: entry.term,
              href: `/learn/${entry.slug}`,
            }))}
          />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 md:flex-row">
          <p className="text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              {brand.name}
            </Link>{" "}
            © {new Date().getFullYear()}
          </p>
          <div className="flex gap-6 sm:gap-8">
            {brand.footerLinks.map((link) =>
              link.url.startsWith("/") ? (
                <Link key={link.name} href={link.url} className={linkClass}>
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.url}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={linkClass}
                >
                  {link.name}
                </a>
              )
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
