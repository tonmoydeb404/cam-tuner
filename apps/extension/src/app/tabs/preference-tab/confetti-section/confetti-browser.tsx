import { Button } from "@/components/ui/button";
import { useConfettiContext } from "@/context/confetti";
import { triggerConfetti } from "@/utils/confetti";
import { Play } from "lucide-react";

const confettiTypes = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional multicolored confetti",
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b"],
  },
  {
    id: "hearts",
    name: "Hearts",
    description: "Romantic heart-shaped confetti",
    colors: ["#ff6b9d", "#ff8a8a", "#ffa8e4", "#ff9ff3"],
  },
  {
    id: "stars",
    name: "Stars",
    description: "Twinkling star confetti",
    colors: ["#ffd700", "#ffed4e", "#fff200", "#ffb700"],
  },
  {
    id: "celebration",
    name: "Celebration",
    description: "High-energy celebration burst",
    colors: ["#ff3838", "#ff9500", "#ffdd00", "#00d4ff", "#b347d9"],
  },
];

const ConfettiBrowser = () => {
  const { confetti } = useConfettiContext();

  const handleSelectConfetti = async (type: (typeof confettiTypes)[0]) => {
    // Trigger confetti effect with the selected type and current settings
    await triggerConfetti(
      type.id,
      type.colors,
      confetti.intensity,
      confetti.duration
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {confettiTypes.map((type) => {
          return (
            <div
              key={type.id}
              className="p-3 border border-border/40 rounded-lg hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{type.name}</h4>
                    <Button
                      onClick={() => handleSelectConfetti(type)}
                      variant="outline"
                      size="sm"
                      className="ml-2 flex items-center gap-2"
                    >
                      <Play className="h-4 w-4" />
                      Play
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {type.description}
                  </p>
                  <div className="flex gap-1">
                    {type.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-border/20"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConfettiBrowser;
