import { SidebarProvider } from "@/components/ui/sidebar";
import EditorSidebar from "@/layouts/editor/sidebar";
import EditorSliceLoader from "@/store/features/editor/loader";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const EditorRootLayout = (props: Props) => {
  return (
    <>
      <SidebarProvider>
        <EditorSidebar>{props.children}</EditorSidebar>
        <main></main>
      </SidebarProvider>
      <EditorSliceLoader />
    </>
  );
};

export default EditorRootLayout;
