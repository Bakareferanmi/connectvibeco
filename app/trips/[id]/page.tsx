import TripDetailView from "@/components/TripDetailView";
import { TRIPS } from "@/lib/data";

export function generateStaticParams() {
  return TRIPS.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const trip = TRIPS.find((t) => t.id === params.id);
  if (!trip) return { title: "Connect Vibe Co" };
  return { title: `${trip.title}, Connect Vibe Co`, description: trip.description };
}

export default function TripDetailPage({ params }: { params: { id: string } }) {
  return <TripDetailView id={params.id} />;
}
