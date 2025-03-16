import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add security headers
  const response = NextResponse.next()

  // Content Security Policy
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://*.vercel-insights.com",
  )

  // Other security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

  // Check authentication for protected routes
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/manager") ||
    pathname === "/profile" ||
    pathname === "/settings"
  ) {
    const authToken = request.cookies.get("auth-token")?.value

    if (!authToken) {
      const url = new URL("/login", request.url)
      url.searchParams.set("from", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === "/login" || pathname === "/reset-password") {
    const authToken = request.cookies.get("auth-token")?.value

    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

