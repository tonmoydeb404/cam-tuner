import { SidebarProvider } from "@/components/ui/sidebar";
import EditorPreview from "@/layouts/editor/preview";
import EditorSidebar from "@/layouts/editor/sidebar";
import EditorSliceLoader from "@/store/features/editor/loader";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const EditorRootLayout = (props: Props) => {
  return (
    <>
      <EditorSliceLoader />
      <SidebarProvider sidebarWidth="30rem">
        <EditorSidebar>{props.children}</EditorSidebar>
        <main className="flex-1">
          <EditorPreview />
        </main>
      </SidebarProvider>
    </>
  );
};

export default EditorRootLayout;
