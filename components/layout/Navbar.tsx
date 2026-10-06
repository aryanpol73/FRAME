"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { NAV_ITEMS, INSTAGRAM } from "./nav"
import SettingsSheet from "./SettingsSheet"

export { NAV_ITEMS, INSTAGRAM }

const ICONS: Record<string, React.ReactNode> = {
  FRAME: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="3.5" />
    </>
  ),
  WORK: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </>
  ),
  SERIES: (
    <>
      <rect x="6" y="7" width="15" height="13" rx="2.5" />
      <path d="M3 16V6a2.5 2.5 0 0 1 2.5-2.5H16" />
    </>
  ),
  ABOUT: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </>
  ),
}

export default function Navbar({ absolute = false }: { absolute?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)

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

  const rawIndex = NAV_ITEMS.findIndex((i) => isItemActive(i.href))
  const activeIndex = rawIndex === -1 ? 0 : rawIndex
  const hasActive = rawIndex !== -1

  return (
    <>
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
      <nav className="hidden items-center md:flex gap-1 rounded-full border border-white/[0.08] bg-surface/80 p-1 backdrop-blur-xl shadow-2xl shadow-black/60">
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

      {/* Header Right Action Cluster (Instagram + Settings) */}
      <div className="flex items-center gap-2">
        {/* Compact Instagram button for mobile */}
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 active:scale-90 active:text-gold sm:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
          </svg>
        </a>

        {/* Modern External Instagram Action on Desktop */}
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

        {/* Settings (Gear) Button for Mobile & Desktop */}
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Settings"
          data-cursor="link"
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-surface/70 text-muted backdrop-blur-md transition-all duration-300 hover:border-gold/40 hover:bg-surface hover:text-gold hover:shadow-[0_0_12px_rgba(232,193,112,0.15)] active:scale-90"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>

    {/* Settings Sheet / Modal */}
    <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />

    {/* Native Full-Width Mobile Bottom Tab Bar */}
    <nav
      aria-label="Primary"
      className="frame-bottom-bar fixed inset-x-0 bottom-0 left-0 right-0 z-50 w-full md:hidden"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 6px)" }}
    >
      <div className="relative mx-auto grid w-full max-w-md grid-cols-4 px-1.5 py-1">
        {/* Sliding gold indicator */}
        <span
          aria-hidden
          className="frame-dock-pill pointer-events-none absolute bottom-1 left-1.5 top-1"
          style={{
            width: "calc((100% - 12px) / 4)",
            transform: `translateX(${activeIndex * 100}%)`,
            opacity: hasActive ? 1 : 0,
          }}
        />
        {NAV_ITEMS.map((item, i) => {
          const active = hasActive && i === activeIndex
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(item.href, e)}
              aria-current={active ? "page" : undefined}
              className={`relative z-10 flex flex-col items-center justify-center gap-1 rounded-[20px] py-2 transition-all duration-300 active:scale-90 ${
                active ? "text-gold" : "text-muted"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-[22px] w-[22px] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  active ? "-translate-y-0.5 scale-110" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {ICONS[item.label]}
              </svg>
              <span className="text-[9.5px] font-medium uppercase tracking-[0.16em]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
    </>
  )
}
