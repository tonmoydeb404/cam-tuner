"use client"

import { IconEye, IconHelpCircle, IconRefresh } from "@tabler/icons-react"
import {
  ALIGN_PLUGIN_ID,
  CROP_PLUGIN_ID,
  DEFAULT_TUNER_CONFIG,
  FLIP_VERTICAL_PLUGIN_ID,
  MIRROR_PLUGIN_ID,
  ZOOM_PLUGIN_ID,
  type TunerConfig,
} from "@workspace/stream-config"
import { Button } from "@workspace/ui/components/button"
import { Switch } from "@workspace/ui/components/switch"
import { PluginPanel } from "@workspace/ui/components/tuner/plugin-panel"
import { cn } from "@workspace/ui/lib/utils"
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react"
import { Bullets, Frame, Glow, Headline, Kicker, Lede } from "./kit"
import { BrandMark } from "./logo"

/**
 * Light-theme token values pinned onto the popup subtree — the real popup
 * components read theme custom properties, and exported PNGs must look
 * identical regardless of the site's light/dark mode.
 */
const LIGHT_TOKENS = {
  "--background": "oklch(0.9709 0.0114 128.5914)",
  "--foreground": "oklch(0.2715 0.0273 159.2673)",
  "--card": "oklch(1 0 0)",
  "--card-foreground": "oklch(0.2715 0.0273 159.2673)",
  "--popover": "oklch(1 0 0)",
  "--popover-foreground": "oklch(0.2715 0.0273 159.2673)",
  "--primary": "oklch(0.8523 0.1913 123.5789)",
  "--primary-foreground": "oklch(0.2715 0.0273 159.2673)",
  "--secondary": "oklch(0.9166 0.0115 128.6012)",
  "--secondary-foreground": "oklch(0.2715 0.0273 159.2673)",
  "--muted": "oklch(0.9166 0.0115 128.6012)",
  "--muted-foreground": "oklch(0.4866 0.016 145.3235)",
  "--accent": "oklch(0.9513 0.0434 121.3482)",
  "--accent-foreground": "oklch(0.2715 0.0273 159.2673)",
  "--border": "oklch(0.8421 0.0122 133.3919)",
  "--input": "oklch(0.8421 0.0122 133.3919)",
  "--ring": "oklch(0.8523 0.1913 123.5789)",
} as CSSProperties

/** Same tab markup as the popup's SiteCard (apps/extension popup). */
function Tab({
  active,
  title,
  children,
}: {
  active: boolean
  title?: string
  children: ReactNode
}) {
  return (
    <span
      role="tab"
      aria-selected={active}
      title={title}
      className={cn(
        "-mb-px flex min-w-0 items-center justify-center gap-1.5 border-b-2 px-1 pt-2 pb-1.5 text-xs font-medium",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground"
      )}
    >
      {children}
    </span>
  )
}

/**
 * One real popup card: the extension popup's PluginPanel with optional
 * header/footer (the two cards in the promo frame each show one end),
 * driven by a live local TunerConfig so the controls are the actual
 * components users get.
 */
const PopupCard = ({
  pluginIds,
  showHeader = true,
  showFooter = true,
}: {
  pluginIds: string[]
  showHeader?: boolean
  showFooter?: boolean
}) => {
  const [config, setConfig] = useState<TunerConfig>({
    ...DEFAULT_TUNER_CONFIG,
    zoom: 1.5,
  })

  const innerRef = useRef<HTMLDivElement>(null)
  const [natural, setNatural] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const update = () => setNatural({ w: el.offsetWidth, h: el.offsetHeight })
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Native size (Chrome caps real popups at 600px tall anyway); never upscale.
  const scale = Math.min(1, 560 / Math.max(natural.h, 1))

  return (
    <div style={{ width: natural.w * scale, height: natural.h * scale }}>
      <div
        ref={innerRef}
        className="flex w-[320px] flex-col overflow-hidden rounded-[10px] border bg-background text-foreground shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)]"
        style={{
          ...LIGHT_TOKENS,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          visibility: natural.w > 0 ? "visible" : "hidden",
        }}
      >
        {showHeader ? (
          /* Header — same markup as the extension popup header */
          <header className="shrink-0 space-y-2.5 border-b bg-card px-3 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrandMark size={25} />
                <h1 className="text-sm font-semibold">CamTuner</h1>
              </div>
              <label className="flex items-center gap-1.5">
                <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                  This site
                </span>
                <Switch
                  checked
                  onCheckedChange={() => {}}
                  aria-label="Enable CamTuner on this site"
                />
              </label>
            </div>

            {/* Site tabs — same markup as the popup's SiteCard */}
            <div className="-mx-3 -mb-2.5 flex items-start gap-4 px-3">
              <div role="tablist" className="flex flex-1 items-start gap-4">
                <Tab active={false}>All sites</Tab>
                <Tab active title="meet.google.com">
                  This site
                </Tab>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                className="mt-1.5"
                aria-label="Reset this site to your settings for all sites"
              >
                <IconRefresh size={12} />
              </Button>
            </div>
          </header>
        ) : null}

        {/* Body — same nesting as the extension popup body */}
        <div className="space-y-2.5 px-3 py-2.5">
          <div className="space-y-4">
            <PluginPanel
              config={config}
              onConfigChange={(update) =>
                setConfig((c) => ({ ...c, ...update }))
              }
              pluginIds={pluginIds}
            />
          </div>
        </div>

        {showFooter ? (
          /* Footer — same markup as the extension popup footer */
          <footer className="mt-auto shrink-0 border-t bg-card px-3 py-2.5">
            <div className="flex gap-2">
              <Button variant="default" size="lg" className="flex-1">
                <IconEye size={15} />
                Show Preview
              </Button>
              <Button
                variant="outline"
                size="icon-lg"
                aria-label="Help and troubleshooting"
              >
                <IconHelpCircle size={18} />
              </Button>
            </div>
          </footer>
        ) : null}
      </div>
    </div>
  )
}

/** Feature 5 — the popup, shown as two native-size cards. */
export const PopupFrame = () => (
  <Frame width={1280} height={800}>
    <Glow style={{ bottom: -460, left: -360 }} />
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 48,
        padding: "0 84px",
        position: "relative",
        flex: 1,
      }}
    >
      <div style={{ width: 380, flexShrink: 0 }}>
        <Kicker>One popup</Kicker>
        <Headline size={52} style={{ marginTop: 28 }}>
          Every control. One popup.
        </Headline>
        <Lede size={20} style={{ marginTop: 20, maxWidth: 360 }}>
          Set framing for all sites, or customize a single one. Changes apply to
          your live camera instantly.
        </Lede>
        <div style={{ marginTop: 36 }}>
          <Bullets
            items={[
              "Per-site settings that stick",
              "Changes apply instantly",
              "Preview without joining a call",
              "Free forever — no account",
            ]}
            size={19}
            gap={15}
          />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 32,
        }}
      >
        {/* Top half: header + framing controls */}
        <div style={{ marginTop: -20 }}>
          <PopupCard
            showFooter={false}
            pluginIds={[
              CROP_PLUGIN_ID,
              MIRROR_PLUGIN_ID,
              FLIP_VERTICAL_PLUGIN_ID,
            ]}
          />
        </div>
        {/* Bottom half: align & zoom + footer, staggered downward so the
            pair reads as one popup captured from top to bottom */}
        <div style={{ marginTop: 130 }}>
          <PopupCard
            showHeader={false}
            pluginIds={[ALIGN_PLUGIN_ID, ZOOM_PLUGIN_ID]}
          />
        </div>
      </div>
    </div>
  </Frame>
)
