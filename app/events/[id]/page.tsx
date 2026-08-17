import EventDetailView from "@/components/EventDetailView";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`SELECT title, description FROM events WHERE id = ${id} LIMIT 1`;
  const event = rows[0];
  if (!event) return { title: "Connect Vibe Co" };
  return { title: `${event.title}, Connect Vibe Co`, description: event.description };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventDetailView id={id} />;
}
