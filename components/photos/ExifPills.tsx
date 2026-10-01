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
          className="border border-line px-4 py-2 text-[11px] uppercase tracking-[0.15em] text-muted"
        >
          {p}
        </li>
      ))}
    </ul>
  )
}
