"use client"

import { CamState } from "@/components/camera-states"
import { useTuner, type UseTunerReturn } from "@/hooks/use-tuner"
import { useWebcam } from "@/hooks/use-webcam"
import { cn } from "@workspace/ui/lib/utils"
import { type ReactNode, useEffect, useRef, useState } from "react"
import content from "../../../../data/content.json"
import { displayClass } from "../../fonts"
import { InstallButton } from "../install-button"
import {
  AlignControls,
  BackgroundControls,
  FlipControls,
  FrameControls,
  ZoomControls,
} from "./controls"
import { ShowcasePreview } from "./preview"
import { ShowcaseSectionItem } from "./section-item"

const CONTROLS: Record<string, (tuner: UseTunerReturn) => ReactNode> = {
  frame: (t) => <FrameControls tuner={t} />,
  zoom: (t) => <ZoomControls tuner={t} />,
  align: (t) => <AlignControls tuner={t} />,
  background: (t) => <BackgroundControls tuner={t} />,
  flip: (t) => <FlipControls tuner={t} />,
}

const sections = content.showcase.sections

export const Showcase = () => {
  const webcam = useWebcam({ autoStart: false, bypassExtension: true })
  const tuner = useTuner(webcam.stream, {}, { syncExtension: false })
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [camState, setCamState] = useState<CamState>("idle")
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (webcam.error) {
      const msg = webcam.error.toLowerCase()
      setCamState(
        msg.includes("denied") ||
          msg.includes("permission") ||
          msg.includes("notallowed")
          ? "denied"
          : "error"
      )
    } else if (webcam.stream) {
      setCamState("active")
    }
  }, [webcam.stream, webcam.error])

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (tuner.outputStream && el.srcObject !== tuner.outputStream) {
      el.srcObject = tuner.outputStream
      el.play().catch(() => {})
    } else if (!tuner.outputStream) {
      el.srcObject = null
    }
  }, [tuner.outputStream])

  // Fires the instant <video> mounts so a stream that arrived first attaches.
  const attachVideoRef = (el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && tuner.outputStream && el.srcObject !== tuner.outputStream) {
      el.srcObject = tuner.outputStream
      el.play().catch(() => {})
    }
  }

  const handleStart = async () => {
    setCamState("requesting")
    await webcam.startCamera()
  }

  const handleStop = () => {
    webcam.stopCamera()
    setCamState("idle")
  }

  return (
    // Always dark: the preview is a camera feed and reads best on a dark stage.
    <section
      id="demo"
      aria-labelledby="demo-heading"
      className="dark relative scroll-mt-16 bg-background px-4 py-24 text-foreground sm:px-6 lg:py-32"
    >
      <span id="hero-demo" aria-hidden="true" className="absolute top-0" />
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <h2
            id="demo-heading"
            className={cn(
              displayClass,
              "text-4xl leading-none font-bold tracking-[-0.03em] text-balance sm:text-6xl"
            )}
          >
            {content.showcase.title}
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {content.showcase.description}
          </p>
        </div>

        <div className="mt-10 grid gap-x-14 lg:mt-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          {/* One shared preview that stays pinned while the controls scroll. */}
          <div className="sticky top-16 z-20 -mx-4 bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-[max(6rem,calc(50vh-12rem))] lg:z-0 lg:mx-0 lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <ShowcasePreview
              camState={camState}
              videoRef={attachVideoRef}
              onStart={handleStart}
              onStop={handleStop}
              error={webcam.error}
              config={tuner.config}
              activeLabel={sections[activeIndex]?.kicker ?? ""}
              activeIndex={activeIndex}
              total={sections.length}
            />
          </div>

          <div>
            {sections.map((section, i) => (
              <ShowcaseSectionItem
                key={section.id}
                index={i}
                title={section.title}
                description={section.description}
                active={i === activeIndex}
                onActive={setActiveIndex}
              >
                {CONTROLS[section.id]?.(tuner)}
              </ShowcaseSectionItem>
            ))}

            <div className="py-8">
              <InstallButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
