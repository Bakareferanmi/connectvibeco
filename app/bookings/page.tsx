"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket as TicketIcon } from "lucide-react";
import BookingCard from "@/components/BookingCard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { EVENTS, TRIPS } from "@/lib/data";
import type { Ticket } from "@/lib/types";

const STORAGE_KEY = "connectvibe:bookings";

export default function BookingsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setTickets(raw ? JSON.parse(raw) : []);
    } catch {
      setTickets([]);
    }
  }, []);

  const bookedEvents = EVENTS
    .map((e) => ({ event: e, ticket: tickets.find((t) => t.itemId === e.id) }))
    .filter((x): x is { event: (typeof EVENTS)[number]; ticket: Ticket } => !!x.ticket);

  const bookedTrips = TRIPS
    .map((t) => ({ trip: t, ticket: tickets.find((tk) => tk.itemId === t.id) }))
    .filter((x): x is { trip: (typeof TRIPS)[number]; ticket: Ticket } => !!x.ticket);

  const isEmpty = bookedEvents.length === 0 && bookedTrips.length === 0;

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
          {bookedEvents.length + bookedTrips.length} booked
        </p>
        <h1 className="font-display text-[36px] sm:text-[48px] font-semibold tracking-tight mb-8">
          Your bookings
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {isEmpty ? (
          <div className="py-20 text-center">
            <TicketIcon className="w-8 h-8 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-[15px] mb-4">
              No bookings yet. Book an event or trip and it'll show up here.
            </p>
            <Link href="/events" className="text-fuchsia-400 text-[14px] font-medium">
              Browse events
            </Link>
          </div>
        ) : (
          <>
            {bookedEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-[20px] font-semibold tracking-tight mb-5">
                  Events
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {bookedEvents.map(({ event, ticket }) => (
                    <BookingCard
                      key={event.id}
                      ticket={ticket}
                      href={`/events/${event.id}`}
                      location={event.location}
                      image={event.images?.[0]}
                    />
                  ))}
                </div>
              </div>
            )}

            {bookedTrips.length > 0 && (
              <div>
                <h2 className="font-display text-[20px] font-semibold tracking-tight mb-5">
                  Trips
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {bookedTrips.map(({ trip, ticket }) => (
                    <BookingCard
                      key={trip.id}
                      ticket={ticket}
                      href={`/trips/${trip.id}`}
                      location={trip.location}
                      image={trip.images?.[0]}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
