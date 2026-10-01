import Link from "next/link"
import { NAV, INSTAGRAM } from "./Navbar"

export default function Footer() {
  return (
    <footer className="border-t border-line px-6 py-12 md:px-12">
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
        <Link
          href="/"
          data-cursor="link"
          className="font-display text-cream"
          style={{ fontSize: 18, letterSpacing: "0.2em" }}
        >
          FRAME
        </Link>

        <nav className="flex gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-cursor="link"
              className="nav-link text-muted transition-colors hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="link"
          className="nav-link text-muted transition-colors hover:text-gold"
        >
          aryan.on.cam ↗
        </a>
      </div>

      <p className="mt-10 text-center text-[11px] uppercase tracking-[0.15em] text-muted">
        © 2024 Aryan Pol · FRAME · Moments worth keeping.
      </p>
    </footer>
  )
}
