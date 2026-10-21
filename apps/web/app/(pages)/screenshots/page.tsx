import ScreenshotsView from "@/views/screenshots"
import { pageMetadata } from "@/lib/seo"

// Indexable: doubles as a public press kit. Not linked from the nav —
// reached by URL, like the Tavo screenshots page.
export const metadata = pageMetadata({
  path: "/screenshots",
  title: "Store Screenshots — CamTuner",
  description:
    "Pixel-perfect promo assets for the CamTuner store listings. Download Chrome Web Store and Firefox Add-ons screenshots and tiles at their exact required dimensions.",
})

export default function ScreenshotsPage() {
  return <ScreenshotsView />
}
