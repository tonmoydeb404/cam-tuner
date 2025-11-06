"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { ThemeAnimationType, useTheme } from "@/lib/next-themes";

const ThemeSwitcher = () => {
  const { ref, setTheme, resolvedTheme } = useTheme({
    animationType: ThemeAnimationType.QR_SCAN,
  });

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Button
      ref={ref}
      onClick={toggleTheme}
      size={"icon"}
      className="w-full aspect-square h-auto"
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon className="size-5!" />
      ) : (
        <SunIcon className="size-5!" />
      )}
    </Button>
  );
};

export default ThemeSwitcher;
