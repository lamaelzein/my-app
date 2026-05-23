import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOTPEmail(email: string, otp: string) {
  console.log("=================================")
  console.log("TO:", email)
  console.log("OTP CODE:", otp)
  console.log("=================================")

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "lamaelzein7078@gmail.com", 
    subject: "Your OTP Code",
    html: `
      <div style="font-family:sans-serif;padding:20px">
        <h2>Your verification code</h2>
        <p style="color:#666;margin-bottom:8px">Code for: <strong>${email}</strong></p>
        <p style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#111">${otp}</p>
        <p style="color:#666">This code expires in 5 minutes.</p>
      </div>
    `,
  })
}