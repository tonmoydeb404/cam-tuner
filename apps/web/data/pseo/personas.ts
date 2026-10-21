/**
 * Data for persona pages (/for/[slug]) — "webcam setup for teachers",
 * "look professional in interviews", etc. Demand for every slug below was
 * validated against Google autocomplete before building (see repo history).
 *
 * Each persona needs genuinely distinct advice — a teacher's framing problem
 * (moving around a classroom) shares almost nothing with an interviewer's
 * (static, eye-line, first impressions). Pages are indexable by default;
 * set `noindex: true` on any entry that turns out thinner than expected.
 */

export interface PersonaPain {
  title: string
  description: string
}

export interface PersonaFaq {
  q: string
  a: string
}

export interface Persona {
  slug: string
  name: string
  metaTitle: string
  metaDescription: string
  intro: string[]
  pains: PersonaPain[]
  /** Slug of the recommended aspect-ratio page (/crop/[slug]). */
  ratioSlug: string
  /** Product features this persona should turn on, with the why. */
  features: PersonaPain[]
  /** Platform slugs (/on/[slug]) most relevant to this persona. */
  platformSlugs: string[]
  tips: string[]
  faqs: PersonaFaq[]
  lastUpdated: string
}

export const personas: Persona[] = [
  {
    slug: "teachers",
    name: "teachers",
    metaTitle: "Webcam Setup for Teachers — Look Great While You Teach",
    metaDescription:
      "Frame your webcam for online teaching: stay centered while you move, blur your classroom, and look clear on Meet and Zoom. Free browser extension.",
    intro: [
      "Teaching on camera is nothing like sitting in a meeting. You lean toward the desk, turn to grab a printout, stand at the whiteboard — and a fixed camera crops you out the moment you move.",
      "CamTuner is built for exactly that: Center Stage keeps the frame on you as you move, your chosen crop stays locked all lesson, and a blurred or replaced background hides the controlled chaos of a real classroom.",
    ],
    pains: [
      {
        title: "You move, the frame doesn't",
        description:
          "Standard webcams frame a still subject. The moment you stand or lean in, you drift out of shot mid-explanation.",
      },
      {
        title: "The classroom is the co-star",
        description:
          "Whatever is behind you — posters, boxes, other students — is broadcast to every attendee and every recording.",
      },
      {
        title: "School hardware is unflattering",
        description:
          "Shared Chromebooks and old conference cams are wide-angle by default, so you teach from across the room.",
      },
    ],
    ratioSlug: "16-9",
    features: [
      {
        title: "Center Stage tracking",
        description:
          "Face tracking keeps you centered while you write on the board, lean to a student's view, or grab props — all processed on your device.",
      },
      {
        title: "Background blur or replacement",
        description:
          "Blur the classroom or swap in a clean image, so attention stays on the lesson instead of the room.",
      },
      {
        title: "Settings that stick",
        description:
          "Set your framing once; CamTuner remembers it per site, so first period starts framed like the last one ended.",
      },
    ],
    platformSlugs: ["google-meet", "microsoft-teams"],
    tips: [
      "Turn Center Stage on for lessons where you move, and off for desk sessions to save CPU",
      "A 1.3x zoom with Center Stage reads as “present and calm” — pure wide angle reads as distant",
      "Blur beats replacement for live teaching: no edge glitches when you gesture quickly",
    ],
    faqs: [
      {
        q: "Does CamTuner work on school Chromebooks?",
        a: "Yes. CamTuner runs in Chrome, and ChromeOS browsers support the same extension APIs — including the camera-stream access CamTuner uses. If your teaching happens in the browser (Meet, Zoom web, Teams web), it works.",
      },
      {
        q: "Will face tracking slow down my lesson?",
        a: "Center Stage uses more CPU than a plain crop, and it's optional per session. Most teachers keep a fixed 16:9 crop for desk lessons and enable tracking only for whiteboard-style teaching.",
      },
      {
        q: "Does the blur work in recorded lessons?",
        a: "Yes — if the lesson is recorded in the browser, the recording captures the already-adjusted stream, blurred background and framing included.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "interviews",
    name: "job interviews",
    metaTitle: "Webcam Framing for Job Interviews — Show Up Centered",
    metaDescription:
      "Look composed and centered in video interviews: a tight 16:9 frame, clean background and steady eye-line, set once with a free browser extension.",
    intro: [
      "In a video interview, the frame is the first impression. A distant, off-center webcam shot quietly signals the same things a sloppy desk does — and interviewers can't tell them apart from nerves.",
      "CamTuner lets you fix the impression once, before the call: a tight centered crop, a blurred room, and a framing that doesn't shift when you lean in to make a point.",
    ],
    pains: [
      {
        title: "First impressions are visual",
        description:
          "Interviewers form judgments in seconds. A wide, dark, off-center frame works against you before you've answered anything.",
      },
      {
        title: "Nerves show up as movement",
        description:
          "Leaning, shifting and gesturing all move you around a fixed frame — right when you most want to look composed.",
      },
      {
        title: "Your home is on display",
        description:
          "Interview calls happen where you live. Laundry, roommates and kitchen clutter become part of your presentation.",
      },
    ],
    ratioSlug: "16-9",
    features: [
      {
        title: "Centered, tight 16:9 crop",
        description:
          "Frame yourself from the chest up, centered — the composition interview guides recommend, locked in before you join.",
      },
      {
        title: "Background blur",
        description:
          "One toggle dissolves the room behind you into a soft, neutral backdrop that keeps attention on your answers.",
      },
      {
        title: "Rehearse on the same tool",
        description:
          "Use the live crop tool on this site to practice your setup, then the extension applies the identical framing on the real call.",
      },
    ],
    platformSlugs: ["zoom", "microsoft-teams", "google-meet"],
    tips: [
      "Raise the laptop so the camera is at eye level — framing fixes geometry, not height",
      "Face a window or lamp; no crop recovers a backlit silhouette",
      "Join the interview from the browser (Zoom web, Teams web) so the framing definitely applies",
    ],
    faqs: [
      {
        q: "Should I use background blur in an interview?",
        a: "Usually yes. A blurred room reads as tidy and neutral without the distraction (or glitch risk) of a virtual image. If your actual space is presentable, a real background is fine too.",
      },
      {
        q: "Will the interviewer know I'm using a tool?",
        a: "They'll see a well-framed, centered camera feed — the same look as a good dedicated webcam setup. There's no watermark, overlay or branding.",
      },
      {
        q: "Can I use it for practice sessions too?",
        a: "Yes, and you should: record yourself with the framing you'll use live. The crop tool on this site works without installing anything.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "streamers",
    name: "streamers",
    metaTitle: "Webcam Framing for Streamers — Vertical & 16:9, In-Browser",
    metaDescription:
      "Frame your webcam for streams: native 9:16 for vertical broadcasts, 16:9 for shows, mirror control and zero added latency — all in the browser.",
    intro: [
      "Browser-based streaming studios like StreamYard made going live without OBS possible — but your webcam still shoots one shape, and every platform wants a different one. Vertical destinations crop your landscape feed blind.",
      "CamTuner shapes the camera feed at the source: a real 9:16 frame for vertical live, 16:9 for standard shows, plus mirror control for setups that come out flipped.",
    ],
    pains: [
      {
        title: "Vertical platforms crop blind",
        description:
          "When a landscape webcam feed meets a 9:16 stage, the studio center-crops it — cutting off whatever you framed carefully.",
      },
      {
        title: "Mirror confusion",
        description:
          "Flipped feeds make on-screen text unreadable and your gestures look wrong; some capture rigs make it worse.",
      },
      {
        title: "Frame drift across a long stream",
        description:
          "You start centered; two hours later you've migrated to the edge of the shot without noticing.",
      },
    ],
    ratioSlug: "9-16",
    features: [
      {
        title: "Native 9:16 for vertical live",
        description:
          "Frame a true vertical shot — TikTok and Shorts-style live stages get a real composition, not a cropped accident.",
      },
      {
        title: "Mirror and flip controls",
        description:
          "Correct the orientation once; the corrected feed is what the studio and the stream receive.",
      },
      {
        title: "Center Stage for long sessions",
        description:
          "Optional face tracking keeps you framed through hours of movement, without you touching the camera.",
      },
    ],
    platformSlugs: ["streamyard", "riverside", "discord"],
    tips: [
      "For simultaneous horizontal + vertical broadcasts, frame for the vertical stage — horizontal crops of a 9:16 feed lose less than the reverse",
      "Check your framing in StreamYard's device preview before going live; it shows the exact tuned feed",
      "Keep a second browser profile with a 16:9 preset for guest spots on other shows",
    ],
    faqs: [
      {
        q: "Does CamTuner work with OBS?",
        a: "No — OBS captures your camera directly, outside the browser. CamTuner is built for browser-based studios (StreamYard, Restream, Riverside) where the stream flows through Chrome.",
      },
      {
        q: "Can I run different framings for different streams?",
        a: "Yes. CamTuner supports per-site settings, so your StreamYard tab can run 9:16 vertical while your Riverside tab stays 16:9.",
      },
      {
        q: "Does the processing add lag to my stream?",
        a: "Cropping and zooming add under 2ms — effectively nothing. Face tracking costs more CPU, so enable it only for streams where you move around.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "remote-workers",
    name: "remote workers",
    metaTitle: "Better Webcam Framing for Remote Work — All-Day Calls",
    metaDescription:
      "Look present on every meeting, all day: crop and center your webcam once, blur your home office, and never touch camera settings again.",
    intro: [
      "Remote workers spend more of their week on camera than any other group — and small framing problems compound across dozens of weekly calls: the drifting off-center shot, the visible bedroom, the half-empty tile.",
      "CamTuner is a set-and-forget fix: tune your crop, alignment and background once, and every call app in the browser shows the same composed version of you, with no per-app setup.",
    ],
    pains: [
      {
        title: "Camera settings per app, per update",
        description:
          "Meet, Zoom and Teams each have their own video settings that never carry over — and periodically reset.",
      },
      {
        title: "Small tiles punish wide shots",
        description:
          "In grid view, every bit of empty room shrinks your effective presence on screen.",
      },
      {
        title: "Home spaces aren't studios",
        description:
          "Your office doubles as a guest room, and it shows every time the camera comes on.",
      },
    ],
    ratioSlug: "16-9",
    features: [
      {
        title: "One setup, every app",
        description:
          "The framing applies at the browser level, so Meet, Zoom web, Teams web, Slack and Discord all get the same tuned feed.",
      },
      {
        title: "Background blur on demand",
        description:
          "Blur the home office meeting-by-meeting — heavy processing only runs when you switch it on.",
      },
      {
        title: "Per-site overrides",
        description:
          "Keep a formal crop for client calls and a looser one for internal standups, keyed to each site.",
      },
    ],
    platformSlugs: ["google-meet", "zoom", "microsoft-teams", "slack-huddles"],
    tips: [
      "A 1.2x zoom centered on you makes grid tiles noticeably more present — try it for a week",
      "Keep Center Stage off for desk work; it's for standing desks and whiteboards, not email-adjacent calls",
      "Letterbox mode with a bar color matching your meeting background is a subtle way to brand internal all-hands",
    ],
    faqs: [
      {
        q: "Will this slow my laptop down during work hours?",
        a: "No. Cropping and zooming are near-free (under 2ms per frame). Background effects and face tracking use more CPU and are toggles — off by default.",
      },
      {
        q: "Does it work with my company's laptop restrictions?",
        a: "CamTuner is a standard Chrome extension installed from the Chrome Web Store. If your managed browser allows extensions, it works; no drivers or admin rights needed.",
      },
      {
        q: "Can I have different settings for work and personal calls?",
        a: "Yes — per-site settings mean your work Meet account and your personal Discord can carry different crops and backgrounds.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "content-creators",
    name: "content creators",
    metaTitle: "Webcam Framing for Content Creators — Record, Don't Fix",
    metaDescription:
      "Frame talking-head video at the source: locked 16:9 crops, brand-colored letterboxes and studio-quality framing for course and YouTube recording.",
    intro: [
      "Every talking-head video inherits its webcam framing. Fix it in the edit and you're re-cropping, re-keying and re-framing every single video forever; fix it at the camera and it's done once.",
      "CamTuner frames the feed before your recorder captures it — so course videos, YouTube segments and screencast face-cams all start with the composition you chose, not the one your webcam defaulted to.",
    ],
    pains: [
      {
        title: "Reframing every video, forever",
        description:
          "A bad source framing means cropping and correcting in post for every upload — hours of repeated work.",
      },
      {
        title: "Inconsistent look across videos",
        description:
          "Manual setups drift: this week's crop is a little different from last week's, and viewers feel it.",
      },
      {
        title: "Face-cam steals screen space",
        description:
          "Screencasts need the face-cam small but well-composed — impossible with a wide, unbudgeted camera frame.",
      },
    ],
    ratioSlug: "16-9",
    features: [
      {
        title: "Locked, repeatable framing",
        description:
          "The same crop and alignment every session — your series looks like one series.",
      },
      {
        title: "Letterbox color as a brand element",
        description:
          "Pad your feed with any bar color to match your thumbnail palette or course template.",
      },
      {
        title: "Record-ready for browser recorders",
        description:
          "Riverside and other in-browser recorders capture the tuned feed — framing, blur and all.",
      },
    ],
    platformSlugs: ["riverside", "streamyard", "zoom"],
    tips: [
      "Record 16:9 even for vertical-first platforms — a 9:16 cut from extra headroom beats a 9:16 session with no lateral options",
      "Set your letterbox color to your brand background and screenshots become instantly on-template",
      "Do one test recording after changing anything — framing bugs are invisible live and permanent in the edit",
    ],
    faqs: [
      {
        q: "Does the framing apply to screen recordings too?",
        a: "CamTuner only adjusts camera streams, so your screen capture is untouched — but the face-cam feed inside a browser recorder or call is framed exactly as you set it.",
      },
      {
        q: "I already own a good webcam. Is this still useful?",
        a: "Yes — good hardware doesn't choose your composition. The crop, alignment and consistency layer is exactly what a camera can't do for itself.",
      },
      {
        q: "Can I export my settings to another machine?",
        a: "Settings live in Chrome extension storage per machine. Set the same values on your recording rig once and they persist there.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
]

export const personaBySlug = (slug: string) =>
  personas.find((p) => p.slug === slug)

export const otherPersonas = (slug: string) =>
  personas.filter((p) => p.slug !== slug)
