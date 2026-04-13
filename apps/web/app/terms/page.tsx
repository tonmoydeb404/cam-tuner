import { brand } from "@/data/brand"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions — CamTuner",
  description:
    "CamTuner terms and conditions. Read the terms governing your use of the extension and website.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        <h1 className="text-4xl font-black tracking-tighter sm:text-5xl">
          Terms and Conditions
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Last updated: April 2026
        </p>

        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              1. Acceptance of Terms
            </h2>
            <p>
              By installing the CamTuner browser extension or using the CamTuner
              website, you agree to be bound by these Terms and Conditions. If
              you do not agree with any part of these terms, you must not use
              CamTuner.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              2. Description of Service
            </h2>
            <p>
              CamTuner is a browser extension and web application that allows
              you to crop, zoom, and align your webcam feed in real-time,
              entirely within your browser. All processing is performed locally
              on your device using the Canvas API and WebCodecs — no data is
              sent to any server.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              3. Use of the Service
            </h2>
            <p>
              You agree to use CamTuner only for lawful purposes. You must not:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Modify, decompile, or reverse-engineer the extension except as
                permitted by applicable law.
              </li>
              <li>
                Use CamTuner to capture, record, or distribute content without
                the knowledge and consent of all parties involved.
              </li>
              <li>
                Attempt to circumvent any security or access controls of the
                extension or the website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              4. Intellectual Property
            </h2>
            <p>
              All source code, design, and content of CamTuner are the
              intellectual property of the CamTuner team and are licensed under
              the terms of the project&apos;s open-source license where
              applicable. The CamTuner name and logo are trademarks of the
              CamTuner team.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              5. Disclaimer of Warranties
            </h2>
            <p>
              CamTuner is provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, or
              non-infringement. We do not warrant that the service will be
              uninterrupted, error-free, or compatible with all browsers and
              devices.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, the CamTuner team shall
              not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of or
              inability to use the service, even if we have been advised of the
              possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              7. Third-Party Services
            </h2>
            <p>
              CamTuner works alongside third-party video conferencing platforms
              such as Google Meet and Zoom. We are not affiliated with these
              services, and your use of them is subject to their own terms and
              policies. We are not responsible for changes to third-party
              platforms that may affect CamTuner&apos;s functionality.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              8. Changes to These Terms
            </h2>
            <p>
              We may update these Terms and Conditions at any time. When we do,
              we will revise the &quot;last updated&quot; date at the top of
              this page. Your continued use of CamTuner after any changes
              constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-foreground">
              9. Contact
            </h2>
            <p>
              If you have questions about these terms, please open an issue on
              our{" "}
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
    </div>
  )
}
