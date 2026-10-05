import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import AboutContent from "@/components/sections/AboutContent"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60
export const metadata = {
  title: "About — FRAME",
  description: "FRAME is the photography journal of Aryan Pol.",
}

export default async function AboutPage() {
  const supabase = await createClient()

  const [{ data: photos }, { data: guestbook }] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("guestbook_entries")
      .select("*")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(30),
  ])

  return (
    <main>
      <Navbar />
      <AboutContent
        favorites={photos ?? []}
        guestbookEntries={guestbook ?? []}
      />
      <Footer />
    </main>
  )
}
