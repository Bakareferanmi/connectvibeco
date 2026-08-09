"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import TicketCardSkeleton from "@/components/TicketCardSkeleton";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { EVENTS, CATEGORIES } from "@/lib/data";

const SORT_OPTIONS = ["Date", "Price: low to high", "Price: high to low", "Spots left"] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

function parseEventDate(dateStr: string): number {
  const cleaned = dateStr.replace(/^[A-Za-z]+,\s*/, "");
  const parsed = Date.parse(`${cleaned}, ${new Date().getFullYear()}`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function parsePrice(priceStr: string): number {
  const digits = priceStr.replace(/[^0-9.]/g, "");
  return digits ? parseFloat(digits) : 0;
}

export default function EventsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [sort, setSort] = useState<SortOption>("Date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    const result = EVENTS.filter((e) => {
      const matchesCategory = category === "All" || e.category === category;
      const matchesQuery =
        query.trim() === "" ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.location.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    const sorted = [...result];
    switch (sort) {
      case "Date":
        sorted.sort((a, b) => parseEventDate(a.date) - parseEventDate(b.date));
        break;
      case "Price: low to high":
        sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case "Price: high to low":
        sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case "Spots left":
        sorted.sort((a, b) => a.spots - b.spots);
        break;
    }
    return sorted;
  }, [query, category, sort]);

  return (
    <div className="min-h-screen bg-ink">
      <Nav />

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-3">
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

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-panel border border-white/10 rounded-full px-4 py-3 text-[14px] text-white focus:outline-none focus:border-fuchsia-500/50 sm:w-56"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="bg-ink text-white">
                Sort: {opt}
              </option>
            ))}
          </select>
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
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <TicketCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
