import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { Bebas_Neue, Inter, Playfair_Display } from "next/font/google"
import CustomCursor from "@/components/ui/CustomCursor"
import PageTransition from "@/components/ui/PageTransition"
import PWARegister from "@/components/ui/PWARegister"
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

export const viewport: Viewport = {
  themeColor: "#0d0b0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "FRAME — Aryan Pol",
    template: "%s — Aryan Pol",
  },
  description: "FRAME is the photography journal of Aryan Pol.",
  applicationName: "FRAME",
  authors: [{ name: "Aryan Pol" }],
  creator: "Aryan Pol",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FRAME",
  },
  openGraph: {
    title: "FRAME — Aryan Pol",
    description: "FRAME is the photography journal of Aryan Pol.",
    type: "website",
    siteName: "FRAME",
    images: [
      {
        url: "/images/frame-logo.png",
        width: 1024,
        height: 1024,
        alt: "FRAME — Aryan Pol",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-base text-cream">
        <PWARegister />
        <CustomCursor />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
