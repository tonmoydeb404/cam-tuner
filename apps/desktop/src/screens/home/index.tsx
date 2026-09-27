import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { brand } from "@/lib/brand";

// Demo screen: a minimal invoke() round trip to the Rust `greet` command
// (src-tauri/src/commands.rs). Replace with your app's real screens.
export function HomeScreen() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState<string | null>(null);

  async function handleGreet() {
    const result = await api.greet(name.trim() || "world");
    setGreeting(result);
  }

  return (
    <section className="min-h-0 flex-1 overflow-auto scrollbar-thin p-6">
      <div className="mx-auto grid max-w-lg gap-6">
        <div className="grid gap-1 text-center">
          <h1 className="text-xl font-[760] text-ink">
            Welcome to {brand.appName}
          </h1>
          <p className="text-[0.82rem] text-muted-foreground">
            This is a starter screen calling a Rust command via IPC.
          </p>
        </div>

        <div className="grid gap-2 rounded-xl border border-border bg-surface p-4">
          <div className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGreet()}
              placeholder="Your name…"
              className="h-9"
            />
            <Button onClick={handleGreet} className="h-9">
              <Sparkles size={14} />
              Greet
            </Button>
          </div>
          {greeting && (
            <p className="rounded-lg bg-inset p-3 text-[0.82rem] text-muted-foreground">
              {greeting}
            </p>
          )}
        </div>

        <div className="grid gap-2 rounded-xl border border-border bg-surface p-4 text-[0.78rem] leading-relaxed text-muted-foreground">
          <strong className="text-[0.82rem] text-ink">Where to go next</strong>
          <span>
            IPC commands:{" "}
            <code className="rounded bg-inset px-1 py-0.5">
              src-tauri/src/commands.rs
            </code>{" "}
            +{" "}
            <code className="rounded bg-inset px-1 py-0.5">src/lib/api.ts</code>
          </span>
          <span>
            Database:{" "}
            <code className="rounded bg-inset px-1 py-0.5">
              src-tauri/src/db.rs
            </code>{" "}
            + migrations in{" "}
            <code className="rounded bg-inset px-1 py-0.5">
              src-tauri/src/migrations/sql/
            </code>
          </span>
          <span>
            Screens: <code className="rounded bg-inset px-1 py-0.5">src/screens/</code>{" "}
            · routes in <code className="rounded bg-inset px-1 py-0.5">src/app.tsx</code>
          </span>
        </div>
      </div>
    </section>
  );
}
