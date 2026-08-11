import EventDetailView from "@/components/EventDetailView";
import { EVENTS } from "@/lib/data";

export function generateStaticParams() {
  return EVENTS.map((e) => ({ id: e.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const event = EVENTS.find((e) => e.id === params.id);
  if (!event) return { title: "Connect Vibe Co" };
  return { title: `${event.title}, Connect Vibe Co`, description: event.description };
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  return <EventDetailView id={params.id} />;
}
