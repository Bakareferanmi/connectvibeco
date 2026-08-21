import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/require-user";

function makeCode(): string {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const all = letters + digits;
  const chars: string[] = [
    letters[Math.floor(Math.random() * letters.length)],
    digits[Math.floor(Math.random() * digits.length)],
  ];
  while (chars.length < 5) {
    chars.push(all[Math.floor(Math.random() * all.length)]);
  }
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return `CVC-${chars.join("")}`;
}

export async function GET(req: NextRequest) {
  const { session, denied } = await requireUser(req);
  if (denied) return denied;

  const rows = await sql`
    SELECT ticket_id AS "ticketId", item_id AS "itemId", title, meta, price, qty, purchased_at AS "purchasedAt"
    FROM tickets WHERE user_id = ${session!.userId} ORDER BY purchased_at DESC
  `;
  return NextResponse.json({ ok: true, tickets: rows });
}

export async function POST(req: NextRequest) {
  const { session, denied } = await requireUser(req);
  if (denied) return denied;

  try {
    const { itemId, qty } = await req.json();
    const parsedQty = Number(qty);
    if (!itemId || !Number.isInteger(parsedQty) || parsedQty < 1 || parsedQty > 20) {
      return NextResponse.json({ ok: false, error: "Missing or invalid booking details." }, { status: 400 });
    }

    // Title, meta, and price are looked up server-side from the event/trip
    // record — never trusted from the client — so a booking always reflects
    // the real listing price, not whatever the request body claims.
    const isTrip = itemId.startsWith("trp-");
    const itemRows = isTrip
      ? await sql`SELECT title, location, dates, price FROM trips WHERE id = ${itemId} LIMIT 1`
      : await sql`SELECT title, date, time, location, price FROM events WHERE id = ${itemId} LIMIT 1`;
    const item = itemRows[0];
    if (!item) {
      return NextResponse.json({ ok: false, error: "Event or trip not found." }, { status: 404 });
    }

    const title = item.title as string;
    const price = item.price as string;
    const meta = isTrip
      ? `${item.location} · ${item.dates}`
      : `${item.date} · ${item.time} · ${item.location}`;

    const existing = await sql`
      SELECT ticket_id AS "ticketId", item_id AS "itemId", title, meta, price, qty, purchased_at AS "purchasedAt"
      FROM tickets WHERE user_id = ${session!.userId} AND item_id = ${itemId} LIMIT 1
    `;
    if (existing[0]) {
      return NextResponse.json({ ok: true, ticket: existing[0] });
    }

    let ticket = null;
    for (let attempt = 0; attempt < 5 && !ticket; attempt++) {
      const ticketId = makeCode();
      try {
        const [created] = await sql`
          INSERT INTO tickets (ticket_id, user_id, item_id, title, meta, price, qty)
          VALUES (${ticketId}, ${session!.userId}, ${itemId}, ${title}, ${meta}, ${price}, ${parsedQty})
          RETURNING ticket_id AS "ticketId", item_id AS "itemId", title, meta, price, qty, purchased_at AS "purchasedAt"
        `;
        ticket = created;
      } catch {
        // ticket_id collision (rare) - retry with a new code
      }
    }
    if (!ticket) {
      return NextResponse.json({ ok: false, error: "Could not generate a ticket. Try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ticket });
  } catch (err) {
    console.error("create booking error", err);
    return NextResponse.json({ ok: false, error: "Could not book." }, { status: 500 });
  }
}
