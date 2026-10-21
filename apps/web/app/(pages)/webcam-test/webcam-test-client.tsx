"use client"

import {
  DeniedState,
  ErrorState,
  IdleState,
  RequestingState,
  deriveCamState,
} from "@/components/camera-states"
import { useWebcam } from "@/hooks/use-webcam"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

interface TrackStats {
  label: string
  width?: number
  height?: number
  frameRate?: number
  aspectRatio?: number
}

export default function WebcamTestClient() {
  const webcam = useWebcam({ autoStart: false, bypassExtension: true })
  const { isLoading, error, stream, devices } = webcam
  const { selectedDeviceId, setSelectedDeviceId } = webcam
  const camState = deriveCamState({ isLoading, stream, error })
  const [stats, setStats] = useState<TrackStats | null>(null)
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  // Attach the raw stream (mirrors PreviewVideo in views/preview).
  useEffect(() => {
    const el = videoElRef.current
    if (!el) return
    if (el.srcObject !== stream) {
      el.srcObject = stream
    }
  }, [stream])

  // Poll the active track's settings so resolution/fps stay accurate even
  // after the browser renegotiates the stream.
  useEffect(() => {
    if (!stream) {
      setStats(null)
      return
    }
    const read = () => {
      const track = stream.getVideoTracks()[0]
      if (!track) return
      const s = track.getSettings()
      setStats({
        label: track.label || "Camera",
        width: s.width,
        height: s.height,
        frameRate: s.frameRate ? Math.round(s.frameRate) : undefined,
        aspectRatio: s.aspectRatio,
      })
    }
    read()
    const timer = setInterval(read, 1000)
    return () => clearInterval(timer)
  }, [stream])

  const statsRows: { label: string; value?: string | number }[] = stats
    ? [
        { label: "Camera", value: stats.label },
        {
          label: "Resolution",
          value:
            stats.width && stats.height
              ? `${stats.width} × ${stats.height}`
              : undefined,
        },
        {
          label: "Frame rate",
          value: stats.frameRate ? `${stats.frameRate} fps` : undefined,
        },
        {
          label: "Aspect ratio",
          value: stats.aspectRatio
            ? stats.aspectRatio.toFixed(2) + ":1"
            : undefined,
        },
      ]
    : []

  return (
    <div className="container pt-28 pb-32">
      <div className="mx-auto max-w-3xl">
        <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
          <video
            ref={(el) => {
              videoElRef.current = el
              if (el && stream && el.srcObject !== stream) {
                el.srcObject = stream
              }
            }}
            autoPlay
            playsInline
            muted
            aria-label="Webcam test preview"
            className={cn(
              "h-full w-full scale-x-[-1] object-contain",
              camState !== "active" && "hidden"
            )}
          />
          {camState === "idle" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IdleState
                onStart={webcam.startCamera}
                title="Test your camera"
                description="Your video is processed entirely in this tab — nothing is recorded or uploaded."
                buttonLabel="Start camera"
              />
            </div>
          )}
          {camState === "requesting" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <RequestingState />
            </div>
          )}
          {camState === "denied" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <DeniedState onStart={webcam.startCamera} />
            </div>
          )}
          {camState === "error" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <ErrorState onStart={webcam.startCamera} error={error} />
            </div>
          )}
        </div>

        {camState === "active" && (
          <>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {statsRows.map((row) => (
                <div
                  key={row.label}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {row.label}
                  </dt>
                  <dd className="mt-1 truncate text-sm font-semibold text-foreground">
                    {row.value ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>

            {devices.length > 1 && (
              <div className="mt-6">
                <label
                  htmlFor="camera-select"
                  className="text-sm font-medium text-foreground"
                >
                  Camera
                </label>
                <select
                  id="camera-select"
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground"
                >
                  {devices.map((device) => (
                    <option key={device.deviceId} value={device.deviceId}>
                      {device.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                If the image looks upside down or mirrored wrong, that&apos;s
                your camera — not the test. The preview is mirrored like a real
                call.
              </p>
              <button
                type="button"
                onClick={webcam.stopCamera}
                className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-foreground"
              >
                Stop camera
              </button>
            </div>
          </>
        )}

        <div className="mt-16 space-y-4 text-sm leading-relaxed text-muted-foreground">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            What this webcam test checks
          </h2>
          <p>
            This page opens your camera with the browser&apos;s standard camera
            API and reports what it actually delivers: the live image, the
            resolution your camera negotiated, the frame rate it sustains, and
            the device name. If the preview moves smoothly and the numbers match
            what your camera promises, your webcam and its connection are
            working.
          </p>
          <p>
            The test runs entirely on your device. No frame is ever recorded,
            stored, or uploaded — when you close or reload the page, the camera
            turns off.
          </p>
          <h2 className="pt-4 text-2xl font-bold tracking-tight text-foreground">
            Camera works but you look wrong on calls?
          </h2>
          <p>
            A working camera can still be badly framed — too far away,
            off-center, or the wrong shape for the call app. That&apos;s what{" "}
            <Link
              href="/"
              className="text-primary underline underline-offset-4"
            >
              CamTuner
            </Link>{" "}
            fixes: crop, zoom and center your feed once, and every call shows
            the framed version.
          </p>
        </div>
      </div>
    </div>
  )
}
