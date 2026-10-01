import Link from "next/link"

export const NAV = [
  { label: "Work", href: "/#work" },
  { label: "Series", href: "/series" },
  { label: "About", href: "/about" },
]

export const INSTAGRAM = "https://instagram.com/aryan.on.cam"

export default function Navbar({ absolute = false }: { absolute?: boolean }) {
  return (
    <header
      className={`${
        absolute ? "absolute" : "relative"
      } left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-7 md:px-12`}
    >
      <Link
        href="/"
        data-cursor="link"
        className="font-display text-cream"
        style={{ fontSize: 18, letterSpacing: "0.2em" }}
      >
        FRAME
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
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
    </header>
  )
}
