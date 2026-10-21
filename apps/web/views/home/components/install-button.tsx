import envLib from "@/lib/env"
import { IconBrandChrome } from "@tabler/icons-react"
import { buttonVariants } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

interface InstallButtonProps {
  label: string
  className?: string
  variant?: "default" | "outline"
}

/** Every install call-to-action on the page goes through this component. */
export const InstallButton = ({
  label,
  className,
  variant = "default",
}: InstallButtonProps) => (
  <Link
    href={envLib.chromeStoreUrl ?? "#"}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      buttonVariants({ variant }),
      "h-12 gap-2 rounded-full px-6 text-base font-semibold",
      className
    )}
  >
    <IconBrandChrome className="size-5" />
    {label}
  </Link>
)
