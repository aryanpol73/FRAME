"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const btn =
  "inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/15 px-5 py-3 text-[11px] font-medium uppercase tracking-[0.2em] text-cream transition-all duration-300 hover:border-gold hover:text-gold active:scale-95 disabled:opacity-50"
const inputCls =
  "w-full border border-line bg-surface px-4 py-3 text-sm text-cream outline-none placeholder:text-muted focus:border-gold"

type Passkey = { id: string; friendly_name?: string | null; created_at?: string }
type Note = { kind: "ok" | "err"; text: string } | null

function errText(err: unknown) {
  const e = err as { name?: string; message?: string } | null
  if (e?.name === "NotAllowedError" || e?.name === "AbortError") return "Prompt cancelled or timed out."
  return e?.message || "Something went wrong."
}

export default function SecurityPage() {
  const [supported, setSupported] = useState(true)
  const [passkeys, setPasskeys] = useState<Passkey[]>([])
  const [busy, setBusy] = useState(false)
  const [pwd, setPwd] = useState("")
  const [pwdNote, setPwdNote] = useState<Note>(null)
  const [pkNote, setPkNote] = useState<Note>(null)

  async function load() {
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.passkey.list()
      setPasskeys((data as Passkey[] | null) ?? [])
    } catch {
      /* listing is optional */
    }
  }

  useEffect(() => {
    setSupported(!!window.PublicKeyCredential)
    load()
  }, [])

  async function register() {
    setBusy(true)
    setPkNote(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.registerPasskey()
      if (error) setPkNote({ kind: "err", text: errText(error) })
      else {
        setPkNote({ kind: "ok", text: "Passkey registered on this device." })
        load()
      }
    } catch (err) {
      setPkNote({ kind: "err", text: errText(err) })
    }
    setBusy(false)
  }

  async function remove(id: string) {
    if (!confirm("Remove this passkey?")) return
    const supabase = createClient()
    const { error } = await supabase.auth.passkey.delete({ passkeyId: id })
    if (error) setPkNote({ kind: "err", text: errText(error) })
    else load()
  }

  async function savePassword(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setPwdNote(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: pwd })
    if (error) setPwdNote({ kind: "err", text: error.message })
    else {
      setPwdNote({ kind: "ok", text: "Password saved." })
      setPwd("")
    }
    setBusy(false)
  }

  const noteCls = (n: Note) => `mt-3 text-xs ${n?.kind === "err" ? "text-sienna" : "text-gold"}`

  return (
    <div className="mx-auto max-w-xl space-y-14">
      <section>
        <h1 className="font-display text-cream" style={{ fontSize: 36, letterSpacing: "0.04em" }}>
          Security
        </h1>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted">Passkeys &amp; backup password</p>
      </section>

      <section>
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-cream">Passkeys</h2>
        <p className="mt-2 text-xs text-muted leading-relaxed">
          Register one passkey per device you use. Passkeys are stored securely in your device&apos;s native credential system (such as Windows Hello on PC, or Android/Google Password Manager on phone). Open this Security page on each device to register its passkey.
        </p>
        <ul className="mt-4 space-y-2">
          {passkeys.map((p) => (
            <li key={p.id} className="flex items-center justify-between border border-line bg-surface px-4 py-3 text-xs">
              <span className="text-cream">
                {p.friendly_name || "Passkey"}
                {p.created_at && <span className="ml-2 text-muted">{new Date(p.created_at).toLocaleDateString()}</span>}
              </span>
              <button onClick={() => remove(p.id)} className="text-muted hover:text-sienna">
                Remove
              </button>
            </li>
          ))}
          {passkeys.length === 0 && <li className="text-xs text-muted">No passkeys registered yet.</li>}
        </ul>
        <button onClick={register} disabled={busy || !supported} className={`${btn} mt-5`}>
          {busy ? "Registering…" : "Register passkey on this device"}
        </button>
        {!supported && <p className="mt-3 text-xs text-sienna">This browser doesn&apos;t support passkeys.</p>}
        {pkNote && <p className={noteCls(pkNote)}>{pkNote.text}</p>}
      </section>

      <section>
        <h2 className="text-[11px] uppercase tracking-[0.2em] text-cream">Backup password</h2>
        <form onSubmit={savePassword} className="mt-4 space-y-3">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            placeholder="New password (min 8 characters)"
            className={inputCls}
          />
          <button type="submit" disabled={busy} className={btn}>
            Save password
          </button>
        </form>
        {pwdNote && <p className={noteCls(pwdNote)}>{pwdNote.text}</p>}
      </section>
    </div>
  )
}
