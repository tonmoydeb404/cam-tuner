"use client"

import WelcomeBanner from "@/views/preview/welcome-banner"
import confetti from "canvas-confetti"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function startConfetti() {
  const duration = 15 * 1000
  const animationEnd = Date.now() + duration
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)

  return interval
}

const WelcomeHandler = () => {
  const searchParams = useSearchParams()
  const [open, setOpen] = useState(false)
  const fired = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (fired.current) return
    if (searchParams.get("welcome") !== "true") return

    fired.current = true
    setOpen(true)
    intervalRef.current = startConfetti()

    const url = new URL(window.location.href)
    url.searchParams.delete("welcome")
    window.history.replaceState({}, "", url.pathname)
  }, [searchParams])

  const handleDismiss = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setOpen(false)
  }

  return <WelcomeBanner open={open} onDismiss={handleDismiss} />
}

export default WelcomeHandler
