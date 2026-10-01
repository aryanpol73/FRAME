import HeroSection from "@/components/sections/HeroSection"
import Marquee from "@/components/ui/Marquee"
import GallerySection from "@/components/sections/GallerySection"
import AboutTeaser from "@/components/sections/AboutTeaser"
import SeriesTeaser, { type SeriesWithCover } from "@/components/sections/SeriesTeaser"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { createClient } from "@/lib/supabase/server"

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [{ data: photos }, { data: seriesRows }] = await Promise.all([
    supabase
      .from("photos")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    supabase.from("series").select("*").order("created_at", { ascending: true }),
  ])

  const list = photos ?? []
  const series: SeriesWithCover[] = (seriesRows ?? []).map((s) => ({
    ...s,
    cover_url:
      list.find((p) => p.id === s.cover_photo_id)?.cloudinary_url ??
      list.find((p) => p.series === s.name)?.cloudinary_url ??
      null,
  }))

  return (
    <main>
      <Navbar absolute />
      <HeroSection photo={list[0] ?? null} />
      <Marquee />
      <GallerySection photos={list} />
      <AboutTeaser />
      <SeriesTeaser series={series} />
      <Footer />
    </main>
  )
}
