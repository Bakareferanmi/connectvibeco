"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowLeft, Flame } from "lucide-react";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import TicketCard from "@/components/TicketCard";
import AttendeeStack from "@/components/AttendeeStack";
import SaveButton from "@/components/SaveButton";
import BookButton from "@/components/BookButton";
import EventGallery from "@/components/EventGallery";
import TicketStatus from "@/components/TicketStatus";
import type { Accent, EventListing } from "@/lib/types";

const ACCENTS: Record<Accent, { text: string }> = {
  magenta: { text: "text-fuchsia-400" },
  teal: { text: "text-cyan-400" },
  violet: { text: "text-violet-400" },
};

const LOW_SPOTS_THRESHOLD = 3;

export default function EventDetailView({ id }: { id: string }) {
  const [events, setEvents] = useState<EventListing[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) setEvents(data.events);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const event = events.find((e) => e.id === id);

  if (ready && !event) {
    return (
      <div className="min-h-screen bg-ink">
        <Nav />
        <section className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
          <p className="text-white/60 text-[15px] mb-5">That event doesn&apos;t exist, or has been removed.</p>
          <Link href="/events" className="text-fuchsia-400 text-[14px] font-medium">
            Browse events
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  if (!event) return null;

  const a = ACCENTS[event.accent];
  const isFillingFast = event.spots <= LOW_SPOTS_THRESHOLD;
  const related = events.filter((e) => e.category === event.category && e.id !== event.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-8 pb-16">
        <Link href="/events" className="inline-flex items-center gap-1.5 text-[13px] text-white/50 hover:text-white/70 transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to events
        </Link>

        {event.images && <EventGallery images={event.images} alt={event.title} />}

        <span className={`text-[11px] tracking-[0.15em] uppercase font-mono ${a.text}`}>
          {event.category}
        </span>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight leading-[1.1] mt-3 mb-6">
          {event.title}
        </h1>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[14px] text-white/60 mb-6">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {event.date} · {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.spots} spots left
          </span>
          {isFillingFast && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
              <Flame className="w-3 h-3" />
              Filling fast
            </span>
          )}
        </div>

        <div className="mb-8">
          <AttendeeStack seed={event.id} />
        </div>

        <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mb-10">
          {event.description}
        </p>

        <div className="rounded-2xl bg-panel border border-white/10 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono text-white/50 text-[11px] uppercase tracking-[0.15em] mb-1">Price</p>
              <span className="font-mono text-white text-2xl">{event.price}</span>
            </div>
            <BookButton
              id={event.id}
              title={event.title}
              meta={`${event.date} · ${event.time}`}
              price={event.price}
              maxQty={event.spots}
              label="Book spot"
              location={event.location}
              image={event.images?.[0]}
            />
          </div>
          <SaveButton id={event.id} label="Save for later" />
        </div>

        <TicketStatus id={event.id} location={event.location} image={event.images?.[0]} />
      </section>

      {related.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <h2 className="font-display text-[20px] font-semibold tracking-tight mb-5">
            More {event.category.toLowerCase()} events
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map((e) => (
              <TicketCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
