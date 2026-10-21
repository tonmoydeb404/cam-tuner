"use client"

import { IconMenu2, IconX } from "@tabler/icons-react"
import { useMotionValueEvent, useScroll } from "framer-motion"
import { useState } from "react"

import { assets } from "@/assets"
import ThemeButton from "@/components/theme-button"
import { brand } from "@/data/brand"
import content from "@/data/content.json"
import { InstallButton } from "@/views/home/components/install-button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { cn } from "@workspace/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

export const Navbar = () => {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24))

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled
          ? "border-border/50 bg-background/70 backdrop-blur-2xl"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-x-2">
          <Image src={assets.logo} alt={brand.name} width={35} priority />
          <span className="font-heading hidden text-xl font-bold sm:inline">
            {brand.name}
          </span>
        </Link>

        <nav
          aria-label="Global"
          className="hidden items-center gap-6 md:flex lg:gap-8"
        >
          {content.nav.links.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <ThemeButton />

          <InstallButton size="sm" groupClassName="hidden sm:inline-flex" />

          <Drawer open={menuOpen} onOpenChange={setMenuOpen} showSwipeHandle>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="inline-flex size-10 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/50 md:hidden"
            >
              <IconMenu2 className="size-5" aria-hidden="true" />
            </button>

            <DrawerContent>
              <DrawerHeader className="flex-row items-center justify-between text-left">
                <DrawerTitle>Menu</DrawerTitle>
                <DrawerClose
                  aria-label="Close menu"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground/50"
                >
                  <IconX className="size-4" aria-hidden="true" />
                </DrawerClose>
              </DrawerHeader>

              <nav aria-label="Mobile" className="flex flex-col p-4 pt-2">
                {content.nav.links.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded px-2 py-3 text-base font-medium text-foreground outline-none hover:bg-muted focus-visible:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <DrawerFooter>
                <InstallButton
                  size="default"
                  groupClassName="w-full"
                  className="flex-1"
                />
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
