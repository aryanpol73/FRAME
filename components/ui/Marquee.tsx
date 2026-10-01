const UNIT = "FRAME  ·  aryan.on.cam  ·  PHOTOGRAPHY  ·  PUNE  ·  "

export default function Marquee() {
  const strip = UNIT.repeat(8)
  return (
    <div className="h-12 overflow-hidden border-y border-line bg-surface">
      <div className="marquee-track flex h-12 w-max items-center whitespace-nowrap">
        {[0, 1].map((i) => (
          <span
            key={i}
            aria-hidden={i === 1}
            className="font-display text-marquee"
            style={{ fontSize: 20, letterSpacing: "0.08em" }}
          >
            {strip}
          </span>
        ))}
      </div>
    </div>
  )
}
