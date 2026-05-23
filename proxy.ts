import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"

export default function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value
  const { pathname } = req.nextUrl

  // Public routes — allow always
  if (pathname.startsWith("/auth") || pathname === "/") {
    return NextResponse.next()
  }

  // Protected routes
  if (pathname.startsWith("/protected")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", req.url))
    }

    const payload = verifyToken(token) as { role?: string } | null

    if (pathname.startsWith("/protected/admin")) {
      if (!payload || payload.role !== "admin") {
        return NextResponse.redirect(new URL("/protected", req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/protected/:path*", "/auth"],
}