import { useId, type CSSProperties, type ReactNode } from "react"
import { palette } from "./palette"

/**
 * The vector "webcam feed" used across promo frames. Same 4:3 raw sensor
 * geometry as the home hero stage: 160x120 units, subject left of center.
 */
export type SceneVariant = "cluttered" | "blur" | "replace"

const Person = () => (
  <g>
    <path d="M28 120C28 94 42 80 58 80S88 94 88 120Z" fill="#44556b" />
    <rect x="53" y="66" width="10" height="16" fill="#c9a687" />
    <circle cx="58" cy="52" r="13" fill="#d9b99b" />
    <path
      d="M45 52C44 38 52 34 58 34S72 38 71 52C68 45 63 43 58 43S48 45 45 52Z"
      fill="#2a2622"
    />
  </g>
)

const Clutter = () => (
  <g>
    <rect width="160" height="120" fill="#3a4842" />
    <rect y="102" width="160" height="18" fill="#26302c" />
    {/* window */}
    <rect x="106" y="12" width="44" height="60" fill="#d8e6c4" />
    <path d="M128 12V72M106 42H150" stroke="#3a4842" strokeWidth="2" />
    <path
      d="M106 12H150V72H106Z"
      fill="none"
      stroke="#55645d"
      strokeWidth="3"
    />
    {/* shelf with stuff on it */}
    <rect x="4" y="34" width="40" height="3" fill="#55645d" />
    <rect x="8" y="22" width="9" height="12" fill="#a9a58f" />
    <rect x="19" y="26" width="7" height="8" fill="#7b8a6f" />
    <rect x="29" y="20" width="11" height="14" fill="#8c6f6f" />
    {/* cable and laundry */}
    <path
      d="M96 0C94 24 102 40 98 64S92 96 96 110"
      fill="none"
      stroke="#1c2421"
      strokeWidth="1.2"
    />
    <path d="M2 120C2 100 14 94 24 96S38 106 36 120Z" fill="#8c6f6f" />
    <path d="M10 120C12 106 20 102 28 106" fill="none" stroke="#a98a8a" />
  </g>
)

const Replaced = () => (
  <g>
    <rect width="160" height="120" fill="url(#ct-replace-grad)" />
    <circle cx="24" cy="26" r="18" fill={palette.lime} opacity="0.16" />
    <circle cx="132" cy="88" r="30" fill={palette.lime} opacity="0.12" />
    <circle cx="118" cy="20" r="9" fill="#ffffff" opacity="0.14" />
  </g>
)

/**
 * A framed video stage: dark bezel, scene filling via slice, optional SVG
 * overlay drawn in the same 160x120 coordinate space. `viewBox` (scene
 * coords) re-frames what the stage shows — used for "what the call sees"
 * insets that render a crop of the same scene.
 */
export const Stage = ({
  width,
  height,
  variant = "cluttered",
  overlay,
  label,
  labelTone = "dark",
  style,
  className,
  viewBox = { x: 0, y: 0, w: 160, h: 120 },
}: {
  width: number
  height: number
  variant?: SceneVariant
  overlay?: ReactNode
  label?: string
  labelTone?: "dark" | "lime"
  style?: CSSProperties
  className?: string
  viewBox?: Rect
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        borderRadius: Math.min(24, width * 0.05),
        overflow: "hidden",
        background: palette.deep,
        border: `1px solid ${palette.line}`,
        boxShadow: "0 24px 60px -32px oklch(0.2715 0.0273 159.2673 / 0.45)",
        flexShrink: 0,
        ...style,
      }}
    >
      <svg
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block", width: "100%", height: "100%" }}
        role="img"
        aria-label="A stylized webcam feed of a person in a room"
      >
        <defs>
          {variant === "replace" ? (
            <linearGradient id="ct-replace-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1f3a2e" />
              <stop offset="1" stopColor="#3f5d3a" />
            </linearGradient>
          ) : null}
          {variant === "blur" ? (
            <filter
              id={`ct-blur-${uid}`}
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="2.6" />
            </filter>
          ) : null}
        </defs>

        {variant === "replace" ? <Replaced /> : null}
        {variant === "blur" ? (
          <g filter={`url(#ct-blur-${uid})`}>
            <Clutter />
          </g>
        ) : null}
        {variant === "cluttered" ? <Clutter /> : null}
        <Person />
        {overlay}
      </svg>

      {label ? (
        <span
          style={{
            position: "absolute",
            top: width * 0.028,
            left: width * 0.028,
            fontFamily: fontStack(),
            fontSize: Math.max(10, width * 0.026),
            fontWeight: 600,
            lineHeight: 1,
            padding: `${width * 0.018}px ${width * 0.024}px`,
            borderRadius: 6,
            ...(labelTone === "lime"
              ? { background: palette.lime, color: palette.ink }
              : {
                  background: "rgba(0,0,0,0.55)",
                  color: "rgba(255,255,255,0.85)",
                }),
          }}
        >
          {label}
        </span>
      ) : null}
    </div>
  )
}

