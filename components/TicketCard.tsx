import { Calendar, MapPin, Users, ArrowUpRight } from "lucide-react";
import type { EventListing, Accent } from "@/lib/types";

const ACCENTS: Record<Accent, { text: string; hoverText: string }> = {
  magenta: { text: "text-fuchsia-400", hoverText: "group-hover:text-fuchsia-400" },
  teal: { text: "text-cyan-400", hoverText: "group-hover:text-cyan-400" },
  violet: { text: "text-violet-400", hoverText: "group-hover:text-violet-400" },
};

export default function TicketCard({ event }: { event: EventListing }) {
  const a = ACCENTS[event.accent];
  return (
    <div className="relative flex-shrink-0 w-[280px] rounded-2xl bg-panel border border-white/10 overflow-hidden hover:border-white/20 transition-colors group">
      <div className="p-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-[11px] tracking-[0.15em] uppercase font-mono ${a.text}`}>
            {event.category}
          </span>
          <span className="text-[11px] font-mono text-white/30">#{event.id}</span>
        </div>
        <h3 className="font-display font-semibold text-white text-[17px] leading-snug mb-4">
          {event.title}
        </h3>
        <div className="space-y-2 text-[13px] text-white/50">
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
          </div>
        </div>
      </div>

      <div className="relative h-0 border-t border-dashed border-white/15">
        <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-ink" />
        <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-ink" />
      </div>

      <div className="p-5 pt-4 flex items-center justify-between">
        <span className="font-mono text-white text-lg">{event.price}</span>
        <button
          className={`flex items-center gap-1 text-[13px] font-medium text-white/90 ${a.hoverText} transition-colors`}
        >
          Book spot <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
