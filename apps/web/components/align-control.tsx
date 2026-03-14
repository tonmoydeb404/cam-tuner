import { AlignPosition } from "@/lib/tuner-types"

interface AlignControlProps {
  value: AlignPosition
  onChange: (value: AlignPosition) => void
}

const ALIGN_OPTIONS: AlignPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "center-left",
  "center",
  "center-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

export function AlignControl({ value, onChange }: AlignControlProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
        Align
      </label>
      <div className="grid w-full grid-cols-3 gap-2 rounded-2xl border border-white/5 bg-neutral-950 p-2">
        {ALIGN_OPTIONS.map((pos) => {
          const isSelected = value === pos
          return (
            <button
              key={pos}
              onClick={() => onChange(pos)}
              className={`flex h-10 w-full items-center justify-center rounded-xl transition-all ${
                isSelected
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-neutral-900 text-neutral-600 hover:bg-neutral-800 hover:text-neutral-400"
              }`}
              aria-label={`Align ${pos}`}
            >
              <div
                className={`h-2 w-2 rounded-full ${isSelected ? "bg-white" : "bg-neutral-600"}`}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
