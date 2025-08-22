import { FeatureCard } from "@/components/ui/feature-card";
import { KeyboardShortcut } from "@/components/ui/keyboard-shortcut";
import { AlertCircle, HelpCircle, Keyboard } from "lucide-react";

type Props = {};

const TroubleshootTab = (props: Props) => {
  return (
    <div className="space-y-4">
      {/* Quick Setup Guide */}
      <FeatureCard
        title="Quick Setup"
        icon={HelpCircle}
        description="Follow these steps to get started"
      >
        <ol className="space-y-3">
          {setupSteps.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold mt-0.5">
                {item.id}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {item.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </FeatureCard>

      {/* Keyboard Shortcuts */}
      <FeatureCard
        title="Keyboard Shortcuts"
        icon={Keyboard}
        description="Speed up your workflow"
      >
        <div className="space-y-2">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.keys.join('+') + shortcut.description} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{shortcut.description}</span>
              <KeyboardShortcut keys={shortcut.keys} />
            </div>
          ))}
        </div>
      </FeatureCard>

      {/* Common Issues */}
      <FeatureCard
        title="Common Issues"
        icon={AlertCircle}
        description="Solutions for frequent problems"
      >
        <div className="space-y-3">
          {commonIssues.map((issue) => (
            <details key={issue.problem} className="group">
              <summary className="text-sm font-medium cursor-pointer hover:text-foreground text-muted-foreground list-none flex items-center gap-2 py-1">
                <div className="w-2 h-2 rounded-full bg-destructive/60 flex-shrink-0" />
                <span className="flex-1">{issue.problem}</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2 ml-4 leading-relaxed">
                {issue.solution}
              </p>
            </details>
          ))}
        </div>
      </FeatureCard>
    </div>
  );
};

export default TroubleshootTab;

const setupSteps = [
  {
    id: 1,
    title: "Configure Your Camera",
    text: "Use the Camera tab to select your camera and adjust frame settings like aspect ratio and mirroring.",
  },
  {
    id: 2,
    title: "Apply Effects",
    text: "Go to Effects tab to adjust zoom, brightness, contrast, and saturation in real-time.",
  },
  {
    id: 3,
    title: "Apply Changes", 
    text: "Click the Apply Changes button to save your settings and make them available to video apps.",
  },
  {
    id: 4,
    title: "Select CamTuner in Video Apps",
    text: "In your video app (Google Meet, Zoom, etc.), select 'CamTuner' as your camera source.",
  },
];

const shortcuts = [
  { keys: ['1'], description: 'Switch to Camera tab' },
  { keys: ['2'], description: 'Switch to Effects tab' },
  { keys: ['3'], description: 'Switch to Help tab' },
  { keys: ['Ctrl', 'Enter'], description: 'Apply changes' },
  { keys: ['Ctrl', 'Space'], description: 'Toggle extension on/off' },
];

const commonIssues = [
  {
    problem: "Camera not appearing in video apps",
    solution: "Make sure the extension is enabled and you've applied your settings. Refresh your video app and look for 'CamTuner' in camera options."
  },
  {
    problem: "Changes not visible in video calls",
    solution: "Turn your camera off and on again in the video app. Some apps need to restart the camera feed to pick up changes."
  },
  {
    problem: "Poor performance or lag",
    solution: "Reduce extreme brightness/contrast/saturation values. High zoom levels and heavy effects can impact performance on older devices."
  },
  {
    problem: "Extension appears disabled",
    solution: "Check the toggle switch in the header. Make sure you have granted camera permissions to the extension."
  }
];
