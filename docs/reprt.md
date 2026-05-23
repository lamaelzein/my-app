# My-App — Full Project Report

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Authentication System](#authentication-system)
5. [Role-Based Access Control](#role-based-access-control)
6. [Student Management](#student-management)
7. [API Routes](#api-routes)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)

---

## 1. Project Overview

**My-App** is a full-stack web application built with Next.js 14 (App Router). It provides a secure, role-based portal where:

- **Admins** can manage students — add, edit, and delete records
- **Users** can view the student list in read-only mode

Access is protected by JWT authentication combined with OTP (One-Time Password) email verification and Cloudflare Turnstile bot protection.

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Authentication | JWT (jsonwebtoken) |
| OTP Delivery | Resend (email API) |
| Bot Protection | Cloudflare Turnstile |
| Styling | Inline styles (no CSS framework) |
| Data Storage | In-memory (server-side array) |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

---

## 3. Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-otp/route.ts       # Sends OTP email to user
│   │   │   ├── verify-otp/route.ts     # Verifies OTP, issues JWT token
│   │   │   └── logout/route.ts         # Clears auth cookie
│   │   ├── admin/
│   │   │   ├── me/route.ts             # Returns current user info (role, email)
│   │   │   └── students/route.ts       # CRUD operations (admin only)
│   │   └── students/route.ts           # Read-only student list (all users)
│   ├── auth/                           # Login / OTP pages
│   ├── protected/
│   │   ├── layout.tsx                  # Auth guard — redirects if no token
│   │   ├── page.tsx                    # Default protected landing page
│   │   └── admin/
│   │       └── page.tsx                # Admin + User students page
│   ├── layout.tsx                      # Root layout
│   └── page.tsx                        # Home page
├── lib/
│   ├── jwt.ts                          # signToken, verifyToken helpers
│   ├── otp.ts                          # OTP generation and validation
│   ├── email.ts                        # Email sending via Resend
│   └── students.ts                     # In-memory student store
├── public/                             # Static assets
├── .env.local                          # Environment variables
├── next.config.ts
└── package.json
```

---

## 4. Authentication System

The app uses a **passwordless OTP flow**:

### Flow Diagram
```
User enters email
       ↓
Server generates OTP → sends to email via Resend
       ↓
User enters OTP
       ↓
Server verifies OTP → signs JWT token with { email, role }
       ↓
JWT stored in httpOnly cookie
       ↓
User redirected to /protected
```

### Key Files

**`lib/jwt.ts`** — Token signing and verification:
```typescript
export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: "1d" })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
```

**`app/api/auth/verify-otp/route.ts`** — Issues token with role:
```typescript
const role = ADMIN_EMAILS.includes(email) ? "admin" : "user"
const token = signToken({ email, role })
```

Admin emails are hardcoded in the `ADMIN_EMAILS` array. Any email not in that list receives the `"user"` role.

---

## 5. Role-Based Access Control

### How roles work

| Role | Assigned to |
|---|---|
| `admin` | Emails listed in `ADMIN_EMAILS` array |
| `user` | Everyone else |

### Route protection

**`app/protected/layout.tsx`** guards all protected routes:
- Reads the `token` cookie
- Verifies the JWT using `verifyToken`
- Redirects to `/auth` if token is missing or invalid

**`app/protected/admin/page.tsx`** additionally checks:
- If `role !== "admin"` → redirects to `/protected`

### UI differences by role

| Feature | Admin | User |
|---|---|---|
| View student list | ✅ | ✅ |
| Add student form | ✅ | ❌ |
| Edit button | ✅ | ❌ |
| Delete button | ✅ | ❌ |
| Role badge color | 🔴 Red | 🔵 Blue |

---

## 6. Student Management

### Data Model

```typescript
type Student = {
  id: string       // auto-generated timestamp
  name: string
  email: string
  grade: string
}
```

### Storage

Students are stored in a **server-side in-memory array** in `lib/students.ts`. This means data resets on server restart. For production persistence, this should be replaced with a database (e.g. Supabase, Vercel KV).

### Operations

| Operation | Who can do it |
|---|---|
| View all students | Admin + User |
| Add student | Admin only |
| Edit student | Admin only |
| Delete student | Admin only |

---

## 7. API Routes

### Auth Routes

| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/send-otp` | Sends OTP to email | No |
| POST | `/api/auth/verify-otp` | Verifies OTP, sets cookie | No |
| POST | `/api/auth/logout` | Clears token cookie | No |

### Student Routes

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/api/students` | Get all students | Any logged-in user |
| GET | `/api/admin/students` | Get all students | Admin only |
| POST | `/api/admin/students` | Add a student | Admin only |
| PUT | `/api/admin/students` | Update a student | Admin only |
| DELETE | `/api/admin/students` | Delete a student | Admin only |

### User Info Route

| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | `/api/admin/me` | Get current user email + role | Any logged-in user |

---

## 8. Environment Variables

Add these in Vercel under **Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key used to sign/verify JWT tokens |
| `EMAIL_USER` | Gmail address used for sending OTPs |
| `EMAIL_PASS` | Gmail app password |
| `CLOUDFLARE_SECRET_KEY` | Cloudflare Turnstile server-side secret |
| `NEXT_PUBLIC_CLOUDFLARE_SITE_KEY` | Cloudflare Turnstile client-side site key |
| `RESEND_API_KEY` | Resend API key for email delivery |

Set all variables for **Production**, **Preview**, and **Development** environments.

---

## 9. Deployment

The app is deployed on **Vercel** connected to a GitHub repository.

### Deployment Steps

1. Push code to GitHub:
```bash
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/lamaelzein/my-app.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → Import the GitHub repository
3. Add all environment variables in Vercel dashboard
4. Click Deploy

### CI/CD

GitHub Actions workflows are configured under `.github/workflows/` for automated testing and deployment on every push to `main`.

### Important Note on Data Persistence

The current in-memory student store resets on every Vercel cold start. For a production app, replace `lib/students.ts` with a persistent database such as:

- **Supabase** — free PostgreSQL database
- **Vercel KV** — free Redis key-value store
- **PlanetScale** — free MySQL database

---

*Report generated for my-app — Next.js 14 fullstack project*