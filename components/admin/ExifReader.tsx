"use client"

import { useEffect } from "react"
import { readExif, type ExifData } from "@/lib/exif"

export default function ExifReader({
  file,
  value,
  onChange,
}: {
  file: File | null
  value: ExifData
  onChange: (next: ExifData) => void
}) {
  useEffect(() => {
    if (!file) return
    let live = true
    readExif(file).then((d) => {
      if (live) onChange(d)
    })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  const fields: { key: keyof ExifData; label: string; type: string }[] = [
    { key: "location", label: "Location", type: "text" },
    { key: "date", label: "Date", type: "date" },
    { key: "time", label: "Time", type: "time" },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {fields.map((f) => (
        <label key={f.key} className="block">
          <span className="mb-2 block text-[10px] uppercase tracking-[0.15em] text-muted">
            {f.label}
          </span>
          <input
            type={f.type}
            value={(value[f.key] as string) ?? ""}
            onChange={(e) => {
              const next = { ...value, [f.key]: e.target.value }
              const d = f.key === "date" ? e.target.value : next.date
              const t = f.key === "time" ? e.target.value : next.time
              next.shotAt = d ? new Date(`${d}T${t || "00:00"}`).toISOString() : null
              onChange(next)
            }}
            className="w-full border border-line bg-surface px-3 py-2.5 text-sm text-cream outline-none focus:border-gold"
          />
        </label>
      ))}
    </div>
  )
}
