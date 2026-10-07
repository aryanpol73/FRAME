"use client"

import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { cldUrl } from "@/lib/cloudinary"
import type { Photo } from "@/lib/supabase/types"

const WORDS = ["PLACES.", "NATURE.", "LIGHT.", "EVERYTHING."]
const STATS = ["PHOTOGRAPHS BY ARYAN POL", "COLLECTING THE SECONDS", "FRAME"]

export default function HeroSection({
  photos = [],
  photo = null,
}: {
  photos?: Photo[]
  photo?: Photo | null
}) {
  const allPhotos = photos.length > 0 ? photos : photo ? [photo] : []
  const [photoIndex, setPhotoIndex] = useState(0)
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (allPhotos.length <= 1) return
    const id = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % allPhotos.length)
    }, 5000)
    return () => clearInterval(id)
  }, [allPhotos.length])

  const currentPhoto = allPhotos[photoIndex] ?? null

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 bg-surface">
        <AnimatePresence>
          {currentPhoto && (
            <motion.img
              key={currentPhoto.id}
              src={cldUrl(currentPhoto.cloudinary_url, { width: 2400, crop: "limit" })}
              alt=""
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(13,11,10,0.85), transparent)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-base/80 to-transparent" />

      <div className="absolute bottom-28 left-6 md:left-12">
        <p
          className="mb-3 font-display text-gold/70"
          style={{ fontSize: 14, letterSpacing: "0.2em" }}
        >
          ARYAN POL
        </p>

        <div className="h-[0.95em] overflow-hidden" style={{ fontSize: "clamp(56px, 13vw, 120px)" }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={WORDS[i]}
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-display leading-[0.95] text-cream"
              style={{ fontSize: "inherit", letterSpacing: "0.01em" }}
            >
              {WORDS[i]}
            </motion.h1>
          </AnimatePresence>
        </div>

        <p className="mt-6 max-w-[360px] text-[15px] leading-relaxed text-muted">
          Collecting the seconds before they disappear.
        </p>

        <Link
          href="#work"
          data-cursor="link"
          className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:text-gold hover:shadow-[0_0_20px_rgba(200,169,110,0.25)] active:scale-95"
        >
          <span>View Work</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="text-gold"
          >
            ↓
          </motion.span>
        </Link>
      </div>

      <div className="absolute bottom-8 left-6 right-6 flex items-center gap-4 md:left-12 md:right-12">
        {STATS.map((s, idx) => (
          <div key={s} className="flex items-center gap-4">
            {idx > 0 && <span className="h-[1px] w-8 bg-line md:w-16" />}
            <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
              {s}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
