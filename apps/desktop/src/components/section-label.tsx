function SectionLabel({
  label,
  count,
}: {
  label: string;
  count?: number;
}) {
  return (
    <div
      className={`flex bg-inset px-3 py-[7px] border-b border-separator ${
        count !== undefined ? "items-center justify-between" : ""
      }`}
    >
      <span className="text-faint text-[0.68rem] font-[760]">{label}</span>
      {count !== undefined && (
        <span className="text-faint text-[0.68rem] font-[600]">{count}</span>
      )}
    </div>
  );
}

export { SectionLabel };
