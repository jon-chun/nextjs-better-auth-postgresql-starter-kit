/**
 * Next.js Middleware for Route Protection
 * Protects dashboard routes and handles authentication redirects
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/gallery", "/settings", "/credits"];

// Define auth routes (redirect to dashboard if already logged in)
const authRoutes = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get session token from cookies
  const sessionToken = request.cookies.get("plushifyme.session_token")?.value;

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !sessionToken) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
