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

      if (!res.ok || !res.body) throw new Error(await res.text())

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ""

      while (true) {
        const { done, value: chunk } = await reader.read()
        if (done) break
        acc += decoder.decode(chunk, { stream: true })
        onChange(acc)
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
          className="border border-gold px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-base disabled:opacity-50"
        >
          {streaming ? "Generating…" : hasRun ? "Regenerate" : "Generate with AI"}
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
