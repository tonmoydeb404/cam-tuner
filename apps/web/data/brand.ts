export const brand = {
  name: "CamTuner",
  tagline: "Professional Webcam Configurator",
  title: "CamTuner — Professional Webcam Configurator",
  baseUrl: "https://camtuner.app",
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
    github: "https://github.com/camtuner",
    githubRepo: "https://github.com/camtuner/cam-tuner",
    twitter: "https://twitter.com/camtuner",
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
    { name: "Github", url: "https://github.com/camtuner/cam-tuner" },
    { name: "Twitter", url: "https://twitter.com/camtuner" },
  ],
  demo: {
    tabLabel: "CamTuner Demo",
    urlBarLabel: "camtuner.app/demo",
  },
} as const
