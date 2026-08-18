import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-server";

export async function requireUser(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return { session: null, denied: NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 }) };

  const session = await verifySession(token);
  if (!session) return { session: null, denied: NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 }) };

  return { session, denied: null };
}
