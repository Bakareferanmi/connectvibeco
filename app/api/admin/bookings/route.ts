import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const rows = await sql`
    SELECT
      t.ticket_id AS "ticketId", t.item_id AS "itemId", t.title, t.meta,
      t.price, t.qty, t.purchased_at AS "purchasedAt", u.email AS "ownerEmail"
    FROM tickets t
    JOIN users u ON u.id = t.user_id
    ORDER BY t.purchased_at DESC
  `;
  return NextResponse.json({ ok: true, bookings: rows });
}
