import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { getStudents, addStudent, updateStudent, deleteStudent } from "@/lib/students"
import { NextRequest, NextResponse } from "next/server"

async function checkAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) return false
  const payload = verifyToken(token) as { role: string } | null
  return payload?.role === "admin"
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json(getStudents())
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  return NextResponse.json(addStudent(body), { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id, ...data } = await req.json()
  return NextResponse.json(updateStudent(id, data))
}

export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await req.json()
  deleteStudent(id)
  return NextResponse.json({ success: true })
}