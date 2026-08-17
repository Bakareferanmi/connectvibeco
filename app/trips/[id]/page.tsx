import TripDetailView from "@/components/TripDetailView";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await sql`SELECT title, description FROM trips WHERE id = ${id} LIMIT 1`;
  const trip = rows[0];
  if (!trip) return { title: "Connect Vibe Co" };
  return { title: `${trip.title}, Connect Vibe Co`, description: trip.description };
}

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TripDetailView id={id} />;
}
