import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app";
import { LucideBadgeInfo, LucideX } from "lucide-react";
import { useState } from "react";

type Props = {};

const ApplyBtn = (props: Props) => {
  const { applySettings, changesPending } = useAppContext();
  const [showAlert, setShowAlert] = useState(false);

  const updateSettings = () => {
    applySettings();
    setShowAlert(true);
  };

  return (
    <div className="flex flex-col mb-5 space-y-3">
      <Button
        onClick={updateSettings}
        variant={changesPending ? "default" : "outline"}
      >
        {changesPending ? "Update Changes" : "Save Changes"}
      </Button>

      {showAlert && (
        <Alert className="relative border-amber-500 bg-amber-100">
          <LucideBadgeInfo className="h-4 w-4" />
          <AlertTitle className="font-semibold">
            Camera Settings Updated
          </AlertTitle>
          <AlertDescription className="text-foreground">
            To apply changes, turn the camera off and on again in the website
            you're using.
          </AlertDescription>
          <Button
            size={"icon"}
            className="size-5 absolute top-2 right-2"
            variant={"ghost"}
            onClick={() => setShowAlert(false)}
          >
            <LucideX />
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default ApplyBtn;
