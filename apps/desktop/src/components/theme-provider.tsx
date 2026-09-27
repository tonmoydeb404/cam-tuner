import { ThemeProvider, useTheme } from "next-themes";
import { useEffect } from "react";
import { brand } from "@/lib/brand";

function ThemeKeyboardShortcut() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "d") return;

      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      setTheme(theme === "dark" ? "light" : "dark");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme]);

  return null;
}

export function AppThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      storageKey={`${brand.slug}-theme`}
      enableSystem={false}
      disableTransitionOnChange
    >
      <ThemeKeyboardShortcut />
      {children}
    </ThemeProvider>
  );
}
