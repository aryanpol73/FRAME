import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google"
import CustomCursor from "@/components/ui/CustomCursor"
import PageTransition from "@/components/ui/PageTransition"
import "./globals.css"

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "FRAME — Aryan Pol",
  description: "Moments worth keeping. Photography by Aryan Pol, Pune, India.",
  openGraph: {
    title: "FRAME — Aryan Pol",
    description: "Moments worth keeping.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="bg-base text-cream">
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
