import { SidebarProvider } from "@/components/ui/sidebar";
import EditorSidebar from "@/layouts/editor/sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const EditorRootLayout = (props: Props) => {
  return (
    <SidebarProvider>
      <EditorSidebar />
      <main>{props.children}</main>
    </SidebarProvider>
  );
};

export default EditorRootLayout;
