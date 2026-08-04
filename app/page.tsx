"use client";

import { useState } from "react";
import TicketCard from "@/components/TicketCard";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import type { EventListing } from "@/lib/types";

const EVENTS: EventListing[] = [
  { id: "01", title: "Rooftop Sessions: Sunset Sounds", category: "Music", date: "Sat, Aug 8", time: "7:00 PM", location: "Shoreditch, London", spots: 12, price: "£15", accent: "magenta" },
  { id: "02", title: "Peak District Weekend Hike", category: "Trip", date: "Fri, Aug 14", time: "2 days", location: "Peak District", spots: 4, price: "£85", accent: "teal" },
  { id: "03", title: "Supper Club: Strangers & Stories", category: "Social", date: "Thu, Aug 6", time: "8:00 PM", location: "Hackney, London", spots: 3, price: "£28", accent: "violet" },
];

const NAV_LINKS = ["Events", "Trips", "Membership"] as const;
const TABS = ["nearby", "this week", "trips"] as const;

export default function HomePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("nearby");

  return (
    <div className="min-h-screen bg-ink overflow-hidden">
      <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full border-2 border-fuchsia-500" style={{ boxShadow: "0 0 12px rgba(217,70,239,0.6)" }} />
          <span className="font-display font-semibold tracking-tight">connect vibe</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-[14px] text-white/60">
          {NAV_LINKS.map((link) => (
            <button key={link} className="hover:text-white transition-colors">
              {link}
            </button>
          ))}
        </div>
        <button className="text-[13px] font-medium bg-white text-black px-4 py-2 rounded-full">Sign up</button>
      </nav>

      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="absolute -top-10 right-0 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(217,70,239,0.15) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)" }} />
        <div className="relative">
          <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-white/40 mb-5">487 people going out this week</p>
          <h1 className="font-display text-[44px] sm:text-[64px] font-semibold leading-[1.05] tracking-tight max-w-2xl">
            Find your people.{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">Show up.</span>
          </h1>
          <p className="text-white/50 text-[16px] max-w-md mt-5 leading-relaxed">
            Local meetups, weekend trips, and nights out. Vetted, bookable, and full of strangers worth meeting.
          </p>
          <div className="flex items-center gap-3 mt-8">
            <button className="bg-fuchsia-500 hover:bg-fuchsia-400 transition-colors text-white text-[14px] font-medium px-6 py-3 rounded-full">Browse events</button>
            <button className="border border-white/20 hover:border-white/40 transition-colors text-white/80 text-[14px] font-medium px-6 py-3 rounded-full">How it works</button>
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
          <button className="text-[13px] text-white/30 font-mono hidden sm:block">scroll to see more</button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 sm:mx-0 sm:px-0">
          {EVENTS.map((e) => (
            <TicketCard key={e.id} event={e} />
          ))}
        </div>
      </section>

      <HowItWorks />
      <Testimonials />
      <Footer />
    </div>
  );
}
