import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  (await cookies()).delete("token");

  return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
}