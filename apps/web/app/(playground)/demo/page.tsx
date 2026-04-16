import DemoView from "@/views/demo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Demo — CamTuner",
  description:
    "Explore CamTuner's tuner controls with a static image — no webcam needed.",
  robots: { index: false, follow: false },
}

export default function DemoPage() {
  return <DemoView />
}
