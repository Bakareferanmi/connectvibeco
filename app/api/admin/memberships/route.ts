import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  const rows = await sql`
    SELECT
      m.tier_id AS "tierId", m.tier_name AS "tierName", m.price, m.period,
      m.member_number AS "memberNumber", m.joined_at AS "joinedAt", u.email AS "ownerEmail"
    FROM memberships m
    JOIN users u ON u.id = m.user_id
    ORDER BY m.joined_at DESC
  `;
  return NextResponse.json({ ok: true, memberships: rows });
}
