"use client";

import { Sidebar } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import EditorSidebarPanel1 from "./panel-1";
import EditorSidebarPanel2 from "./panel-2";

type Props = {
  children: ReactNode;
};

const EditorSidebar = (props: Props) => {
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row [--sidebar-width:500px]"
    >
      <EditorSidebarPanel1 />
      <EditorSidebarPanel2>{props.children}</EditorSidebarPanel2>
    </Sidebar>
  );
};

export default EditorSidebar;
