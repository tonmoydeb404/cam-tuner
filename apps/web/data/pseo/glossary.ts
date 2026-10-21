/**
 * Data for glossary pages (/learn/[slug]) — "what is center stage",
 * "what is a virtual camera", etc. Definitions lead with the direct answer
 * (AEO): the first paragraph must stand alone as the answer.
 *
 * Demand for every slug was validated against Google autocomplete before
 * building. Indexable by default; `noindex: true` available per entry.
 */

export interface GlossaryFaq {
  q: string
  a: string
}

export interface GlossaryEntry {
  slug: string
  term: string
  metaTitle: string
  metaDescription: string
  /** Direct answer — must stand alone when extracted by AI engines. */
  definition: string
  /** Depth beyond the dictionary: how it works, why it matters. */
  body: string[]
  /** How CamTuner implements or relates to the concept. */
  camtunerAngle: string
  /** Slugs of related glossary entries for cross-linking. */
  relatedSlugs: string[]
  faqs: GlossaryFaq[]
  lastUpdated: string
}

export const glossary: GlossaryEntry[] = [
  {
    slug: "center-stage",
    term: "Center Stage",
    metaTitle: "What Is Center Stage? Auto-Framing Explained",
    metaDescription:
      "Center Stage is auto-framing that keeps you centered in the shot as you move. Here's how it works — and how to get it on any webcam, in the browser.",
    definition:
      "Center Stage is an auto-framing feature that keeps the person in the camera's view centered in the frame as they move around, using face detection to pan and zoom the image in real time.",
    body: [
      "Apple introduced Center Stage on iPads and Macs with purpose-built cameras: the device detects faces, computes the tightest frame that contains everyone, and continuously re-frames the video — digitally, without moving any lens.",
      "The effect reads as having a camera operator: walk to the whiteboard and the shot follows; step back and the frame widens. The trade-off is cost — Apple's version needs specific hardware, and standalone auto-framing cameras are priced accordingly.",
    ],
    camtunerAngle:
      "CamTuner brings Center Stage to any webcam through software: face tracking runs locally in the browser and re-frames your stream before any call app sees it — no special camera, no drivers, nothing uploaded.",
    relatedSlugs: ["auto-framing", "virtual-camera"],
    faqs: [
      {
        q: "Can I get Center Stage on a normal webcam?",
        a: "Yes — with software. CamTuner applies the same face-tracked auto-framing to any webcam inside Chrome, so your existing camera gains Center Stage on every browser-based call.",
      },
      {
        q: "Does Center Stage use facial recognition or upload video?",
        a: "No. In CamTuner, face detection runs entirely on your device to position the frame — no identification, no storage, and no video ever leaves your machine.",
      },
      {
        q: "Does Center Stage work in Zoom and Meet?",
        a: "Yes. Because the framing is applied to the stream before the call app receives it, Center Stage works everywhere your camera works: Meet, Zoom web, Teams web and beyond.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "letterboxing",
    term: "Letterboxing",
    metaTitle: "What Is Letterboxing? Video Bars Explained",
    metaDescription:
      "Letterboxing pads a video with bars to fit a different-shaped frame. Here's when bars help, when they hurt, and how to letterbox your webcam in any color.",
    definition:
      "Letterboxing is the practice of fitting video into a frame of a different aspect ratio by padding the leftover space with bars — typically black — along two sides of the image.",
    body: [
      "The name comes from cinema: when widescreen films played on 4:3 TVs, black bars appeared above and below to preserve the full frame. The same mechanic runs in reverse on video calls, where a 4:3 webcam feed meets a 16:9 call tile and the platform pads the sides.",
      "Letterboxing preserves everything the camera sees; its alternative, cropping, fills the frame but discards content. Which one you want depends on whether the leftover space is information (keep it — letterbox) or distraction (lose it — crop).",
    ],
    camtunerAngle:
      "CamTuner makes letterboxing a choice instead of a side effect: crop your webcam to any ratio, or pad it with bars in any color — including your brand colors — instead of being stuck with black.",
    relatedSlugs: ["auto-framing", "4k-webcam"],
    faqs: [
      {
        q: "Why does my webcam show black bars on calls?",
        a: "Your camera captures a wider or taller shape than the call app's video tile. The app letterboxes the mismatch. Cropping your feed to the tile's shape (usually 16:9) removes the bars.",
      },
      {
        q: "Can letterbox bars be a color other than black?",
        a: "Yes. CamTuner lets you set any bar color — useful for matching a stream overlay, a course template, or a brand background instead of default black.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "virtual-camera",
    term: "virtual camera",
    metaTitle: "What Is a Virtual Camera? (And a Lighter Alternative)",
    metaDescription:
      "A virtual camera is software that pretends to be a webcam so apps receive processed video. How virtual cameras work — and the browser-level alternative.",
    definition:
      "A virtual camera is a software driver that creates a fake webcam device on your computer: applications that select it receive video that other software has processed, instead of the raw camera feed.",
    body: [
      "Virtual cameras sit between your real camera and your apps. Tools like OBS write their composited output — overlays, filters, effects — to the virtual device, and anything that selects “OBS Virtual Camera” receives that processed video as if it came from hardware.",
      "The approach is powerful but heavy: it requires installing a kernel- or system-level driver, selecting the virtual device in every app, and managing yet another program during calls. When the driver crashes or updates break, your camera disappears from every app at once.",
    ],
    camtunerAngle:
      "CamTuner adjusts your real camera's stream inside the browser instead — no driver, no second program, no device to select. Your apps keep using the normal camera; the video they receive is simply already framed.",
    relatedSlugs: ["auto-framing", "center-stage"],
    faqs: [
      {
        q: "Is CamTuner a virtual camera?",
        a: "No. It's a browser extension that adjusts the camera stream inside the browser. That's why there's no driver to install and no device switch needed in Meet, Zoom or anywhere else.",
      },
      {
        q: "When do I actually need a virtual camera?",
        a: "When the app receiving the video runs outside the browser — desktop apps like the Zoom or Teams desktop clients, or OBS scenes feeding other programs. For browser-based calls, in-browser adjustment is lighter and simpler.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "auto-framing",
    term: "auto-framing",
    metaTitle: "What Is Auto-Framing? Webcam Framing Explained",
    metaDescription:
      "Auto-framing keeps your camera composition correct without manual adjustment — zoom, crop and centering that follow you. Here's how it works.",
    definition:
      "Auto-framing is camera software that continuously adjusts the shot's zoom and composition to keep its subject well-framed, without anyone operating the camera.",
    body: [
      "Auto-framing systems detect the subject (usually via face detection), decide what “well-framed” means — centered, a certain size in the shot — and adjust the image digitally to hold that composition as the subject moves.",
      "It differs from a plain zoom lock, which holds one crop forever, and from fixed framing, which never moves at all. The spectrum runs: fixed crop → manual zoom → zoom presets → full subject tracking. Each step up trades a little processing power for less manual attention.",
    ],
    camtunerAngle:
      "CamTuner covers the whole spectrum in the browser: a fixed crop when you want stability, fixed zoom levels when you want control, and Center Stage face tracking when you want the frame to follow you — switchable per call.",
    relatedSlugs: ["center-stage", "letterboxing"],
    faqs: [
      {
        q: "Is auto-framing the same as Center Stage?",
        a: "Center Stage is Apple's brand of auto-framing — one implementation of the general concept. Other implementations exist in conference cameras and, via CamTuner, in any browser with a webcam.",
      },
      {
        q: "Should I use auto-framing or a fixed crop?",
        a: "Fixed if you sit still and want zero distraction and minimal CPU; auto-framing if you move — stand, walk, teach — or find yourself constantly re-centering manually.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "4k-webcam",
    term: "4K webcam",
    metaTitle: "Do You Need a 4K Webcam? What Resolution Matters",
    metaDescription:
      "4K webcams capture far more detail than calls transmit. What 4K is actually for — and how cropping headroom beats resolution on video calls.",
    definition:
      "A 4K webcam captures video at roughly 3840 × 2160 pixels — four times the pixels of 1080p — even though most video calls transmit at 720p or 1080p.",
    body: [
      "That mismatch is the whole story of 4K webcams. Call platforms downscale your feed to manage bandwidth, so the extra resolution rarely reaches the other side of a live call. Where 4K genuinely helps is headroom: a dense 2160-line image can be cropped or zoomed while still delivering more detail than a native 1080p sensor could after the same crop.",
      "In other words, resolution isn't the goal — framing flexibility is. A 4K feed cropped to the good half of its frame still looks sharp; a 1080p feed cropped that far starts to smudge. Sensor quality, lens and lighting still matter more than the pixel count alone.",
    ],
    camtunerAngle:
      "CamTuner turns that headroom into composition: crop into a 4K feed to frame exactly the shot you want while staying above call-transmit resolution — and a well-lit 1080p webcam, cropped smartly, beats an expensive 4K one left on auto.",
    relatedSlugs: ["letterboxing", "auto-framing"],
    faqs: [
      {
        q: "Do video calls transmit in 4K?",
        a: "No. Meet, Zoom and Teams typically transmit 720p–1080p per participant for bandwidth reasons. Your 4K feed is downscaled on the way out — the extra pixels mainly buy cropping headroom.",
      },
      {
        q: "Should I buy a 4K webcam or fix my framing first?",
        a: "Fix framing first. Most “bad webcam” complaints — too far away, off-center, cluttered background — are composition problems that a crop solves for free, on any camera.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
]

export const glossaryBySlug = (slug: string) =>
  glossary.find((g) => g.slug === slug)

export const otherGlossaryEntries = (slug: string) =>
  glossary.filter((g) => g.slug !== slug)

/** Related entries resolved by slug, preserving order. */
export const relatedGlossaryEntries = (entry: GlossaryEntry) =>
  entry.relatedSlugs
    .map((slug) => glossaryBySlug(slug))
    .filter((g) => g !== undefined)
