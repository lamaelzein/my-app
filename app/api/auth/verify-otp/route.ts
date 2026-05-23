import { NextResponse } from "next/server";
import { signJwt } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { email } = await req.json();

  const token = signJwt({
    email,
    role: email === "admin@gmail.com" ? "admin" : "user",
  });

  (await cookies()).set("token", token, {
    httpOnly: true,
  });

  return NextResponse.json({ success: true, token });
}