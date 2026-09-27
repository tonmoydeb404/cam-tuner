import { brand } from "@/lib/brand";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { CheckCircle2 } from "lucide-react";

type UpdateNoticeDialogProps = {
  open: boolean;
  previousVersion: string | null;
  onDismiss: () => void;
};

export function UpdateNoticeDialog({
  open,
  previousVersion,
  onDismiss,
}: UpdateNoticeDialogProps) {
  function handleOpenChange(o: boolean) {
    if (!o) onDismiss();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="lg">
        <DialogHeader className="flex-row items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500">
            <CheckCircle2 size={18} />
          </span>
          <span className="grid gap-0.5">
            <DialogTitle>{brand.appName} is up to date</DialogTitle>
            <DialogDescription>
              {previousVersion
                ? `Updated from v${previousVersion} to v${brand.version}.`
                : `You're now on v${brand.version}.`}
            </DialogDescription>
          </span>
        </DialogHeader>

        <div className="p-4 pt-0">
          <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
            Thanks for keeping {brand.appName} fresh. This version includes the
            latest improvements and fixes.
          </p>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <Button onClick={onDismiss}>Got it</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
