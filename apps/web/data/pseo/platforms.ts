/**
 * Data for the "works with" integration pages (/on/[slug]).
 *
 * Each entry must contain genuinely platform-specific content — steps,
 * support matrix, quirks and FAQs are what differentiate these pages from
 * template-swapped thin content. CamTuner patches getUserMedia inside the
 * browser, so the core fact of every page is: browser clients work, native
 * desktop apps do not.
 */

export interface PlatformStep {
  title: string
  description: string
}

export interface PlatformFaq {
  q: string
  a: string
}

export interface Platform {
  slug: string
  /** Display name — keep in sync with content.json worksWith.items. */
  name: string
  metaTitle: string
  metaDescription: string
  /** Lead paragraph shown under the page title. */
  intro: string[]
  /** Where calls actually happen. */
  support: {
    /** Has a browser client CamTuner can tune. */
    web: boolean
    /** Has a native desktop app CamTuner cannot touch. */
    desktopApp: boolean
    note: string
  }
  steps: PlatformStep[]
  /** The framing that suits the platform's video layout. */
  recommendedRatio: "16:9" | "4:3" | "1:1" | "9:16"
  quirks: PlatformStep[]
  faqs: PlatformFaq[]
  lastUpdated: string
}

export const platforms: Platform[] = [
  {
    slug: "google-meet",
    name: "Google Meet",
    metaTitle: "CamTuner for Google Meet — Better Camera Framing",
    metaDescription:
      "Crop, zoom and center your webcam on Google Meet — free, in the browser, with no Meet settings to change. Everything is processed on your device.",
    intro: [
      "Google Meet fits your entire camera frame into the video tile, and laptop webcams are wide. The result is the classic Meet look: you sit small in the middle of the shot with the whole room visible behind you.",
      "CamTuner fixes this before Meet ever receives a frame. You crop, zoom and align your feed once in the extension, and every Meet call — including the green-room preview — shows the framed version.",
    ],
    support: {
      web: true,
      desktopApp: false,
      note: "Meet runs entirely in the browser, so CamTuner works on every call with no exceptions — there is no separate Meet desktop app to worry about.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "One click from the Chrome Web Store. The extension needs camera access to adjust your feed.",
      },
      {
        title: "Set your framing",
        description:
          "Open the CamTuner popup and pick an aspect ratio, zoom level and alignment. Try it live on this site first if you like.",
      },
      {
        title: "Join your Meet call as usual",
        description:
          "Keep your normal camera selected in Meet. The tuned stream is what Meet — and everyone on the call — receives.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "The pre-join preview shows the tuned feed too",
        description:
          "The green-room check before you join uses the same camera stream, so what you see there is exactly what participants get.",
      },
      {
        title: "Camera switching is safe",
        description:
          "If you switch cameras mid-call in Meet's settings, CamTuner re-applies your framing to the new stream automatically.",
      },
    ],
    faqs: [
      {
        q: "Does CamTuner work in the Google Meet desktop app?",
        a: "There is no separate Meet desktop app — Meet always runs in the browser, which is exactly where CamTuner works. If you open Meet from a Gmail sidebar or a calendar link, you are still in the browser and still covered.",
      },
      {
        q: "Do other participants see my cropped, zoomed framing?",
        a: "Yes. CamTuner adjusts the stream inside your browser before Meet transmits it, so the framed version is what everyone on the call sees — not just your local preview.",
      },
      {
        q: "Do I need to change anything in Meet's settings?",
        a: "No. Keep your regular camera selected in Meet's video settings. CamTuner modifies the feed before the browser hands it over, so no virtual camera or device switch is needed.",
      },
      {
        q: "Does Meet's background blur still work?",
        a: "Meet applies its own effects after receiving your stream, so you can combine Meet's backgrounds with CamTuner framing — though most people find they only need one of the two.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "zoom",
    name: "Zoom",
    metaTitle: "CamTuner for Zoom — Crop & Frame Your Webcam",
    metaDescription:
      "Fix your webcam framing on Zoom web: crop to 16:9, zoom in and center yourself before the call. Free browser extension — nothing leaves your device.",
    intro: [
      "Zoom is where bad framing hurts most — it is the default for job interviews, client calls and all-hands. Zoom's own camera adjustments are thin, and the wide lens on most laptop webcams leaves you looking distant.",
      "CamTuner works with Zoom in the browser (via the Chrome Web client). Tune your crop, zoom and alignment once, and every browser-based Zoom call shows the framed version — with your normal camera still selected.",
    ],
    support: {
      web: true,
      desktopApp: true,
      note: "CamTuner works when you join from the browser. The Zoom desktop app receives its video outside the browser, so CamTuner has no effect there.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and allow camera access — the extension adjusts the stream locally.",
      },
      {
        title: "Set your framing",
        description:
          "Pick your aspect ratio, zoom and alignment in the CamTuner popup. Changes apply instantly.",
      },
      {
        title: "Join from your browser",
        description:
          "When the meeting link tries to launch the Zoom app, choose “Join from Your Browser” instead. Keep your usual camera selected.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "“Join from Your Browser” is the critical step",
        description:
          "Zoom links default to opening the desktop app. Look for the browser-join link on the launch page — if the app opens instead, CamTuner cannot reach that call.",
      },
      {
        title: "Zoom's Touch up my appearance stacks fine",
        description:
          "Zoom's video filters and CamTuner framing operate at different stages, so you can combine them if you want both.",
      },
    ],
    faqs: [
      {
        q: "Does CamTuner work in the Zoom desktop app?",
        a: "No. The desktop app talks to your camera directly, outside the browser, so there is nothing for a browser extension to adjust. Join the meeting from Chrome (choose “Join from Your Browser”) and CamTuner applies automatically.",
      },
      {
        q: "How do I join a Zoom meeting in the browser instead of the app?",
        a: "Open the meeting link, and on the page that tries to launch Zoom, click “Join from Your Browser”. You may need to click “cancel” on the app-launch prompt first. The in-browser client supports all the essentials: video, audio and screen sharing.",
      },
      {
        q: "Will other participants see my adjusted framing?",
        a: "Yes. The crop and zoom are applied to the stream before Zoom receives it, so the framed version is what everyone else sees.",
      },
      {
        q: "Does this work with Zoom's HD video setting?",
        a: "Yes — CamTuner processes the stream before Zoom encodes it, so Zoom's HD and original-video settings behave as usual.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "microsoft-teams",
    name: "Microsoft Teams",
    metaTitle: "CamTuner for Microsoft Teams — Better Webcam Framing",
    metaDescription:
      "Look centered and framed on Microsoft Teams calls. CamTuner crops, zooms and aligns your webcam in the browser — free and fully on-device.",
    intro: [
      "Teams tiles are unforgiving: the full camera frame is squeezed into a small grid cell, so anything off-center reads as off-center immediately, and the empty room around you is on display all meeting.",
      "CamTuner works with Teams in the browser at teams.microsoft.com and teams.live.com. Set your framing once in the extension and the tuned feed is what Teams — and your colleagues — receive.",
    ],
    support: {
      web: true,
      desktopApp: true,
      note: "Use the Teams web app in Chrome for CamTuner to apply. The installed Teams desktop app bypasses the browser, so CamTuner cannot adjust its video.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and grant camera access.",
      },
      {
        title: "Set your framing",
        description:
          "Choose your crop, zoom and alignment in the CamTuner popup — the preview shows exactly what the call will see.",
      },
      {
        title: "Join the meeting in the browser",
        description:
          "When a Teams link offers “Continue on this browser” (or “Join the meeting on the web”), take it and keep your normal camera selected.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "Work and personal accounts both have web clients",
        description:
          "teams.microsoft.com serves work and school accounts; teams.live.com serves personal accounts. CamTuner works on both in Chrome.",
      },
      {
        title: "Together mode and gallery view benefit most",
        description:
          "Tight framing reads best in Teams' grid layouts, where every extra bit of empty room shrinks your tile share even further.",
      },
    ],
    faqs: [
      {
        q: "Does CamTuner work in the Teams desktop app?",
        a: "No. The desktop app captures your camera outside the browser. Join from Chrome via the browser-join option on the meeting link and CamTuner's framing applies automatically.",
      },
      {
        q: "Which Teams URL should I use?",
        a: "Work and school meetings run at teams.microsoft.com, personal meetings at teams.live.com. Both run in the browser, and CamTuner works on both.",
      },
      {
        q: "Do other participants see the framed version?",
        a: "Yes. The adjustments happen before Teams receives the stream, so everyone sees the cropped, centered feed.",
      },
      {
        q: "Can I still use Teams backgrounds and effects?",
        a: "Yes. Teams applies its backgrounds after receiving your stream, so Teams effects and CamTuner framing can be used together.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "discord",
    name: "Discord",
    metaTitle: "CamTuner for Discord — Crop & Frame Your Webcam",
    metaDescription:
      "Frame your webcam properly on Discord. CamTuner crops, zooms and centers your camera in the browser — free, with nothing uploaded anywhere.",
    intro: [
      "Discord video tiles are small and often shared with screens, so a wide, off-center camera makes you barely visible. Server admins and friends get the tidy, centered you instead of the distant one.",
      "CamTuner works with Discord in the browser at discord.com. Tune your framing once, keep your normal camera selected in Discord's voice & video settings, and the framed feed is what the channel sees.",
    ],
    support: {
      web: true,
      desktopApp: true,
      note: "CamTuner works in the browser app at discord.com. The Discord desktop app captures the camera outside the browser, so it is unaffected.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and allow camera access.",
      },
      {
        title: "Set your framing",
        description:
          "Pick your ratio, zoom and alignment in the CamTuner popup.",
      },
      {
        title: "Go live from discord.com",
        description:
          "Use the browser version of Discord, keep your regular camera selected under Voice & Video settings, and start your video as usual.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "Discord's camera preview shows the tuned feed",
        description:
          "The preview in User Settings → Voice & Video uses the same stream, so you can confirm your framing before going live.",
      },
      {
        title: "Streaming a screen is unaffected",
        description:
          "CamTuner only touches camera streams. Screen shares stream exactly as before.",
      },
    ],
    faqs: [
      {
        q: "Does CamTuner work in the Discord desktop app?",
        a: "No. The desktop app is a separate program that talks to your camera directly, outside the browser. Use discord.com in Chrome and CamTuner applies automatically.",
      },
      {
        q: "Do I need to select a different camera in Discord?",
        a: "No. Keep your regular camera in Discord's Voice & Video settings. CamTuner adjusts the stream before Discord receives it.",
      },
      {
        q: "Will my framing show in Go Live streams and calls?",
        a: "Yes — anywhere Discord shows your camera (voice calls, video channels, Go Live with camera), the tuned feed is what viewers get.",
      },
      {
        q: "Does it work with Discord's Krisp noise suppression?",
        a: "Krisp processes audio, CamTuner processes video — they don't interact. Both can be on at once.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "slack-huddles",
    name: "Slack Huddles",
    metaTitle: "CamTuner for Slack Huddles — Better Webcam Framing",
    metaDescription:
      "Show up framed and centered in Slack Huddles. CamTuner adjusts your webcam in the browser before Slack sees it — free and on-device.",
    intro: [
      "Huddles are casual, but a bad camera angle is still the first thing people see in an async-friendly workplace. Slack's small video bubbles amplify the classic webcam problem: too much room, not enough you.",
      "CamTuner works with Slack in the browser at app.slack.com. Set your framing in the extension and every huddle shows the cropped, centered version of your feed.",
    ],
    support: {
      web: true,
      desktopApp: true,
      note: "CamTuner works when Slack runs in Chrome at app.slack.com. The Slack desktop app loads its own environment, so huddles started there are not tuned.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and grant camera access.",
      },
      {
        title: "Set your framing",
        description:
          "Choose your aspect ratio, zoom and alignment in the CamTuner popup.",
      },
      {
        title: "Start the huddle from app.slack.com",
        description:
          "Open your workspace in Chrome (rather than the desktop app), start or join the huddle, and keep your normal camera selected.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "Bookmark the web workspace",
        description:
          "If your team lives in the desktop app, keep app.slack.com open in a Chrome tab for huddles so your framing is always applied.",
      },
      {
        title: "Screen shares are untouched",
        description:
          "CamTuner only adjusts camera streams, so your window and screen shares behave exactly as before.",
      },
    ],
    faqs: [
      {
        q: "Does CamTuner work in the Slack desktop app?",
        a: "No. Huddles started in the Slack desktop app use a camera path outside the browser. Run Slack in Chrome at app.slack.com and CamTuner's framing applies automatically.",
      },
      {
        q: "Do huddle participants see the adjusted video?",
        a: "Yes. The stream is tuned before Slack receives it, so everyone in the huddle sees the framed version.",
      },
      {
        q: "Can I use different framing for different workspaces?",
        a: "CamTuner keeps one global framing by default, with per-site overrides supported — so you can tune Slack differently from other tools if you want.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "whereby",
    name: "Whereby",
    metaTitle: "CamTuner for Whereby — Better Camera Framing",
    metaDescription:
      "Crop, zoom and center your webcam on Whereby calls. CamTuner works in the browser Whereby already uses — free and fully on-device.",
    intro: [
      "Whereby is browser-native video calling — no downloads, the call lives in a tab. That makes it a perfect match for CamTuner, which also lives in the browser and adjusts your camera before the call platform sees it.",
      "Frame yourself once — crop, zoom, align — and every Whereby room shows the tuned feed, from the pre-join check onward.",
    ],
    support: {
      web: true,
      desktopApp: false,
      note: "Whereby runs in the browser by design, so CamTuner works on every call with nothing extra to configure.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and allow camera access.",
      },
      {
        title: "Set your framing",
        description:
          "Pick your aspect ratio, zoom and alignment in the CamTuner popup.",
      },
      {
        title: "Open your Whereby room",
        description:
          "Join as usual and keep your normal camera selected in the device check. The tuned stream is what the room receives.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "The pre-join device check shows the tuned feed",
        description:
          "Confirm your framing on Whereby's camera check screen before entering the room — it matches what participants will see.",
      },
      {
        title: "Recording and locking rooms are unaffected",
        description:
          "CamTuner only changes the video your camera produces; every other Whereby feature works as normal.",
      },
    ],
    faqs: [
      {
        q: "Does CamTuner work with Whereby's embedded rooms?",
        a: "Yes. Whereby rooms embedded in other sites still request the camera through the browser, so the tuned stream applies there too.",
      },
      {
        q: "Do other participants see my cropped framing?",
        a: "Yes. The adjustments are applied before Whereby receives the stream, so everyone sees the framed version.",
      },
      {
        q: "Do I need a virtual camera or extra software?",
        a: "No. CamTuner is a browser extension, not a virtual camera. Your camera selection stays the same everywhere.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "riverside",
    name: "Riverside",
    metaTitle: "CamTuner for Riverside — Frame Your Webcam Right",
    metaDescription:
      "Record framed, centered video in Riverside studios. CamTuner crops and zooms your webcam in the browser before Riverside records it.",
    intro: [
      "Riverside records high-quality local video, which means your framing mistakes are preserved in the recording too. A distant, off-center camera is much more painful in a podcast cut than in a live call.",
      "CamTuner fixes the framing at the source — inside the browser, before Riverside's recorder captures anything. Crop to 16:9, zoom in, center yourself once, and both the live studio view and the local recordings show the framed version.",
    ],
    support: {
      web: true,
      desktopApp: false,
      note: "Riverside studios run in the browser, so CamTuner works on every session — guest and host alike.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and allow camera access.",
      },
      {
        title: "Set your framing",
        description:
          "Pick 16:9, zoom and alignment in the CamTuner popup before you join the studio.",
      },
      {
        title: "Join the studio and check the device screen",
        description:
          "Riverside's pre-join device check shows the tuned feed — confirm your framing there, then start recording as usual.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "Local recordings capture the framed feed",
        description:
          "Riverside records the browser stream locally — the same one CamTuner adjusted — so your uploads and backups keep the framing.",
      },
      {
        title: "Tune before you join",
        description:
          "Set your framing before entering the studio so the device check and the first take are already right.",
      },
    ],
    faqs: [
      {
        q: "Will Riverside's recordings include my CamTuner framing?",
        a: "Yes. Riverside records the stream inside the browser, after CamTuner's adjustments, so local recordings and uploads keep your crop and zoom.",
      },
      {
        q: "Does CamTuner reduce Riverside's recording quality?",
        a: "No. CamTuner processes frames on your device with near-zero added latency and doesn't change the resolution Riverside requests beyond your crop.",
      },
      {
        q: "Should guests install it too?",
        a: "For a consistent show, yes — each participant's framing is set on their own device, so every guest who wants to look centered needs the extension installed in their Chrome.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
  {
    slug: "streamyard",
    name: "StreamYard",
    metaTitle: "CamTuner for StreamYard — Better Camera Framing",
    metaDescription:
      "Frame your webcam for StreamYard broadcasts — including 9:16 vertical streams. CamTuner crops and centers your camera in the browser.",
    intro: [
      "StreamYard broadcasts get reused everywhere: the YouTube replay wants 16:9, the TikTok and Shorts clips want 9:16, and your camera only shoots one shape. Whatever doesn't fit becomes bars or a blind crop.",
      "CamTuner shapes the feed before StreamYard receives it. Use a 16:9 crop for standard broadcasts, or switch the whole show vertical with a 9:16 frame — live in the browser, no virtual camera, no desktop software.",
    ],
    support: {
      web: true,
      desktopApp: false,
      note: "StreamYard studios run entirely in the browser, so CamTuner works for hosts and guests on every broadcast.",
    },
    steps: [
      {
        title: "Add CamTuner to Chrome",
        description:
          "Install from the Chrome Web Store and allow camera access.",
      },
      {
        title: "Set your framing",
        description:
          "Pick 16:9 for landscape shows — or 9:16 if the whole broadcast is vertical — plus zoom and alignment, in the CamTuner popup.",
      },
      {
        title: "Enter the studio and confirm on the device check",
        description:
          "StreamYard's camera settings screen shows the tuned feed. Keep your normal camera selected and go live.",
      },
    ],
    recommendedRatio: "16:9",
    quirks: [
      {
        title: "For vertical broadcasts, frame 9:16 at the source",
        description:
          "Instead of letting StreamYard center-crop your landscape feed for vertical destinations, deliver a real 9:16 frame and choose exactly what's in the shot.",
      },
      {
        title: "Camera switching mid-show is safe",
        description:
          "If you change cameras in the studio, CamTuner re-applies your framing to the new stream automatically.",
      },
    ],
    faqs: [
      {
        q: "Can I use CamTuner for vertical (9:16) streams?",
        a: "Yes — that's one of its best uses. Set a 9:16 aspect ratio in the extension and StreamYard's vertical destinations receive a native vertical frame instead of a cropped-down landscape one.",
      },
      {
        q: "Do viewers see my framing on the final broadcast?",
        a: "Yes. StreamYard receives the already-framed stream, so the crop and zoom are baked into everything: the live show, the replay and the clips.",
      },
      {
        q: "Does it work for guests joining my studio?",
        a: "For guests, framing is set on their device — each guest needs CamTuner installed in their own Chrome to appear framed.",
      },
    ],
    lastUpdated: "2026-10-21",
  },
]

export const platformBySlug = (slug: string) =>
  platforms.find((p) => p.slug === slug)

/** Sibling pages for cross-links, excluding the given platform. */
export const otherPlatforms = (slug: string) =>
  platforms.filter((p) => p.slug !== slug)
