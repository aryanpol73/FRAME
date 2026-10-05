import { formatExifDate, formatExifTime } from "@/lib/exif"

export default function ExifPills({
  location,
  shotAt,
}: {
  location: string | null
  shotAt: string | null
}) {
  const pills = [
    location,
    formatExifDate(shotAt),
    formatExifTime(shotAt),
  ].filter(Boolean) as string[]

  if (!pills.length) return null

  return (
    <ul className="flex flex-wrap gap-2">
      {pills.map((p) => (
        <li
          key={p}
          className="rounded-full border border-white/10 bg-surface/60 px-4 py-1.5 text-[10.5px] uppercase tracking-[0.16em] text-muted backdrop-blur-md"
        >
          {p}
        </li>
      ))}
    </ul>
  )
}
