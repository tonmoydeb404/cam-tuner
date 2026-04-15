import type { Metadata } from "next"
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google"

import { SchemaMarkup } from "@/components/schema-markup"
import { ThemeProvider } from "@/components/theme-provider"
import { brand } from "@/data/brand"
import "@workspace/ui/globals.css"
import { cn } from "@workspace/ui/lib/utils"

const nunitoSansHeading = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})
const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const metadata: Metadata = {
  title: brand.title,
  description: brand.description.full,
  keywords: [...brand.keywords],
  authors: [{ name: brand.author }],
  creator: brand.author,
  metadataBase: new URL(brand.baseUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: brand.baseUrl,
    siteName: brand.name,
    title: brand.title,
    description: brand.description.short,
    images: [
      {
        url: brand.ogImage.url,
        width: brand.ogImage.width,
        height: brand.ogImage.height,
        alt: brand.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: brand.title,
    description: brand.description.short,
    images: [brand.ogImage.url],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: brand.baseUrl,
  },
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        nunitoSansHeading.variable
      )}
      data-scroll-behavior="smooth"
    >
      <head>
        <SchemaMarkup />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
