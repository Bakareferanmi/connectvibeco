"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Ticket } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { EVENTS, TRIPS } from "@/lib/data";

const STORAGE_KEY = "connectvibe:bookings";

export default function BookingsPage() {
  const [bookedIds, setBookedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setBookedIds(raw ? JSON.parse(raw) : []);
    } catch {
      setBookedIds([]);
    }
  }, []);

  const bookedEvents = EVENTS.filter((e) => bookedIds.includes(e.id));
  const bookedTrips = TRIPS.filter((t) => bookedIds.includes(t.id));
  const isEmpty = bookedEvents.length === 0 && bookedTrips.length === 0;

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          {bookedEvents.length + bookedTrips.length} booked
        </p>
        <h1 className="font-display text-[36px] sm:text-[48px] font-semibold tracking-tight mb-8">
          Your bookings
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {isEmpty ? (
          <div className="py-20 text-center">
            <Ticket className="w-8 h-8 text-white/20 mx-auto mb-4" />
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
                  {bookedEvents.map((e) => (
                    <TicketCard key={e.id} event={e} />
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
                  {bookedTrips.map((t) => (
                    <TripCard key={t.id} trip={t} />
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
