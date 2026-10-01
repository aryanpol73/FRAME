import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import Reveal from "@/components/ui/Reveal"
import { createClient } from "@/lib/supabase/server"
import { cldUrl } from "@/lib/cloudinary"

export const revalidate = 60
export const metadata = { title: "Series — FRAME" }

export default async function SeriesIndex() {
  const supabase = await createClient()

  const [{ data: series }, { data: photos }] = await Promise.all([
    supabase.from("series").select("*").order("created_at"),
    supabase.from("photos").select("*").eq("published", true),
  ])

  const list = series ?? []
  const pics = photos ?? []

  return (
    <main>
      <Navbar />
      <section className="px-6 pb-28 pt-12 md:px-12">
        <h1
          className="mb-16 font-display leading-[0.88] text-cream"
          style={{ fontSize: "clamp(56px, 11vw, 100px)" }}
        >
          <Reveal>Series.</Reveal>
        </h1>

        {list.length === 0 ? (
          <p className="text-sm text-muted">Series coming soon.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => {
              const count = pics.filter((p) => p.series === s.name).length
              const cover =
                pics.find((p) => p.id === s.cover_photo_id) ??
                pics.find((p) => p.series === s.name)

              return (
                <Link
                  key={s.id}
                  href={`/series/${s.slug}`}
                  data-cursor="photo"
                  className="group relative aspect-[4/5] overflow-hidden border border-transparent transition-colors hover:border-gold"
                >
                  {cover ? (
                    <img
                      src={cldUrl(cover.cloudinary_url, { width: 800, crop: "limit" })}
                      alt={s.name}
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="h-full w-full bg-surface" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-base/90 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <h2 className="font-display text-cream" style={{ fontSize: 32 }}>
                      {s.name}
                    </h2>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
                      {count} {count === 1 ? "photograph" : "photographs"}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
