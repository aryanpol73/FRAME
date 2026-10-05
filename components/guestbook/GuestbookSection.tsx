"use client"

import { useState } from "react"
import { submitGuestbookThought } from "@/app/about/actions"
import type { GuestbookEntry } from "@/lib/supabase/types"

export default function GuestbookSection({
  entries,
}: {
  entries: GuestbookEntry[]
}) {
  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatusMessage("")
    setErrorMessage("")

    const formData = new FormData()
    formData.append("name", name)
    formData.append("message", message)

    try {
      const res = await submitGuestbookThought(formData)
      if (res.error) {
        setErrorMessage(res.error)
      } else if (res.success) {
        setStatusMessage(res.message || "Thank you for leaving something behind.")
        setName("")
        setMessage("")
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mt-32 border-t border-line/80 pt-20">
      <div className="grid gap-16 lg:grid-cols-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-5">
          <p className="text-[11px] uppercase tracking-[0.22em] text-gold mb-2">
            Guestbook
          </p>
          <h2
            className="font-display text-cream leading-[0.95]"
            style={{ fontSize: "clamp(36px, 6vw, 54px)" }}
          >
            Leave Something Behind
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-muted max-w-md">
            If something here made you stop for a moment, leave a thought.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5 max-w-md">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.16em] text-muted mb-2">
                Name or Initial
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. A. or Anonymous"
                className="w-full rounded-none border border-line bg-surface px-4 py-3 text-sm text-cream outline-none transition-colors placeholder:text-muted/60 focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.16em] text-muted mb-2">
                Your Thought
              </label>
              <textarea
                required
                rows={4}
                maxLength={600}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write whatever made you pause..."
                className="w-full resize-none border border-line bg-surface px-4 py-3 font-serif italic text-base text-cream outline-none transition-colors placeholder:not-italic placeholder:font-body placeholder:text-sm placeholder:text-muted/60 focus:border-gold"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group relative inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-6 py-3 text-[11px] uppercase tracking-[0.18em] font-semibold text-gold shadow-[0_0_15px_rgba(232,193,112,0.15)] transition-all duration-300 hover:border-gold hover:bg-gold hover:text-base hover:shadow-[0_0_20px_rgba(232,193,112,0.35)] active:scale-95 disabled:opacity-50"
            >
              <span>{submitting ? "Sending…" : "Leave it"}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>

            {statusMessage && (
              <p className="rounded-lg border border-gold/30 bg-gold/10 p-3 text-xs text-gold">
                {statusMessage}
              </p>
            )}

            {errorMessage && (
              <p className="rounded-lg border border-sienna/30 bg-sienna/10 p-3 text-xs text-sienna">
                {errorMessage}
              </p>
            )}
          </form>
        </div>

        {/* Right Column: Quiet Stream of Messages */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between border-b border-line pb-4 mb-8">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Notes & Impressions
            </span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-mono">
              {entries.length} {entries.length === 1 ? "Thought" : "Thoughts"}
            </span>
          </div>

          {entries.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-line/60 p-8">
              <p className="font-serif italic text-muted text-base">
                “Be the first to leave a thought behind.”
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-line bg-surface/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-line hover:bg-surface/80 hover:shadow-lg"
                >
                  <p className="font-serif italic text-cream/95 text-base md:text-lg leading-relaxed">
                    “{entry.message}”
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-line/40 pt-3">
                    <span className="font-display tracking-[0.16em] text-xs text-gold">
                      — {entry.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted/60">
                      {new Date(entry.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
