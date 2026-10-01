import { notFound } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import MasonryGrid from "@/components/photos/MasonryGrid"
import Reveal from "@/components/ui/Reveal"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

export default async function SeriesDetail({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const supabase = await createClient()

  const { data: series } = await supabase
    .from("series")
    .select("*")
    .eq("slug", name)
    .single()

  if (!series) notFound()

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("published", true)
    .eq("series", series.name)
    .order("created_at", { ascending: false })

  return (
    <main>
      <Navbar />
      <section className="px-6 pb-28 pt-12 md:px-12">
        <p className="mb-6 text-[11px] uppercase tracking-[0.2em] text-gold">
          Series
        </p>
        <h1
          className="font-display leading-[0.88] text-cream"
          style={{ fontSize: "clamp(56px, 11vw, 100px)" }}
        >
          <Reveal>{series.name}.</Reveal>
        </h1>
        {series.description && (
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
            {series.description}
          </p>
        )}

        <div className="mt-16">
          <MasonryGrid photos={photos ?? []} />
        </div>
      </section>
      <Footer />
    </main>
  )
}
