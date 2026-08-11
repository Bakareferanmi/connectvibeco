"use client";

import { useState, useEffect } from "react";
import TripCard from "@/components/TripCard";
import TripCardSkeleton from "@/components/TripCardSkeleton";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { TRIPS as STATIC_TRIPS } from "@/lib/data";
import { getTrips } from "@/lib/adminStore";
import type { TripListing } from "@/lib/types";

export default function TripsPage() {
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<TripListing[]>(STATIC_TRIPS);

  useEffect(() => {
    setTrips(getTrips());
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-10">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
          {trips.length} trips open for booking
        </p>
        <h1 className="font-display text-[36px] sm:text-[48px] font-semibold tracking-tight mb-4 max-w-xl">
          Weekend trips worth planning around
        </h1>
        <p className="text-white/50 text-[15px] max-w-lg leading-relaxed">
          Small group trips with transport, stays, and a full itinerary
          sorted. Reserve a spot and show up.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <TripCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
