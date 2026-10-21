"use client"

import { cn } from "@workspace/ui/lib/utils"
import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useId, useState } from "react"

// The raw sensor image is 4:3. Every preset is a crop of it, centered on the
// subject (who sits left of center in the raw frame).
const W = 160
const H = 120

interface Preset {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
}

const PRESETS: Preset[] = [
  { id: "original", label: "Original", x: 0, y: 0, w: 160, h: 120 },
  { id: "16-9", label: "16:9", x: 0, y: 20, w: 120, h: 67.5 },
  { id: "4-3", label: "4:3", x: 8, y: 18, w: 100, h: 75 },
  { id: "1-1", label: "1:1", x: 23, y: 14, w: 70, h: 70 },
  { id: "9-16", label: "9:16", x: 35, y: 12, w: 46, h: 81.8 },
]

const CYCLE_MS = 2800

/** Corner marks that hug a crop, drawn as one path so they animate together. */
const corners = ({ x, y, w, h }: Preset, l = 6) =>
  `M${x} ${y + l}V${y}H${x + l}M${x + w - l} ${y}H${x + w}V${y + l}M${x + w} ${y + h - l}V${y + h}H${x + w - l}M${x + l} ${y + h}H${x}V${y + h - l}`

/** A cluttered corner of a room with someone sitting off to one side. */
const Scene = () => (
  <>
    <rect width={W} height={H} fill="#3a4842" />
    <rect y="102" width={W} height="18" fill="#26302c" />
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
    {/* the person */}
    <path d="M28 120C28 94 42 80 58 80S88 94 88 120Z" fill="#44556b" />
    <rect x="53" y="66" width="10" height="16" fill="#c9a687" />
    <circle cx="58" cy="52" r="13" fill="#d9b99b" />
    <path
      d="M45 52C44 38 52 34 58 34S72 38 71 52C68 45 63 43 58 43S48 45 45 52Z"
      fill="#2a2622"
    />
  </>
)

export const HeroStage = () => {
  const reduceMotion = useReducedMotion()
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto || reduceMotion) return
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % PRESETS.length),
      CYCLE_MS
    )
    return () => clearInterval(timer)
  }, [auto, reduceMotion])

  const p = PRESETS[index]!
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.7, ease: [0.65, 0, 0.35, 1] as const }

  const choose = (i: number) => {
    setAuto(false)
    setIndex(i)
  }

  return (
    <div>
      <div className="relative overflow-hidden rounded-[0.5rem] border border-border bg-black">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="A webcam view of a person sitting left of center in a cluttered room. A frame resizes around them to show different crops."
          className="block w-full"
        >
          <defs>
            <g id={`${uid}-scene`}>
              <Scene />
            </g>
            <mask id={`${uid}-mask`}>
              <rect width={W} height={H} fill="white" />
              <motion.rect
                initial={false}
                animate={{ x: p.x, y: p.y, width: p.w, height: p.h }}
                transition={transition}
                fill="black"
              />
            </mask>
          </defs>

          <use href={`#${uid}-scene`} />
          <rect
            width={W}
            height={H}
            fill="black"
            opacity="0.6"
            mask={`url(#${uid}-mask)`}
          />

          {[1, 2].map((n) => (
            <g key={n} className="stroke-white/35" strokeWidth="1">
              <motion.line
                initial={false}
                animate={{
                  x1: p.x + (p.w * n) / 3,
                  x2: p.x + (p.w * n) / 3,
                  y1: p.y,
                  y2: p.y + p.h,
                }}
                transition={transition}
                vectorEffect="non-scaling-stroke"
              />
              <motion.line
                initial={false}
                animate={{
                  x1: p.x,
                  x2: p.x + p.w,
                  y1: p.y + (p.h * n) / 3,
                  y2: p.y + (p.h * n) / 3,
                }}
                transition={transition}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          ))}
          <motion.path
            initial={false}
            animate={{ d: corners(p) }}
            transition={transition}
            className="fill-none stroke-primary"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <p className="absolute top-3 left-3 rounded-sm bg-black/60 px-2 py-1 text-xs text-white/80">
          What your camera sees
        </p>

        <div className="absolute right-3 bottom-3 flex flex-col items-end gap-1.5">
          <p className="rounded-sm bg-black/60 px-2 py-1 text-xs text-white/80">
            What the call sees
          </p>
          <motion.div
            initial={false}
            animate={{ width: `${(7 * p.w) / p.h}rem` }}
            transition={transition}
            className="h-28 overflow-hidden rounded-sm border-2 border-primary bg-black"
          >
            <motion.svg
              aria-hidden="true"
              initial={false}
              animate={{ viewBox: `${p.x} ${p.y} ${p.w} ${p.h}` }}
              transition={transition}
              className="block h-full w-full"
            >
              <use href={`#${uid}-scene`} />
            </motion.svg>
          </motion.div>
        </div>
      </div>

      <div
        role="group"
        aria-label="Crop shape"
        className="mt-4 flex flex-wrap items-center gap-2"
      >
        <span className="mr-1 text-sm text-muted-foreground">Crop to</span>
        {PRESETS.map((preset, i) => (
          <button
            key={preset.id}
            type="button"
            aria-pressed={i === index}
            onClick={() => choose(i)}
            className={cn(
              "h-9 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              i === index
                ? "border-foreground bg-foreground text-background"
                : "border-border text-foreground hover:border-foreground/50"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
