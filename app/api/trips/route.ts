import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const rows = await sql`SELECT * FROM trips ORDER BY created_at DESC`;
  return NextResponse.json({ ok: true, trips: rows });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    const body = await req.json();
    const { title, location, dates, duration, price, spots, highlights, accent, description, images } = body;

    if (!title || !location || !dates || !duration || !price || !accent || !description) {
      return NextResponse.json({ ok: false, error: "Missing required fields." }, { status: 400 });
    }

    const id = `trp-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;

    const [created] = await sql`
      INSERT INTO trips (id, title, location, dates, duration, price, spots, highlights, accent, description, images)
      VALUES (${id}, ${title}, ${location}, ${dates}, ${duration}, ${price}, ${spots ?? 0}, ${JSON.stringify(highlights ?? [])}, ${accent}, ${description}, ${JSON.stringify(images ?? [])})
      RETURNING *
    `;
    return NextResponse.json({ ok: true, trip: created });
  } catch (err) {
    console.error("create trip error", err);
    return NextResponse.json({ ok: false, error: "Could not create trip." }, { status: 500 });
  }
}
