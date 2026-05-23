import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { getStudents } from "@/lib/students"
import { NextResponse } from "next/server"

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json(getStudents())
}