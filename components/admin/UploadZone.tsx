"use client"

import { useRef, useState } from "react"
import { validateClientImage } from "@/lib/image-validation"

export default function UploadZone({
  onFile,
  disabled = false,
}: {
  onFile: (file: File) => void
  disabled?: boolean
}) {
  const [over, setOver] = useState(false)
  const [error, setError] = useState("")
  const [validating, setValidating] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  async function accept(file?: File) {
    if (!file || disabled || validating) return

    setValidating(true)
    setError("")

    try {
      const result = await validateClientImage(file)
      if (!result.valid) {
        setError(result.error || "Invalid photograph file.")
        setValidating(false)
        return
      }

      setError("")
      onFile(file)
    } catch {
      setError("Failed to validate file. Please select a valid photograph.")
    } finally {
      setValidating(false)
    }
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setOver(false)
          if (!disabled) accept(e.dataTransfer.files?.[0])
        }}
        onClick={() => {
          if (!disabled && !validating) input.current?.click()
        }}
        className={`flex flex-col items-center justify-center gap-3 border border-dashed py-24 text-center transition-all ${
          disabled
            ? "cursor-not-allowed border-line/40 opacity-50"
            : over
            ? "cursor-pointer border-gold bg-surface shadow-2xl"
            : "cursor-pointer border-line hover:border-line hover:bg-surface/30"
        }`}
      >
        <p className="font-display text-cream" style={{ fontSize: 28 }}>
          {validating ? "Validating photograph…" : "Drop a photograph"}
        </p>
        <p className="text-xs text-muted max-w-sm px-4">
          JPG · PNG · WEBP · HEIC · AVIF — up to 50MB
        </p>
        <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2 text-[10px] font-medium uppercase tracking-[0.18em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/25 hover:text-gold hover:shadow-[0_0_15px_rgba(200,169,110,0.25)] active:scale-95">
          <span>{validating ? "Checking…" : "Browse Files"}</span>
          <span className="text-gold">↑</span>
        </span>
        <input
          ref={input}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif,.avif"
          hidden
          disabled={disabled || validating}
          onChange={(e) => {
            accept(e.target.files?.[0])
            e.target.value = "" // Reset to allow re-selecting same file if desired
          }}
        />
      </div>
      {error && (
        <div className="mt-4 rounded-xl border border-sienna/40 bg-sienna/10 p-3.5 text-xs text-sienna font-medium">
          {error}
        </div>
      )}
    </div>
  )
}
