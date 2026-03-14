/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type Props = {}

const PreviewError = (props: Props) => {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border bg-card p-6 text-center">
      <div className="mb-4 inline-block rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-500">
        <HugeiconsIcon
          icon={Alert02Icon}
          strokeWidth={1.5}
          className="h-8 w-8"
        />
      </div>
      <h3 className="mb-2 text-lg font-medium text-white">
        Camera Access Denied
      </h3>
      <p className="text-sm text-neutral-400">
        Please allow camera permissions in your browser settings to use Cam
        Tuner.
      </p>
    </div>
  )
}

export default PreviewError
