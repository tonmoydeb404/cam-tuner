"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"

interface WelcomeBannerProps {
  open: boolean
  onDismiss: () => void
}

const WelcomeBanner = ({ open, onDismiss }: WelcomeBannerProps) => {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onDismiss()}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <div className="mb-2 text-3xl">🎉</div>
          <DialogTitle>Extension installed!</DialogTitle>
          <DialogDescription>
            Start your camera to preview and sync your settings in real-time.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton></DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WelcomeBanner
