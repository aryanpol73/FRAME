import PhotoCard from "./PhotoCard"
import type { Photo } from "@/lib/supabase/types"

function CameraEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 border border-line py-32 text-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#9A9088"
        strokeWidth="1"
        aria-hidden
      >
        <path d="M3 8a2 2 0 0 1 2-2h2.5l1.2-2h6.6l1.2 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
        <circle cx="12" cy="12.5" r="3.5" />
      </svg>
      <p className="text-sm text-muted">Photos coming soon.</p>
    </div>
  )
}

// A: 2 photos, B: 3 photos, C: 1 photo — then repeat.
const PATTERN = [2, 3, 1] as const

function chunk(photos: Photo[]) {
  const rows: { kind: 0 | 1 | 2; items: Photo[] }[] = []
  let i = 0
  let p = 0
  while (i < photos.length) {
    const kind = (p % 3) as 0 | 1 | 2
    const take = PATTERN[kind]
    rows.push({ kind, items: photos.slice(i, i + take) })
    i += take
    p += 1
  }
  return rows
}

export default function MasonryGrid({ photos }: { photos: Photo[] }) {
  if (!photos.length) return <CameraEmpty />

  const rows = chunk(photos)
  let counter = 0

  return (
    <div className="flex flex-col gap-4">
      {rows.map((row, r) => {
        if (row.kind === 0) {
          const [left, right] = row.items
          return (
            <div
              key={r}
              className="flex flex-col gap-4 md:flex-row md:items-start"
            >
              <div className="md:w-[60%]">
                <PhotoCard
                  photo={left}
                  index={counter++}
                  aspect="aspect-[4/5]"
                  priority={r === 0}
                />
              </div>
              {right && (
                <div className="md:w-[38%] md:mt-20">
                  <PhotoCard
                    photo={right}
                    index={counter++}
                    aspect="aspect-[3/2]"
                  />
                </div>
              )}
            </div>
          )
        }

        if (row.kind === 1) {
          return (
            <div key={r} className="grid gap-4 md:grid-cols-3 md:items-start">
              {row.items.map((p, i) => (
                <div key={p.id} className={i === 1 ? "md:-mt-10" : ""}>
                  <PhotoCard photo={p} index={counter++} aspect="aspect-[3/2]" />
                </div>
              ))}
            </div>
          )
        }

        return (
          <div key={r} className="max-h-[600px] overflow-hidden">
            {row.items.map((p) => (
              <PhotoCard
                key={p.id}
                photo={p}
                index={counter++}
                aspect="aspect-[21/9]"
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
