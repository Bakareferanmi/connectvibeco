import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM events WHERE id = ${id} LIMIT 1`;
  if (!rows[0]) return NextResponse.json({ ok: false, error: "Event not found." }, { status: 404 });
  return NextResponse.json({ ok: true, event: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["title", "category", "date", "time", "location", "spots", "price", "accent", "description", "images"] as const;

  const existingRows = await sql`SELECT * FROM events WHERE id = ${id} LIMIT 1`;
  if (!existingRows[0]) return NextResponse.json({ ok: false, error: "Event not found." }, { status: 404 });
  const existing = existingRows[0];

  const merged: Record<string, unknown> = {};
  for (const key of allowed) {
    merged[key] = key in body ? body[key] : existing[key];
  }

  const [updated] = await sql`
    UPDATE events SET
      title = ${merged.title as string},
      category = ${merged.category as string},
      date = ${merged.date as string},
      time = ${merged.time as string},
      location = ${merged.location as string},
      spots = ${merged.spots as number},
      price = ${merged.price as string},
      accent = ${merged.accent as string},
      description = ${merged.description as string},
      images = ${JSON.stringify(merged.images ?? [])}
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json({ ok: true, event: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  await sql`DELETE FROM events WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
