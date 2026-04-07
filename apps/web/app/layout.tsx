import { Geist_Mono, Noto_Sans, Nunito_Sans, Geist } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "@workspace/ui/globals.css";
import { cn } from "@workspace/ui/lib/utils";

const geistHeading = Geist({subsets:['latin'],variable:'--font-heading'});

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'})

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
      className={cn("antialiased", fontMono.variable, "font-sans", nunitoSans.variable, geistHeading.variable)}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
