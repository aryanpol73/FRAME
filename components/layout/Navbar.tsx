"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NAV_ITEMS, INSTAGRAM } from "./nav"

export { NAV_ITEMS, INSTAGRAM }

export default function Navbar({ absolute = false }: { absolute?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      if (pathname === "/") {
        const workEl = document.getElementById("work")
        if (workEl) {
          const rect = workEl.getBoundingClientRect()
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection("work")
          } else if (window.scrollY < 200) {
            setActiveSection("frame")
          }
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [pathname])

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    if (href === "/#work" && pathname === "/") {
      e.preventDefault()
      const el = document.getElementById("work")
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    } else if (href === "/" && pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const isItemActive = (href: string) => {
    if (href === "/#work") {
      return pathname === "/" && activeSection === "work"
    }
    if (href === "/") {
      return pathname === "/" && activeSection !== "work"
    }
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`${
        absolute ? "absolute" : "sticky"
      } left-0 top-0 z-50 flex w-full items-center justify-between px-5 py-4 transition-all duration-500 md:px-10 ${
        scrolled ? "bg-base/85 backdrop-blur-xl border-b border-line/80 py-3.5 shadow-2xl shadow-black/50" : "bg-gradient-to-b from-base/60 via-base/20 to-transparent"
      }`}
    >
      {/* Brand Logo Button */}
      <Link
        href="/"
        data-cursor="link"
        onClick={(e) => handleNavClick("/", e)}
        className="group flex items-center gap-3 rounded-full py-1 pr-3 active:scale-95 transition-transform duration-200"
      >
        <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-line bg-surface shadow-md transition-all duration-700 ease-out group-hover:rotate-90 group-hover:border-gold/50 group-hover:shadow-[0_0_15px_rgba(232,193,112,0.25)]">
          <img
            src="/icons/icon-192.png"
            alt="FRAME"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </span>
        <span
          className="font-display text-cream tracking-[0.22em] text-lg transition-colors group-hover:text-gold"
        >
          FRAME
        </span>
      </Link>

      {/* Floating Modern Pill Dock for FRAME / WORK / SERIES / ABOUT */}
      <nav className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-surface/80 p-1 backdrop-blur-xl shadow-2xl shadow-black/60">
        {NAV_ITEMS.map((item, index) => {
          const active = isItemActive(item.href)
          return (
            <div key={item.label} className="flex items-center">
              {index > 0 && (
                <span className="px-1 text-[10px] text-white/15 select-none font-light">
                  /
                </span>
              )}
              <Link
                href={item.href}
                data-cursor="link"
                onClick={(e) => handleNavClick(item.href, e)}
                className={`relative flex items-center rounded-full px-3.5 py-1.5 text-[10.5px] uppercase tracking-[0.18em] font-medium transition-all duration-300 ease-out active:scale-90 ${
                  active
                    ? "bg-white/[0.12] text-gold font-semibold shadow-[0_0_14px_rgba(232,193,112,0.2)] border border-gold/30"
                    : "text-muted hover:bg-white/[0.06] hover:text-cream hover:scale-105"
                }`}
              >
                {active && (
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_#e8c170] animate-pulse" />
                )}
                {item.label}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* Modern External Instagram Action */}
      <a
        href={INSTAGRAM}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="link"
        className="group hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-surface/60 px-4 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted backdrop-blur-md transition-all duration-300 hover:border-gold/40 hover:bg-surface hover:text-gold hover:shadow-[0_0_12px_rgba(232,193,112,0.15)] active:scale-95 sm:inline-flex"
      >
        <span>aryan.on.cam</span>
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </a>
    </header>
  )
}
