import Reveal from "@/components/ui/Reveal"
import { cldUrl } from "@/lib/cloudinary"
import { INSTAGRAM } from "@/components/layout/nav"
import GuestbookSection from "@/components/guestbook/GuestbookSection"
import type { Photo, GuestbookEntry } from "@/lib/supabase/types"

const EMAIL = "aryan.pol737@gmail.com"

export default function AboutContent({
  favorites,
  guestbookEntries = [],
}: {
  favorites: Photo[]
  guestbookEntries?: GuestbookEntry[]
}) {
  return (
    <section className="pb-32">
      {/* Editorial Header */}
      <div className="overflow-hidden pt-16 md:pt-24">
        <h1
          className="whitespace-nowrap pl-6 font-display leading-[0.85] text-cream md:pl-12"
          style={{ fontSize: "clamp(72px, 18vw, 140px)" }}
        >
          <Reveal>About.</Reveal>
        </h1>
        <p className="mt-4 pl-6 text-[12px] uppercase tracking-[0.22em] text-gold md:pl-12">
          FRAME — a visual archive by Aryan Pol.
        </p>
      </div>

      {/* Main Grid: Story + 2 Portraits */}
      <div className="mt-16 grid gap-16 px-6 lg:grid-cols-12 md:px-12">
        {/* Story Section */}
        <div className="lg:col-span-5 max-w-xl space-y-7 text-[15px] leading-relaxed text-muted">
          <div>
            <h2 className="font-display text-3xl text-cream tracking-[0.06em]">
              Aryan Pol.
            </h2>
            <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">
              Photographer
            </p>
          </div>

          <p className="text-[16px] text-cream/90 leading-relaxed">
            I&apos;ve always been drawn to the moments that are easy to overlook — light
            falling through a street, a landscape disappearing into fog, an expression
            that lasts only a second.
          </p>

          <p>
            The fun is in finding something worth photographing wherever I happen to be.
          </p>

          <p>
            I like exploring, looking closer, and finding something that catches my eye.
          </p>

          <p className="text-cream">
            FRAME is my collection of those moments.
          </p>

          {/* Signature */}
          <div className="pt-8 border-t border-line">
            <p className="font-serif italic text-xl text-cream/95 tracking-wide">
              “LOOK. FIND. FRAME.”
            </p>
          </div>

          {/* Modern Tactile Buttons for Connect */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="rounded-full border border-white/10 bg-surface/80 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:text-gold hover:shadow-[0_0_15px_rgba(232,193,112,0.2)] active:scale-95"
            >
              Instagram ↗
            </a>
            <a
              href={`mailto:${EMAIL}`}
              data-cursor="link"
              className="rounded-full border border-white/10 bg-surface/80 px-5 py-2.5 text-[11px] uppercase tracking-[0.16em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold/50 hover:text-gold hover:shadow-[0_0_15px_rgba(232,193,112,0.2)] active:scale-95"
            >
              Contact ↗
            </a>
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted/80 pl-2">
              Visual Journal · Photography
            </span>
          </div>
        </div>

        {/* 2 Portraits Section */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Portrait 1: Fog / Mountain */}
          <div className="group relative overflow-hidden border border-line bg-surface shadow-2xl transition-transform duration-500 hover:-translate-y-1">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/aryan-fog.webp"
                alt="Aryan Pol — disappearing into fog"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-4 border-t border-line/60 bg-surface/90">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                01 / Mountain Mist
              </p>
              <p className="font-serif italic text-xs text-muted mt-0.5">
                “A landscape disappearing into fog”
              </p>
            </div>
          </div>

          {/* Portrait 2: Beach / Coastal Light */}
          <div className="group relative overflow-hidden border border-line bg-surface shadow-2xl transition-transform duration-500 hover:-translate-y-1 sm:mt-12">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src="/images/aryan-beach.webp"
                alt="Aryan Pol — coastal light"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="p-4 border-t border-line/60 bg-surface/90">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                02 / Coastal Light
              </p>
              <p className="font-serif italic text-xs text-muted mt-0.5">
                “Keeping a feeling alive”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Works from Archive */}
      {favorites.length > 0 && (
        <div className="mt-32 border-t border-line pt-20 px-6 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Recent from the archive
            </p>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold">
              FRAME Selected
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {favorites.map((p) => (
              <div key={p.id} className="aspect-square overflow-hidden border border-line bg-surface group">
                <img
                  src={cldUrl(p.cloudinary_url, { width: 600, height: 600, crop: "fill" })}
                  alt={p.title ?? "FRAME Archive"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guestbook Section */}
      <div className="px-6 md:px-12">
        <GuestbookSection entries={guestbookEntries} />
      </div>
    </section>
  )
}
