interface GridToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function GridToggle({ value, onChange }: GridToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
        Grid & Align
      </label>
      <div className="flex items-center justify-between bg-neutral-950 border border-white/5 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              value ? "bg-indigo-500/20 text-indigo-400" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-neutral-300">Rule of Thirds</span>
        </div>
        <button
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${
            value ? "bg-indigo-500" : "bg-neutral-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
              value ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
