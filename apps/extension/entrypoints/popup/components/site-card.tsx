import { IconRefresh } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import type { SiteSetting } from "../../../lib/storage"
import { hostnameOf, type Scope } from "../utils"

type SiteCardProps = {
  siteOrigin: string
  site: SiteSetting | null
  scope: Scope
  onScopeChange: (scope: Scope) => void
  onResetSite: () => void
}

function Tab({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean
  onClick: () => void
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      title={title}
      className={cn(
        "-mb-px flex min-w-0 items-center justify-center gap-1.5 border-b-2 px-1 pt-2 pb-1.5 text-xs font-medium transition-colors outline-none focus-visible:text-foreground",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

/** Tabs that sit on the header's bottom border; must be its last child. */
export function SiteCard({
  siteOrigin,
  site,
  scope,
  onScopeChange,
  onResetSite,
}: SiteCardProps) {
  return (
    <div className="-mx-3 -mb-2.5 flex items-start gap-4 px-3">
      <div role="tablist" className="flex flex-1 items-start gap-4">
        <Tab
          active={scope === "global"}
          onClick={() => onScopeChange("global")}
        >
          All sites
        </Tab>
        <Tab
          active={scope === "site"}
          onClick={() => onScopeChange("site")}
          title={hostnameOf(siteOrigin)}
        >
          This site
        </Tab>
      </div>
      <Button
        variant="ghost"
        size="icon-xs"
        className="mt-1.5"
        disabled={!site}
        title="Reset this site to your settings for all sites"
        aria-label="Reset this site to your settings for all sites"
        onClick={onResetSite}
      >
        <IconRefresh size={12} />
      </Button>
    </div>
  )
}
