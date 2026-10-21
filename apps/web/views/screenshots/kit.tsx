import type { CSSProperties, ReactNode } from "react"
import { fontDisplay, fontSans } from "./fonts"
import { palette } from "./palette"

/** Uppercase feature kicker above headlines. */
export const Kicker = ({
  children,
  tone = "lime",
}: {
  children: ReactNode
  tone?: "lime" | "outline"
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: fontSans,
      fontSize: 15,
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      lineHeight: 1,
      padding: "8px 14px",
      borderRadius: 999,
      ...(tone === "lime"
        ? { background: palette.lime, color: palette.ink }
        : { border: `1.5px solid ${palette.line}`, color: palette.muted }),
    }}
  >
    <span
      style={{
        width: 8,
        height: 8,
        borderRadius: 999,
        background: tone === "lime" ? palette.ink : palette.lime,
      }}
    />
    {children}
  </span>
)

export const Headline = ({
  children,
  size = 54,
  color = palette.ink,
  style,
}: {
  children: ReactNode
  size?: number
  color?: string
  style?: CSSProperties
}) => (
  <h2
    style={{
      fontFamily: fontDisplay,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "-0.03em",
      lineHeight: 1.02,
      color,
      margin: 0,
      textWrap: "balance",
      ...style,
    }}
  >
    {children}
  </h2>
)

export const Lede = ({
  children,
  size = 20,
  color = palette.muted,
  style,
}: {
  children: ReactNode
  size?: number
  color?: string
  style?: CSSProperties
}) => (
  <p
    style={{
      fontFamily: fontSans,
      fontSize: size,
      lineHeight: 1.5,
      color,
      margin: 0,
      ...style,
    }}
  >
    {children}
  </p>
)

export const Bullets = ({
  items,
  gap = 14,
  size = 19,
  color = palette.ink,
}: {
  items: string[]
  gap?: number
  size?: number
  color?: string
}) => (
  <ul
    style={{ display: "grid", gap, margin: 0, padding: 0, listStyle: "none" }}
  >
    {items.map((item) => (
      <li
        key={item}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: fontSans,
          fontSize: size,
          fontWeight: 500,
          color,
          lineHeight: 1.2,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            background: palette.lime,
            flexShrink: 0,
            outline: `3px solid ${palette.lime}33`,
          }}
        />
        {item}
      </li>
    ))}
  </ul>
)

/** Row of small pills, e.g. aspect-ratio presets with one active. */
export const PillRow = ({
  items,
  activeIndex = 0,
  size = 16,
}: {
  items: string[]
  activeIndex?: number
  size?: number
}) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
    {items.map((item, i) => (
      <span
        key={item}
        style={{
          fontFamily: fontSans,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1,
          padding: `${size * 0.55}px ${size * 1.1}px`,
          borderRadius: 999,
          ...(i === activeIndex
            ? {
                background: palette.ink,
                color: palette.paper,
                boxShadow: `0 0 0 3px ${palette.lime}`,
              }
            : {
                border: `1.5px solid ${palette.line}`,
                color: palette.muted,
                background: palette.card,
              }),
        }}
      >
        {item}
      </span>
    ))}
  </div>
)

/** Standard frame root — opaque, exact px, always light. */
export const Frame = ({
  width,
  height,
  children,
  background = palette.paper,
  style,
}: {
  width: number
  height: number
  children: ReactNode
  background?: string
  style?: CSSProperties
}) => (
  <div
    style={{
      width,
      height,
      background,
      color: palette.ink,
      fontFamily: fontSans,
      position: "relative",
      overflow: "hidden",
      display: "flex",
      ...style,
    }}
  >
    {children}
  </div>
)

/** Subtle radial wash for large empty areas. */
export const Glow = ({ style }: { style?: CSSProperties }) => (
  <span
    aria-hidden="true"
    style={{
      position: "absolute",
      width: 900,
      height: 900,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${palette.lime}26 0%, transparent 62%)`,
      pointerEvents: "none",
      ...style,
    }}
  />
)

/** Shared left-copy / right-visual layout for the 1280x800 feature frames. */
export const FeatureLayout = ({
  kicker,
  headline,
  lede,
  bullets,
  pills,
  children,
}: {
  kicker: string
  headline: string
  lede: string
  bullets: string[]
  pills?: { items: string[]; activeIndex?: number }
  children: ReactNode
}) => (
  <Frame width={1280} height={800}>
    <Glow style={{ bottom: -460, left: -360 }} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 72,
        padding: "0 84px",
        position: "relative",
        flex: 1,
      }}
    >
      <div style={{ width: 500, flexShrink: 0 }}>
        <Kicker>{kicker}</Kicker>
        <Headline size={56} style={{ marginTop: 28 }}>
          {headline}
        </Headline>
        <Lede size={20} style={{ marginTop: 20, maxWidth: 440 }}>
          {lede}
        </Lede>
        {pills ? (
          <div style={{ marginTop: 32 }}>
            <PillRow items={pills.items} activeIndex={pills.activeIndex} />
          </div>
        ) : null}
        <div style={{ marginTop: 36 }}>
          <Bullets items={bullets} size={19} gap={15} />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  </Frame>
)
