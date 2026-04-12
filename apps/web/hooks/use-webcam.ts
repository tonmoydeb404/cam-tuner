"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface VideoDevice {
  deviceId: string
  label: string
}

export interface UseWebcamReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>
  devices: VideoDevice[]
  selectedDeviceId: string
  setSelectedDeviceId: (id: string) => void
  isLoading: boolean
  error: string | null
  stream: MediaStream | null
  startCamera: () => Promise<void>
  stopCamera: () => void
}

interface UseWebcamOptions {
  /** If false, camera will NOT start automatically on mount. Default: true */
  autoStart?: boolean
  /**
   * If true, calls the original (pre-extension) getUserMedia so you always get
   * the raw camera stream even when the cam-tuner extension is active.
   * Falls back to the normal getUserMedia when the extension is not installed.
   */
  bypassExtension?: boolean
}

export function useWebcam({
  autoStart = true,
  bypassExtension = false,
}: UseWebcamOptions = {}): UseWebcamReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [devices, setDevices] = useState<VideoDevice[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("")
  // Label saved in extension storage — used to restore the right camera across sessions.
  const savedLabelRef = useRef<string | null>(null)
  const [isLoading, setIsLoading] = useState(autoStart)
  const [error, setError] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Resolve which getUserMedia to use:
  // - bypassExtension=true + extension present → use the pre-patch original
  // - otherwise → use whatever is on navigator.mediaDevices (may be patched)
  const getStream = useCallback(
    (constraints: MediaStreamConstraints) => {
      const win = window as Window & {
        __camtuner_getUserMedia?: (
          constraints: MediaStreamConstraints
        ) => Promise<MediaStream>
      }
      const fn =
        bypassExtension && typeof win.__camtuner_getUserMedia === "function"
          ? win.__camtuner_getUserMedia.bind(window)
          : navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
      return fn(constraints) as Promise<MediaStream>
    },
    [bypassExtension]
  )

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setStream(null)
  }, [])

  const loadDevices = useCallback(async () => {
    try {
      const all = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = all
        .filter((d) => d.kind === "videoinput")
        .map((d, i) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${i + 1}`,
        }))
      setDevices(videoDevices)
      return videoDevices
    } catch {
      return []
    }
  }, [])

  const startStream = useCallback(
    async (deviceId?: string) => {
      stopStream()
      setIsLoading(true)
      setError(null)
      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId ? { deviceId: { exact: deviceId } } : true,
        }
        const stream = await getStream(constraints)
        streamRef.current = stream
        setStream(stream)
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        // Enumerate devices after permission is granted so labels are available
        const videoDevices = await loadDevices()
        if (videoDevices.length > 0) {
          const activeId =
            deviceId ??
            stream.getVideoTracks()[0]?.getSettings().deviceId ??
            videoDevices[0]!.deviceId

          // If no explicit deviceId was requested, try to restore by saved label.
          if (!deviceId && savedLabelRef.current) {
            const match = videoDevices.find(
              (d) => d.label === savedLabelRef.current
            )
            if (match && match.deviceId !== activeId) {
              // Restart with the matching device — will resolve on next call.
              setIsLoading(false)
              startStream(match.deviceId)
              return
            }
          }

          const resolved =
            videoDevices.find((d) => d.deviceId === activeId) ??
            videoDevices[0]!
          setSelectedDeviceId(resolved.deviceId)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not access camera."
        )
      } finally {
        setIsLoading(false)
      }
    },
    [stopStream, loadDevices, getStream]
  )

  // Attach stream to video element when stream changes
  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
    }
  }, [stream])

  // Initial stream start (only when autoStart is true)
  useEffect(() => {
    if (!autoStart) return
    startStream()
    return stopStream
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Switch camera when selection changes (skip first render).
  // Also persist the label to extension storage so it survives page reloads.
  const isFirstMount = useRef(true)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (!selectedDeviceId) return
    const label = devices.find((d) => d.deviceId === selectedDeviceId)?.label
    if (label) {
      savedLabelRef.current = label
      window.postMessage(
        { type: "syncCameraLabel", label },
        window.location.origin
      )
    }
    startStream(selectedDeviceId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDeviceId])

  // Listen for the extension to send back the saved camera label.
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== "camtuner:config-update") return
      const label: string | null = event.data.cameraLabel ?? null
      savedLabelRef.current = label
    }
    window.addEventListener("message", handler)
    window.dispatchEvent(new CustomEvent("camtuner:request-config"))
    return () => window.removeEventListener("message", handler)
  }, [])

  return {
    videoRef,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    isLoading,
    error,
    stream,
    startCamera: () => startStream(selectedDeviceId),
    stopCamera: stopStream,
  }
}
