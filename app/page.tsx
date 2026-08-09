"use client";

import { useState, useMemo } from "react";
import TicketCard from "@/components/TicketCard";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { EVENTS } from "@/lib/data";

const TABS = ["nearby", "this week", "trips"] as const;

function parseEventDate(dateStr: string): number {
  const cleaned = dateStr.replace(/^[A-Za-z]+,\s*/, "");
  const parsed = Date.parse(`${cleaned}, ${new Date().getFullYear()}`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export default function HomePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("nearby");

  const filteredEvents = useMemo(() => {
    if (tab === "trips") {
      return EVENTS.filter((e) => e.category === "Trip");
    }
    if (tab === "this week") {
      const now = Date.now();
      const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
      return EVENTS.filter((e) => {
        const eventTime = parseEventDate(e.date);
        return eventTime >= now && eventTime <= weekFromNow;
      });
    }
    return EVENTS;
  }, [tab]);

  return (
    <div className="min-h-screen bg-ink overflow-hidden">
      <Nav />

      <section className="relative max-w-6xl mx-auto px-6 pt-4 pb-20">
        <div className="absolute -top-10 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)" }} />
        <div className="relative">
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/50 mb-5">487 people going out this week</p>
          <h1 className="font-display text-[44px] sm:text-[64px] font-semibold leading-[1.05] tracking-tight max-w-2xl">
            Find your people.{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Show up.</span>
          </h1>
          <p className="text-white/50 text-[16px] max-w-md mt-5 leading-relaxed">
            Local meetups, weekend trips, and nights out. Vetted, bookable, and full of strangers worth meeting.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <a href="/events" className="bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full">Browse events</a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 w-fit">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`text-[13px] px-4 py-1.5 rounded-full capitalize transition-colors ${tab === t ? "bg-white text-black font-medium" : "text-white/50"}`}>
                {t}
              </button>
            ))}
          </div>
          <button className="text-[13px] text-white/50 font-mono hidden sm:block">scroll to see more</button>
        </div>

        {filteredEvents.length === 0 ? (
          <p className="text-white/50 text-[14px] py-8">
            Nothing in this category right now — check back soon.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
            {filteredEvents.slice(0, 6).map((e) => (
              <div key={e.id} className="w-[280px] flex-shrink-0">
                <TicketCard event={e} />
              </div>
            ))}
          </div>
        )}
      </section>

      <HowItWorks />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
}
