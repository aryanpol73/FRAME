"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import Reveal from "@/components/ui/Reveal"
import { cldUrl } from "@/lib/cloudinary"
import PhotoReactions from "@/components/photos/PhotoReactions"
import type { Photo } from "@/lib/supabase/types"

export default function GallerySection({ photos }: { photos: Photo[] }) {
  const ref = useRef<HTMLDivElement>(null)

  // Show only 2-3 photos in one clean line, followed by the View More card
  const displayPhotos = photos.slice(0, 3)
  const totalCount = photos.length
  const totalItems = displayPhotos.length + 1 // including View More card

  return (
    <section id="work" className="overflow-hidden border-t border-line py-28 md:py-40">
      <div className="mb-16 flex items-end justify-between px-6 md:px-12">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-gold">
            The Work
          </p>
          <h2
            className="font-display leading-[0.88] text-cream"
            style={{ fontSize: "clamp(48px, 9vw, 80px)" }}
          >
            <Reveal>Selected</Reveal>
            <Reveal delay={0.08}>Photographs.</Reveal>
          </h2>
        </div>

        {/* View More / All Work button in header */}
        <Link
          href="/work"
          data-cursor="link"
          className="group hidden items-center gap-2 rounded-full border border-gold/30 bg-surface/70 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-muted backdrop-blur-md transition-all duration-300 hover:border-gold hover:text-gold active:scale-95 sm:inline-flex"
        >
          <span>All Work ({totalCount})</span>
          <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {photos.length === 0 ? (
        <p className="px-6 text-sm text-muted md:px-12">Photos coming soon.</p>
      ) : (
        <div ref={ref} className="cursor-grab overflow-hidden px-6 md:px-12">
          <motion.div
            drag="x"
            dragConstraints={{
              left: Math.min(0, -(totalItems * 336 - 600)),
              right: 0,
            }}
            dragElastic={0.08}
            className="flex gap-4"
          >
            {displayPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative shrink-0 overflow-hidden border border-line/60 bg-surface/50 transition-all duration-300 hover:border-gold hover:shadow-2xl"
                style={{ width: 320, height: 420 }}
              >
                <Link
                  href={`/work/${photo.slug}`}
                  data-cursor="photo"
                  draggable={false}
                  className="relative block h-full w-full overflow-hidden"
                >
                  <img
                    src={cldUrl(photo.cloudinary_url, {
                      width: 640,
                      height: 840,
                      crop: "fill",
                    })}
                    alt={photo.title ?? "Photograph by Aryan Pol"}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                  {photo.series && (
                    <span className="absolute left-4 top-4 rounded-full border border-cream/20 bg-base/70 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cream backdrop-blur-md">
                      {photo.series}
                    </span>
                  )}

                  <div className="absolute bottom-5 left-5 right-16">
                    {photo.title && (
                      <h3
                        className="font-display text-cream"
                        style={{ fontSize: 28, letterSpacing: "0.02em" }}
                      >
                        {photo.title}
                      </h3>
                    )}
                    {photo.caption && (
                      <p className="mt-1 line-clamp-1 text-xs text-muted">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </Link>

                {/* Subtle reaction button */}
                <div className="absolute bottom-4 right-4 z-20">
                  <PhotoReactions photoId={photo.id} compact />
                </div>
              </div>
            ))}

            {/* View More Card in the line — takes user to /work */}
            <Link
              href="/work"
              data-cursor="link"
              draggable={false}
              className="group relative flex shrink-0 flex-col justify-between overflow-hidden border border-gold/30 bg-surface/80 p-8 backdrop-blur-md transition-all duration-500 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_30px_rgba(232,193,112,0.2)] active:scale-95"
              style={{ width: 320, height: 420 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
                  The Archive
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/15 text-gold transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-base">
                  →
                </span>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted">
                  Curated Collection
                </p>
                <h3
                  className="mt-2 font-display text-cream transition-colors group-hover:text-gold"
                  style={{ fontSize: 36, lineHeight: 0.95 }}
                >
                  View More Work
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  Explore all {totalCount} photographs in the full editorial archive.
                </p>

                <div className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-gold">
                  <span>Enter Archive</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      )}

      {/* Mobile-friendly bottom "View More Work" CTA */}
      <div className="mt-6 px-6 sm:hidden">
        <Link
          href="/work"
          data-cursor="link"
          className="group flex w-full items-center justify-between rounded-2xl border border-gold/35 bg-surface/80 p-4.5 backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/10 active:scale-[0.98]"
        >
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
              View More
            </span>
            <span className="font-display text-base tracking-[0.03em] text-cream">
              Explore All Work ({totalCount})
            </span>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/40 bg-gold/15 text-gold transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-gold group-hover:text-base">
            →
          </div>
        </Link>
      </div>
    </section>
  )
}
