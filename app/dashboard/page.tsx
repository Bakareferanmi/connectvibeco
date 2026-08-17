"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Ticket as TicketIcon, Bookmark, ArrowRight, Compass } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";
import type { EventListing, TripListing } from "@/lib/types";

interface DashboardItem {
  id: string;
  title: string;
  when: string;
  location: string;
  image?: string;
  href: string;
}

function toItems(events: EventListing[], trips: TripListing[]): DashboardItem[] {
  return [
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      when: `${e.date} · ${e.time}`,
      location: e.location,
      image: e.images?.[0],
      href: `/events/${e.id}`,
    })),
    ...trips.map((t) => ({
      id: t.id,
      title: t.title,
      when: t.dates,
      location: t.location,
      image: t.images?.[0],
      href: `/trips/${t.id}`,
    })),
  ];
}

function ItemCard({ item }: { item: DashboardItem }) {
  return (
    <Link
      href={item.href}
      className="w-[240px] flex-shrink-0 rounded-2xl bg-panel border border-white/10 overflow-hidden hover:border-white/20 transition-colors"
    >
      <div className="aspect-[4/3] bg-white/5">
        {item.image && <img src={item.image} alt={item.title} className="w-full h-full object-cover" />}
      </div>
      <div className="p-4">
        <p className="text-[14px] font-medium text-white truncate mb-1">{item.title}</p>
        <p className="text-[12px] text-white/50 flex items-center gap-1 mb-0.5">
          <Calendar className="w-3 h-3" />
          {item.when}
        </p>
        <p className="text-[12px] text-white/50 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {item.location}
        </p>
      </div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <Nav />
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8 animate-pulse">
        <div className="h-3 w-24 bg-white/5 rounded mb-3" />
        <div className="h-9 w-64 bg-white/5 rounded mb-3" />
        <div className="h-4 w-72 bg-white/5 rounded" />
      </section>
      <section className="max-w-6xl mx-auto px-6 pb-12 animate-pulse">
        <div className="h-5 w-32 bg-white/5 rounded mb-5" />
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[240px] flex-shrink-0 rounded-2xl bg-panel border border-white/10 overflow-hidden">
              <div className="aspect-[4/3] bg-white/5" />
              <div className="p-4 space-y-2">
                <div className="h-3.5 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-1/2 bg-white/5 rounded" />
                <div className="h-3 w-2/3 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [events, setEvents] = useState<EventListing[]>([]);
  const [trips, setTrips] = useState<TripListing[]>([]);
  const [dataReady, setDataReady] = useState(false);
  const [tickets, setTickets] = useState<{ itemId: string }[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((res) => res.json()),
      fetch("/api/trips").then((res) => res.json()),
    ])
      .then(([eventsData, tripsData]) => {
        if (eventsData.ok) setEvents(eventsData.events);
        if (tripsData.ok) setTrips(tripsData.trips);
      })
      .catch(() => {})
      .finally(() => setDataReady(true));
  }, []);

  useEffect(() => {
    if (!user) {
      setTickets([]);
      setSavedIds([]);
      return;
    }
    fetch("/api/bookings", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.ok && setTickets(data.tickets))
      .catch(() => setTickets([]));
    fetch("/api/saved", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => data.ok && setSavedIds(data.savedIds))
      .catch(() => setSavedIds([]));
  }, [user]);

  if (loading || !dataReady) return <DashboardSkeleton />;

  if (!user) {
    return (
      <div className="min-h-screen bg-ink">
        <Nav />
        <section className="max-w-md mx-auto px-6 pt-24 pb-24 text-center">
          <p className="text-white/60 text-[15px] mb-5">Sign in to see your dashboard.</p>
          <Link
            href="/login"
            className="inline-block bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Sign in
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const allItems = toItems(events, trips);
  const bookedItems = allItems.filter((i) => tickets.some((t) => t.itemId === i.id));
  const savedItems = allItems.filter((i) => savedIds.includes(i.id));
  const bookedOrSavedIds = new Set([...bookedItems.map((i) => i.id), ...savedItems.map((i) => i.id)]);
  const availableItems = allItems.filter((i) => !bookedOrSavedIds.has(i.id)).slice(0, 6);
  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">Dashboard</p>
        <h1 className="font-display text-[32px] sm:text-[40px] font-semibold tracking-tight leading-[1.1] mb-3">
          Welcome back, {firstName}
        </h1>
        <p className="text-white/50 text-[14px]">
          {bookedItems.length > 0 || savedItems.length > 0
            ? `You have ${bookedItems.length} upcoming booking${bookedItems.length === 1 ? "" : "s"} and ${savedItems.length} saved.`
            : "Nothing booked or saved yet. Time to find your people."}
        </p>
      </section>

      {availableItems.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-[18px] font-semibold tracking-tight flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              Available now
            </h2>
            <Link href="/events" className="text-[13px] text-white/50 hover:text-white/70 transition-colors flex items-center gap-1">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
            {availableItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-[18px] font-semibold tracking-tight flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-fuchsia-400" />
            Your bookings
          </h2>
          {bookedItems.length > 0 && (
            <Link href="/bookings" className="text-[13px] text-white/50 hover:text-white/70 transition-colors flex items-center gap-1">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        {bookedItems.length === 0 ? (
          <p className="text-white/45 text-[14px]">No bookings yet.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
            {bookedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-[18px] font-semibold tracking-tight flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-violet-400" />
            Saved for later
          </h2>
          {savedItems.length > 0 && (
            <Link href="/saved" className="text-[13px] text-white/50 hover:text-white/70 transition-colors flex items-center gap-1">
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        {savedItems.length === 0 ? (
          <p className="text-white/45 text-[14px]">Nothing saved yet.</p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0">
            {savedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {bookedItems.length === 0 && savedItems.length === 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-24 text-center">
          <Link
            href="/events"
            className="inline-block bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full"
          >
            Browse events
          </Link>
        </section>
      )}

      <Footer />
    </div>
  );
}
