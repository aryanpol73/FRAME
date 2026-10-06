import type { EmailOtpType } from "@supabase/supabase-js"
import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"

const DEFAULT_NEXT = "/admin"
const EMAIL_OTP_TYPES: EmailOtpType[] = [
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
]

/**
 * Only allow internal, same-origin paths. Rejects absolute URLs, protocol-relative
 * URLs (//evil.com), backslash tricks and userinfo tricks (@evil.com).
 */
function safeNext(raw: string | null, origin: string): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) {
    return DEFAULT_NEXT
  }
  try {
    const url = new URL(raw, origin)
    if (url.origin !== origin) return DEFAULT_NEXT
    return `${url.pathname}${url.search}`
  } catch {
    return DEFAULT_NEXT
  }
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = safeNext(searchParams.get("next"), origin)

  const fail = (reason: string) => {
    const url = new URL("/admin/login", origin)
    url.searchParams.set("error", "auth")
    url.searchParams.set("reason", reason.slice(0, 200))
    return NextResponse.redirect(url)
  }

  // Errors reported by Supabase itself (e.g. expired or already-used link).
  const providerError = searchParams.get("error_description") || searchParams.get("error")
  if (providerError) return fail(providerError)

  const supabase = await createClient()

  // 1. Preferred: token_hash flow. Works on any device/browser, no PKCE cookie needed.
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  if (tokenHash) {
    if (!type || !EMAIL_OTP_TYPES.includes(type)) return fail("Invalid sign-in link type.")
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash })
    if (error) return fail(error.message)
    return NextResponse.redirect(new URL(next, origin))
  }

  // 2. Fallback: PKCE code flow (requires the same browser that requested the email).
  const code = searchParams.get("code")
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return fail(
        `${error.message}. Open the link in the same browser you requested it from, or request a new one.`
      )
    }
    return NextResponse.redirect(new URL(next, origin))
  }

  return fail("Sign-in link is missing its token. Request a new one.")
}
