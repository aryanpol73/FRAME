import MasonryGrid from "@/components/photos/MasonryGrid"
import Reveal from "@/components/ui/Reveal"
import type { Photo } from "@/lib/supabase/types"

export default function GallerySection({ photos }: { photos: Photo[] }) {
  return (
    <section id="work" className="px-6 py-28 md:px-12 md:py-40">
      <p className="mb-6 text-[11px] uppercase tracking-[0.2em] text-gold">
        The Work
      </p>
      <h2
        className="mb-16 font-display leading-[0.88] text-cream"
        style={{ fontSize: "clamp(48px, 9vw, 80px)" }}
      >
        <Reveal>Selected</Reveal>
        <Reveal delay={0.08}>Photographs.</Reveal>
      </h2>

      <MasonryGrid photos={photos} />
    </section>
  )
}
