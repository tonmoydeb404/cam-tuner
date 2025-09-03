import { FormInput, FormTabs } from "@/components/form";
import { usePlaceholder } from "@/context/placeholder";
import { useCallback } from "react";

type Props = {};

const ForegroundSection = (props: Props) => {
  const { placeholderConfig, updateNestedPlaceholder } = usePlaceholder();
  const { foreground } = placeholderConfig;

  // Helper functions for updating nested state
  const updateTextProperty = useCallback(
    (property: keyof typeof foreground.text, value: any) => {
      updateNestedPlaceholder(
        "foreground",
        "text"
      )({
        ...foreground.text,
        [property]: value || null,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [foreground.text, updateNestedPlaceholder]
  );

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h5 className="text-sm uppercase text-muted-foreground">Foreground</h5>
      <FormTabs
        label="Mode"
        id="foreground-mode"
        value={foreground.mode}
        onChange={updateNestedPlaceholder("foreground", "mode")}
        options={[
          { label: "Text", value: "text" },
          { label: "Image", value: "image" },
          { label: "Video", value: "video" },
        ]}
      />

      {foreground.mode === "text" && (
        <>
          <FormInput
            id="text-content"
            label="Text Content"
            value={foreground.text.content || ""}
            onChange={(value) => updateTextProperty("content", value)}
            type="text"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="text-bg-color"
              label="Text Background"
              value={foreground.text.bgColorCode || "#000000"}
              onChange={(value) => updateTextProperty("bgColorCode", value)}
              type="color"
            />
            <FormInput
              id="text-font-color"
              label="Text Color"
              value={foreground.text.fontColorCode || "#ffffff"}
              onChange={(value) => updateTextProperty("fontColorCode", value)}
              type="color"
            />
          </div>
        </>
      )}

      {foreground.mode === "image" && (
        <FormInput
          id="foreground-image"
          label="Image URL"
          value={foreground.imageUrl || ""}
          onChange={(value) =>
            updateNestedPlaceholder("foreground", "imageUrl")(value || null)
          }
          type="text"
        />
      )}

      {foreground.mode === "video" && (
        <FormInput
          id="foreground-video"
          label="Video URL"
          value={foreground.videoUrl || ""}
          onChange={(value) =>
            updateNestedPlaceholder("foreground", "videoUrl")(value || null)
          }
          type="text"
        />
      )}
    </div>
  );
};

export default ForegroundSection;
