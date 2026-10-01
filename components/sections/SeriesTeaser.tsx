"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useRef } from "react"
import Reveal from "@/components/ui/Reveal"
import { cldUrl } from "@/lib/cloudinary"
import type { Series } from "@/lib/supabase/types"

export type SeriesWithCover = Series & { cover_url?: string | null }

export default function SeriesTeaser({ series }: { series: SeriesWithCover[] }) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section className="overflow-hidden border-t border-line py-28 md:py-40">
      <h2
        className="mb-16 px-6 font-display leading-[0.88] text-cream md:px-12"
        style={{ fontSize: "clamp(48px, 9vw, 80px)" }}
      >
        <Reveal>Shot in</Reveal>
        <Reveal delay={0.08}>Series.</Reveal>
      </h2>

      {series.length === 0 ? (
        <p className="px-6 text-sm text-muted md:px-12">Series coming soon.</p>
      ) : (
        <div ref={ref} className="cursor-grab overflow-hidden px-6 md:px-12">
          <motion.div
            drag="x"
            dragConstraints={{
              left: Math.min(0, -(series.length * 336 - 600)),
              right: 0,
            }}
            dragElastic={0.08}
            className="flex gap-4"
          >
            {series.map((s) => (
              <Link
                key={s.id}
                href={`/series/${s.slug}`}
                data-cursor="photo"
                draggable={false}
                className="group relative shrink-0 overflow-hidden border border-transparent transition-colors hover:border-gold"
                style={{ width: 320, height: 420 }}
              >
                {s.cover_url ? (
                  <img
                    src={cldUrl(s.cover_url, { width: 640, height: 840, crop: "fill" })}
                    alt={s.name}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="h-full w-full bg-surface" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-base/90 to-transparent" />
                <div className="absolute bottom-5 left-5">
                  <h3 className="font-display text-cream" style={{ fontSize: 28 }}>
                    {s.name}
                  </h3>
                  {s.description && (
                    <p className="mt-1 max-w-[240px] text-xs text-muted">
                      {s.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}
