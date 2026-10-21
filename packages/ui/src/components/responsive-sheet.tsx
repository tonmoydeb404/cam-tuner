"use client";

import { DrawerDescriptionProps } from "@base-ui/react";
import * as React from "react";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@workspace/ui/components/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";

type ResponsiveSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  descriptionProps?: DrawerDescriptionProps;

  /** Sheet side on desktop. Ignored on mobile (bottom drawer) or "dialog" variant. */
  side?: "right" | "left" | "top" | "bottom";
  /** Desktop chrome: a side Sheet, or a centered Dialog for short forms. Ignored on mobile. */
  variant?: "sheet" | "dialog";
  /** Dialog width when `variant="dialog"`. Ignored otherwise. */
  size?: "sm" | "default" | "lg";
  footer?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Form container that renders a side Sheet (or centered Dialog) on desktop
 * and a bottom Drawer on mobile (and other narrow viewports, e.g. a 420px
 * desktop window). Same props, adaptive chrome.
 */
export function ResponsiveSheet({
  open,
  onOpenChange,
  title,
  description,
  descriptionProps,
  side = "right",
  variant = "sheet",
  size,
  footer,
  children,
}: ResponsiveSheetProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader className="text-left mb-5">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription {...descriptionProps}>
                {description}
              </DrawerDescription>
            )}
          </DrawerHeader>
          <div className="grid gap-3 px-4">{children}</div>
          {footer && <DrawerFooter className="mt-5">{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  }

  if (variant === "dialog") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent size={size}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription {...descriptionProps}>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="grid gap-3 px-4">{children}</div>
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && (
            <SheetDescription {...descriptionProps}>
              {description}
            </SheetDescription>
          )}
        </SheetHeader>
        <div className="grid gap-3 px-4">{children}</div>
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  );
}
