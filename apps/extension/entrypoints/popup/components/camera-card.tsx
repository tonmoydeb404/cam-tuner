import { Button } from "@workspace/ui/components/button"

export function CameraCard({
  cameraLabel,
  onClear,
}: {
  cameraLabel: string
  onClear: () => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border py-1.5 pr-2 pl-4">
      <div className="min-w-0">
        <div className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
          Camera
        </div>
        <div className="truncate text-xs font-medium">{cameraLabel}</div>
      </div>
      <Button
        variant="ghost"
        size="xs"
        title="Tune every camera again (this was set in the web preview)"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  )
}
