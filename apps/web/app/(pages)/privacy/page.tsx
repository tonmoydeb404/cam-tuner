import { brand } from "@/data/brand"
import PageHeader from "@/layouts/page-layout/header"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — CamTuner",
  description: "CamTuner privacy policy. Learn how we handle your data.",
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        title="Privacy Policy"
        description="CamTuner privacy policy. Learn how we handle your data."
        className="mb-14"
      />
      <div className="container">
        <div className="max-w-3xl space-y-10 pb-32 text-sm leading-relaxed text-muted-foreground sm:text-base">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              1. Overview
            </h2>
            <p>
              CamTuner is a browser extension and web application that lets you
              crop, zoom, and align your webcam feed. We are committed to
              protecting your privacy. This policy explains what data we
              collect, how we use it, and your rights.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              2. Data Collection
            </h2>
            <p className="font-semibold text-foreground">
              We do not collect any personal data.
            </p>
            <p className="mt-2">
              CamTuner processes your webcam feed entirely within your browser.
              No video frames, images, or audio data ever leave your device. All
              cropping, zooming, and alignment operations are performed locally
              using the Canvas API and WebCodecs.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              3. Local Storage
            </h2>
            <p>
              CamTuner stores your preferences (aspect ratio, zoom level,
              alignment, letterbox color) in your browser&apos;s local storage
              using the Chrome Storage API. This data never leaves your device
              and is not transmitted to any server.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              4. Camera Permissions
            </h2>
            <p>
              The extension requires camera access to modify your video feed.
              This permission is used solely to apply your configured
              adjustments in real-time. We never record, transmit, or store any
              video or audio data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              5. Third-Party Services
            </h2>
            <p>
              CamTuner does not integrate with any third-party analytics,
              advertising, or tracking services. We do not use cookies or any
              form of user tracking.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              6. Data Sharing
            </h2>
            <p>
              We do not share, sell, or transfer any user data to third parties,
              because we do not collect any data in the first place.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              7. Changes to This Policy
            </h2>
            <p>
              If we update this privacy policy, we will publish the revised
              version on this page with an updated date. Continued use of
              CamTuner after any changes constitutes acceptance of the revised
              policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              8. Contact
            </h2>
            <p>
              If you have questions about this privacy policy, please open an
              issue on our{" "}
              <a
                href={brand.social.github}
                className="text-primary underline underline-offset-4 hover:text-primary/80"
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub repository
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
