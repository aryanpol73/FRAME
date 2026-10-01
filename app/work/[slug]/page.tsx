import Link from "next/link"
import { notFound } from "next/navigation"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import PhotoHero from "@/components/photos/PhotoHero"
import ExifPills from "@/components/photos/ExifPills"
import { createClient } from "@/lib/supabase/server"
import { cldUrl } from "@/lib/cloudinary"

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("photos")
    .select("title, caption")
    .eq("slug", slug)
    .single()

  return {
    title: data?.title ? `${data.title} — FRAME` : "FRAME",
    description: data?.caption ?? "Moments worth keeping.",
  }
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: all } = await supabase
    .from("photos")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  const photos = all ?? []
  const index = photos.findIndex((p) => p.slug === slug)
  if (index === -1) notFound()

  const photo = photos[index]
  const prev = photos[index - 1] ?? photos[photos.length - 1]
  const next = photos[index + 1] ?? photos[0]

  return (
    <main>
      <Navbar absolute />
      <PhotoHero photo={photo} />

      <section className="mx-auto max-w-2xl px-6 py-24">
        {photo.caption && (
          <p
            className="font-serif italic text-cream"
            style={{ fontSize: 20, lineHeight: 1.9 }}
          >
            {photo.caption}
          </p>
        )}

        <div className="mt-12">
          <ExifPills location={photo.exif_location} shotAt={photo.exif_shot_at} />
        </div>
      </section>

      {photos.length > 1 && (
        <nav className="grid gap-4 border-t border-line px-6 py-16 md:grid-cols-2 md:px-12">
          {[
            { p: prev, label: "Previous", align: "" },
            { p: next, label: "Next", align: "md:justify-self-end md:flex-row-reverse" },
          ].map(({ p, label, align }) => (
            <Link
              key={label}
              href={`/work/${p.slug}`}
              data-cursor="photo"
              className={`group flex items-center gap-5 ${align}`}
            >
              <div className="h-20 w-28 shrink-0 overflow-hidden">
                <img
                  src={cldUrl(p.cloudinary_url, { width: 280, height: 200, crop: "fill" })}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
                  {label}
                </p>
                <p className="font-display text-cream" style={{ fontSize: 24 }}>
                  {p.title ?? "Untitled"}
                </p>
              </div>
            </Link>
          ))}
        </nav>
      )}

      <Footer />
    </main>
  )
}
