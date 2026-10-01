"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cldUrl } from "@/lib/cloudinary"
import type { Photo } from "@/lib/supabase/types"

export default function PhotoHero({ photo }: { photo: Photo }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  return (
    // 100vh of hero plus 200px of travel: the image sticks, then releases.
    <div ref={ref} className="relative h-[calc(100vh+200px)]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.img
          src={cldUrl(photo.cloudinary_url, { width: 2400, crop: "limit" })}
          alt={photo.title ?? "Photograph"}
          style={{ opacity, scale }}
          className="h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-base via-base/20 to-transparent" />

        <div className="absolute bottom-16 left-6 md:left-12">
          {photo.series && (
            <span className="mb-4 inline-block border border-cream/25 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-cream">
              {photo.series}
            </span>
          )}
          <h1
            className="font-display leading-[0.9] text-cream"
            style={{ fontSize: "clamp(40px, 8vw, 64px)", letterSpacing: "0.01em" }}
          >
            {photo.title ?? "Untitled"}
          </h1>
        </div>
      </div>
    </div>
  )
}
