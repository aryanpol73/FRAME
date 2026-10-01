import Reveal from "@/components/ui/Reveal"
import { cldUrl } from "@/lib/cloudinary"
import { INSTAGRAM } from "@/components/layout/Navbar"
import type { Photo } from "@/lib/supabase/types"

const EMAIL = "aryan.pol737@gmail.com"

export default function AboutContent({ favorites }: { favorites: Photo[] }) {
  return (
    <section className="pb-28">
      <div className="overflow-hidden pt-16 md:pt-24">
        <h1
          className="whitespace-nowrap pl-6 font-display leading-[0.85] text-cream md:pl-12"
          style={{ fontSize: "clamp(72px, 18vw, 140px)" }}
        >
          <Reveal>About.</Reveal>
        </h1>
      </div>

      <div className="mt-16 grid gap-16 px-6 md:grid-cols-2 md:px-12">
        <div className="max-w-lg space-y-6 text-[15px] leading-relaxed text-muted">
          <p className="text-cream">
            Aryan Pol. I notice things. I collect moments and turn them into
            memories worth keeping.
          </p>
          <p>
            Not because I have to — because I genuinely can&apos;t walk past
            something beautiful without wanting to freeze it. Nature, streets,
            light, chaos — all of it.
          </p>
          <p>FRAME is my collection of those moments.</p>

          <div className="flex flex-wrap gap-3 pt-4">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="rounded-full border border-line px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              Instagram ↗
            </a>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor="link"
              className="rounded-full border border-line px-5 py-2.5 text-[11px] uppercase tracking-[0.15em] text-cream transition-colors hover:border-gold hover:text-gold"
            >
              Contact ↗
            </a>
          </div>

          <p className="pt-6 text-[11px] uppercase tracking-[0.15em] text-muted">
            Pune, India
          </p>
        </div>

        <div className="portrait-tilt flex aspect-[4/5] items-center justify-center border border-dashed border-line">
          <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
            Portrait coming soon
          </span>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="mt-28 grid grid-cols-2 gap-4 px-6 md:grid-cols-4 md:px-12">
          {favorites.map((p) => (
            <div key={p.id} className="aspect-square overflow-hidden">
              <img
                src={cldUrl(p.cloudinary_url, { width: 600, height: 600, crop: "fill" })}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
