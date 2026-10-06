const PRODUCTION_URL = "https://frame-aryan-on-cam.vercel.app"

/**
 * Canonical base URL for links placed inside auth emails (magic link, password reset).
 * - development: the current origin, so localhost keeps working
 * - production: NEXT_PUBLIC_APP_URL, falling back to the production domain
 */
export function getAuthRedirectBase(): string {
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    return window.location.origin
  }
  return (process.env.NEXT_PUBLIC_APP_URL || PRODUCTION_URL).replace(/\/$/, "")
}
