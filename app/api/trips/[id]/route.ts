import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`SELECT * FROM trips WHERE id = ${id} LIMIT 1`;
  if (!rows[0]) return NextResponse.json({ ok: false, error: "Trip not found." }, { status: 404 });
  return NextResponse.json({ ok: true, trip: rows[0] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json();
  const allowed = ["title", "location", "dates", "duration", "price", "spots", "highlights", "accent", "description", "images"] as const;

  const existingRows = await sql`SELECT * FROM trips WHERE id = ${id} LIMIT 1`;
  if (!existingRows[0]) return NextResponse.json({ ok: false, error: "Trip not found." }, { status: 404 });
  const existing = existingRows[0];

  const merged: Record<string, unknown> = {};
  for (const key of allowed) {
    merged[key] = key in body ? body[key] : existing[key];
  }

  const [updated] = await sql`
    UPDATE trips SET
      title = ${merged.title as string},
      location = ${merged.location as string},
      dates = ${merged.dates as string},
      duration = ${merged.duration as string},
      price = ${merged.price as string},
      spots = ${merged.spots as number},
      highlights = ${JSON.stringify(merged.highlights ?? [])},
      accent = ${merged.accent as string},
      description = ${merged.description as string},
      images = ${JSON.stringify(merged.images ?? [])}
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json({ ok: true, trip: updated });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const { id } = await params;
  await sql`DELETE FROM trips WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
