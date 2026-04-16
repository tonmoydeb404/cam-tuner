"use client"

import { brand } from "@/data/brand"
import Link from "next/link"

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
        <div className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase sm:text-xs">
          <Link href="/">{brand.name}</Link> © {new Date().getFullYear()}
        </div>
        <div className="flex gap-6 sm:gap-8">
          {brand.footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              rel="noopener noreferrer"
              target="_blank"
              className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground sm:text-xs"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
