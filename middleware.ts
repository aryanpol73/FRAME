import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "aryan.pol737@gmail.com"

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isAdminPath = path.startsWith("/admin")
  const isLoginPage = path === "/admin/login"

  // 1. Guard all /admin routes (except /admin/login) against unauthenticated users
  if (isAdminPath && !isLoginPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // 2. Guard against authenticated non-admin users
  if (isAdminPath && !isLoginPage && user && user.email !== ADMIN_EMAIL) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    url.searchParams.set("error", "unauthorized")
    return NextResponse.redirect(url)
  }

  // 3. If admin is already authenticated, redirect from /admin/login to /admin dashboard
  if (isLoginPage && user && user.email === ADMIN_EMAIL) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  // Refreshed cookies are passed along
  return response
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
}
