import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const rows = await sql`
    SELECT id, email, name, google_id IS NOT NULL AS via_google, created_at
    FROM users ORDER BY created_at DESC
  `;
  return NextResponse.json({ ok: true, users: rows });
}
