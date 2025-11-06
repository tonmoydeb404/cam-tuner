import { Sidebar } from "@/components/ui/sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const EditorSidebarPanel2 = (props: Props) => {
  return (
    <Sidebar collapsible="none" className="hidden flex-1 md:flex">
      {props.children}
    </Sidebar>
  );
};

export default EditorSidebarPanel2;
