import { Button } from "@workspace/ui/components/button";
import { Switch } from "@workspace/ui/components/switch";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  Loader2,
  Trash2,
  Users,
  Video,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { ScreenHeader } from "@/components/screen-header";
import {
  api,
  type VcamPluginStatus,
  type VcamStatus,
} from "@/lib/api";

export function VcamScreen() {
  const [status, setStatus] = useState<VcamStatus | null>(null);
  const [plugin, setPlugin] = useState<VcamPluginStatus | null>(null);
  const [busy, setBusy] = useState(false);
  const [installBusy, setInstallBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [vcam, plug] = await Promise.all([
        api.vcamStatus(),
        api.vcamPluginStatus(),
      ]);
      setStatus(vcam);
      setPlugin(plug);
    } catch (err) {
      toast.error("Failed to load virtual camera state", {
        description: String(err),
      });
    }
  }, []);

  useEffect(() => {
    refresh().catch(() => {});
    const timer = setInterval(refresh, 2000);
    return () => clearInterval(timer);
  }, [refresh]);

  const handleToggle = useCallback(
    async (next: boolean) => {
      setBusy(true);
      try {
        const nextStatus = next ? await api.vcamStart() : await api.vcamStop();
        setStatus(nextStatus);
      } catch (err) {
        toast.error(next ? "Could not start virtual camera" : "Could not stop", {
          description: String(err),
        });
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const handleInstall = useCallback(async () => {
    setInstallBusy(true);
    try {
      const next = await api.vcamPluginInstall();
      setPlugin(next);
      toast.success("Virtual camera plugin installed", {
        description: "Restart camera-using apps to see CamTuner Camera.",
      });
    } catch (err) {
      toast.error("Install cancelled or failed", { description: String(err) });
    } finally {
      setInstallBusy(false);
    }
  }, []);

  const handleUninstall = useCallback(async () => {
    setInstallBusy(true);
    try {
      const next = await api.vcamPluginUninstall();
      setPlugin(next);
    } catch (err) {
      toast.error("Uninstall cancelled or failed", {
        description: String(err),
      });
    } finally {
      setInstallBusy(false);
    }
  }, []);

  return (
    <section className="min-h-0 flex-1 overflow-auto scrollbar-thin p-6">
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        <ScreenHeader
          title="Virtual Camera"
          actions={
            <div className="flex items-center gap-3">
              {status && (
                <span className="font-mono text-[10px] text-faint">
                  {status.streaming
                    ? `${status.clients} client${status.clients === 1 ? "" : "s"}`
                    : "offline"}
                </span>
              )}
              <Switch
                checked={status?.streaming ?? false}
                onCheckedChange={handleToggle}
                disabled={busy || status === null || !plugin?.installed}
                aria-label="Toggle virtual camera"
              />
            </div>
          }
        />

        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            Working…
          </div>
        )}

        {/* Plugin installation */}
        <div className="grid gap-3 rounded-xl border border-border bg-surface p-4">
          <strong className="text-[0.82rem] text-ink">Camera plugin</strong>
          <p className="text-[0.78rem] leading-relaxed text-muted-foreground">
            The plugin registers <em>CamTuner Camera</em> as a system camera.
            Install it once (admin password), then select it in Zoom, Chrome,
            or OBS.
          </p>
          <div className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
            {plugin === null ? (
              <Loader2 size={14} className="animate-spin" />
            ) : plugin.installed ? (
              <>
                <CheckCircle2 size={14} className="text-green-600" />
                <span>
                  Installed at <code className="rounded bg-inset px-1 py-0.5">{plugin.path}</code>
                  {!plugin.upToDate && " — a newer build exists"}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={14} className="text-amber-600" />
                <span>Not installed</span>
              </>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              disabled={installBusy || (plugin?.installed && plugin.upToDate)}
              className="h-8"
            >
              {installBusy ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {plugin?.installed ? "Update" : "Install"}
            </Button>
            {plugin?.installed && (
              <Button
                variant="outline"
                onClick={handleUninstall}
                disabled={installBusy}
                className="h-8"
              >
                <Trash2 size={14} />
                Uninstall
              </Button>
            )}
          </div>
        </div>

        {/* Streaming */}
        <div className="grid gap-3 rounded-xl border border-border bg-surface p-4">
          <strong className="text-[0.82rem] text-ink">Output</strong>
          <div className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
            <Video size={14} />
            {status?.streaming ? (
              <span>Live — output follows the Studio tuning.</span>
            ) : (
              <span>
                Off. Enabling uses the selected Studio camera at pipeline
                resolution.
              </span>
            )}
          </div>
          {status && (
            <span className="font-mono text-[10px] text-faint">
              socket: {status.socketPath}
            </span>
          )}
          {status && status.streaming && (
            <div className="flex items-center gap-2 text-[0.78rem] text-muted-foreground">
              <Users size={14} />
              {status.clients === 0
                ? "No apps connected — open the camera in Zoom or OBS."
                : `${status.clients} connected`}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
