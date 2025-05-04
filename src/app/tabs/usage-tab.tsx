import { Camera, Cog, RefreshCw, Video } from "lucide-react";

type Props = {};

const UsageTab = (props: Props) => {
  return (
    <div className="p-5 border rounded-2xl shadow-sm">
      <ol className="space-y-5">
        {usages.map((item) => (
          <li key={item.id} className="flex items-center gap-x-3">
            <div className="flex-shrink-0 size-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="font-semibold">{item.icon}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-sm mb-0.5">{item.title}</h3>
              <p className="text-muted-foreground text-[13px] leading-tight">
                {item.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default UsageTab;

const usages = [
  {
    id: 1,
    title: "Select Camera Source",
    text: "Select CamTuner from camera source in your desired web application (Ex: Meet, Zoom)",
    icon: <Video size={20} />,
  },
  {
    id: 2,
    title: "Configure Settings",
    text: "Configure camera settings from the extension and preview the changes in real-time",
    icon: <Cog size={20} />,
  },
  {
    id: 3,
    title: "Sync Changes",
    text: "Click Sync Changes to save your settings and publish to the current web application",
    icon: <RefreshCw size={20} />,
  },
  {
    id: 4,
    title: "Troubleshooting",
    text: "If changes are not reflected immediately, try turning the camera off and on again in your web application",
    icon: <Camera size={20} />,
  },
];
