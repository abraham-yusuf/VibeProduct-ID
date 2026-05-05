import { NextRequest, NextResponse } from "next/server"

// Routes yang butuh autentikasi
const PROTECTED_ROUTES = ["/dashboard"]
// Routes yang hanya untuk guest (belum login)
const AUTH_ROUTES = ["/auth/login"]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Cek apakah route ini diproteksi
  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r))
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r))

  // Ambil session cookie dari Better Auth
  const sessionCookie =
    req.cookies.get("better-auth.session_token") ??
    req.cookies.get("__Secure-better-auth.session_token")

  const isLoggedIn = !!sessionCookie

  // Redirect ke login jika belum login dan akses dashboard
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect ke dashboard jika sudah login dan akses halaman auth
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  return NextResponse.next()
}


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
}
