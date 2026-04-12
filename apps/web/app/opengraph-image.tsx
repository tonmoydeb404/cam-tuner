import { brand } from "@/data/brand"
import { ImageResponse } from "next/og"

export const alt = brand.ogImage.alt
export const size = { width: brand.ogImage.width, height: brand.ogImage.height }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0a0a0a",
        padding: "60px",
      }}
    >
      {/* Main headline */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: "72px",
          fontWeight: 900,
          color: "white",
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: "24px",
        }}
      >
        <span>PRO CAMERA</span>
        <span style={{ color: "#666" }}>IN YOUR BROWSER.</span>
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: "24px",
          color: "#888",
          textAlign: "center",
          maxWidth: "600px",
        }}
      >
        Crop, zoom, and align your live camera feed. Free Chrome extension for
        professional webcam framing.
      </div>

      {/* Bottom bar */}
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
    { ...size }
  )
}
