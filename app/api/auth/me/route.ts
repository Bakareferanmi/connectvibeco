import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: true, user: null });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ ok: true, user: null });

  const rows = await sql`SELECT id, email, name, is_admin FROM users WHERE id = ${session.userId} LIMIT 1`;
  const user = rows[0] ?? null;
  return NextResponse.json({ ok: true, user });
}
