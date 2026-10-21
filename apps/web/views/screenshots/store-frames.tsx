import { fontSans } from "./fonts"
import { Bullets, Frame, Glow, Headline, Lede } from "./kit"
import { BrandLockup } from "./logo"
import { palette } from "./palette"
import { CropOverlay, SceneChip, Stage, type Rect } from "./scene"

const CROP_16_9: Rect = { x: 4, y: 27, w: 152, h: 85.5 }
/** Full-height 9:16 window centered on the subject. */
const CROP_9_16: Rect = { x: 24, y: 0, w: 67.5, h: 120 }

/** Primary store screenshot — 1280x800 (16:10). */
export const HeroFrame = () => (
  <Frame width={1280} height={800}>
    <Glow style={{ top: -420, left: -320 }} />
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 56,
        padding: "72px 84px",
        position: "relative",
        flex: 1,
      }}
    >
      <div
        style={{
          width: 500,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BrandLockup markSize={44} fontSize={30} tag="v3" />
        <Headline size={58} style={{ marginTop: 32 }}>
          Frame yourself properly on every call.
        </Headline>
        <Lede size={20} style={{ marginTop: 18, maxWidth: 450 }}>
          Crop, zoom and align your webcam right in the browser — before Meet,
          Zoom or any other site sees a single frame.
        </Lede>
        <div style={{ marginTop: 32 }}>
          <Bullets
            size={19}
            gap={14}
            items={[
              "16:9, 4:3, 1:1 and 9:16 framing",
              "Center Stage — auto face tracking",
              "Background blur and replace",
              "100% on-device, zero added lag",
            ]}
          />
        </div>
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontFamily: fontSans,
            fontSize: 17,
            fontWeight: 600,
            color: palette.muted,
          }}
        >
          <span
            style={{
              background: palette.lime,
              color: palette.ink,
              borderRadius: 999,
              padding: "7px 16px",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            Free
          </span>
          No account · Nothing leaves your machine
        </div>
      </div>

      <div style={{ position: "relative", flex: 1, alignSelf: "center" }}>
        <Stage
          width={540}
          height={405}
          label="What your camera sees"
          overlay={<CropOverlay rect={CROP_16_9} thirds />}
        />
        <div
          style={{
            position: "absolute",
            right: -26,
            bottom: -34,
            filter: "drop-shadow(0 18px 32px rgba(0,0,0,0.35))",
          }}
        >
          <Stage
            width={228}
            height={128}
            viewBox={CROP_16_9}
            label="What the call sees"
            labelTone="lime"
            style={{
              borderWidth: 3,
              borderColor: palette.lime,
              borderRadius: 14,
            }}
          />
        </div>
      </div>
    </div>
  </Frame>
)

/** Small promo tile — 440x280, used in store lists and search. */
export const SmallTileFrame = () => (
  <Frame width={440} height={280} style={{ flexDirection: "column" }}>
    <Glow style={{ top: -260, right: -220, width: 620, height: 620 }} />
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "36px 40px 32px",
      }}
    >
      <BrandLockup markSize={36} fontSize={24} />
      <Headline size={35} style={{ marginTop: 26, maxWidth: 360 }}>
        Frame yourself properly on every call.
      </Headline>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontFamily: fontSans,
          fontSize: 14.5,
          fontWeight: 600,
          color: palette.muted,
        }}
      >
        <span
          style={{
            background: palette.lime,
            color: palette.ink,
            borderRadius: 999,
            padding: "5px 12px",
            fontWeight: 700,
          }}
        >
          Free
        </span>
        Chrome · Firefox · No account
      </div>
    </div>
    {/* crop-corner motif hugging the tile's own edges */}
    <svg
      width="440"
      height="280"
      viewBox="0 0 440 280"
      style={{ position: "absolute", inset: 0 }}
      aria-hidden="true"
    >
      <path
        d="M16 44V30Q16 16 30 16H44M396 16H410Q424 16 424 30V44M424 236V250Q424 264 410 264H396M44 264H30Q16 264 16 250V236"
        fill="none"
        stroke={palette.lime}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  </Frame>
)

/** Marquee promo tile — 1400x560, featured-banner surface. */
export const MarqueeTileFrame = () => (
  <Frame width={1400} height={560} background={palette.deep}>
    <Glow style={{ top: -300, right: 260, width: 800, height: 800 }} />
    <div
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: 72,
        padding: "0 96px",
      }}
    >
      <div style={{ width: 640, display: "flex", flexDirection: "column" }}>
        <BrandLockup
          markSize={42}
          fontSize={28}
          color={palette.paper}
          tag="Free"
        />
        <Headline size={60} color={palette.paper} style={{ marginTop: 34 }}>
          Your camera, tuned for every call.
        </Headline>
        <Lede
          size={21}
          color="rgba(255,255,255,0.66)"
          style={{ marginTop: 20, maxWidth: 560 }}
        >
          Crop, zoom, align, track and blur — right in the browser, before the
          call app sees a frame.
        </Lede>
        <div
          style={{
            marginTop: 36,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {[
            "16:9 → 9:16",
            "Center Stage",
            "Background effects",
            "100% on-device",
          ].map((chip) => (
            <span
              key={chip}
              style={{
                fontFamily: fontSans,
                fontSize: 17,
                fontWeight: 600,
                lineHeight: 1,
                padding: "11px 18px",
                borderRadius: 999,
                border: "1.5px solid rgba(255,255,255,0.22)",
                color: "rgba(255,255,255,0.85)",
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

      <div style={{ position: "relative", alignSelf: "center" }}>
        <Stage
          width={490}
          height={368}
          label="What your camera sees"
          overlay={
            <>
              <CropOverlay rect={CROP_9_16} thirds />
              <SceneChip x={88} y={3} text="9:16" align="end" />
            </>
          }
          style={{ borderColor: "rgba(255,255,255,0.16)", borderWidth: 0 }}
        />
        {/* The 9:16 window from the feed, as an overlay */}
        <div
          style={{
            position: "absolute",
            right: -26,
            bottom: -34,
            filter: "drop-shadow(0 18px 32px rgba(0,0,0,0.45))",
          }}
        >
          <Stage
            width={118}
            height={210}
            viewBox={CROP_9_16}
            label="9:16"
            labelTone="lime"
            style={{
              borderWidth: 3,
              borderColor: palette.lime,
              borderRadius: 14,
            }}
          />
        </div>
      </div>
    </div>
  </Frame>
)
