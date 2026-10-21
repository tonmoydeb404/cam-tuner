import type { Metadata } from "next"
import PreviewPageClient from "./preview-client"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  path: "/preview",
  title: "Camera Preview — CamTuner",
  description:
    "Preview and configure your webcam settings in real-time with CamTuner.",
  noindex: true,
})

export default function PreviewPage() {
  return <PreviewPageClient />
}
