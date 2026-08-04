"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import Footer from "@/components/Footer";
import { EVENTS, CATEGORIES } from "@/lib/data";

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesQuery =
        query.trim() === "" ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.location.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

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
        <button className="text-[13px] font-medium bg-white text-black px-4 py-2 rounded-full">
          Sign up
        </button>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-3">
          {filtered.length} {filtered.length === 1 ? "event" : "events"} found
        </p>
        <h1 className="font-display text-[36px] sm:text-[48px] font-semibold tracking-tight mb-8">
          Find your next plan
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or location"
              className="w-full bg-panel border border-white/10 rounded-full pl-11 pr-4 py-3 text-[14px] text-white placeholder-white/30 focus:outline-none focus:border-fuchsia-500/50"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`text-[13px] px-4 py-1.5 rounded-full transition-colors ${
                category === c
                  ? "bg-white text-black font-medium"
                  : "bg-white/5 text-white/50 hover:text-white/80"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-white/50 text-[15px] mb-4">
              No events match that search.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="text-fuchsia-400 text-[14px] font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e) => (
              <TicketCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
