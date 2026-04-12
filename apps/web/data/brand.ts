import envLib from "@/lib/env"

export const brand = {
  name: "CamTuner",
  tagline: "Professional Webcam Configurator",
  title: "CamTuner — Professional Webcam Configurator",
  baseUrl: envLib.webUrl,
  description: {
    full: "Crop, zoom, and align your live camera feed directly in your browser. Free Chrome extension for professional webcam framing on Google Meet and Zoom.",
    short:
      "Crop, zoom, and align your live camera feed directly in your browser. Free Chrome extension for professional webcam framing.",
    schema:
      "Professional webcam configurator. Crop, zoom, and align your live camera feed directly in your browser.",
    app: "Professional browser extension for webcam framing. Crop, zoom, and align your live video feed with zero-latency processing.",
  },
  author: "CamTuner",
  keywords: [
    "webcam",
    "camera settings",
    "crop video",
    "zoom webcam",
    "browser extension",
    "Google Meet",
    "Zoom",
    "CamTuner",
    "video framing",
    "webcam configurator",
  ],
  social: {
    github: "https://github.com/tonmoydeb404/cam-tuner",
  },
  ogImage: {
    url: "https://camtuner.app/opengraph-image",
    width: 1200,
    height: 630,
    alt: "CamTuner — Professional Webcam Configurator",
  },
  footerLinks: [
    { name: "Privacy", url: "/privacy" },
    { name: "Terms", url: "/terms" },
    { name: "Github", url: "https://github.com/tonmoydeb404/cam-tuner" },
    { name: "Developer", url: "https://tonmoydeb.com" },
  ],
} as const
