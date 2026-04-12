"use client"

import { IconMoon, IconSun } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

type Props = {}

const ThemeButton = (_props: Props) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-8 animate-pulse rounded-md bg-gray-300" />
  }

  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <IconSun className="size-5" />
      ) : (
        <IconMoon className="size-5" />
      )}
    </Button>
  )
}

export default ThemeButton
