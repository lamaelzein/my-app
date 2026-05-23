import { NextRequest, NextResponse } from "next/server"
import { verifyOTP } from "@/lib/otp"
import { signToken } from "@/lib/jwt"

const ADMIN_EMAILS = ["lamaelzein7078@gmail.com"] 

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json()

  const valid = verifyOTP(email, otp)
  if (!valid) {
    return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
  }

  const role = ADMIN_EMAILS.includes(email) ? "admin" : "user"
  const token = signToken({ email, role })

  const response = NextResponse.json({ message: "Login successful", role })
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })

  return response
}