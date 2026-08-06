import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowLeft, Check, Flame } from "lucide-react";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import AttendeeStack from "@/components/AttendeeStack";
import SaveButton from "@/components/SaveButton";
import BookButton from "@/components/BookButton";
import EventGallery from "@/components/EventGallery";
import TicketStatus from "@/components/TicketStatus";
import { TRIPS } from "@/lib/data";
import type { Accent } from "@/lib/types";

const ACCENTS: Record<Accent, { text: string; bg: string }> = {
  magenta: { text: "text-fuchsia-400", bg: "bg-fuchsia-500" },
  teal: { text: "text-cyan-400", bg: "bg-cyan-500" },
  violet: { text: "text-violet-400", bg: "bg-violet-500" },
};

const LOW_SPOTS_THRESHOLD = 3;

export function generateStaticParams() {
  return TRIPS.map((t) => ({ id: t.id }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const trip = TRIPS.find((t) => t.id === params.id);
  if (!trip) return { title: "Trip not found, Connect Vibe Co" };
  return { title: `${trip.title}, Connect Vibe Co`, description: trip.description };
}

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const trip = TRIPS.find((t) => t.id === params.id);
  if (!trip) notFound();

  const a = ACCENTS[trip.accent];
  const isFillingFast = trip.spots <= LOW_SPOTS_THRESHOLD;

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-8 pb-24">
        <Link href="/trips" className="inline-flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to trips
        </Link>

        {trip.images && <EventGallery images={trip.images} alt={trip.title} />}

        <div className={`h-1.5 w-16 rounded-full ${a.bg} mb-5`} />

        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mb-6">
          {trip.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-white/60 mb-6">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {trip.location}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {trip.dates}
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {trip.spots} spots left
          </span>
          {isFillingFast && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3" />
              Filling fast
            </span>
          )}
          <span className={`font-mono text-[11px] uppercase tracking-[0.15em] ${a.text}`}>
            {trip.duration}
          </span>
        </div>

        <div className="mb-8">
          <AttendeeStack seed={trip.id} />
        </div>

        <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mb-10">
          {trip.description}
        </p>

        <h2 className="font-display text-[16px] font-semibold tracking-tight mb-4">
          What's included
        </h2>
        <ul className="space-y-3 mb-10">
          {trip.highlights.map((h) => (
            <li key={h} className="flex items-start gap-3 text-[14px] text-white/70">
              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.text}`} />
              {h}
            </li>
          ))}
        </ul>

        <div className="rounded-2xl bg-panel border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-white/40 text-[11px] uppercase tracking-[0.15em] mb-1">Price per person</p>
              <span className="font-mono text-white text-2xl">{trip.price}</span>
            </div>
            <BookButton
              id={trip.id}
              title={trip.title}
              meta={trip.dates}
              price={trip.price}
              maxQty={trip.spots}
              label="Reserve your spot"
            />
          </div>
          <SaveButton id={trip.id} label="Save for later" />
        </div>

        <TicketStatus id={trip.id} location={trip.location} image={trip.images?.[0]} />
      </section>

      <Footer />
    </div>
  );
}
