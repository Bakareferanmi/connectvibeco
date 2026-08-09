"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { EVENTS, TRIPS } from "@/lib/data";

const STORAGE_KEY = "connectvibe:saved";

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setSavedIds(raw ? JSON.parse(raw) : []);
    } catch {
      setSavedIds([]);
    }
  }, []);

  const savedEvents = EVENTS.filter((e) => savedIds.includes(e.id));
  const savedTrips = TRIPS.filter((t) => savedIds.includes(t.id));
  const isEmpty = savedEvents.length === 0 && savedTrips.length === 0;

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
          {savedEvents.length + savedTrips.length} saved
        </p>
        <h1 className="font-display text-[36px] sm:text-[48px] font-semibold tracking-tight mb-8">
          Your saved plans
        </h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {isEmpty ? (
          <div className="py-20 text-center">
            <Heart className="w-8 h-8 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-[15px] mb-4">
              Nothing saved yet. Tap the heart on any event or trip to add it here.
            </p>
            <Link href="/events" className="text-fuchsia-400 text-[14px] font-medium">
              Browse events
            </Link>
          </div>
        ) : (
          <>
            {savedEvents.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-[20px] font-semibold tracking-tight mb-5">
                  Events
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {savedEvents.map((e) => (
                    <TicketCard key={e.id} event={e} />
                  ))}
                </div>
              </div>
            )}

            {savedTrips.length > 0 && (
              <div>
                <h2 className="font-display text-[20px] font-semibold tracking-tight mb-5">
                  Trips
                </h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {savedTrips.map((t) => (
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
