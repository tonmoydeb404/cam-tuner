import WhatsNewView from "@/views/whats-new"
import { pageMetadata } from "@/lib/seo"

// Indexed: the dated changelog is a genuine freshness signal and answers
// "is CamTuner maintained?" for both searchers and AI engines.
export const metadata = pageMetadata({
  path: "/whats-new",
  title: "What's New — CamTuner Release History",
  description:
    "Every CamTuner release with dates and highlights — Center Stage tracking, background effects, flip controls and all the fixes in between.",
})

export default function WhatsNewPage() {
  return <WhatsNewView />
}
