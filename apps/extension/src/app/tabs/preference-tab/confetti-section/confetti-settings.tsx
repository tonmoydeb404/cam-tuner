import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useConfettiContext } from "@/context/confetti";

const ConfettiSettings = () => {
  const { confetti, updateConfetti } = useConfettiContext();

  const handleIntensityChange = (value: number[]) => {
    updateConfetti("intensity")(value[0]);
  };

  const handleDurationChange = (value: number[]) => {
    updateConfetti("duration")(value[0]);
  };

  return (
    <div className="space-y-6">
      {/* Intensity */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="intensity">Intensity</Label>
          <span className="text-sm text-muted-foreground">
            {confetti?.intensity || 50}%
          </span>
        </div>
        <Slider
          id="intensity"
          min={10}
          max={100}
          step={10}
          value={[confetti?.intensity || 50]}
          onValueChange={handleIntensityChange}
          className="w-full mb-1.5"
        />
        <p className="text-xs text-muted-foreground">
          Controls the amount of confetti particles
        </p>
      </div>

      {/* Duration */}
      <div className="">
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="duration">Duration</Label>
          <span className="text-sm text-muted-foreground">
            {confetti?.duration || 3}s
          </span>
        </div>
        <Slider
          id="duration"
          min={1}
          max={10}
          step={0.5}
          value={[confetti?.duration || 3]}
          onValueChange={handleDurationChange}
          className="w-full mb-1.5"
        />
        <p className="text-xs text-muted-foreground">
          How long the confetti effect lasts
        </p>
      </div>
    </div>
  );
};

export default ConfettiSettings;
