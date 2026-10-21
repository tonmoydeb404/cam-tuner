"use client"

import envLib from "@/lib/env"
import { IconChevronDown } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { ButtonGroup } from "@workspace/ui/components/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import * as React from "react"
import { FaChrome, FaFirefoxBrowser } from "react-icons/fa6"

interface InstallButtonProps {
  /** lg → "Add to Chrome", default → "Chrome", sm → compact labels. */
  size?: "sm" | "default" | "lg"
  /** Extra classes applied to the primary (Chrome) button. */
  className?: string
  /** Dropdown menu trigger button classes. */
  triggerClassName?: string
  /** Extra classes applied to the group wrapper. */
  groupClassName?: string
}

/** Every install call-to-action on the site goes through this component. */
export const InstallButton = ({
  size = "default",
  className,
  triggerClassName,
  groupClassName,
}: InstallButtonProps) => {
  const sizeStyles = {
    lg: {
      button: "h-14 px-7 text-base font-semibold",
      icon: "size-5",
      trigger: "h-14 w-14",
      label: (name: string) => `Add to ${name}`,
    },
    default: {
      button: "h-12 px-5 text-base font-semibold",
      icon: "size-5",
      trigger: "h-12 w-12",
      label: (name: string) => name,
    },
    sm: {
      button: "h-9 px-3.5 text-sm font-semibold",
      icon: "size-4",
      trigger: "h-9 w-9",
      label: (name: string) => name,
    },
  }

  const style = sizeStyles[size]
  const groupRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <ButtonGroup
      ref={groupRef}
      aria-label="Install CamTuner"
      className={groupClassName}
    >
      <Button
        nativeButton={false}
        render={
          <Link
            href={envLib.chromeStoreUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        aria-label="Install CamTuner for Chrome"
        className={cn(
          "rounded-l-full! rounded-r-none!",
          style.button,
          className
        )}
      >
        <FaChrome className={style.icon} aria-hidden="true" />
        <span>{style.label("Chrome")}</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              aria-label="More install options"
              className={cn(style.trigger, triggerClassName)}
            >
              <IconChevronDown className={style.icon} aria-hidden="true" />
            </Button>
          }
        />

        <DropdownMenuContent
          anchor={groupRef}
          align="end"
          className="w-(--anchor-width)"
        >
          {[
            {
              id: "chrome",
              href: envLib.chromeStoreUrl,
              name: "Chrome",
              Icon: FaChrome,
            },
            {
              id: "firefox",
              href: envLib.firefoxStoreUrl,
              name: "Firefox",
              Icon: FaFirefoxBrowser,
            },
          ].map((store) => (
            <DropdownMenuItem
              key={store.id}
              render={
                <a
                  href={store.href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <store.Icon className={style.icon} aria-hidden="true" />
              {style.label(store.name)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
