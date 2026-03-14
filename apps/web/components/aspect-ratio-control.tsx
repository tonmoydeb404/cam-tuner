import { AspectRatio, ASPECT_RATIO_OPTIONS } from "@/lib/tuner-types";

interface AspectRatioControlProps {
  value: AspectRatio;
  onChange: (value: AspectRatio) => void;
}

export function AspectRatioControl({ value, onChange }: AspectRatioControlProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-2 gap-2">
        {ASPECT_RATIO_OPTIONS.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange(ratio)}
            className={`py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
              value === ratio
                ? "bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                : "bg-neutral-950 border-white/5 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            }`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  );
}
