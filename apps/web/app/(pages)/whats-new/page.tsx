import WhatsNewView from "@/views/whats-new"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "What's New — CamTuner",
  description: "See what changed in the latest CamTuner extension update.",
  robots: { index: false, follow: false },
}

interface Props {}

export default async function WhatsNewPage(props: Props) {
  return <WhatsNewView />
}
