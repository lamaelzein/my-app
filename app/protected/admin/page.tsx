"use client"

import { useEffect, useState } from "react"

type Student = { id: string; name: string; email: string; grade: string }
const empty = { name: "", email: "", grade: "" }

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [form, setForm] = useState(empty)
  const [editId, setEditId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<"admin" | "user" | null>(null)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchAll() {
      const [meRes, studentsRes] = await Promise.all([
        fetch("/api/admin/me"),
        fetch("/api/students"),
      ])
      if (meRes.ok) {
        const me = await meRes.json()
        setRole(me.role)
      }
      if (studentsRes.ok) {
        const list = await studentsRes.json()
        setStudents(list)
      }
    }
    fetchAll()
  }, [refresh])

  async function handleSubmit() {
    if (!form.name || !form.email || !form.grade) return
    setLoading(true)
    if (editId) {
      await fetch("/api/admin/students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, ...form }),
      })
      setEditId(null)
    } else {
      await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
    }
    setForm(empty)
    setLoading(false)
    setRefresh(r => r + 1)
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/students", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setRefresh(r => r + 1)
  }

  function handleEdit(s: Student) {
    setEditId(s.id)
    setForm({ name: s.name, email: s.email, grade: s.grade })
  }

  const isAdmin = role === "admin"

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a2e", fontFamily: "sans-serif", padding: "40px 20px" }}>

      {/* Header card */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 36px", width: "100%", maxWidth: 700, boxShadow: "0 4px 24px rgba(0,0,0,0.3)", margin: "0 auto 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 6px", color: "#111" }}>
            {isAdmin ? "Admin Panel" : "Student Portal"}
          </h1>
          <span style={{
            fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
            background: isAdmin ? "#fee2e2" : "#e0f2fe",
            color: isAdmin ? "#dc2626" : "#0284c7",
          }}>
            {role ?? "..."}
          </span>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button style={{ padding: "10px 20px", background: "#111", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
            Logout
          </button>
        </form>
      </div>

      {/* Main card */}
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 36px", maxWidth: 700, margin: "0 auto", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 20px", color: "#111" }}>
          Students
        </h2>

        {/* Add/Edit form — admin only */}
        {isAdmin && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", padding: 16, background: "#f9f9f9", borderRadius: 10 }}>
            <input
              placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Grade"
              value={form.grade}
              onChange={e => setForm({ ...form, grade: e.target.value })}
              style={{ ...inputStyle, width: 80, flex: "none" }}
            />
            <button onClick={handleSubmit} disabled={loading} style={btnPrimary}>
              {editId ? "Update" : "Add"}
            </button>
            {editId && (
              <button onClick={() => { setEditId(null); setForm(empty) }} style={btnSecondary}>
                Cancel
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {students.length === 0 ? (
          <p style={{ color: "#888", fontSize: 14 }}>No students yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Grade</th>
                {isAdmin && <th style={th}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={td}>{s.name}</td>
                  <td style={td}>{s.email}</td>
                  <td style={td}>{s.grade}</td>
                  {isAdmin && (
                    <td style={td}>
                      <button onClick={() => handleEdit(s)} style={btnPrimary}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{ ...btnSecondary, color: "red", border: "1px solid red", marginLeft: 6 }}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none", flex: 1, minWidth: 120 }
const th: React.CSSProperties = { padding: "8px 12px", color: "#555", fontWeight: 500 }
const td: React.CSSProperties = { padding: "10px 12px", color: "#222" }
const btnPrimary: React.CSSProperties = { padding: "8px 16px", borderRadius: 8, border: "none", background: "#111", color: "#fff", fontSize: 13, cursor: "pointer" }
const btnSecondary: React.CSSProperties = { padding: "8px 16px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#333", fontSize: 13, cursor: "pointer" }