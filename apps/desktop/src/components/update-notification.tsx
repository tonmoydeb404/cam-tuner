import { UpdateChangelogDialog } from "@/components/update-changelog-dialog";
import { useApp } from "@/context/app-context";
import { Button } from "@workspace/ui/components/button";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import { Download, Loader2, X } from "lucide-react";
import { useState } from "react";

export function UpdateNotification() {
  const { updateInfo, dismissUpdate, installUpdate, isInstallingUpdate } =
    useApp();
  const sidebar = useSidebar();
  const [changelogOpen, setChangelogOpen] = useState(false);

  if (updateInfo === null) return null;

  const collapsed = sidebar.state === "collapsed";

  if (collapsed) {
    return (
      <>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip={`v${updateInfo.version} ready to install`}
            onClick={() => installUpdate()}
            disabled={isInstallingUpdate}
          >
            {isInstallingUpdate ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Download />
            )}
            <span>Update</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <UpdateChangelogDialog
          open={changelogOpen}
          onOpenChange={setChangelogOpen}
          updateInfo={updateInfo}
        />
      </>
    );
  }

  return (
    <>
      <div className="mx-2 mb-1 rounded-lg border border-sidebar-border bg-surface p-2.5">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
            <Download className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[0.72rem] font-[760] text-ink">
              Update available
            </p>
            <p className="mt-0.5 text-[0.7rem] leading-snug text-muted-foreground">
              v{updateInfo.version} is ready to install.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="shrink-0 text-muted-foreground"
            onClick={dismissUpdate}
            aria-label="Dismiss update"
          >
            <X />
          </Button>
        </div>
        <div className="mt-2 flex gap-1.5">
          <Button
            variant="outline"
            size="xs"
            className="flex-1"
            onClick={() => setChangelogOpen(true)}
          >
            What&apos;s new
          </Button>
          <Button
            size="xs"
            className="flex-1"
            onClick={() => installUpdate()}
            disabled={isInstallingUpdate}
          >
            {isInstallingUpdate ? (
              <>
                <Loader2 className="animate-spin" />
                Installing…
              </>
            ) : (
              "Install & restart"
            )}
          </Button>
        </div>
      </div>
      <UpdateChangelogDialog
        open={changelogOpen}
        onOpenChange={setChangelogOpen}
        updateInfo={updateInfo}
      />
    </>
  );
}
