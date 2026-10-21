import DemoView from "@/views/demo"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/demo",
  title: "Demo — CamTuner",
  description:
    "Explore CamTuner's tuner controls with a static image — no webcam needed.",
  noindex: true,
})

export default function DemoPage() {
  return <DemoView />
}
