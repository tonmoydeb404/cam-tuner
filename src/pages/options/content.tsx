import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useWebcamPermission from "@/hooks/use-webcam-permission";
import { CameraOff, Loader2, LucideCamera } from "lucide-react";

const Content = () => {
  const { hasPermission, isSupported, requestPermission } =
    useWebcamPermission();

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">CamTuner Options</CardTitle>
          <CardDescription>Configure your extension settings</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between py-4">
            <div className="space-y-0.5">
              <Label
                htmlFor="camera-permission"
                className="text-base font-medium"
              >
                Camera Permission
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow the extension to access your camera
              </p>
            </div>

            {!isSupported && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <CameraOff size={18} />
                <span>Not supported</span>
              </div>
            )}

            {isSupported && hasPermission === null && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin" size={18} />
                <span className="text-sm">Checking...</span>
              </div>
            )}

            {isSupported && hasPermission === false && (
              <Button
                onClick={requestPermission}
                aria-label="Request camera access"
              >
                <LucideCamera className="h-4 w-4" />
                Allow
              </Button>
            )}

            {isSupported && hasPermission === true && (
              <Button variant="outline" className="pointer-events-none">
                Allowed
              </Button>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col items-start border-t pt-6">
          <p className="text-sm text-muted-foreground mb-2">
            Having issues with the extension? Please report them on our GitHub
            repository.
          </p>
          <a
            href="https://github.com/your-repo/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded hover:bg-muted transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            Report an Issue
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Content;
