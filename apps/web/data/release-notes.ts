export type ReleaseNote = {
  version: string
  date: string // ISO date e.g. "2026-04-15"
  title: string
  breaking?: boolean
  highlights: string[]
}

export const releaseNotes: ReleaseNote[] = [
  {
    version: "2.0.9",
    date: "2026-04-16",
    title: "Mirror & What's New",
    highlights: [
      "Added mirror/flip control to the tuner for horizontal camera mirroring",
      "Added a What's New page to the web app showcasing release history",
    ],
  },
  {
    version: "2.0.8",
    date: "2026-04-13",
    title: "Stability & Dependency Update",
    highlights: [
      "Upgraded Next.js to 16.2.3 for improved performance and security",
      "Fixed cleanup of stream modifiers and track management to prevent memory leaks",
    ],
  },
  {
    version: "2.0.6",
    date: "2026-04-12",
    title: "Complete Rewrite",
    breaking: true,
    highlights: [
      "Started from scratch with a brand new architecture",
      "Rebuilt the web app and extension with a modern stack",
      "Dropped legacy features from v1 that no longer fit the vision",
    ],
  },
  {
    version: "1.4.2",
    date: "2025-09-04",
    title: "Letterbox Color Control",
    highlights: [
      "Added letterbox color customization — choose any background color for cropped areas",
    ],
  },
  {
    version: "1.4.1",
    date: "2025-09-03",
    title: "Architecture Refactor",
    highlights: [
      "Extracted core webcam logic into separate managers and context for better maintainability",
      "Removed unused hook to reduce bundle size",
    ],
  },
  {
    version: "1.3.4",
    date: "2025-08-26",
    title: "Performance & Overlay Fixes",
    highlights: [
      "Optimized stream processing for lower CPU usage",
      "Added confetti celebration on extension install",
      "Fixed media overlay rendering performance",
    ],
  },
  {
    version: "1.3.3",
    date: "2025-08-25",
    title: "GIF Support & Zoom Fixes",
    highlights: [
      "Added animated GIF support in the extension",
      "Fixed zoom behavior across different aspect ratios",
      "Fixed browser sync storage initialization order",
      "Fixed Chrome extension build command",
    ],
  },
  {
    version: "1.2.0",
    date: "2025-08-25",
    title: "Extension UI Update",
    highlights: ["Redesigned extension popup UI for a cleaner look and feel"],
  },
]
