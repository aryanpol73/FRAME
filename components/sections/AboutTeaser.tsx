import Link from "next/link"
import Reveal from "@/components/ui/Reveal"

export default function AboutTeaser() {
  return (
    <section className="grid gap-16 border-t border-line px-6 py-28 md:grid-cols-2 md:items-center md:px-12 md:py-40">
      <div>
        <p
          className="font-serif italic leading-snug text-cream"
          style={{ fontSize: "clamp(24px, 3.4vw, 32px)" }}
        >
          <Reveal>“I genuinely can&apos;t walk past</Reveal>
          <Reveal delay={0.08}>something beautiful without</Reveal>
          <Reveal delay={0.16}>wanting to freeze it.”</Reveal>
        </p>

        <p className="mt-8 max-w-md text-[15px] leading-relaxed text-muted">
          FRAME is where I keep the moments I couldn&apos;t let pass — nature,
          streets, light, chaos. All of it, collected from Pune and wherever
          else I happen to be looking.
        </p>

        <Link
          href="/about"
          data-cursor="link"
          className="mt-8 inline-block text-[12px] uppercase tracking-[0.15em] text-gold"
        >
          More about me →
        </Link>
      </div>

      <div className="group portrait-tilt flex aspect-[4/5] items-center justify-center border border-dashed border-line">
        <span className="text-[11px] uppercase tracking-[0.15em] text-muted">
          Portrait coming soon
        </span>
      </div>
    </section>
  )
}
