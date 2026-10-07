import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import MasonryGrid from "@/components/photos/MasonryGrid"
import Reveal from "@/components/ui/Reveal"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60
export const metadata = {
  title: "Work — FRAME",
  description: "Selected photographs and moments captured by Aryan Pol.",
}

export default async function WorkPage() {
  const supabase = await createClient()

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const list = photos ?? []

  return (
    <main>
      <Navbar />
      <section className="px-6 pb-28 pt-12 md:px-12">
        <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-gold">
          The Archive
        </p>

        <div className="mb-14 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h1
            className="font-display leading-[0.88] text-cream"
            style={{ fontSize: "clamp(56px, 11vw, 100px)" }}
          >
            <Reveal>The Work.</Reveal>
          </h1>
          <p className="text-[12px] uppercase tracking-[0.16em] text-muted">
            {list.length} {list.length === 1 ? "Photograph" : "Photographs"}
          </p>
        </div>

        <MasonryGrid photos={list} />
      </section>
      <Footer />
    </main>
  )
}
