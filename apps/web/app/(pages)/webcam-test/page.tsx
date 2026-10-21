import WebcamTestClient from "./webcam-test-client"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  path: "/webcam-test",
  title: "Webcam Test — Check Your Camera Online Free",
  description:
    "Test your webcam right in the browser: see a live preview, your detected resolution and frame rate. No install, no upload — everything stays on your device.",
})

export default function WebcamTestPage() {
  return <WebcamTestClient />
}
