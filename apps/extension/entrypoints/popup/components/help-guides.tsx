import { IconHelpCircle, IconX } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer"
import { hostnameOf, type StreamInfo } from "../utils"

export type Guide = {
  id: string
  title: string
  message: string
  /** True when this problem is happening on the current page right now. */
  active: boolean
}

export function getGuides({
  siteOrigin,
  streamInfo,
  cameraLabel,
  effectiveEnabled,
}: {
  siteOrigin: string | null
  streamInfo: StreamInfo | null
  cameraLabel: string | null
  effectiveEnabled: boolean
}): Guide[] {
  const live = effectiveEnabled ? streamInfo : null
  const page = siteOrigin ? hostnameOf(siteOrigin) : "the page"

  const guides: Guide[] = [
    {
      id: "reload",
      title: "Settings aren't applied",
      message: `CamTuner was off when ${page} started your camera. Reload the page or restart your camera to apply your settings.`,
      active: live?.tuned === false && live.reason !== "camera",
    },
    {
      id: "camera",
      title: "A different camera is in use",
      message: cameraLabel
        ? `CamTuner is only tuning “${cameraLabel}”, but this page is using a different camera. Switch to that camera, or change the tuned camera in the web preview.`
        : "This page is using a different camera than the one selected in the web preview. Switch cameras, or change the selected camera in the web preview.",
      active: live?.tuned === false && live.reason === "camera",
    },
    {
      id: "background",
      title: "Background effects not loading",
      message:
        "Background effects couldn't load on this page. Check your connection and reload the page.",
      active: live?.warning === "background",
    },
    {
      id: "tracking",
      title: "Center Stage not loading",
      message:
        "Center Stage couldn't load on this page. Check your connection and reload the page.",
      active: live?.warning === "tracking",
    },
    {
      id: "change-camera",
      title: "How to change camera",
      message: `Click “Show Preview” below to open the web preview, then pick your camera under “Camera Source”. CamTuner tunes the camera you pick there${
        cameraLabel ? ` — currently “${cameraLabel}”` : ""
      }.`,
      active: false,
    },
  ]

  // Problems happening on this page right now come first.
  return guides.sort((a, b) => Number(b.active) - Number(a.active))
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon-lg"
      aria-label="Help and troubleshooting"
      title="Help and troubleshooting"
      onClick={onClick}
    >
      <IconHelpCircle size={18} />
    </Button>
  )
}

/** Bottom drawer: picking a topic shows its message in the header. */
export function HelpDrawer({
  guides,
  open,
  onOpenChange,
  onSelect,
}: {
  guides: Guide[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (id: string) => void
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Troubleshooting</DrawerTitle>
          <DrawerDescription>
            Pick a topic to see what to do about it.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-0.5 p-4">
          {guides.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => {
                onSelect(g.id)
                onOpenChange(false)
              }}
              className="rounded px-2 py-2 text-left text-xs outline-none hover:bg-muted focus-visible:bg-muted"
            >
              {g.title}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/** Amber banners in the header: live problems plus any topic picked in the drawer. */
export function GuideBanners({
  guides,
  pinnedId,
  onDismissPinned,
}: {
  guides: Guide[]
  pinnedId: string | null
  onDismissPinned: () => void
}) {
  const shown = guides.filter((g) => g.active || g.id === pinnedId)

  return (
    <>
      {shown.map((g) => {
        const dismissable = g.id === pinnedId && !g.active
        return (
          <div
            key={g.id}
            className="flex items-start gap-1.5 rounded-[12px] border border-amber-500/40 bg-amber-500/10 px-2 py-1.5 text-[11px] leading-snug text-amber-700 dark:text-amber-400"
          >
            <p className="flex-1">{g.message}</p>
            {dismissable && (
              <button
                type="button"
                aria-label="Dismiss"
                onClick={onDismissPinned}
                className="shrink-0 rounded p-0.5 outline-none hover:bg-amber-500/20 focus-visible:bg-amber-500/20"
              >
                <IconX size={12} />
              </button>
            )}
          </div>
        )
      })}
    </>
  )
}
