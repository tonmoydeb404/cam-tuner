import PreviewPlayer from "@/components/preview-player";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera } from "lucide-react";

type Props = {};

const PreviewSection = (props: Props) => {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Live Preview
        </CardTitle>
        <CardDescription>
          Real-time camera feed with applied effects from CamTuner virtual
          camera
        </CardDescription>
      </CardHeader>

      <CardContent>
        <PreviewPlayer />
      </CardContent>

      <CardFooter className="border-t pt-4">
        <p className="text-sm text-muted-foreground">
          This preview shows what others will see when you use CamTuner as your
          camera source in video calls.
        </p>
      </CardFooter>
    </Card>
  );
};

export default PreviewSection;
