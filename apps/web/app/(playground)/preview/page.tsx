import type { Metadata } from "next"
import PreviewPageClient from "./preview-client"

export const metadata: Metadata = {
  title: "Camera Preview — CamTuner",
  description:
    "Preview and configure your webcam settings in real-time with CamTuner.",
  robots: { index: false, follow: false },
}

export default function PreviewPage() {
  return <PreviewPageClient />
}
