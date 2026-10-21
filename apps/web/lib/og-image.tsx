import { ImageResponse } from "next/og"

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = "image/png"

/**
 * Shared OG image template for programmatic pages — same look as the
 * site-wide app/opengraph-image.tsx but with per-page copy. Returns the
 * ImageResponse directly (it is a Response, not a JSX component).
 */
export function OgImage({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0a0a0a",
        padding: "72px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: "28px",
          fontWeight: 700,
          color: "#5EBC4B",
          letterSpacing: "0.08em",
        }}
      >
        CAMTUNER
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: "64px",
            fontWeight: 900,
            color: "white",
            lineHeight: 1.1,
            maxWidth: "920px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "28px",
            color: "#888",
            maxWidth: "860px",
            lineHeight: 1.3,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "6px",
          backgroundColor: "#5EBC4B",
        }}
      />
    </div>,
    { ...OG_SIZE }
  )
}
