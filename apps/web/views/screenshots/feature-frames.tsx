import { fontSans } from "./fonts"
import { palette } from "./palette"
import { Stage, CropOverlay, SceneChip, TrackingBox, type Rect } from "./scene"
import { FeatureLayout } from "./kit"

const RAW_16_9: Rect = { x: 4, y: 27, w: 152, h: 85.5 }
/** Full-height 9:16 window centered on the subject. */
const RAW_9_16: Rect = { x: 24, y: 0, w: 67.5, h: 120 }
const ZOOM_RECT: Rect = { x: 14, y: 16, w: 92, h: 69 }

const AlignGridOverlay = ({ rect }: { rect: Rect }) => (
  <g>
    {[1, 2].map((n) => (
      <g key={n} stroke="rgba(255,255,255,0.28)" strokeWidth="0.5">
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
    ))}
    {[0, 1, 2].flatMap((cx) =>
      [0, 1, 2].map((cy) => {
        const px = rect.x + (rect.w * cx) / 2
        const py = rect.y + (rect.h * cy) / 2
        const isCenter = cx === 1 && cy === 1
        return isCenter ? (
          <g key={`${cx}-${cy}`}>
            <circle
              cx={px}
              cy={py}
              r="3.4"
              fill="none"
              stroke={palette.lime}
              strokeWidth="1"
            />
            <circle cx={px} cy={py} r="1.7" fill={palette.lime} />
          </g>
        ) : (
          <circle
            key={`${cx}-${cy}`}
            cx={px}
            cy={py}
            r="1.3"
            fill="rgba(255,255,255,0.65)"
          />
        )
      })
    )}
  </g>
)

/** Feature 1 — aspect ratio & letterbox. */
export const FramingFrame = () => (
  <FeatureLayout
    kicker="Frame"
    headline="Pick the shape of your shot"
    lede="Choose an aspect ratio, then decide whether the leftover space is padded with bars in any color or cropped away entirely."
    pills={{ items: ["16:9", "4:3", "1:1", "9:16"], activeIndex: 3 }}
    bullets={[
      "Clean crop or letterbox padding",
      "Any bar color, including green screen",
      "Different shape per site",
      "Applied before the call app sees it",
    ]}
  >
    <div style={{ position: "relative" }}>
      <Stage
        width={540}
        height={405}
        label="What your camera sees"
        overlay={
          <>
            <CropOverlay rect={RAW_9_16} thirds />
            <SceneChip x={88} y={3} text="9:16" align="end" />
          </>
        }
      />
      <div
        style={{
          position: "absolute",
          right: -22,
          bottom: -30,
          filter: "drop-shadow(0 18px 32px rgba(0,0,0,0.35))",
        }}
      >
        <Stage
          width={122}
          height={217}
          viewBox={RAW_9_16}
          label="9:16 ready"
          labelTone="lime"
          style={{
            borderWidth: 3,
            borderColor: palette.lime,
            borderRadius: 14,
          }}
        />
      </div>
    </div>
  </FeatureLayout>
)

/** Feature 2 — zoom & alignment. */
export const ZoomAlignFrame = () => (
  <FeatureLayout
    kicker="Zoom & align"
    headline="Move in without moving the camera"
    lede="Dial in a fixed zoom, or switch to auto and let CamTuner keep you at the right size as you lean in and out."
    bullets={[
      "Smooth 1–4× zoom",
      "Nine-point alignment",
      "Fixed or auto mode",
      "Zero added latency",
    ]}
  >
    <div style={{ position: "relative" }}>
      <Stage
        width={540}
        height={405}
        viewBox={ZOOM_RECT}
        label="1.8× zoom"
        overlay={<AlignGridOverlay rect={ZOOM_RECT} />}
      />
      <div
        style={{
          position: "absolute",
          right: -20,
          bottom: -30,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: palette.card,
          border: `1px solid ${palette.line}`,
          borderRadius: 999,
          padding: "10px 18px",
          boxShadow: "0 14px 30px -18px rgba(0,0,0,0.4)",
        }}
      >
        <span
          style={{
            fontFamily: fontSans,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: palette.muted,
          }}
        >
          ZOOM
        </span>
        <div
          style={{
            width: 120,
            height: 6,
            borderRadius: 999,
            background: palette.paper,
            border: `1px solid ${palette.line}`,
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              width: "58%",
              borderRadius: 999,
              background: palette.lime,
            }}
          />
          <span
            style={{
              position: "absolute",
              left: "58%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              borderRadius: 999,
              background: palette.ink,
              border: `3px solid ${palette.lime}`,
            }}
          />
        </div>
        <span
          style={{
            fontFamily: fontSans,
            fontSize: 14,
            fontWeight: 700,
            color: palette.ink,
          }}
        >
          1.8×
        </span>
      </div>
    </div>
  </FeatureLayout>
)

/** Feature 3 — Center Stage face tracking. */
export const CenterStageFrame = () => {
  // A 16:9 crop centered on the subject — what the call sees with Auto on.
  const follow: Rect = { x: 0, y: 19.4, w: 116, h: 65.25 }
  return (
    <FeatureLayout
      kicker="Center Stage"
      headline="Stay framed as you move"
      lede="Switch to Auto and Center Stage tracks your face to keep you framed while you pace, lean or slide your chair."
      bullets={[
        "Face tracking, fully on-device",
        "Auto zoom keeps your size steady",
        "Under 2ms added latency",
        "No video ever uploaded",
      ]}
    >
      <div style={{ position: "relative" }}>
        <Stage
          width={540}
          height={304}
          viewBox={follow}
          label="Center Stage · on"
          labelTone="lime"
          overlay={<TrackingBox />}
        />
        <div
          style={{
            position: "absolute",
            left: 28,
            bottom: -30,
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: palette.card,
            border: `1px solid ${palette.line}`,
            borderRadius: 999,
            padding: "9px 16px",
            boxShadow: "0 14px 30px -18px rgba(0,0,0,0.4)",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: palette.lime,
              boxShadow: `0 0 0 4px ${palette.lime}33`,
            }}
          />
          <span
            style={{
              fontFamily: fontSans,
              fontSize: 14,
              fontWeight: 700,
              color: palette.ink,
            }}
          >
            Tracking — locked at 1.6×
          </span>
        </div>
      </div>
    </FeatureLayout>
  )
}

/** Feature 4 — background blur & replace. */
export const BackgroundFrame = () => (
  <FeatureLayout
    kicker="Background"
    headline="Tidy up what's behind you"
    lede="Blur a messy room or swap it for an image. Person segmentation happens on your device, frame by frame."
    bullets={[
      "Adjustable blur strength",
      "Custom or built-in images",
      "On-device segmentation",
      "Turn off anytime — no reload",
    ]}
  >
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
        gap: "32px 30px",
        alignItems: "center",
      }}
    >
      <Stage
        width={252}
        height={189}
        label="Blur · 14"
        overlay={<SceneChip x={96} y={102} text="MESSY ROOM" tone="dark" />}
      />
      <Stage
        width={252}
        height={189}
        variant="blur"
        label="Blur · 14"
        labelTone="lime"
        overlay={<SceneChip x={96} y={102} text="AFTER" />}
      />
      <Stage
        width={252}
        height={189}
        label="Image · custom"
        overlay={<SceneChip x={96} y={102} text="SAME ROOM" tone="dark" />}
      />
      <Stage
        width={252}
        height={189}
        variant="replace"
        label="Image · custom"
        labelTone="lime"
        overlay={<SceneChip x={96} y={102} text="AFTER" />}
      />
    </div>
  </FeatureLayout>
)
