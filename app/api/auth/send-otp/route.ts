import { NextRequest, NextResponse } from "next/server"
import { generateOTP } from "@/lib/otp"
import { sendOTPEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, cfToken } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Skip Cloudflare in development
    if (process.env.NODE_ENV === "production" && cfToken) {
      const cfRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.CLOUDFLARE_SECRET_KEY,
          response: cfToken,
        }),
      })
      const cfData = await cfRes.json()
      if (!cfData.success) {
        return NextResponse.json({ error: "Human verification failed" }, { status: 400 })
      }
    }

    const otp = generateOTP(email)
    await sendOTPEmail(email, otp)

    return NextResponse.json({ message: "OTP sent" })
  } catch (error) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 })
  }
}