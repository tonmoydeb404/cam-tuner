import { openUrl } from "@tauri-apps/plugin-opener";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { ExternalLink } from "lucide-react";
import { brand } from "@/lib/brand";
import type { UpdateInfo } from "@/types";

type UpdateChangelogDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  updateInfo: UpdateInfo;
};

export function UpdateChangelogDialog({
  open,
  onOpenChange,
  updateInfo,
}: UpdateChangelogDialogProps) {
  const hasNotes =
    updateInfo.body != null && updateInfo.body.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>What&apos;s new in v{updateInfo.version}</DialogTitle>
          <DialogDescription>
            Release notes for the upcoming update.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[50vh] overflow-auto p-4 pt-0 scrollbar-thin">
          {hasNotes ? (
            <pre className="whitespace-pre-wrap break-words font-sans text-[0.82rem] leading-relaxed text-muted-foreground">
              {updateInfo.body}
            </pre>
          ) : (
            <div className="grid gap-3 py-4 text-center">
              <p className="text-[0.82rem] text-muted-foreground">
                Release notes are not available for this version.
              </p>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    openUrl(brand.downloadUrl).catch(() => {})
                  }
                >
                  <ExternalLink />
                  View on GitHub
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
