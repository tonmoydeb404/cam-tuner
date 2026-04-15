"use client"

import { assets } from "@/assets"
import { brand } from "@/data/brand"
import { useImageStream } from "@/hooks/use-image-stream"
import { useTuner } from "@/hooks/use-tuner"
import { IconPhoto, IconRotate } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent } from "@workspace/ui/components/card"
import { TunerControlFields } from "@workspace/ui/components/tuner/tuner-control-fields"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const DEFAULT_IMAGE = "/demo-sample.jpg"

const DemoView = () => {
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const stream = useImageStream(imageSrc)
  const tuner = useTuner(stream, {}, { syncExtension: false })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImageSrc(url)
  }

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (imageSrc !== DEFAULT_IMAGE) URL.revokeObjectURL(imageSrc)
    }
  }, [imageSrc])

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center px-4 py-8">
      <Link
        href="/"
        className="fixed top-5 left-6 z-10 flex items-center gap-2"
      >
        <Image src={assets.logo} alt={brand.name} width={28} />
        <span className="font-heading text-base font-bold">{brand.name}</span>
      </Link>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 md:flex-row">
        {/* Main Preview Area */}
        <div className="dark relative flex flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border bg-card">
          <DemoVideo stream={tuner.outputStream} />
        </div>

        {/* Sidebar Controls */}
        <div className="flex w-full flex-col gap-6 md:w-80">
          <Card className="bg-muted dark:bg-card">
            <CardContent>
              <div className="flex flex-col gap-6">
                {/* Image picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Source Image</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <IconPhoto />
                    Choose Image
                  </Button>
                </div>

                <TunerControlFields
                  aspectRatio={tuner.config.aspectRatio}
                  onAspectRatioChange={tuner.setAspectRatio}
                  zoom={tuner.config.zoom}
                  onZoomChange={tuner.setZoom}
                  align={tuner.config.align}
                  onAlignChange={tuner.setAlign}
                  barColor={tuner.config.barColor ?? "#000000"}
                  onBarColorChange={tuner.setBarColor}
                  mirror={tuner.config.mirror}
                  onMirrorChange={tuner.setMirror}
                />

                <Button
                  onClick={tuner.resetConfig}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <IconRotate />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/** Renders the processed stream in a <video> element, same as PreviewVideo */
const DemoVideo = ({ stream }: { stream: MediaStream | null }) => {
  const ref = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (el.srcObject !== stream) el.srcObject = stream
  }, [stream])

  return (
    <video
      autoPlay
      playsInline
      muted
      aria-label="Demo preview"
      className="absolute inset-0 h-full w-full text-transparent"
      style={{ objectFit: "contain" }}
      ref={(el) => {
        ref.current = el
        if (el && stream) {
          if (el.srcObject !== stream) el.srcObject = stream
        } else if (el && !stream) {
          el.srcObject = null
        }
      }}
    />
  )
}

export default DemoView
