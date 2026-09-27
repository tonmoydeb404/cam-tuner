import { brand } from "@/lib/brand";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { AlertTriangle } from "lucide-react";

type DowngradeNoticeDialogProps = {
  open: boolean;
  previousVersion: string;
  onDismiss: () => void;
};

export function DowngradeNoticeDialog({
  open,
  previousVersion,
  onDismiss,
}: DowngradeNoticeDialogProps) {
  function handleOpenChange(o: boolean) {
    if (!o) onDismiss();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="lg">
        <DialogHeader className="flex-row items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-amber-500/15 text-amber-500">
            <AlertTriangle size={18} />
          </span>
          <span className="grid gap-0.5">
            <DialogTitle>Switched to v{brand.version}</DialogTitle>
            <DialogDescription>
              Downgraded from v{previousVersion}.
            </DialogDescription>
          </span>
        </DialogHeader>

        <div className="p-4 pt-0">
          <div className="grid gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-[0.8rem] leading-relaxed text-amber-200">
            <strong className="font-[600]">Heads up</strong>
            <span>
              A newer database schema or features from v{previousVersion} may
              not be available on this build. If anything looks off, reinstall
              the latest version.
            </span>
          </div>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <Button variant="secondary" onClick={onDismiss}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
