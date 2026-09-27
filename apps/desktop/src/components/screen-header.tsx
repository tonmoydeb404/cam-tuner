// Shared uppercase mono heading used at the top of tab screens (Times, Settings).
export function ScreenHeader({
  title,
  actions,
}: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between">
      <h1 className="font-mono text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </h1>
      {actions}
    </div>
  );
}
