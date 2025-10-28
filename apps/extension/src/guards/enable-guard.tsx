import { useAppContext } from "@/context/app";
import { LucidePowerOff } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const EnableGuard = ({ children }: Props) => {
  const { enable } = useAppContext();

  if (!enable) {
    return (
      <div className="px-5 py-10 text-center flex flex-col items-center justify-center border border-dashed rounded-xl">
        <LucidePowerOff size={34} className="mb-4 text-muted-foreground" />
        <h1 className="text-lg font-bold mb-1">Feature Disabled</h1>
        <p className="text-sm text-muted-foreground">
          This feature is currently turned off. Please enable it to continue
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnableGuard;
