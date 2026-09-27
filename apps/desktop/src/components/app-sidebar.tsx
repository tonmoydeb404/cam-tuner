import { Home, PanelLeftIcon, Search, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { UpdateNotification } from "@/components/update-notification";
import { useModal } from "@/context/modal-context";
import { brand } from "@/lib/brand";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@workspace/ui/components/sidebar";

type NavItem = {
  path: string;
  label: string;
  icon: typeof Home;
};

// Add your app's routes here (and matching <Route> entries in app.tsx).
const NAV_ITEMS: NavItem[] = [{ path: "/", label: "Home", icon: Home }];

export function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const sidebar = useSidebar();
  const { settings, command } = useModal();

  function handleNavClick(path: string) {
    navigate(path);
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="gap-3"
              tabIndex={-1}
              onClick={() => handleNavClick("/")}
            >
              <img
                src="/logo.svg"
                alt={`${brand.appName} logo`}
                style={{
                  maxHeight: sidebar.state === "expanded" ? 32 : 24,
                  marginLeft: sidebar.state === "expanded" ? 0 : 4,
                }}
              />
              <div className="grid flex-1 text-left leading-tight">
                <span className="text-[0.92rem] font-[760] text-ink">
                  {brand.appName}
                </span>
                <span className="text-[0.68rem] text-faint">
                  {brand.description.short}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Search"
                  onClick={() => command.open()}
                >
                  <Search />
                  <span>Search</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNavClick(item.path)}
                      tooltip={item.label}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UpdateNotification />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Toggle sidebar"
              onClick={() => sidebar.toggleSidebar()}
            >
              <PanelLeftIcon />
              <span>Toggle sidebar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              isActive={settings.isOpen}
              onClick={() => settings.open()}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
