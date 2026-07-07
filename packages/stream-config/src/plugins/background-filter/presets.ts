export type BackgroundPreset = {
  id: string
  label: string
  thumb: string
  full: string
}

function gradient(
  id: string,
  label: string,
  colors: string[],
  angle: number = 135
): BackgroundPreset {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><defs><linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)"><stop offset="0" stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[1]}"/></linearGradient></defs><rect width="160" height="90" fill="url(#g)"/></svg>`
  const encoded = encodeURIComponent(svg)
  const dataUrl = `data:image/svg+xml,${encoded}`
  return { id: `preset:${id}`, label, thumb: dataUrl, full: dataUrl }
}

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  gradient("sunset", "Sunset", ["#ff6b6b", "#ffd93d"]),
  gradient("ocean", "Ocean", ["#0ea5e9", "#6366f1"]),
  gradient("forest", "Forest", ["#059669", "#064e3b"]),
  gradient("aurora", "Aurora", ["#7c3aed", "#2563eb"]),
  gradient("warm", "Warm", ["#f97316", "#dc2626"]),
]
