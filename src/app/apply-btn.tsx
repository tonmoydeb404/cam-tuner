import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app";
import { LucideAlertTriangle, LucideX } from "lucide-react";
import { useState } from "react";

type Props = {
  onTroubleshoot: () => void;
};

const ApplyBtn = (props: Props) => {
  const { onTroubleshoot } = props;
  const { applySettings, changesPending } = useAppContext();
  const [showAlert, setShowAlert] = useState(false);

  const updateSettings = () => {
    applySettings();
    setShowAlert(true);
  };

  return (
    <div className="flex flex-col space-y-3">
      <Button
        onClick={updateSettings}
        variant={changesPending ? "default" : "outline"}
      >
        Sync Changes
      </Button>

      {showAlert && (
        <Alert className="relative border-amber-500 bg-amber-100">
          <LucideAlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-medium">
            Camera Settings Synced
          </AlertTitle>
          <AlertDescription>
            <p className="text-foreground !leading-[1.4]">
              If changes are not reflected immediately, try to{" "}
              <span
                className="text-primary hover:underline cursor-pointer"
                onClick={onTroubleshoot}
              >
                troubleshoot
              </span>
            </p>
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
