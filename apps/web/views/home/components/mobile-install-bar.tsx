"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import content from "../../../data/content.json"
import { InstallButton } from "./install-button"

/** Keeps an install CTA in reach on small screens once the hero scrolls away. */
export const MobileInstallBar = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 p-3 backdrop-blur-md sm:hidden"
        >
          <InstallButton label={content.nav.primaryCta} className="w-full" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
