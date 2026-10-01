"use client"

import { useRef, useState } from "react"

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const MAX_BYTES = 50 * 1024 * 1024

export default function UploadZone({
  onFile,
}: {
  onFile: (file: File) => void
}) {
  const [over, setOver] = useState(false)
  const [error, setError] = useState("")
  const input = useRef<HTMLInputElement>(null)

  function accept(file?: File) {
    if (!file) return
    const okType =
      ACCEPTED.includes(file.type) || /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)
    if (!okType) return setError("Use JPG, PNG, WEBP or HEIC.")
    if (file.size > MAX_BYTES) return setError("That file is over 50MB.")
    setError("")
    onFile(file)
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          accept(e.dataTransfer.files?.[0])
        }}
        onClick={() => input.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 border border-dashed py-24 text-center transition-colors ${
          over ? "border-gold bg-surface" : "border-line"
        }`}
      >
        <p className="font-display text-cream" style={{ fontSize: 28 }}>
          Drop a photograph
        </p>
        <p className="text-xs text-muted">
          JPG · PNG · WEBP · HEIC — up to 50MB
        </p>
        <input
          ref={input}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/*"
          hidden
          onChange={(e) => accept(e.target.files?.[0])}
        />
      </div>
      {error && <p className="mt-3 text-xs text-sienna">{error}</p>}
    </div>
  )
}
