import { useModal } from "@/context/modal-context";
import { api } from "@/lib/api";
import { brand } from "@/lib/brand";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Switch } from "@workspace/ui/components/switch";
import { ExternalLink, Moon } from "lucide-react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-2">
      <h3 className="text-[0.68rem] font-[760] text-faint">{title}</h3>
      {children}
    </section>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
  icon,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-control text-muted-foreground">
            {icon}
          </span>
        )}
        <span className="grid min-w-0 gap-0.5">
          <strong className="text-[0.82rem] text-ink">{title}</strong>
          <small className="truncate text-[0.7rem] text-muted-foreground">
            {description}
          </small>
        </span>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={title} />
    </div>
  );
}

export function SettingsDialog() {
  const { settings: settingsModal } = useModal();
  const { theme, setTheme } = useTheme();

  const [autostart, setAutostart] = useState(false);
  const [checkingUpdate, setCheckingUpdate] = useState(false);

  useEffect(() => {
    api
      .isAutostartEnabled()
      .then(setAutostart)
      .catch(() => {});
  }, []);

  function handleThemeToggle(checked: boolean) {
    setTheme(checked ? "dark" : "light");
  }

  async function handleAutostartToggle(checked: boolean) {
    setAutostart(checked);
    try {
      if (checked) {
        await api.enableAutostart();
        toast.success(`${brand.appName} will launch on system boot.`);
      } else {
        await api.disableAutostart();
        toast.success("Autostart disabled.");
      }
    } catch (err) {
      console.error("Autostart toggle failed:", err);
      toast.error("Failed to change autostart setting.");
      setAutostart(!checked);
    }
  }

  async function handleCheckUpdate() {
    setCheckingUpdate(true);
    try {
      const info = await api.checkForUpdate();
      if (!info) {
        // run_update_check emits update://available when an update exists,
        // which opens the update notification — only the up-to-date case
        // needs feedback here.
        toast.success(`${brand.appName} is up to date.`);
      }
    } catch (err) {
      toast.error("Couldn't check for updates.", {
        description: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setCheckingUpdate(false);
    }
  }

  function handleClose(open: boolean) {
    if (!open) settingsModal.close();
  }

  return (
    <Dialog open={settingsModal.isOpen} onOpenChange={handleClose}>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure {brand.appName} to fit your workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-h-0 flex-1 gap-6 overflow-auto scrollbar-thin p-4">
          <SettingsSection title="APPEARANCE">
            <ToggleRow
              title="Dark theme"
              description="Toggle between dark and light appearance."
              checked={theme === "dark"}
              onChange={handleThemeToggle}
              icon={<Moon size={15} />}
            />
          </SettingsSection>

          <SettingsSection title="SYSTEM">
            <ToggleRow
              title="Start at login"
              description={`Launch ${brand.appName} automatically on system boot.`}
              checked={autostart}
              onChange={handleAutostartToggle}
            />
          </SettingsSection>

          <SettingsSection title="ABOUT">
            <div className="grid gap-1 rounded-lg border border-border bg-surface p-3 text-[0.78rem] text-muted-foreground">
              <span className="flex items-center justify-between gap-2 text-ink">
                {brand.appName}{" "}
                <span className="text-faint">v{brand.version}</span>
              </span>
              <span>{brand.description.short}</span>
              <span className="mt-1 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-auto p-0 text-[0.74rem] text-primary underline-offset-2 hover:underline"
                  onClick={handleCheckUpdate}
                  disabled={checkingUpdate}
                >
                  {checkingUpdate ? "Checking…" : "Check for updates"}
                </Button>
                <span className="text-faint">·</span>
                <Button
                  variant="ghost"
                  size="xs"
                  className="h-auto p-0 text-[0.74rem] text-primary underline-offset-2 hover:underline"
                  onClick={() =>
                    openUrl(brand.repository).catch(() => {})
                  }
                >
                  <ExternalLink size={12} />
                  View source on GitHub
                </Button>
              </span>
            </div>
          </SettingsSection>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <DialogClose render={<Button variant="secondary">Done</Button>} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
