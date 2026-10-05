"use client"

import { useState } from "react"

export default function CaptionGenerator({
  imageUrl,
  value,
  onChange,
}: {
  imageUrl: string | null
  value: string
  onChange: (next: string) => void
}) {
  const [streaming, setStreaming] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [error, setError] = useState("")

  async function generate() {
    if (!imageUrl) {
      setError("Upload the photo first — the AI needs a URL to look at.")
      return
    }

    setError("")
    setStreaming(true)
    onChange("")

    try {
      const res = await fetch("/api/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })

      if (!res.ok) {
        let errMessage = "Generation failed."
        try {
          const errData = await res.json()
          errMessage = errData.error || errMessage
        } catch {
          errMessage = (await res.text()) || errMessage
        }
        throw new Error(errMessage)
      }

      const contentType = res.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const data = await res.json()
        onChange(data.caption ?? "")
      } else if (res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let acc = ""

        while (true) {
          const { done, value: chunk } = await reader.read()
          if (done) break
          acc += decoder.decode(chunk, { stream: true })
          onChange(acc)
        }
      }

      setHasRun(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.")
    } finally {
      setStreaming(false)
    }
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.15em] text-muted">
          Caption
        </span>
        <button
          type="button"
          onClick={generate}
          disabled={streaming}
          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/20 hover:text-gold hover:shadow-[0_0_15px_rgba(200,169,110,0.25)] active:scale-95 disabled:opacity-50"
        >
          <span className="text-gold">✦</span>
          <span>{streaming ? "Generating…" : hasRun ? "Regenerate" : "Generate with AI"}</span>
        </button>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Write something, or let the AI start it."
        className="w-full resize-y border border-line bg-surface px-5 py-4 font-serif italic text-cream outline-none placeholder:not-italic placeholder:font-body placeholder:text-muted focus:border-gold"
        style={{ fontSize: 18, lineHeight: 1.8 }}
      />

      {error && <p className="mt-2 text-xs text-sienna">{error}</p>}
    </div>
  )
}
