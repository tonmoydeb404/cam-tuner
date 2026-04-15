import { cn } from "@workspace/ui/lib/utils"
import { ReactNode } from "react"

type Props = {
  title: ReactNode
  description: ReactNode
  className?: string
}

const PageHeader = (props: Props) => {
  const { title, description, className } = props
  return (
    <div className={cn("container pt-32", className)}>
      <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
        {title}
      </h1>
      <p className="mt-4 text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  )
}

export default PageHeader
