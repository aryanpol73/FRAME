import Link from "next/link"
import type { ReactNode } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "./actions"

export const metadata = { title: "FRAME Admin" }

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "aryan.pol737@gmail.com"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // When there's no authenticated user, the child IS the login page — render it bare.
  if (!user) {
    return <div className="min-h-screen bg-base">{children}</div>
  }

  // If authenticated user is not the designated admin, block admin shell
  if (user.email !== ADMIN_EMAIL) {
    redirect("/admin/login?error=unauthorized")
  }

  return (
    <div className="min-h-screen bg-base text-cream">
      {/* Modern Admin Topbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-line/80 bg-base/85 px-4 py-3 backdrop-blur-xl md:px-12 md:py-4 shadow-xl shadow-black/40">
        <div className="flex items-center gap-2.5 sm:gap-6">
          <Link
            href="/"
            data-cursor="link"
            className="group flex items-center gap-2 active:scale-95 transition-transform"
          >
            <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-line bg-surface transition-all duration-700 ease-out group-hover:rotate-90 group-hover:border-gold/50">
              <img
                src="/icons/icon-192.png"
                alt="FRAME"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="font-display text-cream tracking-[0.22em] text-base group-hover:text-gold transition-colors hidden sm:inline">
              FRAME
            </span>
          </Link>

          {/* Admin Navigation Capsule */}
          <nav className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-white/[0.08] bg-surface/80 p-1 backdrop-blur-xl shadow-lg">
            <Link
              href="/admin"
              data-cursor="link"
              className="rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] font-medium text-muted transition-all duration-300 hover:bg-white/[0.08] hover:text-cream active:scale-90"
            >
              Dashboard
            </Link>
            <span className="text-[10px] text-white/15 select-none">/</span>
            <Link
              href="/admin/upload"
              data-cursor="link"
              className="rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] font-medium text-muted transition-all duration-300 hover:bg-white/[0.08] hover:text-cream active:scale-90"
            >
              Upload
            </Link>
            <span className="text-[10px] text-white/15 select-none">/</span>
            <Link
              href="/admin/security"
              data-cursor="link"
              className="rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] font-medium text-muted transition-all duration-300 hover:bg-white/[0.08] hover:text-cream active:scale-90"
            >
              Security
            </Link>
          </nav>
        </div>

        <form action={signOut}>
          <button
            type="submit"
            data-cursor="link"
            className="rounded-full border border-white/[0.08] bg-surface/60 px-3 sm:px-4 py-1 sm:py-1.5 text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.16em] text-muted backdrop-blur-md transition-all duration-300 hover:border-sienna/50 hover:bg-sienna/10 hover:text-sienna active:scale-95"
          >
            Sign out
          </button>
        </form>
      </header>

      <div className="px-4 py-8 md:px-12 md:py-10">{children}</div>
    </div>
  )
}
