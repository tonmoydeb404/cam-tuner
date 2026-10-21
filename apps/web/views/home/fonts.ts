import { Bricolage_Grotesque } from "next/font/google"

// Headlines on the home page only. Body copy keeps the app-wide Geist.
export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
})

export const displayClass = "font-(family-name:--font-display)"
