"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useEditorSlice } from "@/store";
import { FormProvider, useForm } from "react-hook-form";
import EditorFieldsSection from "./fields";

type Props = {};

const EditorView = (props: Props) => {
  const { crop } = useEditorSlice();
  const form = useForm({ defaultValues: crop });

  const handleSubmit = () => {};

  return (
    <>
      <SidebarHeader className="gap-3.5 border-b p-4 flex flex-row justify-between">
        <div>
          <h2 className="text-foreground text-base font-bold mb-0.5">
            Crop & Zoom
          </h2>
          <p className="text-xs text-muted-foreground">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum!
          </p>
        </div>
        <div>
          <Switch />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <FormProvider {...form}>
          <EditorFieldsSection />
        </FormProvider>
      </SidebarContent>
      <SidebarFooter>
        <Button onClick={handleSubmit}>Apply Settings</Button>
      </SidebarFooter>
    </>
  );
};

export default EditorView;
