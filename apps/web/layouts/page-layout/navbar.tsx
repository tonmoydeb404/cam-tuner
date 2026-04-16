import { assets } from "@/assets"
import { brand } from "@/data/brand"
import content from "@/data/content.json"
import envLib from "@/lib/env"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

export const PageNavbar = () => {
  return (
    <header className="border-b border-border/50 bg-background">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={assets.logo} alt={brand.name} width={28} />
          <span className="font-heading text-base font-bold text-foreground">
            {brand.name}
          </span>
        </Link>

        <Link
          href={envLib.chromeStoreUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          {content.nav.primaryCta}
        </Link>
      </div>
    </header>
  )
}
