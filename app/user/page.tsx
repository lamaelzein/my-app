import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/jwt";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) redirect("/login");

  const payload = verifyJwt(token);

  return (
    <div className="p-10">
      <h1 className="text-3xl text-blue-600">User Dashboard</h1>
      <p>Welcome {payload.email}</p>

      <a href="/api/auth/logout" className="text-blue-600">
        Logout
      </a>
    </div>
  );
}