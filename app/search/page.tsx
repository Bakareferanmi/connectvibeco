"use client";

import { useState, useMemo, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { EVENTS as STATIC_EVENTS, TRIPS as STATIC_TRIPS } from "@/lib/data";
import { getEvents, getTrips } from "@/lib/adminStore";
import type { EventListing, TripListing } from "@/lib/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventListing[]>(STATIC_EVENTS);
  const [trips, setTrips] = useState<TripListing[]>(STATIC_TRIPS);

  useEffect(() => {
    setEvents(getEvents());
    setTrips(getTrips());
  }, []);

  const matchedEvents = useMemo(() => {
    if (query.trim() === "") return [];
    const q = query.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
    );
  }, [query, events]);

  const matchedTrips = useMemo(() => {
    if (query.trim() === "") return [];
    const q = query.toLowerCase();
    return trips.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
    );
  }, [query, trips]);

  const hasQuery = query.trim() !== "";
  const totalResults = matchedEvents.length + matchedTrips.length;

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-3xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
          Search
        </p>
        <h1 className="font-display text-[32px] sm:text-[44px] font-semibold tracking-tight mb-8">
          What are you looking for?
        </h1>

        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events and trips by name or location"
            className="w-full bg-panel border border-white/10 rounded-full pl-11 pr-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
          />
        </div>
      </section>

      {hasQuery && (
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-8">
            {totalResults} {totalResults === 1 ? "result" : "results"} for &quot;{query}&quot;
          </p>

          {totalResults === 0 ? (
            <div className="py-20 text-center">
              <p className="text-white/50 text-[15px]">Nothing matches that search.</p>
            </div>
          ) : (
            <>
              {matchedEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display text-[18px] font-semibold tracking-tight mb-5">
                    Events
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {matchedEvents.map((e) => (
                      <TicketCard key={e.id} event={e} />
                    ))}
                  </div>
                </div>
              )}

              {matchedTrips.length > 0 && (
                <div>
                  <h2 className="font-display text-[18px] font-semibold tracking-tight mb-5">
                    Trips
                  </h2>
                  <div className="grid md:grid-cols-2 gap-5">
                    {matchedTrips.map((t) => (
                      <TripCard key={t.id} trip={t} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <Footer />
    </div>
  );
}
