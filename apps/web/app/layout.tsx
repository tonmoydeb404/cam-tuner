import { Geist_Mono, Noto_Sans } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";

const notoSans = Noto_Sans({variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", notoSans.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
