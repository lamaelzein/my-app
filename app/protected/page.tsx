import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { redirect } from "next/navigation"

export default async function UserPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) redirect("/auth")

  const payload = verifyToken(token) as { email: string; role: string } | null
  if (!payload) redirect("/auth")

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
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>Welcome!</h1>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 4px" }}>
          Logged in as: <strong>{payload.email}</strong>
        </p>
        <p style={{ fontSize: 14, color: "#666", margin: "0 0 24px" }}>
          Role: <strong>{payload.role}</strong>
        </p>
        <form action="/api/auth/logout" method="POST">
          <button style={{
            width: "100%", padding: "11px 0",
            background: "#111", color: "#fff",
            border: "none", borderRadius: 8,
            fontSize: 14, cursor: "pointer",
          }}>
            Logout
          </button>
        </form>
      </div>
    </div>
  )
}