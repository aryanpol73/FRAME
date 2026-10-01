"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const [message, setMessage] = useState("")

  async function send(e: React.FormEvent) {
    e.preventDefault()
    setStatus("sending")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      },
    })

    if (error) {
      setStatus("error")
      setMessage(error.message)
    } else {
      setStatus("sent")
      setMessage("Check your inbox for the sign-in link.")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={send} className="w-full max-w-sm">
        <h1 className="font-display text-cream" style={{ fontSize: 48, letterSpacing: "0.04em" }}>
          FRAME
        </h1>
        <p className="mt-2 mb-10 text-[11px] uppercase tracking-[0.2em] text-muted">
          Admin access
        </p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full border border-line bg-surface px-4 py-3 text-sm text-cream outline-none placeholder:text-muted focus:border-gold"
        />

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-4 w-full border border-gold px-4 py-3 text-[11px] uppercase tracking-[0.15em] text-gold transition-colors hover:bg-gold hover:text-base disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send magic link"}
        </button>

        {message && (
          <p className={`mt-4 text-xs ${status === "error" ? "text-sienna" : "text-muted"}`}>
            {message}
          </p>
        )}
      </form>
    </main>
  )
}
