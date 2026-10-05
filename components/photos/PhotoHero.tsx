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
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  return (
    // 100vh of hero plus 160px of travel: the image sticks, then releases.
    <div ref={ref} className="relative min-h-[calc(100vh+160px)] w-full">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-base flex flex-col justify-between">
        {/* Ambient atmospheric backdrop matching photo tones */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src={cldUrl(photo.cloudinary_url, { width: 800, crop: "fill", quality: 20 })}
            alt=""
            aria-hidden
            className="h-full w-full object-cover blur-3xl opacity-20 scale-125"
          />
          <div className="absolute inset-0 bg-base/60 backdrop-blur-xl" />
        </div>

        {/* Main Presentation Stage: Full photograph in its native composition */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-4 pt-20 pb-28 md:px-12 md:pt-24 md:pb-36 max-h-[84vh] w-full">
          <motion.img
            src={cldUrl(photo.cloudinary_url, { width: 2400, crop: "limit" })}
            alt={photo.title ?? "Photograph"}
            style={{ opacity, scale }}
            className="max-h-full max-w-full w-auto h-auto object-contain rounded-sm shadow-[0_25px_70px_rgba(0,0,0,0.85)] border border-white/[0.04]"
          />
        </div>

        {/* Scrim & Editorial Title Overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-base via-base/80 to-transparent p-6 pt-16 md:p-12">
          <div className="pointer-events-auto">
            {photo.series && (
              <span className="mb-3 inline-flex items-center rounded-full border border-gold/40 bg-gold/15 px-3.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-gold backdrop-blur-md">
                {photo.series}
              </span>
            )}
            <h1
              className="font-display leading-[0.9] text-cream"
              style={{ fontSize: "clamp(34px, 6vw, 60px)", letterSpacing: "0.01em" }}
            >
              {photo.title ?? "Untitled"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}
