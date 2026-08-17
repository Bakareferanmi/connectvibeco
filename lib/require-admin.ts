import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-server";

export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const rows = await sql`SELECT is_admin FROM users WHERE id = ${session.userId} LIMIT 1`;
  if (!rows[0]?.is_admin) {
    return NextResponse.json({ ok: false, error: "Admin access required." }, { status: 403 });
  }
  return null; // null means "check passed, continue"
}
