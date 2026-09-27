import { brand } from "@/lib/brand";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Rocket } from "lucide-react";

type WelcomeDialogProps = {
  open: boolean;
  onGetStarted: () => void;
};

export function WelcomeDialog({ open, onGetStarted }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent size="lg" showCloseButton={false}>
        <DialogHeader className="flex-row items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Rocket size={18} />
          </span>
          <span className="grid gap-0.5">
            <DialogTitle>Welcome to {brand.appName}</DialogTitle>
            <DialogDescription>{brand.description.short}</DialogDescription>
          </span>
        </DialogHeader>

        <div className="grid gap-4 p-4 pt-0">
          <p className="text-[0.82rem] leading-relaxed text-muted-foreground">
            {brand.description.long}
          </p>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <Button onClick={() => onGetStarted()}>Get started</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
