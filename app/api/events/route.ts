import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const rows = await sql`SELECT * FROM events ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, events: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { title, category, date, time, location, spots, price, accent, description, images } = body;

    if (!title || !category || !date || !time || !location || !price || !accent || !description) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const id = `evt-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

    const [created] = await sql`
      INSERT INTO events (id, title, category, date, time, location, spots, price, accent, description, images)
      VALUES (${id}, ${title}, ${category}, ${date}, ${time}, ${location}, ${spots ?? 0}, ${price}, ${accent}, ${description}, ${JSON.stringify(images ?? [])})
      RETURNING *
    `;
    return NextResponse.json({ ok: true, event: created });
  } catch (err) {
    console.error("create event error", err);
    return NextResponse.json({ ok: false, error: "Could not create event." }, { status: 500 });
  }
}
