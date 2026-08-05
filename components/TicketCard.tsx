"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, ArrowUpRight, Heart, Flame } from "lucide-react";
import type { EventListing, Accent } from "@/lib/types";
import { useSaved } from "@/lib/useSaved";
import { useToast } from "@/lib/toast-context";
import AttendeeStack from "@/components/AttendeeStack";

const ACCENTS: Record<Accent, { text: string; hoverText: string }> = {
  magenta: { text: "text-fuchsia-400", hoverText: "group-hover:text-fuchsia-400" },
  teal: { text: "text-cyan-400", hoverText: "group-hover:text-cyan-400" },
  violet: { text: "text-violet-400", hoverText: "group-hover:text-violet-400" },
};

const LOW_SPOTS_THRESHOLD = 3;

export default function TicketCard({ event }: { event: EventListing }) {
  const a = ACCENTS[event.accent];
  const { saved, toggle } = useSaved(event.id);
  const { showToast } = useToast();
  const isFillingFast = event.spots <= LOW_SPOTS_THRESHOLD;

  function handleToggle(e: React.MouseEvent) {
    const willBeSaved = !saved;
    toggle(e);
    showToast(willBeSaved ? "Saved to your list" : "Removed from saved");
  }

  return (
    <Link
      href={`/events/${event.id}`}
      className="relative w-full rounded-2xl bg-panel border border-white/10 overflow-hidden hover:border-white/20 transition-colors group block"
    >
      <button
        onClick={handleToggle}
        aria-label={saved ? "Remove from saved" : "Save event"}
        className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${saved ? "fill-fuchsia-500 text-fuchsia-500" : "text-white/70"}`}
        />
      </button>

      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] tracking-[0.15em] uppercase font-mono ${a.text}`}>
            {event.category}
          </span>
          <span className="text-[11px] font-mono text-white/30">#{event.id}</span>
        </div>
        <h3 className="font-display font-semibold text-white text-[17px] leading-snug mb-4 pr-8">
          {event.title}
        </h3>
        <div className="space-y-2 text-[13px] text-white/50 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{event.date} · {event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5" />
            <span>{event.spots} spots left</span>
            {isFillingFast && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full ml-1">
                <Flame className="w-3 h-3" />
                Filling fast
              </span>
            )}
          </div>
        </div>
        <AttendeeStack seed={event.id} />
      </div>

      <div className="relative h-0 border-t border-dashed border-white/15">
        <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-ink" />
        <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-ink" />
      </div>

      <div className="p-5 pt-4 flex items-center justify-between">
        <span className="font-mono text-white text-lg">{event.price}</span>
        <span
          className={`flex items-center gap-1 text-[13px] font-medium text-white/90 ${a.hoverText} transition-colors`}
        >
          Book spot <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}
