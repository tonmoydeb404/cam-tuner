import { display } from "@/views/home/fonts"

// The display font instance lives with the home view; importing it here
// registers the same self-hosted face for this route. The `.variable` class
// must be applied to a wrapper (see index.tsx) for `--font-display` to resolve.
export { display }

export const fontDisplay = "var(--font-display, sans-serif)"
export const fontSans = "var(--font-sans, sans-serif)"
