import { FormInput, FormTabs } from "@/components/form";
import { usePlaceholder } from "@/context/placeholder";

type Props = {};

const BackgroundSection = (props: Props) => {
  const { placeholderConfig, updateNestedPlaceholder } = usePlaceholder();
  const { background } = placeholderConfig;
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h5 className="text-sm uppercase text-muted-foreground">Background</h5>
      <FormTabs
        label="Mode"
        id="background-mode"
        value={background.mode}
        onChange={updateNestedPlaceholder("background", "mode")}
        options={[
          { label: "Color", value: "color" },
          { label: "Image", value: "image" },
          { label: "Video", value: "video" },
        ]}
      />

      {background.mode === "color" && (
        <FormInput
          label="Color"
          id="background-color"
          value={background.colorCode || "#1a1a1a"}
          onChange={(value) =>
            updateNestedPlaceholder("background", "colorCode")(value || null)
          }
          type="color"
        />
      )}

      {background.mode === "image" && (
        <FormInput
          id="background-image"
          label="Background Image URL"
          value={background.imageUrl || ""}
          onChange={(value) =>
            updateNestedPlaceholder("background", "imageUrl")(value || null)
          }
          type="text"
        />
      )}

      {background.mode === "video" && (
        <FormInput
          id="background-video"
          label="Background Video URL"
          value={background.videoUrl || ""}
          onChange={(value) =>
            updateNestedPlaceholder("background", "videoUrl")(value || null)
          }
          type="text"
        />
      )}
    </div>
  );
};

export default BackgroundSection;
