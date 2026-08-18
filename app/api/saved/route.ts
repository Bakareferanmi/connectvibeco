import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/require-user";

export async function GET(req: NextRequest) {
  const { session, denied } = await requireUser(req);
  if (denied) return denied;

  const rows = await sql`SELECT item_id FROM saved_items WHERE user_id = ${session!.userId}`;
  return NextResponse.json({ ok: true, savedIds: rows.map((r) => r.item_id) });
}

export async function POST(req: NextRequest) {
  const { session, denied } = await requireUser(req);
  if (denied) return denied;

  const { itemId } = await req.json();
  if (!itemId) return NextResponse.json({ ok: false, error: "Missing itemId." }, { status: 400 });

  const existing = await sql`SELECT 1 FROM saved_items WHERE user_id = ${session!.userId} AND item_id = ${itemId}`;
  let saved: boolean;
  if (existing.length > 0) {
    await sql`DELETE FROM saved_items WHERE user_id = ${session!.userId} AND item_id = ${itemId}`;
    saved = false;
  } else {
    await sql`INSERT INTO saved_items (user_id, item_id) VALUES (${session!.userId}, ${itemId})`;
    saved = true;
  }
  return NextResponse.json({ ok: true, saved });
}
