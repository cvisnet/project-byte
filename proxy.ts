import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED_ROUTE_PREFIXES = [
  "/dashboard",
  "/users",
  "/news-management",
  "/organization-management",
];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isLoggedIn = !!token;

  // ❌ Guest accessing protected admin routes
  if (!isLoggedIn && isProtectedRoute) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ❌ Logged-in user accessing login
  if (isLoggedIn && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🚫 Suspended user
  if (isLoggedIn && token?.isSuspended) {
    return NextResponse.redirect(new URL("/suspended", req.url));
  }

  const response = NextResponse.next();

  if (isProtectedRoute) {
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/users/:path*",
    "/news-management/:path*",
    "/organization-management/:path*",
  ],
};
