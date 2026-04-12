export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="size-8 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          Loading…
        </p>
      </div>
    </div>
  )
}
