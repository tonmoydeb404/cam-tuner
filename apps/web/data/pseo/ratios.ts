/**
 * Data for the aspect-ratio crop pages (/crop/[slug]).
 *
 * Each page pairs the copy with a live tool that preloads the ratio, so the
 * page itself is the product — not a description of it.
 */

export interface RatioFaq {
  q: string
  a: string
}

export interface RatioPage {
  slug: string
  /** Value passed to the tuner — must be a valid AspectRatio. */
  ratio: "16:9" | "4:3" | "1:1" | "9:16"
  name: string
  metaTitle: string
  metaDescription: string
  intro: string[]
  useCases: string[]
  /** Platform slugs where this shape is the native fit. */
  fitsPlatformSlugs: string[]
  tips: string[]
  faqs: RatioFaq[]
  lastUpdated: string
}

export const ratios: RatioPage[] = [
  {
    slug: "16-9",
    ratio: "16:9",
    name: "16:9",
    metaTitle: "Crop Your Webcam to 16:9 — Free Browser Tool",
    metaDescription:
      "Crop and zoom your webcam to 16:9 right in the browser. Try it live, then keep the framing on every call with the free CamTuner extension.",
    intro: [
      "16:9 is the shape of video calling. Meet, Zoom, Teams, Discord and every mainstream call app fill a 16:9 tile, but most laptop webcams record 4:3 — so the app either shows bars or stretches a crop you don't control.",
      "Taking 16:9 into your own hands means choosing what's in the shot: zoomed in enough to look present, aligned where you want, with the dead space cropped away instead of letterboxed by someone else's algorithm.",
    ],
    useCases: [
      "Google Meet, Zoom and Teams calls — the tile is 16:9, so your feed should be too",
      "Recording talking-head video for YouTube or course content",
      "Any call where you currently see black bars above and below your feed",
    ],
    fitsPlatformSlugs: ["google-meet", "zoom", "microsoft-teams"],
    tips: [
      "Zoom to about 1.2–1.5x before you crop — most webcams have more resolution than a call needs, and the tighter shot reads as more engaged",
      "If you'd rather keep the full sensor view, turn letterbox on instead and pick a bar color that matches your background",
      "Pair the crop with Center Stage if you move around — it keeps the 16:9 frame locked on you",
    ],
    faqs: [
      {
        q: "Why does my webcam show black bars in video calls?",
        a: "Most laptop webcams capture 4:3, while call apps display 16:9. When the app fits your whole frame, the missing width becomes bars. Cropping your feed to 16:9 removes them.",
      },
      {
        q: "Is 16:9 the same as what Zoom and Meet already do?",
        a: "No. Apps apply their own automatic crop, which usually centers the frame and can cut you off or include clutter you didn't want. Cropping at the source means you choose the framing.",
      },
      {
        q: "Does cropping to 16:9 reduce quality?",
        a: "Barely. A 1080p webcam cropped to 16:9 still outputs more than the 720p–1080p most call apps transmit, and CamTuner adds under 2ms of processing latency.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "4-3",
    ratio: "4:3",
    name: "4:3",
    metaTitle: "Crop Your Webcam to 4:3 — Free Browser Tool",
    metaDescription:
      "Use your webcam's native 4:3 frame with a live browser tool. Crop, zoom and align, then lock the framing on every call with CamTuner.",
    intro: [
      "4:3 is what your webcam sensor actually sees. Laptop cameras and most external webcams capture a squarish 4:3 frame before any app reshapes it — the fullest, least-distorted picture your camera can produce.",
      "Keeping 4:3 is useful when you control the canvas: recordings you'll reframe later, streaming layouts with room beside you, or calls on platforms that display 4:3 feeds without padding.",
    ],
    useCases: [
      "Recording footage you plan to reframe or edit into other shapes later",
      "Stream layouts with overlays or side panels where a taller frame fits",
      "Calls on platforms that render 4:3 feeds natively without letterboxing",
    ],
    fitsPlatformSlugs: [],
    tips: [
      "4:3 is the tallest shape that doesn't require cropping your sensor — good when headroom matters",
      "On 16:9 call platforms, a 4:3 feed turns into bars — that's where the 16:9 preset is the better choice",
      "Try aligning yourself slightly off-center; a 4:3 frame leaves comfortable room for picture-in-picture overlays",
    ],
    faqs: [
      {
        q: "Isn't my webcam already 4:3?",
        a: "The raw capture is, but call apps and streaming software often crop or letterbox it before anyone sees it. Locking 4:3 in CamTuner keeps the native shape explicit and under your control.",
      },
      {
        q: "Why do I see bars when I use 4:3 on calls?",
        a: "Call tiles are 16:9, so a taller 4:3 feed gets padded with bars on the sides. If you mostly join calls, use the 16:9 preset; keep 4:3 for recording and layouts where you control the canvas.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "1-1",
    ratio: "1:1",
    name: "1:1",
    metaTitle: "Crop Your Webcam to 1:1 — Free Browser Tool",
    metaDescription:
      "Square webcam framing, live in your browser. Crop your camera to 1:1, zoom and align, then keep the look on every call with CamTuner.",
    intro: [
      "Square 1:1 framing is the shape of social: profile videos, feed posts and embeds that need to sit neatly in a grid. Cropped from a webcam at the source, it looks intentional rather than squeezed.",
      "CamTuner lets you frame the exact square you want — center on your face, zoom to taste — and keeps it that way whether you're recording a clip or sitting on a call.",
    ],
    useCases: [
      "Profile videos and avatars for social platforms",
      "Clips destined for grid layouts or embedded players",
      "Podcast video frames that get re-exported to multiple shapes",
    ],
    fitsPlatformSlugs: [],
    tips: [
      "A 1:1 crop of a 1080p feed still has plenty of resolution for social exports",
      "Square crops magnify background clutter at the edges — zoom or align until the frame holds only what you want",
      "For vertical-first platforms, 9:16 keeps more options open than 1:1",
    ],
    faqs: [
      {
        q: "When should I pick 1:1 over 9:16?",
        a: "When the destination is square: profile loops, grid embeds, feed posts. 9:16 wins for Reels, Shorts and TikTok; 1:1 wins when the player or container is square.",
      },
      {
        q: "What happens to a 1:1 feed on a normal video call?",
        a: "Call tiles are 16:9, so a square feed is padded or cropped by the app. Use 1:1 for recording and social, and switch to 16:9 for live calls.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "9-16",
    ratio: "9:16",
    name: "9:16",
    metaTitle: "Crop Your Webcam to 9:16 (Vertical) — Free Tool",
    metaDescription:
      "Frame your webcam vertically — 9:16 for Reels, Shorts, TikTok and vertical live streams. Try the live crop tool, then keep it with CamTuner.",
    intro: [
      "Vertical 9:16 is the native shape of phones: Reels, Shorts, TikTok and vertical live destinations all expect a full-height frame. A webcam that shoots 4:3 or 16:9 has to be cropped hard to get there — and letting the platform do the crop means losing your head or your hands.",
      "Framing 9:16 at the source puts you in charge of the vertical shot: zoomed to the right height, aligned to leave room for captions, and delivered as a real vertical feed instead of a cropped afterthought.",
    ],
    useCases: [
      "Reels, Shorts and TikTok videos recorded from your webcam",
      "Vertical live streams on platforms with 9:16 stages, like StreamYard's vertical broadcasts",
      "Any content where you want a full-height shot with room for captions at the bottom",
    ],
    fitsPlatformSlugs: ["streamyard"],
    tips: [
      "Leave headroom for captions and UI overlays — align your eyes to the top third of the frame",
      "A 9:16 crop is aggressive; a little zoom (1.2x+) plus good lighting keeps the result sharp",
      "Vertical feeds get cut off on desktop players — remember which context you're framing for",
    ],
    faqs: [
      {
        q: "Can I stream vertical video from a normal webcam?",
        a: "Yes. Your webcam captures far more frame than a 16:9 call shows; CamTuner crops that capture to a true 9:16 and hands the vertical feed to any site you're on.",
      },
      {
        q: "How do I stop TikTok cutting off my head?",
        a: "That happens when the platform center-crops a wide feed. Delivering a native 9:16 stream means you framed the vertical shot yourself — nothing gets cropped later.",
      },
      {
        q: "Is a 9:16 crop too tight for a webcam?",
        a: "It's the tightest preset, but 1080p webcams still have resolution to spare after the crop. If it feels too close, reduce the zoom until the frame breathes.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
]

export const ratioBySlug = (slug: string) => ratios.find((r) => r.slug === slug)

export const otherRatios = (slug: string) =>
  ratios.filter((r) => r.slug !== slug)
