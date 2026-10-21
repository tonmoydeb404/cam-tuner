"use client"

import {
  IconAlertCircle,
  IconCamera,
  IconLoader,
  IconShield,
} from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { motion } from "framer-motion"

export type CamState = "idle" | "requesting" | "active" | "denied" | "error"

interface OnStartProps {
  onStart: () => void
}

interface IdleStateProps extends OnStartProps {
  title?: string
  description?: string
  buttonLabel?: string
}

export const IdleState = ({
  onStart,
  title = "Start Camera",
  description = "Click below to start your camera.",
  buttonLabel = "Start Camera",
}: IdleStateProps) => (
  <motion.div
    key="idle"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center gap-4 p-5 text-center sm:gap-5 sm:p-8"
  >
    <div className="rounded-full border border-primary/30 bg-primary/10 p-4 text-primary sm:p-6">
      <IconCamera className="size-8 sm:size-10" />
    </div>
    <div>
      <p className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </p>
      <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Button onClick={onStart}>{buttonLabel}</Button>
    </div>
  </motion.div>
)

export const RequestingState = () => (
  <motion.div
    key="requesting"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center gap-4 p-5 text-center sm:gap-5 sm:p-8"
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      className="rounded-full border border-primary/30 bg-primary/10 p-4 text-primary sm:p-6"
    >
      <IconLoader className="size-8 sm:size-10" />
    </motion.div>
    <div>
      <p className="mb-0 text-base font-semibold text-foreground sm:text-lg">
        Waiting for permission
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Check your browser&apos;s address bar and allow camera access.
      </p>
    </div>
  </motion.div>
)

export const DeniedState = ({ onStart }: OnStartProps) => (
  <motion.div
    key="denied"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center gap-4 p-5 text-center sm:gap-5 sm:p-8"
  >
    <div className="rounded-full border border-destructive/30 bg-destructive/10 p-4 text-destructive sm:p-6">
      <IconShield className="size-8 sm:size-10" />
    </div>
    <div>
      <p className="mb-0 text-base font-semibold text-foreground sm:text-lg">
        Camera access denied
      </p>
      <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Click the camera icon in your browser&apos;s address bar, allow access,
        then try again.
      </p>
      <Button variant="outline" onClick={onStart}>
        Try Again
      </Button>
    </div>
  </motion.div>
)

export const ErrorState = ({
  onStart,
  error,
}: OnStartProps & { error: string | null }) => (
  <motion.div
    key="error"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    className="flex flex-col items-center justify-center gap-4 p-5 text-center sm:gap-5 sm:p-8"
  >
    <div className="rounded-full border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-500 sm:p-6">
      <IconAlertCircle className="size-8 sm:size-10" />
    </div>
    <div>
      <p className="text-base font-semibold text-foreground sm:text-lg">
        Camera not available
      </p>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        {error ?? "No camera detected. Check connections and try again."}
      </p>
      <Button variant="outline" onClick={onStart}>
        Retry
      </Button>
    </div>
  </motion.div>
)

/** Derive a CamState from useWebcam values */
export function deriveCamState({
  isLoading,
  stream,
  error,
}: {
  isLoading: boolean
  stream: MediaStream | null
  error: string | null
}): CamState {
  if (isLoading) return "requesting"
  if (error) {
    const msg = error.toLowerCase()
    return msg.includes("denied") ||
      msg.includes("permission") ||
      msg.includes("notallowed")
      ? "denied"
      : "error"
  }
  if (stream) return "active"
  return "idle"
}
