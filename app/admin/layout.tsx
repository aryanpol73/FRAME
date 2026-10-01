import Link from "next/link"
import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "./actions"

export const metadata = { title: "FRAME Admin" }

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  // The proxy already redirects unauthenticated users to /admin/login.
  // When there's no user here, the child IS the login page — render it bare.
  if (!data.user) {
    return <div className="min-h-screen bg-base">{children}</div>
  }

  return (
    <div className="min-h-screen bg-base">
      <header className="flex items-center justify-between border-b border-line px-6 py-5 md:px-10">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-display text-cream" style={{ fontSize: 18, letterSpacing: "0.2em" }}>
            FRAME
          </Link>
          <Link href="/admin" className="nav-link text-muted hover:text-cream">
            Dashboard
          </Link>
          <Link href="/admin/upload" className="nav-link text-muted hover:text-cream">
            Upload
          </Link>
        </div>

        <form action={signOut}>
          <button className="nav-link text-muted hover:text-sienna">Sign out</button>
        </form>
      </header>

      <div className="px-6 py-10 md:px-10">{children}</div>
    </div>
  )
}
