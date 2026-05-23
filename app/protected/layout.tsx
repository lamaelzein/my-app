import { cookies } from "next/headers"
import { verifyToken } from "@/lib/jwt"
import { redirect } from "next/navigation"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value
  if (!token) redirect("/auth")

  const payload = verifyToken(token) as { email: string; role: string } | null
  if (!payload) redirect("/auth")

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        background: "#111", padding: "12px 24px",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>
          My App
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "#aaa", fontSize: 14 }}>
            {payload.email}
          </span>
          <span style={{
            fontSize: 12, padding: "3px 10px",
            background: payload.role === "admin" ? "#ff4444" : "#4444ff",
            color: "#fff", borderRadius: 999,
          }}>
            {payload.role}
          </span>
          <form action="/api/auth/logout" method="POST">
            <button style={{
              background: "transparent", border: "1px solid #444",
              color: "#fff", padding: "6px 14px",
              borderRadius: 8, fontSize: 13, cursor: "pointer",
            }}>
              Logout
            </button>
          </form>
        </div>
      </nav>

      {/* Content */}
      <main style={{ padding: "32px 24px", background: "#f5f5f5", minHeight: "calc(100vh - 52px)" }}>
        {children}
      </main>
    </div>
  )
}