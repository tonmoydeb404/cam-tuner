"use client"

import {
  Camera01Icon,
  CameraLensIcon,
  Rocket01Icon,
  Settings02Icon,
  Shield01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@workspace/ui/components/button"

const HomeView = () => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {/* NAVBAR */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Camera01Icon}
              className="size-5 text-primary"
            />
            <span className="text-sm font-bold tracking-widest uppercase">
              CamTuner
            </span>
          </div>

          <nav
            aria-label="Global"
            className="hidden items-center gap-8 md:flex"
          >
            {["Features", "Workflow", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-primary"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-[10px] font-bold tracking-widest uppercase sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              size="sm"
              className="px-5 text-[10px] font-bold tracking-widest uppercase"
            >
              Get Extension
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-14">
        {/* HERO SECTION */}
        <section className="relative flex flex-col items-center px-6 pt-20 pb-16 text-center lg:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 border border-border bg-muted/50 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
            <HugeiconsIcon icon={SparklesIcon} className="size-3" />
            Available on Chrome Store
          </div>

          <h1 className="max-w-4xl text-5xl leading-[0.9] font-black tracking-tighter sm:text-7xl md:text-8xl">
            PRO CAMERA <br />
            <span className="font-outline-2 text-muted-foreground/20">
              IN YOUR BROWSER.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed font-medium text-muted-foreground md:text-xl">
            The professional browser extension to calibrate, zoom, and align
            your webcam feed for Google Meet, Zoom, and beyond.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              className="h-14 rounded-none px-10 text-sm font-black tracking-widest uppercase"
            >
              Add to Chrome — Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-none border-2 px-10 text-sm font-black tracking-widest uppercase"
            >
              View Demo
            </Button>
          </div>

          {/* Browser Mockup */}
          <div className="mt-20 w-full max-w-5xl border border-border bg-muted/30 p-1 md:p-2">
            <div className="relative border border-border bg-background">
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-border" />
                  <div className="size-2.5 rounded-full bg-border" />
                  <div className="size-2.5 rounded-full bg-border" />
                </div>
                <div className="mx-auto h-5 w-1/2 rounded border border-border bg-background" />
              </div>
              <div className="relative aspect-video overflow-hidden bg-muted/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="border border-primary/30 p-12 text-primary/20">
                    <HugeiconsIcon icon={CameraLensIcon} className="size-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENTO FEATURES */}
        <section
          id="features"
          className="border-y border-border px-6 py-24 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-rows-2">
              <div className="col-span-1 border border-border bg-card p-8 md:col-span-4 lg:row-span-2">
                <div className="mb-10 flex size-12 items-center justify-center border border-primary/20 bg-primary/5 text-primary">
                  <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold tracking-tight">
                  Granular Controls
                </h3>
                <p className="mt-4 max-w-md text-muted-foreground">
                  Adjust exposure, brightness, and contrast at a hardware level.
                  Our extension communicates directly with your browser's
                  MediaStream API.
                </p>
                <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border pt-8">
                  <div>
                    <div className="text-2xl font-black">1.0ms</div>
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Latency
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black">4K</div>
                    <div className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                      Support
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 border border-border bg-muted/20 p-8 md:col-span-2">
                <HugeiconsIcon
                  icon={Shield01Icon}
                  className="mb-4 size-6 text-primary"
                />
                <h3 className="text-xs font-bold tracking-[0.1em] tracking-tight uppercase">
                  Local Only
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  No data ever leaves your machine. Privacy is baked into our
                  core.
                </p>
              </div>

              <div className="col-span-1 border border-border bg-muted/20 p-8 md:col-span-2">
                <HugeiconsIcon
                  icon={Rocket01Icon}
                  className="mb-4 size-6 text-primary"
                />
                <h3 className="text-xs font-bold tracking-[0.1em] tracking-tight uppercase">
                  One-Tap Inject
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Inject your custom feed into any website with a single global
                  shortcut.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WORKFLOW */}
        <section id="workflow" className="mx-auto max-w-3xl px-6 py-24">
          <div className="space-y-24">
            {[
              {
                step: "01",
                title: "Mount Extension",
                desc: "Install from the Chrome Web Store and pin it to your bar for instant access.",
              },
              {
                step: "02",
                title: "Frame & Tune",
                desc: "Open the popup during any live stream to tweak your zoom and framing in real-time.",
              },
              {
                step: "03",
                title: "Look Professional",
                desc: "Your settings persist across sessions. Join every call with confidence.",
              },
            ].map((s, idx) => (
              <div
                key={idx}
                className="group flex flex-col md:flex-row md:gap-12"
              >
                <div className="text-6xl font-black text-muted-foreground/10 transition-colors group-hover:text-primary md:text-8xl">
                  {s.step}
                </div>
                <div className="mt-4 md:mt-6">
                  <h3 className="text-2xl font-bold tracking-tight uppercase">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary px-6 py-24 text-primary-foreground">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-4xl font-black tracking-tighter uppercase sm:text-6xl">
              Ready to Upgrade?
            </h2>
            <p className="mt-6 text-lg font-medium opacity-80">
              Stop settling for bad webcam angles.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-10 h-16 rounded-none px-12 text-sm font-black tracking-[0.2em] uppercase"
            >
              Install CamTuner Now
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="text-[10px] font-bold tracking-[0.3em] uppercase">
            CamTuner © 2026
          </div>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-[10px] font-bold tracking-widest uppercase transition-colors hover:text-primary"
            >
              Github
            </a>
            <a
              href="#"
              className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:text-primary"
            >
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomeView
