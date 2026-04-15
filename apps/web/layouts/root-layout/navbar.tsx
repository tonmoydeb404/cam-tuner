"use client"

import { motion } from "framer-motion"

import { assets } from "@/assets"
import ThemeButton from "@/components/theme-button"
import { brand } from "@/data/brand"
import content from "@/data/content.json"
import envLib from "@/lib/env"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

export const HomeNavbar = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/60 backdrop-blur-2xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href={"/"} className="flex items-center gap-x-2">
          <Image src={assets.logo} alt={brand.name} width={35} />
          <span className="font-heading text-xl font-bold">{brand.name}</span>
        </Link>

        <nav
          aria-label="Global"
          className="hidden items-center gap-6 md:flex lg:gap-8"
        >
          {content.nav.links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="relative text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:text-foreground hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeButton />

          <Link
            href={envLib.chromeStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "default", size: "lg" }))}
          >
            {content.nav.primaryCta}
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
