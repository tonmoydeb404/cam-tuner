import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app";
import { LucideCheck, LucideLoader2, LucideX } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  onTroubleshoot: () => void;
};

const ApplyBtn = (props: Props) => {
  const { onTroubleshoot } = props;
  const { applySettings, changesPending } = useAppContext();
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const updateSettings = async () => {
    setIsApplying(true);
    
    try {
      applySettings();
      
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowAlert(true);
      }, 1200);
      
    } catch (error) {
      console.error('Failed to apply settings:', error);
    } finally {
      setIsApplying(false);
    }
  };

  // Auto-hide alert after 5 seconds
  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  return (
    <div className="space-y-3">
      {/* Main Apply Button */}
      <Button
        onClick={updateSettings}
        disabled={isApplying || (!changesPending && !showSuccess)}
        variant={changesPending ? "default" : "outline"}
        size="lg"
        className="w-full relative overflow-hidden group transition-all duration-200"
      >
        {isApplying && (
          <LucideLoader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {showSuccess && (
          <LucideCheck className="mr-2 h-4 w-4 text-green-600" />
        )}
        
        <span className="relative z-10">
          {isApplying ? "Applying..." : 
           showSuccess ? "Applied!" :
           changesPending ? "Apply Changes" : "Up to Date"}
        </span>

        {/* Animated background for success state */}
        {showSuccess && (
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 animate-pulse" />
        )}
      </Button>

      {/* Success/Help Alert */}
      {showAlert && (
        <Alert className="relative border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20 animate-in slide-in-from-bottom-2">
          <LucideCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="font-medium text-green-800 dark:text-green-200">
            Settings Applied Successfully
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            <p className="text-sm leading-relaxed">
              Your camera settings are now active. If you don't see changes immediately, try{" "}
              <button
                className="font-medium text-green-800 dark:text-green-200 hover:underline focus:outline-none focus:underline"
                onClick={onTroubleshoot}
              >
                troubleshooting
              </button>
              {" "}or refreshing your video call.
            </p>
          </AlertDescription>
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 h-6 w-6 p-0 text-green-600 hover:text-green-800 hover:bg-green-200/50"
            onClick={() => setShowAlert(false)}
          >
            <LucideX className="h-3 w-3" />
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default ApplyBtn;
