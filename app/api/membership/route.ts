import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/require-user";
import { getTierById } from "@/lib/membershipTiers";

function generateMemberNumber(): string {
  const digits = "0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += digits[Math.floor(Math.random() * digits.length)];
  return `CVC-${code}`;
}

export async function GET(req: NextRequest) {
  const { session, denied } = await requireUser(req);
  if (denied) return denied;

  const rows = await sql`
    SELECT tier_id AS "tierId", tier_name AS "tierName", price, period, member_number AS "memberNumber", joined_at AS "joinedAt"
    FROM memberships WHERE user_id = ${session!.userId} LIMIT 1
  `;
  return NextResponse.json({ ok: true, membership: rows[0] ?? null });
}

export async function POST(req: NextRequest) {
  const { session, denied } = await requireUser(req);
  if (denied) return denied;

  try {
    const { tierId } = await req.json();

    // Name/price/period are never trusted from the client — they're looked
    // up from the canonical tier list so a request can't fabricate a
    // cheaper (or free) membership.
    const tier = typeof tierId === "string" ? getTierById(tierId) : undefined;
    if (!tier) {
      return NextResponse.json({ ok: false, error: "Unknown membership tier." }, { status: 400 });
    }
    const { name: tierName, price, period } = tier;

    let membership = null;
    for (let attempt = 0; attempt < 5 && !membership; attempt++) {
      const memberNumber = generateMemberNumber();
      try {
        const [created] = await sql`
          INSERT INTO memberships (user_id, tier_id, tier_name, price, period, member_number)
          VALUES (${session!.userId}, ${tierId}, ${tierName}, ${price}, ${period}, ${memberNumber})
          ON CONFLICT (user_id) DO UPDATE SET
            tier_id = EXCLUDED.tier_id, tier_name = EXCLUDED.tier_name,
            price = EXCLUDED.price, period = EXCLUDED.period
          RETURNING tier_id AS "tierId", tier_name AS "tierName", price, period, member_number AS "memberNumber", joined_at AS "joinedAt"
        `;
        membership = created;
      } catch {
        // member_number collision (rare) - retry
      }
    }
    if (!membership) {
      return NextResponse.json({ ok: false, error: "Could not create membership. Try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, membership });
  } catch (err) {
    console.error("join membership error", err);
    return NextResponse.json({ ok: false, error: "Could not join." }, { status: 500 });
  }
}
