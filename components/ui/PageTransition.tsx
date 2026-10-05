"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname} className="min-h-screen bg-base animate-fade-in">
      {children}
    </div>
  )
}
