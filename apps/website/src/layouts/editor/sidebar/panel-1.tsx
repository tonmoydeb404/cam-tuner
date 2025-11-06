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
} from "@/components/ui/sidebar";
import { CommandIcon } from "lucide-react";
import Link from "next/link";
import { toolsList } from "../config";
import ThemeSwitcher from "./theme-switcher";

type Props = {};

const EditorSidebarPanel1 = (props: Props) => {
  return (
    <Sidebar collapsible="none" className="w-[60px]! border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              variant={"outline"}
              className="items-center justify-center border"
            >
              <CommandIcon className="size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="px-1.5 md:px-0">
            <SidebarMenu className="gap-y-2">
              {toolsList.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    tooltip={{
                      children: item.title,
                      hidden: false,
                    }}
                    variant={"outline"}
                    className="items-center justify-center aspect-square h-auto border"
                    asChild
                  >
                    <Link href={item.path}>
                      <item.icon className="size-5!" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <ThemeSwitcher />
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export default EditorSidebarPanel1;
