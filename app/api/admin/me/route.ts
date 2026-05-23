import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = verifyToken(token) as { email: string; role: string } | null
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  // allow both admin and user
  return NextResponse.json({ email: payload.email, role: payload.role })
}