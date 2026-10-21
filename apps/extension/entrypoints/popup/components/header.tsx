import { Switch } from "@workspace/ui/components/switch"
import { cn } from "@workspace/ui/lib/utils"
import logo from "../../../assets/icon.svg"
import type { SiteSetting } from "../../../lib/storage"
import type { Scope } from "../utils"
import { SiteCard } from "./site-card"
import { GuideBanners, type Guide } from "./help-guides"

type HeaderProps = {
  siteOrigin: string | null
  site: SiteSetting | null
  scope: Scope
  effectiveEnabled: boolean
  guides: Guide[]
  pinnedGuideId: string | null
  onDismissGuide: () => void
  onToggle: (value: boolean) => void
  onScopeChange: (scope: Scope) => void
  onResetSite: () => void
}

/** Floats above the scrolling popup body. */
export function Header({
  siteOrigin,
  site,
  scope,
  effectiveEnabled,
  guides,
  pinnedGuideId,
  onDismissGuide,
  onToggle,
  onScopeChange,
  onResetSite,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 shrink-0 space-y-2.5 border-b bg-background/95 px-3 py-2.5 backdrop-blur">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="CamTuner Logo"
            width={25}
            height={25}
            className={cn(effectiveEnabled ? "" : "grayscale")}
          />
          <h1 className="text-sm font-semibold">CamTuner</h1>
        </div>
        <label className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {scope === "site" ? "This site" : "All sites"}
          </span>
          <Switch
            checked={effectiveEnabled}
            onCheckedChange={onToggle}
            aria-label={
              scope === "site"
                ? "Enable CamTuner on this site"
                : "Enable CamTuner on all sites"
            }
          />
        </label>
      </div>

      <GuideBanners
        guides={guides}
        pinnedId={pinnedGuideId}
        onDismissPinned={onDismissGuide}
      />

      {siteOrigin ? (
        <SiteCard
          siteOrigin={siteOrigin}
          site={site}
          scope={scope}
          onScopeChange={onScopeChange}
          onResetSite={onResetSite}
        />
      ) : (
        <p className="text-xs text-muted-foreground">
          CamTuner can&rsquo;t tune this page. You&rsquo;re editing settings for
          all sites.
        </p>
      )}
    </header>
  )
}
