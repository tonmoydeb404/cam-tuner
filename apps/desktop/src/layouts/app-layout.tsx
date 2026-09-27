import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";
import { ErrorAlertDialog } from "@/components/error-alert-dialog";
import { SettingsDialog } from "@/components/settings-dialog";
import { StartupModals } from "@/components/startup-modals";
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>

      {/* Route-driven overlays (each opens when its route is active) */}
      <ErrorAlertDialog />
      <SettingsDialog />
      <CommandPalette />
      <StartupModals />
    </SidebarProvider>
  );
}
