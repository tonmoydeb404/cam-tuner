interface ZoomControlProps {
  value: number;
  onChange: (value: number) => void;
}

export function ZoomControl({ value, onChange }: ZoomControlProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Zoom
        </label>
        <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
          {value.toFixed(1)}x
        </span>
      </div>
      <input
        type="range"
        min="1"
        max="3"
        step="0.1"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      />
      <div className="flex justify-between text-[10px] items-center text-neutral-600 font-medium">
        <span>1x</span>
        <span>2x</span>
        <span>3x</span>
      </div>
    </div>
  );
}
