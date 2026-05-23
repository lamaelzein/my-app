"use client"
import { useState } from "react"
import { Turnstile } from "@marsidev/react-turnstile"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep]       = useState<"email" | "otp">("email")
  const [email, setEmail]     = useState("")
  const [otp, setOtp]         = useState("")
  const [cfToken, setCfToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState("")

  const handleSendOTP = async () => {
    if (!email || !cfToken) { setError("Please complete the verification."); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, cfToken }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      setStep("otp")
    } catch { setError("Something went wrong.") }
    finally { setLoading(false) }
  }

  const handleVerifyOTP = async () => {
    if (!otp) { setError("Please enter the OTP."); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); return }
      if (data.role === "admin") router.push("/protected/admin")
      else router.push("/protected")
    } catch { setError("Something went wrong.") }
    finally { setLoading(false) }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f5f5f5", fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        padding: "40px 36px", width: "100%", maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px", color: "#111" }}>
          {step === "email" ? "Sign in" : "Enter OTP"}
        </h1>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>
          {step === "email" ? "Enter your email to receive a verification code" : `We sent a code to ${email}`}
        </p>

        {step === "email" ? (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6 }}>Email</label>
              <input
                type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%", padding: "10px 12px", fontSize: 14,
                  border: "1px solid #e0e0e0", borderRadius: 8,
                  outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!}
                onSuccess={token => setCfToken(token)}
              />
            </div>
            {error && <p style={{ fontSize: 13, color: "red", marginBottom: 12 }}>{error}</p>}
            <button onClick={handleSendOTP} disabled={loading} style={{
              width: "100%", padding: "11px 0",
              background: loading ? "#ccc" : "#111",
              color: "#fff", border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6 }}>Code</label>
              <input
                type="text" value={otp}
                onChange={e => setOtp(e.target.value)}
                placeholder="123456" maxLength={6}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: 22,
                  border: "1px solid #e0e0e0", borderRadius: 8,
                  outline: "none", boxSizing: "border-box",
                  letterSpacing: "8px", textAlign: "center",
                }}
              />
            </div>
            {error && <p style={{ fontSize: 13, color: "red", marginBottom: 12 }}>{error}</p>}
            <button onClick={handleVerifyOTP} disabled={loading} style={{
              width: "100%", padding: "11px 0",
              background: loading ? "#ccc" : "#111",
              color: "#fff", border: "none", borderRadius: 8,
              fontSize: 14, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
            }}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
            <button onClick={() => setStep("email")} style={{
              width: "100%", padding: "11px 0", marginTop: 8,
              background: "transparent", color: "#666",
              border: "1px solid #e0e0e0", borderRadius: 8,
              fontSize: 14, cursor: "pointer",
            }}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  )
}