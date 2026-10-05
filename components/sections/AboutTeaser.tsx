import Link from "next/link"
import Reveal from "@/components/ui/Reveal"

export default function AboutTeaser() {
  return (
    <section className="grid gap-16 border-t border-line px-6 py-28 md:grid-cols-2 md:items-center md:px-12 md:py-40">
      <div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-gold mb-3">
          The Journal
        </p>
        <p
          className="font-serif italic leading-snug text-cream"
          style={{ fontSize: "clamp(24px, 3.4vw, 32px)" }}
        >
          <Reveal>“I don&apos;t follow a genre.</Reveal>
          <Reveal delay={0.08}>I follow whatever makes me stop.”</Reveal>
        </p>

        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted">
          FRAME is the photography journal of Aryan Pol. A collection of moments that are
          easy to overlook — light falling through a street, a landscape disappearing into
          fog, an expression that lasts only a second.
        </p>

        <Link
          href="/about"
          data-cursor="link"
          className="group mt-8 inline-flex items-center gap-2.5 rounded-full border border-gold/30 bg-gold/10 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold/60 hover:bg-gold/20 hover:text-gold hover:shadow-[0_0_20px_rgba(200,169,110,0.25)] active:scale-95"
        >
          <span>About Aryan Pol</span>
          <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      <div className="relative group portrait-tilt aspect-[3/4] max-w-md mx-auto w-full overflow-hidden border border-line bg-surface shadow-2xl">
        <img
          src="/images/aryan-fog.webp"
          alt="Aryan Pol — FRAME Photography Journal"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-base/90 via-base/30 to-transparent p-6">
          <p className="font-display text-cream tracking-[0.15em] text-sm">Aryan Pol</p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-gold">Notice more. Keep what matters.</p>
        </div>
      </div>
    </section>
  )
}
