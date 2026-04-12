import { IconAlertCircle } from "@tabler/icons-react"
import { brand } from "../../data/brand"

interface PreviewErrorProps {
  error?: string | null
}

const PreviewError = ({ error }: PreviewErrorProps) => {
  const isDenied =
    error?.toLowerCase().includes("denied") ||
    error?.toLowerCase().includes("permission")

  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
      <div className="mb-4 inline-block rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500">
        <IconAlertCircle className="h-8 w-8" />
      </div>
      <h3 className="mb-2 text-lg font-medium text-white">
        {isDenied ? "Camera Access Denied" : "Camera Error"}
      </h3>
      <p className="text-sm text-neutral-400">
        {isDenied
          ? `Please allow camera permissions in your browser settings to use ${brand.name}.`
          : (error ?? "Something went wrong accessing your camera.")}
      </p>
    </div>
  )
}

export default PreviewError
