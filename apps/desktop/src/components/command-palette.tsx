import { Settings, Video } from "lucide-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useModal } from "@/context/modal-context"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@workspace/ui/components/command"

export function CommandPalette() {
  const navigate = useNavigate()
  const { command, settings } = useModal()

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey
      if (mod && event.key === "k") {
        event.preventDefault()
        command.open()
      }
    }

    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [command])

  function go(path: string) {
    navigate(path)
    command.close()
  }

  return (
    <CommandDialog
      open={command.isOpen}
      onOpenChange={(open) => {
        if (!open) command.close()
      }}
    >
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go("/")}>
              <Video />
              <span>Studio</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                settings.open()
                command.close()
              }}
            >
              <Settings />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
