"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { getAuthRedirectBase } from "@/lib/auth-redirect"

type Status = "idle" | "busy" | "sent" | "error"

const primaryBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/25 hover:text-gold hover:shadow-[0_0_25px_rgba(200,169,110,0.3)] active:scale-95 disabled:opacity-50"
const ghostBtn =
  "inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/[0.1] bg-surface/60 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted transition-all duration-300 hover:border-gold/40 hover:text-cream active:scale-95 disabled:opacity-50"
const inputCls =
  "w-full border border-line bg-surface px-4 py-3 text-sm text-cream outline-none placeholder:text-muted focus:border-gold"

function passkeyErrorMessage(err: unknown): string {
  const e = err as { name?: string; message?: string } | null
  if (e?.name === "NotAllowedError" || e?.name === "AbortError") {
    return "Passkey prompt was cancelled or timed out."
  }
  return e?.message || "Passkey sign-in failed."
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")
  const [supported, setSupported] = useState(true)
  const [mode, setMode] = useState<"password" | "magic">("password")

  useEffect(() => {
    setSupported(typeof window !== "undefined" && !!window.PublicKeyCredential)
    const err = new URLSearchParams(window.location.search).get("error")
    if (err === "unauthorized") {
      setStatus("error")
      setMessage("This account is not authorised for admin access.")
    } else if (err === "auth") {
      setStatus("error")
      setMessage("Sign-in link was invalid or expired.")
    }
  }, [])

  function fail(msg: string) {
    setStatus("error")
    setMessage(msg)
  }

  async function passkeySignIn() {
    setStatus("busy")
    setMessage("")
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPasskey()
      if (error) return fail(passkeyErrorMessage(error))
      router.replace("/admin")
      router.refresh()
    } catch (err) {
      fail(passkeyErrorMessage(err))
    }
  }

  async function passwordSignIn(e: React.FormEvent) {
    e.preventDefault()
    setStatus("busy")
    setMessage("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return fail(error.message)
    router.replace("/admin")
    router.refresh()
  }

  async function magicLink(e: React.FormEvent) {
    e.preventDefault()
    setStatus("busy")
    setMessage("")
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${getAuthRedirectBase()}/auth/callback?next=/admin` },
    })
    if (error) return fail(error.message)
    setStatus("sent")
    setMessage("Check your inbox for the sign-in link.")
  }

  async function resetPassword() {
    if (!email) return fail("Enter your email first.")
    setStatus("busy")
    setMessage("")
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getAuthRedirectBase()}/auth/callback?next=/admin/security`,
    })
    if (error) return fail(error.message)
    setStatus("sent")
    setMessage("Password setup link sent. Open it to choose a password.")
  }

  const busy = status === "busy"

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-cream" style={{ fontSize: 48, letterSpacing: "0.04em" }}>
          FRAME
        </h1>
        <p className="mt-2 mb-10 text-[11px] uppercase tracking-[0.2em] text-muted">Admin access</p>

        <button type="button" onClick={passkeySignIn} disabled={busy || !supported} className={primaryBtn}>
          <span>{busy ? "Waiting…" : "Continue with Passkey"}</span>
          <span className="text-gold">◉</span>
        </button>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          {supported
            ? "Use your fingerprint, Face ID, Windows Hello or device PIN."
            : "This browser doesn't support passkeys. Use the backup login below."}
        </p>

        <div className="my-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-muted">
          <span className="h-px flex-1 bg-line" />
          Backup login
          <span className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={mode === "password" ? passwordSignIn : magicLink} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="username webauthn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={inputCls}
          />
          {mode === "password" && (
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputCls}
            />
          )}
          <button type="submit" disabled={busy} className={ghostBtn}>
            {mode === "password" ? "Sign in with password" : "Send magic link"}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-[11px] text-muted">
          <button type="button" onClick={() => setMode(mode === "password" ? "magic" : "password")} className="hover:text-gold">
            {mode === "password" ? "Use magic link" : "Use password"}
          </button>
          <button type="button" onClick={resetPassword} disabled={busy} className="hover:text-gold">
            Set / reset password
          </button>
        </div>

        {message && (
          <p className={`mt-4 text-xs ${status === "error" ? "text-sienna" : "text-muted"}`}>{message}</p>
        )}
      </div>
    </main>
  )
}