const fontStack = () => "var(--font-sans, sans-serif)"

export type Rect = { x: number; y: number; w: number; h: number }

/** Corner marks hugging a crop rect, as one SVG path. */
export const cornersPath = ({ x, y, w, h }: Rect, l = 7) =>
  `M${x} ${y + l}V${y}H${x + l}M${x + w - l} ${y}H${x + w}V${y + l}M${x + w} ${y + h - l}V${y + h}H${x + w - l}M${x + l} ${y + h}H${x}V${y + h - l}`

/** Dimmed everything outside `keep`, plus lime corner marks and optional thirds. */
export const CropOverlay = ({
  rect,
  thirds = false,
  dimOpacity = 0.62,
}: {
  rect: Rect
  thirds?: boolean
  dimOpacity?: number
}) => {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  return (
    <g>
      <defs>
        <mask id={`ct-dim-${uid}`}>
          <rect width="160" height="120" fill="white" />
          <rect
            x={rect.x}
            y={rect.y}
            width={rect.w}
            height={rect.h}
            fill="black"
          />
        </mask>
      </defs>
      <rect
        width="160"
        height="120"
        fill="black"
        opacity={dimOpacity}
        mask={`url(#ct-dim-${uid})`}
      />
      {thirds
        ? [1, 2].map((n) => (
            <g key={n} stroke="rgba(255,255,255,0.35)" strokeWidth="0.5">
              <line
                x1={rect.x + (rect.w * n) / 3}
                x2={rect.x + (rect.w * n) / 3}
                y1={rect.y}
                y2={rect.y + rect.h}
              />
              <line
                x1={rect.x}
                x2={rect.x + rect.w}
                y1={rect.y + (rect.h * n) / 3}
                y2={rect.y + (rect.h * n) / 3}
              />
            </g>
          ))
        : null}
      <path
        d={cornersPath(rect)}
        fill="none"
        stroke={palette.lime}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </g>
  )
}

/** A small chip pinned to the scene, drawn fully in SVG. */
export const SceneChip = ({
  x,
  y,
  text,
  tone = "lime",
  align = "start",
}: {
  x: number
  y: number
  text: string
  tone?: "lime" | "dark"
  align?: "start" | "end"
}) => {
  const w = text.length * 2.1 + 4
  const chipX = align === "end" ? x - w : x
  return (
    <g>
      <rect
        x={chipX}
        y={y}
        width={w}
        height={6.4}
        rx={2}
        fill={tone === "lime" ? palette.lime : "rgba(0,0,0,0.62)"}
      />
      <text
        x={chipX + w / 2}
        y={y + 4.4}
        textAnchor="middle"
        fontFamily={fontStack()}
        fontSize="3.4"
        fontWeight="600"
        fill={tone === "lime" ? palette.ink : "rgba(255,255,255,0.9)"}
      >
        {text}
      </text>
    </g>
  )
}

/** Face-tracking box used by the Center Stage frame. */
export const TrackingBox = ({
  face = { x: 45, y: 38, w: 26, h: 27 },
}: {
  face?: Rect
}) => (
  <g>
    <rect
      x={face.x}
      y={face.y}
      width={face.w}
      height={face.h}
      fill="none"
      stroke={palette.lime}
      strokeWidth="1.4"
      strokeDasharray="4 2.4"
      rx="2"
    />
    {[
      `${face.x},${face.y}`,
      `${face.x + face.w},${face.y}`,
      `${face.x},${face.y + face.h}`,
      `${face.x + face.w},${face.y + face.h}`,
    ].map((pt, i) => {
      const [cx, cy] = pt.split(",").map(Number)
      return <circle key={i} cx={cx} cy={cy} r="1.6" fill={palette.lime} />
    })}
    <SceneChip x={face.x} y={face.y - 9} text="FACE LOCKED" tone="lime" />
  </g>
)
