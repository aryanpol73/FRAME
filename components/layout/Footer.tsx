import Link from "next/link"
import { INSTAGRAM, NAV_ITEMS } from "./nav"

export default function Footer() {
  return (
    <footer className="border-t border-line/80 bg-surface/30 px-6 py-14 md:px-12">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <Link
          href="/"
          data-cursor="link"
          className="group flex items-center gap-3 active:scale-95 transition-transform"
        >
          <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-line bg-surface transition-all duration-700 ease-out group-hover:rotate-90 group-hover:border-gold/50">
            <img
              src="/icons/icon-192.png"
              alt="FRAME"
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-display text-cream tracking-[0.22em] text-base group-hover:text-gold transition-colors">
            FRAME
          </span>
        </Link>

        {/* Tactile Capsule Navigation */}
        <nav className="flex items-center gap-1 rounded-full border border-white/[0.06] bg-surface/60 p-1 backdrop-blur-md">
          {NAV_ITEMS.map((item, idx) => (
            <div key={item.label} className="flex items-center">
              {idx > 0 && (
                <span className="px-1 text-[10px] text-white/15 select-none font-light">
                  /
                </span>
              )}
              <Link
                href={item.href}
                data-cursor="link"
                className="rounded-full px-3.5 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted transition-all duration-300 hover:bg-white/[0.08] hover:text-cream active:scale-90"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>

        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="group flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-surface/60 px-4 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold active:scale-95"
        >
          <span>aryan.on.cam</span>
          <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </a>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-line/50 pt-8 gap-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted/70">
          FRAME © 2026 — Aryan Pol
        </p>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold/70">
          Notice more. Keep what matters.
        </p>
      </div>
    </footer>
  )
}
