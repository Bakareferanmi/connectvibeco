import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { EVENTS, TRIPS } from "@/lib/data";
import { DEFAULT_SOCIALS } from "@/lib/adminStore";

// One-time (idempotent) database setup. Creates every table the app needs
// and seeds the events/trips/socials tables from the existing mock data so
// there's something to look at immediately.
//
// Call it with:  curl -X POST https://<your-deployment>/api/setup
export async function POST() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT,
        provider TEXT NOT NULL DEFAULT 'password',
        avatar_url TEXT,
        avatar_preset TEXT,
        pronouns TEXT,
        orientation TEXT,
        bio TEXT,
        age INTEGER,
        city TEXT,
        interests TEXT[],
        instagram TEXT,
        twitter TEXT,
        tiktok TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        spots INTEGER NOT NULL DEFAULT 0,
        price TEXT NOT NULL,
        accent TEXT NOT NULL,
        description TEXT NOT NULL,
        images TEXT[],
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS trips (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        location TEXT NOT NULL,
        dates TEXT NOT NULL,
        duration TEXT NOT NULL,
        price TEXT NOT NULL,
        spots INTEGER NOT NULL DEFAULT 0,
        highlights TEXT[],
        accent TEXT NOT NULL,
        description TEXT NOT NULL,
        images TEXT[],
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tickets (
        ticket_id TEXT PRIMARY KEY,
        item_id TEXT NOT NULL,
        owner_email TEXT NOT NULL DEFAULT 'guest',
        title TEXT NOT NULL,
        meta TEXT NOT NULL,
        price TEXT NOT NULL,
        qty INTEGER NOT NULL DEFAULT 1,
        purchased_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS memberships (
        owner_email TEXT PRIMARY KEY,
        tier_id TEXT NOT NULL,
        tier_name TEXT NOT NULL,
        price TEXT NOT NULL,
        period TEXT NOT NULL,
        member_number TEXT NOT NULL,
        joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS saved_items (
        owner_email TEXT NOT NULL DEFAULT 'guest',
        item_id TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        PRIMARY KEY (owner_email, item_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS socials (
        key TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        href TEXT NOT NULL,
        enabled BOOLEAN NOT NULL DEFAULT true
      );
    `;

    // Seed events (skip any id that already exists so this stays idempotent).
    let eventsSeeded = 0;
    for (const e of EVENTS) {
      const result = await sql`
        INSERT INTO events (id, title, category, date, time, location, spots, price, accent, description, images)
        VALUES (${e.id}, ${e.title}, ${e.category}, ${e.date}, ${e.time}, ${e.location}, ${e.spots}, ${e.price}, ${e.accent}, ${e.description}, ${e.images ?? []})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;
      eventsSeeded += result.length;
    }

    // Seed trips.
    let tripsSeeded = 0;
    for (const t of TRIPS) {
      const result = await sql`
        INSERT INTO trips (id, title, location, dates, duration, price, spots, highlights, accent, description, images)
        VALUES (${t.id}, ${t.title}, ${t.location}, ${t.dates}, ${t.duration}, ${t.price}, ${t.spots}, ${t.highlights}, ${t.accent}, ${t.description}, ${t.images ?? []})
        ON CONFLICT (id) DO NOTHING
        RETURNING id;
      `;
      tripsSeeded += result.length;
    }

    // Seed socials.
    let socialsSeeded = 0;
    for (const s of DEFAULT_SOCIALS) {
      const result = await sql`
        INSERT INTO socials (key, label, href, enabled)
        VALUES (${s.key}, ${s.label}, ${s.href}, ${s.enabled})
        ON CONFLICT (key) DO NOTHING
        RETURNING key;
      `;
      socialsSeeded += result.length;
    }

    return NextResponse.json({
      ok: true,
      message: "Database setup complete.",
      tables: ["users", "events", "trips", "tickets", "memberships", "saved_items", "socials"],
      seeded: { events: eventsSeeded, trips: tripsSeeded, socials: socialsSeeded },
    });
  } catch (error) {
    console.error("Database setup failed:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Database setup failed. Check that DATABASE_URL is set correctly in Vercel.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET lets you sanity-check the connection itself without touching schema.
export async function GET() {
  try {
    const result = await sql`SELECT 1 AS ok;`;
    return NextResponse.json({ ok: true, connected: result[0]?.ok === 1 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
