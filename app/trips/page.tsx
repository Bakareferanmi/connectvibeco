import Link from "next/link";
import { Search } from "lucide-react";
import TripCard from "@/components/TripCard";
import Footer from "@/components/Footer";
import { TRIPS } from "@/lib/data";

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-ink">
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <a href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full border-2 border-fuchsia-500"
            style={{ boxShadow: "0 0 12px rgba(217,70,239,0.6)" }}
          />
          <span className="font-display font-semibold tracking-tight">
            connect vibe
          </span>
        </a>
        <div className="flex items-center gap-3">
          <Link href="/search" aria-label="Search" className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
            <Search className="w-4 h-4 text-white/70" />
          </Link>
          <button className="text-[13px] font-medium bg-white text-black px-4 py-2 rounded-full">
            Sign up
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-10">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          {TRIPS.length} trips open for booking
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
        <div className="grid md:grid-cols-2 gap-5">
          {TRIPS.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
