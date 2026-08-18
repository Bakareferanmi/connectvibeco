import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const rows = await sql`SELECT key, label, href, enabled FROM socials ORDER BY key`;
  return NextResponse.json({ ok: true, socials: rows });
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const { socials } = await req.json();
    if (!Array.isArray(socials)) {
      return NextResponse.json({ ok: false, error: "Invalid payload." }, { status: 400 });
    }

    for (const s of socials) {
      await sql`
        UPDATE socials SET href = ${s.href}, enabled = ${!!s.enabled}
        WHERE key = ${s.key}
      `;
    }

    const rows = await sql`SELECT key, label, href, enabled FROM socials ORDER BY key`;
    return NextResponse.json({ ok: true, socials: rows });
  } catch (err) {
    console.error("update socials error", err);
    return NextResponse.json({ ok: false, error: "Could not save socials." }, { status: 500 });
  }
}
