"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect } from "react";

// ----------------------------------------------------------------------

const isBrowser = typeof window !== "undefined";

const injectBaseStyles = () => {
  if (isBrowser) {
    const styleId = "theme-switch-base-style";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      const isHighResolution =
        window.innerWidth >= 3000 || window.innerHeight >= 2000;

      style.textContent = `
        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation: none;
          mix-blend-mode: normal;
          ${isHighResolution ? "transform: translateZ(0);" : ""}
        }
        
        ${
          isHighResolution
            ? `
        ::view-transition-group(root),
        ::view-transition-image-pair(root),
        ::view-transition-old(root),
        ::view-transition-new(root) {
          backface-visibility: hidden;
          perspective: 1000px;
          transform: translate3d(0, 0, 0);
        }
        `
            : ""
        }
      `;
      document.head.appendChild(style);
    }
  }
};

// ----------------------------------------------------------------------

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    injectBaseStyles();
  }, []);

  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
