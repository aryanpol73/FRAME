"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cldUrl } from "@/lib/cloudinary"
import PhotoReactions from "@/components/photos/PhotoReactions"
import type { Photo } from "@/lib/supabase/types"

export default function PhotoCard({
  photo,
  index = 0,
  aspect = "aspect-[4/3]",
  priority = false,
}: {
  photo: Photo
  index?: number
  aspect?: string
  priority?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }}
      transition={{
        duration: 0.6,
        delay: (index % 6) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative h-full w-full overflow-hidden border border-line/60 bg-surface/50 transition-all duration-300 hover:border-gold/60 hover:shadow-2xl"
    >
      <Link
        href={`/work/${photo.slug}`}
        data-cursor="photo"
        className={`relative block h-full w-full overflow-hidden ${aspect}`}
      >
        <img
          src={cldUrl(photo.cloudinary_url, { width: 1200, crop: "limit" })}
          alt={photo.title ?? "Photograph by Aryan Pol"}
          loading={priority ? "eager" : "lazy"}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base/90 via-base/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {photo.series && (
          <span className="pointer-events-none absolute left-4 top-4 rounded-full border border-cream/25 bg-base/70 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-cream opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100">
            {photo.series}
          </span>
        )}

        {photo.title && (
          <h3
            className="pointer-events-none absolute bottom-4 left-4 font-display text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ fontSize: 26, letterSpacing: "0.02em" }}
          >
            {photo.title}
          </h3>
        )}
      </Link>

      {/* Subtle Appreciate Action Button */}
      <div className="absolute bottom-3.5 right-3.5 z-20">
        <PhotoReactions photoId={photo.id} compact />
      </div>
    </motion.div>
  )
}
